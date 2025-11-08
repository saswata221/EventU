// frontend/src/Pages/PaymentCancel.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import paymentBG from "../Components/Images/paymentBG.jpg";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* Main section with background image */}
      <main
        className="flex-1 flex items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-20"
        style={{ backgroundImage: `url(${paymentBG})` }}
      >
        <div className="max-w-2xl w-full mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-blue-700 flex flex-col items-center justify-center text-center">
          {/* Simple Cross Animation */}
          <div className="relative w-28 h-28 mb-6">
            <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:w-[4px] before:h-full before:bg-red-500 before:left-1/2 before:-translate-x-1/2 before:rotate-45 before:animate-draw after:content-[''] after:absolute after:inset-0 after:w-[4px] after:h-full after:bg-red-500 after:left-1/2 after:-translate-x-1/2 after:-rotate-45 after:animate-draw drop-shadow-[0_0_15px_rgba(239,35,60,0.45)]"></div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-slate-800">
            Payment canceled
          </h2>
          <p className="text-slate-600 mb-6 max-w-md">
            No worries — your payment was not processed. You can try again
            anytime.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/payment"
              className="px-6 py-2 bg-[#EF233C] text-white rounded-lg font-medium hover:bg-[#d92034] transition"
            >
              Try again
            </Link>
            <Link
              to="/"
              className="px-6 py-2 rounded-lg text-slate-700 bg-gray-100 hover:bg-gray-300 transition"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
