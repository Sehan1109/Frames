import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Login from "./Login/login";
import SignUp from "./SignUp/Signup"; // <-- import signup component

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleUserIconClick = () => {
    setShowAuth(true);
  };

  const handleClose = () => {
    setShowAuth(false);
  };

  return (
    <div>
      <header className="flex justify-between items-center px-8 py-4 bg-black text-white">
        <h1 className="text-xl font-bold">FujoFrame</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:underline">Categories</a>
          <a href="#" className="hover:underline">Top Picks</a>
          <a href="#" className="hover:underline">About us</a>
        </nav>
        <FaUserCircle
          size={24}
          onClick={handleUserIconClick}
          style={{ cursor: "pointer" }}
        />
      </header>

      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={handleClose}
            >
              ✖
            </button>

            {/* Toggle Login/Signup */}
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
