// frontend/src/Pages/PaymentSuccess.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import paymentBG from "../Components/Images/paymentBG.jpg";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentSuccess() {
  const q = useQuery();
  const sessionId = q.get("session_id");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* Main section with background image */}
      <main
        className="flex-1 flex items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-20"
        style={{ backgroundImage: `url(${paymentBG})` }}
      >
        <div className="max-w-2xl w-full mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-11 border border-blue-600 text-center">
          {/* Animated Success Checkmark */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[4px] border-emerald-500 animate-scale"></div>
              <svg
                className="w-10 h-10 text-emerald-500 animate-draw-check z-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-slate-800">
            Payment successful
          </h2>
          <p className="text-slate-600 mb-4">
            Thank you for your support — your donation helps EventU grow!
          </p>

          {sessionId && (
            <div className="bg-white/50 border border-white/40 rounded p-3 text-sm text-slate-700 mb-4 break-all">
              <strong>Session ID:</strong> {sessionId}
            </div>
          )}

          <Link
            to="/"
            className="inline-block mt-2 px-6 py-2 bg-[#EF233C] text-white rounded-lg font-medium hover:bg-[#d92034] transition"
          >
            Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
