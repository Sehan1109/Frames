import React, { useState } from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Login from "./Login/login";
import SignUp from "./SignUp/Signup";
import { useCart } from "./Context/CartContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const { cart } = useCart();
  const navigate = useNavigate();

  const handleUserIconClick = () => {
    setShowAuth(true);
  };

  const handleClose = () => {
    setShowAuth(false);
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleCheckout = () => {
    navigate("/cart"); // redirect to a Cart/Checkout page
  };

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center px-8 py-4 bg-black text-white">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          FujoFrame
        </h1>
        <nav className="space-x-6">
          <button
            onClick={() => handleScroll("categories")}
            className="hover:underline relative"
          >
            Categories
          </button>
          <button
            onClick={() => handleScroll("new-ones")}
            className="hover:underline"
          >
            New Ones
          </button>
          <button
            onClick={() => handleScroll("top-rated")}
            className="hover:underline"
          >
            Top Rated
          </button>
          <button
            onClick={() => handleScroll("reviews")}
            className="hover:underline"
          >
            Reviews
          </button>
          <button
            onClick={() => handleScroll("about")}
            className="hover:underline"
          >
            About us
          </button>
        </nav>

        <div className="flex items-center space-x-4 relative">
          {/* Cart Icon */}
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <FaShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}

            {/* Cart Dropdown */}
            {showCart && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-50 p-4">
                <h3 className="font-bold mb-2">Cart Items</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between mb-2 border-b pb-1"
                      >
                        <span>{item.title}</span>
                        <span>
                          ${item.price} x {item.quantity}
                        </span>
                      </div>
                    ))}
                    <button
                      className="w-full mt-2 bg-black text-white py-2 rounded hover:bg-gray-800"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Icon */}
          <FaUserCircle
            size={24}
            onClick={handleUserIconClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={handleClose}
            >
              ✖
            </button>

            {isLogin ? <Login /> : <SignUp />}

            <p className="mt-4 text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    className="text-blue-500 underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-blue-500 underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Log In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
