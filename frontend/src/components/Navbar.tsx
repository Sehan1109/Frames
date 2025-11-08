import { useState, useEffect } from "react";
import * as React from "react"; // Import React for FC
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Login/login"; // Assumes Login.tsx exists
import SignUp from "./SignUp/Signup"; // Assumes SignUp.tsx exists
import { useCart } from "./Context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- NEW: Interface for Cart Items ---
interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

// --- CHANGED: Use React.FC for component type ---
const Navbar: React.FC = () => {
  // --- CHANGED: Explicitly typed states ---
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  // --- CHANGED: Assumes useCart() returns { cart: CartItem[] } ---
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // --- CHANGED: Typed the 'id' parameter ---
  const handleScroll = (id: string) => {
    if (location.pathname === "/") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
    setMobileMenu(false); // Close mobile menu on navigation
  };

  const handleCheckout = () => {
    navigate("/cart");
    setShowCart(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
    setIsLogin(true);
    toast.success("Login successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setShowUserDropdown(false);
    toast.success("Logout successfully");
    navigate("/");
  };

  // --- Animation Variants (no changes needed) ---
  const modalOverlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const modalContentVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.1 } },
  };
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 h-16 bg-black/95 backdrop-blur-lg text-white shadow-lg border-b border-gray-700/50 z-50">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Fujo
          <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
            Frame
          </span>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {["categories", "new-ones", "top-rated", "reviews", "about"].map(
            (id) => (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="hover:text-yellow-400 transition-colors duration-300"
              >
                {id.replace("-", " ").toUpperCase()}
              </button>
            )
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 relative">
          {/* Cart Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => setShowCart(!showCart)}
          >
            <FaShoppingCart
              size={24}
              className="hover:text-yellow-400 transition-colors duration-300"
            />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            )}

            {/* Cart Dropdown */}
            <AnimatePresence>
              {showCart && (
                <motion.div
                  className="absolute right-0 mt-4 w-64 bg-black/90 backdrop-blur-lg border text-white rounded-lg shadow-lg z-50 p-4"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <h3 className="font-bold mb-2">Cart Items</h3>
                  {cart.length === 0 ? (
                    <p className="text-gray-400">Your cart is empty</p>
                  ) : (
                    <>
                      {/* --- CHANGED: Typed 'item' in map --- */}
                      {cart.map((item: CartItem) => (
                        <div
                          key={item._id}
                          className="flex justify-between mb-2 border-b border-gray-700 pb-1"
                        >
                          <span>{item.title}</span>
                          <span>
                            ${item.price} x {item.quantity}
                          </span>
                        </div>
                      ))}
                      <button
                        className="w-full mt-2 bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300 font-semibold transition"
                        onClick={handleCheckout}
                      >
                        Checkout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Icon (Conditional) */}
          <div className="relative">
            <FaUserCircle
              size={26}
              onClick={() => {
                if (isAuthenticated) {
                  setShowUserDropdown(!showUserDropdown);
                  setShowAuth(false);
                } else {
                  setShowAuth(true);
                  setShowUserDropdown(false);
                }
              }}
              className="cursor-pointer hover:text-yellow-400 transition-colors duration-300"
            />

            {/* Logout Dropdown */}
            <AnimatePresence>
              {isAuthenticated && showUserDropdown && (
                <motion.div
                  className="absolute right-0 mt-4 w-48 bg-black/90 backdrop-blur-lg border text-white rounded-lg shadow-lg z-50 p-2"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="fixed top-16 left-0 w-full bg-black/90 backdrop-blur-lg text-white flex flex-col space-y-6 p-6 md:hidden z-40 shadow-lg"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            {["categories", "new-ones", "top-rated", "reviews", "about"].map(
              (id) => (
                <button
                  key={id}
                  onClick={() => handleScroll(id)}
                  className="text-lg hover:text-yellow-400 transition-colors duration-300"
                >
                  {id.replace("-", " ").toUpperCase()}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalOverlayVariants}
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              className="p-6 rounded-xl shadow-2xl w-96 relative bg-black/75 text-white border-2 border-yellow-300"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition-colors"
                onClick={() => setShowAuth(false)}
              >
                <FaTimes size={20} />
              </button>

              {/* --- CHANGED: Passing 'onSuccess' prop --- */}
              {isLogin ? (
                <Login onSuccess={handleAuthSuccess} />
              ) : (
                <SignUp onSuccess={handleAuthSuccess} />
              )}

              <p className="mt-4 text-sm text-center text-gray-400">
                {isLogin ? (
                  <>
                    Don’t have an account?{" "}
                    <span
                      className="text-yellow-500 hover:text-yellow-600 cursor-pointer font-semibold"
                      onClick={() => setIsLogin(false)}
                    >
                      Sign Up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span
                      className="text-yellow-500 hover:text-yellow-600 cursor-pointer font-semibold"
                      onClick={() => setIsLogin(true)}
                    >
                      Login
                    </span>
                  </>
                )}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
