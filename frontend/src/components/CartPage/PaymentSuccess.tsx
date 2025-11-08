import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <CheckCircle size={80} className="text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Thank you for your purchase.
        </p>
        {orderId && (
          <p className="text-gray-600">
            Your Order ID is: <strong>{orderId}</strong>
          </p>
        )}
        <p className="text-gray-600 mt-1">
          We have received your payment and your order is being processed.
        </p>
        <Link
          to="/"
          className="mt-8 px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
