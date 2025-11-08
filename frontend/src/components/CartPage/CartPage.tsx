import { useCart } from "../Context/CartContext";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "./CheckoutModal"; // <-- Import the new modal

const API_BASE = import.meta.env.VITE_API_BASE;
// Add PayHere variables from .env
const PAYHERE_MERCHANT_ID = import.meta.env.VITE_PAYHERE_MERCHANT_ID;
const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

// Define the structure for the form details
interface OrderDetails {
  name: string;
  address: string;
  whatsapp: string;
}

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [quantities, setQuantities] = useState(
    cart.map((item) => item.quantity || 1)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- New state for modal
  const navigate = useNavigate();

  // This function is now the final step, triggered by the modal
  const handleFinalSubmit = async ({
    name,
    address,
    whatsapp,
  }: OrderDetails) => {
    setIsModalOpen(false); // Close the modal
    setIsLoading(true); // Show loading state on the button

    const token = localStorage.getItem("token");

    // All cart/token checks are already done, but we can be safe
    if (!token || cart.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Create a single "pending" order for the whole cart
      const cartItems = cart.map((item, index) => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: quantities[index],
      }));

      const totalAmount = cart.reduce(
        (sum, item, index) => sum + item.price * quantities[index],
        0
      );

      const orderRes = await axios.post(
        `${API_BASE}/orders`,
        {
          name, // <-- Use data from modal
          address, // <-- Use data from modal
          whatsapp, // <-- Use data from modal
          items: cartItems, // Send the array of items
          price: totalAmount, // Send the total price
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newOrder = orderRes.data.order;

      // Step 2: Get PayHere hash for the new order
      const hashRes = await axios.post(
        `${API_BASE}/payments/payhere/generate-hash`,
        {
          order_id: newOrder._id,
          amount: newOrder.totalAmount,
          currency: "LKR", // Assuming LKR, change if needed
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { hash } = hashRes.data;

      // Step 3: Create and submit the PayHere payment form
      const payment = {
        sandbox: true, // Use true for sandbox, false for production
        merchant_id: PAYHERE_MERCHANT_ID,
        return_url: `${APP_URL}/payment-success`,
        cancel_url: `${APP_URL}/payment-cancel`,
        notify_url: `${API_BASE}/payments/notify`,
        order_id: newOrder._id,
        items: "Cart Total",
        amount: newOrder.totalAmount.toFixed(2),
        currency: "LKR",
        first_name: name,
        last_name: "",
        email: "", // Add if you collect user email
        phone: whatsapp,
        address: address,
        city: "", // Add if you collect this
        country: "Sri Lanka",
        hash: hash,
      };

      // Create a form and submit it
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";
      Object.keys(payment).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = (payment as any)[key];
        form.appendChild(input);
      });
      document.body.appendChild(form);

      // Clear cart *before* redirecting
      clearCart();

      form.submit();
      // No need to set isLoading(false) as we are redirecting
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
      setIsLoading(false); // Reset loading state on error
    }
  };

  // This is the new click handler for the "Pay with PayHere" button
  const handleCheckoutClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Instead of prompts, just open the modal
    setIsModalOpen(true);
  };

  useEffect(() => {
    setQuantities(cart.map((item) => item.quantity || 1));
  }, [cart]);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newQuantities = [...quantities];
    newQuantities[index] = newQuantity;
    setQuantities(newQuantities);
    updateQuantity(cart[index]._id, newQuantity);
  };

  const totalPrice = cart.reduce(
    (sum, item, index) => sum + item.price * (quantities[index] || 1),
    0
  );

  return (
    <>
      {" "}
      {/* Use Fragment to render modal at the root level */}
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 py-32 px-4 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h1 className="text-3xl font-extrabold text-black mb-8">
              Your Cart
            </h1>

            {cart.length === 0 && (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}

            <div className="space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={`${API_BASE.replace("/api", "")}/uploads/${
                        item.coverImage
                      }`}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg shadow"
                    />
                    <div>
                      <p className="font-bold text-black">{item.title}</p>
                      <p className="text-gray-600">
                        Rs {item.price.toFixed(2)}
                      </p>{" "}
                      {/* Updated currency */}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Control */}
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(index, quantities[index] - 1)
                        }
                        className="px-3 py-1 text-lg font-bold text-gray-600 hover:text-black"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        readOnly
                        value={quantities[index]}
                        className="w-12 text-center border-l border-r"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(index, quantities[index] + 1)
                        }
                        className="px-3 py-1 text-lg font-bold text-gray-600 hover:text-black"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-black">
              <p className="text-xl font-semibold mb-4 md:mb-0">
                Total:{" "}
                <span className="text-green-600">
                  Rs:{totalPrice.toFixed(2)}
                </span>
              </p>
              <button
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold disabled:opacity-50"
                onClick={handleCheckoutClick} // <-- Changed to new click handler
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? "Processing..." : "Pay with PayHere"}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {/* Render the modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFinalSubmit}
      />
    </>
  );
};

export default CartPage;
