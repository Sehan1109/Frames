import { useCart } from "../Context/CartContext";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import OrderModal from "../Modal/OrderModal";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [quantities, setQuantities] = useState(
    cart.map((item) => item.quantity || 1)
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOrderSubmit = async (orderData: {
    name: string;
    address: string;
    whatsapp: string;
  }) => {
    try {
      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        await axios.post(
          `${API_BASE}/orders`,
          {
            productId: cartItem._id,
            ...orderData,
            quantity: quantities[i],
            price: cartItem.price * quantities[i],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      alert("Order placed successfully ✅");

      // ✅ Clear cart after successful order
      clearCart();
    } catch (err) {
      alert("Failed to place order ❌");
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    if (value < 1) return;
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
    updateQuantity(cart[index]._id, value);
  };

  const totalPrice = cart.reduce(
    (total, item, i) => total + item.price * (quantities[i] || 1),
    0
  );

  useEffect(() => {
    setQuantities(cart.map((item) => item.quantity || 1));
  }, [cart]);

  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p>Add some amazing items to get started!</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-black">
            Your Shopping Cart
          </h1>

          <div className="grid gap-6 text-black">
            {cart.map((item, index) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {item.coverImage && (
                    <img
                      src={`${API_BASE.replace("/api", "")}/uploads/${
                        item.coverImage
                      }`}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() =>
                        handleQuantityChange(index, quantities[index] - 1)
                      }
                      className="px-3 py-1 text-lg font-bold text-gray-600 hover:text-black"
                    >
                      −
                    </button>
                    <span className="w-12 text-center">
                      {quantities[index]}
                    </span>
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
            <p className="text-xl font-semibold">
              Total:{" "}
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </p>
            <button
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold"
              onClick={() => setIsOrderModalOpen(true)}
            >
              Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
        showQuantity={false}
      />
    </div>
  );
};

export default CartPage;
