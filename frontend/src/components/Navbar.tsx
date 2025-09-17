import { useState } from "react";
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import Login from "./Login/login";
import SignUp from "./SignUp/Signup";
import { useCart } from "./Context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id: string) => {
    if (location.pathname === "/") {
      // already on homepage → just scroll
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenu(false);
    } else {
      // go to home and pass the target section
      navigate("/", { state: { scrollTo: id } });
      setMobileMenu(false);
    }
  };

  return (
    <div>
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-900 to-black text-white shadow-md z-50">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          FujoFrame
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {["categories", "new-ones", "top-rated", "reviews", "about"].map(
            (id) => (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="hover:text-gray-300 transition-colors"
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
            <FaShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>

          {/* User Icon */}
          <FaUserCircle
            size={26}
            onClick={() => setShowAuth(true)}
            className="cursor-pointer hover:text-gray-300 transition"
          />

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
      {mobileMenu && (
        <div className="fixed top-16 left-0 w-full bg-black text-white flex flex-col space-y-6 p-6 md:hidden z-40 shadow-lg">
          {["categories", "new-ones", "top-rated", "reviews", "about"].map(
            (id) => (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="text-lg hover:text-gray-300 transition"
              >
                {id.replace("-", " ").toUpperCase()}
              </button>
            )
          )}
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="backdrop-blur-md p-6 rounded-2xl shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-white hover:text-yellow-400"
              onClick={() => setShowAuth(false)}
            >
              ✖
            </button>
            {isLogin ? <Login /> : <SignUp />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
