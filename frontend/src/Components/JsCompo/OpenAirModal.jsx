import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- Date Formatter ---------- */
function formatPrettyDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} ${year}`;
}

/* ---------- Time Formatter (12 hr AM/PM) ---------- */
function formatTime12(timeStr) {
  if (!timeStr) return "";

  // Handles ISO or full datetime
  if (timeStr.includes("T") || timeStr.includes("Z")) {
    const d = new Date(timeStr);
    if (!isNaN(d)) {
      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
    }
  }

  // Handles "HH:mm"
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return timeStr;
}

/* ---------- Modal ---------- */
function OpenAirModal({ event, onClose }) {
  const navigate = useNavigate();
  const [seats, setSeats] = useState(1);

  const handleProceed = () => {
    navigate("/payment", {
      state: {
        event,
        seats,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-[90%] max-w-md bg-white rounded-2xl p-6 border border-purple-600 text-black animate-scaleIn">
        {/* Teams */}
        <div className="text-center mb-4">
          <p className="text-2xl font-kufam font-bold text-[#EF233C]">
            {event.team1}{" "}
            <span className="text-green-600 text-lg font-mono">VS</span>{" "}
            {event.team2}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-lg font-semibold font-inria">
          <p className="text-green-600">
            Starts At :{" "}
            <span className="text-black">{formatTime12(event.time)}</span>
          </p>

          <p className="text-green-600">
            Date :{" "}
            <span className="text-black">{formatPrettyDate(event.date)}</span>
          </p>

          <p className="text-green-600">
            Open Air Park : <span className="text-black">{event.location}</span>
          </p>
        </div>

        {/* Seat Selector */}
        <div className="mt-6">
          <p className="text-lg font-medium mb-2">Number of Seats</p>

          <div className="flex items-center gap-3">
            {/* Minus */}
            <button
              onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
              disabled={seats === 1}
              className="w-10 h-10 rounded-md text-lg font-semibold 
                         disabled:opacity-40 hover:bg-slate-200 transition"
            >
              −
            </button>

            {/* Count */}
            <div
              className="w-10 h-10 flex items-center justify-center 
                            rounded-md font-semibold text-[#EF233C]"
            >
              {seats}
            </div>

            {/* Plus */}
            <button
              onClick={() => setSeats((prev) => Math.min(4, prev + 1))}
              disabled={seats === 4}
              className="w-10 h-10 rounded-md text-lg font-semibold 
                         disabled:opacity-40 hover:bg-slate-200 transition"
            >
              +
            </button>
          </div>

          <p className="text-xs text-slate-700 mt-1">
            Allowed: Upto 4 per booking
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-md 
                       bg-green-600 text-white hover:bg-green-500"
          >
            Cancel
          </button>

          <button
            onClick={handleProceed}
            className="px-5 py-2 text-sm font-semibold rounded-md 
                       bg-[#EF233C] text-white hover:bg-[#d91e33]"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpenAirModal;
