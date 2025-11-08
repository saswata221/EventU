// frontend/src/Pages/Payment.jsx
import React, { useState } from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import paymentBG from "../Components/Images/paymentBG.jpg";

export default function Payment() {
  const navigate = useNavigate();

  const presets = [50, 75, 100];
  const [selected, setSelected] = useState(presets[0]);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // validation limits (in rupees)
  const MIN = 10;
  const MAX = 10000;

  function getAmountRupees() {
    if (custom && custom.trim() !== "") {
      return Number(custom);
    }
    return Number(selected);
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    const amount = getAmountRupees();

    if (!amount || Number.isNaN(amount)) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amount < MIN) {
      setError(`Minimum amount is ₹${MIN}.`);
      return;
    }
    if (amount > MAX) {
      setError(`Maximum amount is ₹${MAX.toLocaleString()}.`);
      return;
    }

    try {
      setLoading(true);
      const body = custom ? { customAmount: amount } : { preset: amount };
      const { url } = await api.createCheckoutSession(body);
      if (url) {
        window.location.href = url;
      } else {
        setError("Could not create checkout session. Try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Unexpected error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* Main section with background image */}
      <main
        className="flex-1 flex items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-12"
        style={{
          backgroundImage: ` url(${paymentBG})`,
        }}
      >
        <div className="max-w-2xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-9 border border-blue-700">
          <h1 className="text-3xl font-kufam font-extrabold mb-2 text-slate-800">
            Buy me a tea ☕
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            This is a personal project built to showcase my full-stack
            development skills. Feel free to explore, and you can contact me for
            collaborations or feedback.
          </p>

          {/* Preset buttons */}
          <div className="flex gap-3 mb-4">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setSelected(p);
                  setCustom("");
                }}
                className={`px-4 py-2 rounded-full font-medium border transition-all ${
                  selected === p && !custom
                    ? "bg-[#EF233C] text-white border-[#EF233C] shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                ₹{p}
              </button>
            ))}
            <button
              onClick={() => {
                setSelected(null);
                setCustom("");
                const el = document.getElementById("custom-amount");
                if (el) el.focus();
              }}
              className={`px-4 py-2 rounded-full font-medium border transition-all ${
                custom
                  ? "bg-[#EF233C] text-white border-[#EF233C] shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom input */}
          <form onSubmit={handlePay}>
            <div className="mb-4">
              <label className="block text-sm text-slate-600 mb-1">
                Custom amount (INR)
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-l-md text-slate-600">
                  ₹
                </span>
                <input
                  id="custom-amount"
                  type="number"
                  min={MIN}
                  max={MAX}
                  step="1"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    if (e.target.value === "") setSelected(presets[0]);
                  }}
                  placeholder="Enter amount in rupees"
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#EF233C]"
                />
              </div>
              <p className="text-xs text-[#] mt-2">
                Min ₹{MIN} • Max ₹{MAX.toLocaleString()}
              </p>
            </div>

            {/* Error */}
            {error && <div className="text-sm text-rose-600 mb-3">{error}</div>}

            {/* Pay button + loader */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 bg-[#EF233C] text-white px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>Proceed to pay ₹{getAmountRupees()}</>
                )}
              </button>

              <div className="text-sm text-[#023e8a]">
                *Secure payment powered by Stripe
              </div>
            </div>
          </form>

          <div className="mt-6 text-xs text-black">
            You will be redirected to a secure Stripe Checkout page to complete
            the payment.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
