// src/Components/JsCompo/BookingModal.jsx
import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

function format12h(hhmm) {
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  if (h > 12) h -= 12;
  return `${h}:${mStr} ${ampm}`;
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function nextNDates(n) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const weekday = d.toLocaleDateString("en-GB", { weekday: "short" }); // Wed
    const dayNum = d.getDate(); // 10
    const month = d.toLocaleDateString("en-GB", { month: "short" }); // Sep
    return {
      iso: d.toISOString().slice(0, 10),
      // 👉 “Wed, 10th Sep” (has the 1st/2nd/3rd/10th style you asked for)
      label: `${weekday}, ${ordinal(dayNum)} ${month}`,
    };
  });
}

// Random time in [4:00 PM, 9:00 PM)
function randomSlot() {
  const hour = Math.floor(Math.random() * (21 - 16)) + 16; // 16..20
  const minute = Math.random() < 0.5 ? "00" : "30";
  return `${hour}:${minute}`;
}

function consecutiveSeats(count) {
  // Preview only (actual locking happens in the seat page)
  const row = String.fromCharCode(65 + Math.floor(Math.random() * 5) + 5); // F..K
  const startNo = Math.floor(Math.random() * Math.max(1, 20 - count)) + 1;
  return Array.from({ length: count }, (_, i) => `${row}-${startNo + i}`);
}

const clamp = (n) => Math.max(1, Math.min(10, n));

export default function BookingModal({ event, onClose }) {
  const navigate = useNavigate();

  const days = useMemo(() => nextNDates(7), []);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(days[0]?.iso || "");
  const [seatCount, setSeatCount] = useState(1);

  // Step-2 preview
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState([]);

  const handleSeatInput = (value) => {
    // robust numeric handling
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return setSeatCount(1);
    setSeatCount(clamp(num));
  };

  const dec = () => setSeatCount((s) => clamp(s - 1));
  const inc = () => setSeatCount((s) => clamp(s + 1));

  function proceed() {
    if (step === 1) {
      setTime(randomSlot());
      setSeats(consecutiveSeats(seatCount));
      setStep(2);
      return;
    }
    onClose?.();
    navigate("/payment");
  }

  return (
    <Modal isOpen={true} onClose={onClose} labelledBy="booking-title">
      <div className="w-[92vw] max-w-[680px] p-6 sm:p-7 bg-white/95 rounded-lg">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2
              id="booking-title"
              className="text-xl font-semibold mb-4 text-[#EF233C]"
            >
              Select your options
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Dates</label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {days.map((d) => (
                    <option key={d.iso} value={d.iso}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seats with +/- controls */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Seats
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={dec}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    aria-label="Decrease seats"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={seatCount}
                    onChange={(e) => handleSeatInput(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()} // avoid accidental changes with scroll
                    className="w-full border rounded-lg px-3 py-2 text-center"
                  />
                  <button
                    type="button"
                    onClick={inc}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    aria-label="Increase seats"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Allowed: 1–10</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={proceed}
                className="px-4 py-2 rounded-lg bg-[#EF233C] text-white hover:bg-[#ef233ccc]"
              >
                Proceed
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Confirm your booking</h2>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={event?.poster_url || event?.image_url}
                alt={event?.title}
                className="w-[160px] h-[220px] object-cover rounded-lg shadow"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div className="flex-1">
                <p className="text-lg font-semibold font-kufam text-[#EF233c]">
                  {event?.title}
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="font-semibold">
                    <span className="font-medium text-green-600">Date:</span>{" "}
                    {days.find((d) => d.iso === date)?.label || date}
                  </p>
                  <p className="font-semibold">
                    <span className="font-medium text-green-600">Time:</span>{" "}
                    {format12h(time)}
                  </p>
                  <p className="font-semibold">
                    <span className="font-medium text-green-600">Venue:</span>{" "}
                    {event?.venue || "—"}
                  </p>
                  <p className="font-semibold">
                    <span className="font-medium text-green-600">Seats:</span>{" "}
                    {seats.join(", ")}
                  </p>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-gray-50 border">
                  <p className="text-sm text-green-600">
                    Price:{" "}
                    <span className="font-semibold text-black">
                      ₹{event?.price_from}
                    </span>{" "}
                    ×{" "}
                    <span className="font-semibold text-[#EF233c]">
                      {seatCount}
                    </span>
                  </p>
                  <p className="text-base font-semibold mt-1">
                    <span className="text-green-600">Total:</span> ₹{" "}
                    {(event?.price_from || 0) * seatCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={proceed}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
