import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const PaymentCancel = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <XCircle size={80} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Canceled
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Your payment was not completed.
        </p>
        <p className="text-gray-600">
          Your order was canceled. If you had any issues, please try again.
        </p>
        <Link
          to="/cart"
          className="mt-8 px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold"
        >
          Back to Cart
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentCancel;
