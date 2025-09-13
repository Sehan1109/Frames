import { useCart } from "../Context/CartContext";
import CheckoutButton from "../Context/CheckoutButton";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState(
    cart.map((item) => item.quantity || 1)
  );

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
                      src={`http://localhost:5000/${item.coverImage}`}
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
                  <input
                    type="number"
                    min={1}
                    value={quantities[index]}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                    className="w-16 px-2 py-1 border rounded-lg text-center"
                  />
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
            <CheckoutButton cart={cart} className="mt-4 md:mt-0" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
