import { useState, useEffect } from "react";
import * as React from "react";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBars,
  FaChevronUp,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Login/login";
import SignUp from "./SignUp/Signup";
import { useCart } from "./Context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

const Navbar: React.FC = () => {
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleScroll = (id: string) => {
    if (location.pathname === "/") {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
    setMobileMenu(false);
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

  const modalOverlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const modalContentVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.1 } },
  };

  // Updated Dropdown Animation: Scales from top-right corner
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "calc(100vh - 4rem)" },
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

        {/* Icons Container */}
        <div className="flex items-center space-x-4 relative">
          {/* --- CART ICON SECTION --- */}
          <div className="relative">
            <div
              className="relative cursor-pointer"
              onClick={() => {
                setShowCart(!showCart);
                setShowUserDropdown(false); // Close user menu if opening cart
              }}
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
            </div>

            {/* Cart Dropdown */}
            <AnimatePresence>
              {showCart && (
                <motion.div
                  className="absolute -right-6 top-full mt-3 w-72 max-w-[85vw] bg-black/95 backdrop-blur-xl border border-gray-700 text-white rounded-lg shadow-2xl z-50 p-4 origin-top-right"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                    <h3 className="font-bold text-yellow-400">Your Cart</h3>
                    <span className="text-xs text-gray-400">
                      {cart.length} Items
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      Your cart is empty
                    </p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {cart.map((item: CartItem) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center mb-3 text-sm"
                        >
                          <span className="truncate w-32 font-medium">
                            {item.title}
                          </span>
                          <div className="flex items-center space-x-2 text-gray-300">
                            <span>x{item.quantity}</span>
                            <span className="text-white font-semibold">
                              ${item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.length > 0 && (
                    <button
                      className="w-full mt-3 bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300 font-bold transition shadow-md"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- USER ICON SECTION --- */}
          <div className="relative">
            <FaUserCircle
              size={26}
              onClick={() => {
                if (isAuthenticated) {
                  setShowUserDropdown(!showUserDropdown);
                  setShowCart(false);
                } else {
                  setShowAuth(true);
                  setShowUserDropdown(false);
                }
              }}
              className="cursor-pointer hover:text-yellow-400 transition-colors duration-300"
            />

            {/* Logout/User Dropdown */}
            <AnimatePresence>
              {isAuthenticated && showUserDropdown && (
                <motion.div
                  className="absolute right-0 top-full mt-3 w-48 bg-black/95 backdrop-blur-xl border border-gray-700 text-white rounded-lg shadow-2xl z-50 p-2 origin-top-right"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded hover:bg-red-500/20 hover:text-red-400 text-sm transition-colors flex items-center gap-2"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-yellow-400 transition-colors"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <FaBars size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            className="fixed top-16 left-0 w-full bg-black/95 backdrop-blur-xl text-white flex flex-col items-center justify-start pt-10 space-y-8 md:hidden z-40 shadow-lg border-b border-gray-800"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <div className="flex flex-col items-center space-y-6 w-full">
              {["categories", "new-ones", "top-rated", "reviews", "about"].map(
                (id) => (
                  <button
                    key={id}
                    onClick={() => handleScroll(id)}
                    className="text-xl font-medium hover:text-yellow-400 hover:scale-105 transition-all duration-300 tracking-wide"
                  >
                    {id.replace("-", " ").toUpperCase()}
                  </button>
                )
              )}
            </div>
            <div className="w-16 h-[1px] bg-gray-700"></div>
            <button
              onClick={() => setMobileMenu(false)}
              className="flex flex-col items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300 mt-4 pb-10"
            >
              <span className="text-sm mb-2">Close Menu</span>
              <div className="p-3 border border-gray-600 rounded-full hover:border-yellow-400">
                <FaChevronUp size={20} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-[60]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalOverlayVariants}
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              className="p-6 rounded-xl shadow-2xl w-96 relative bg-gray-900 text-white border border-yellow-500/30"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition-colors"
                onClick={() => setShowAuth(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

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
