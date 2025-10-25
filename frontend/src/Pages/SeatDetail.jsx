import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import seatbg from "../Components/Images/seatbg.png";
import { IoLocationSharp } from "react-icons/io5";

const SeatSelection = () => {
  const { movieId } = useParams();
  const location = useLocation();

  const {
    title, // movie title
    poster, // poster image url
    duration, // duration in minutes
    showTime, // display time user picked (e.g., "10:20 AM")
    showTimeISO, // raw ISO if needed
    times = [], // all display times for this theatre/hall (already formatted)
    date, // selected date
    placeName, // theatre name
  } = location.state || {};

  const MAX_SEATS = 8;

  const [movieName, setMovieName] = useState(title || "Movie");
  const [selectedTime, setSelectedTime] = useState(showTime || null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([
    "Silver-F-5",
    "Gold-D-8",
    "Platinum-B-3",
  ]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (title) setMovieName(title);
  }, [title]);

  const sections = [
    { type: "Platinum", price: 450, rows: 2, seatsPerRow: 12 },
    { type: "Gold", price: 350, rows: 3, seatsPerRow: 16 },
    { type: "Silver", price: 210, rows: 4, seatsPerRow: 20 },
  ];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      const alreadySelected = prev.includes(seatId);

      // Allow deselect anytime
      if (alreadySelected) {
        return prev.filter((s) => s !== seatId);
      }

      // Prevent selecting more than MAX_SEATS
      if (prev.length >= MAX_SEATS) {
        return prev;
      }

      return [...prev, seatId];
    });
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const sectionType = seatId.split("-")[0];
    const section = sections.find((s) => s.type === sectionType);
    return sum + (section ? section.price : 0);
  }, 0);

  let globalRowIndex = 0;

  const availableTimes = times.length
    ? times
    : ["10:20 AM", "01:20 PM", "05:55 PM", "09:35 PM"];

  const hasReachedLimit = selectedSeats.length >= MAX_SEATS;

  return (
    <div
      className="w-full min-h-screen text-white flex flex-col"
      style={{
        backgroundImage: `url(${seatbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      {/* Main 3-column flex row */}
      <div className="flex-1 px-4 md:px-6 py-4 ">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
            {/* LEFT: movie + timings */}
            <aside className="w-fit shrink-0 sticky top-24 self-start">
              <h2 className="text-xl font-bold mb-3">{movieName}</h2>

              <div className="flex flex-col gap-2 w-fit">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-2 rounded text-sm text-left transition w-fit
                      ${
                        selectedTime === time
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-xs text-gray-300">
                Selected time:{" "}
                <span className="text-green-400">
                  {selectedTime || "Select a time"}
                </span>
              </p>
            </aside>

            {/* CENTER: seat layout */}
            <main className="flex-1">
              <div className="flex flex-col items-center space-y-6 overflow-auto">
                {sections.map((section, sIndex) => (
                  <div key={sIndex} className="text-center">
                    <h3 className="text-md font-semibold mb-2">
                      <span className="text-green-500">₹{section.price}</span>{" "}
                      {section.type.toUpperCase()}
                    </h3>

                    {Array.from({ length: section.rows }).map((_, rowIndex) => {
                      const rowLabel = String.fromCharCode(65 + globalRowIndex);
                      globalRowIndex++;

                      return (
                        <div
                          key={rowLabel}
                          className="flex items-center justify-center mb-1"
                        >
                          <span className="w-6 font-bold">{rowLabel}</span>

                          <div className="flex">
                            {Array.from({ length: section.seatsPerRow }).map(
                              (_, seatIndex) => {
                                const seatNumber = seatIndex + 1;
                                const seatId = `${section.type}-${rowLabel}-${seatNumber}`;
                                const isBooked = bookedSeats.includes(seatId);
                                const isSelected =
                                  selectedSeats.includes(seatId);

                                let aislePositions = [];
                                if (section.type === "Silver")
                                  aislePositions = [5, 15];
                                if (section.type === "Gold")
                                  aislePositions = [4, 12];
                                if (section.type === "Platinum")
                                  aislePositions = [6];

                                const extraSpace =
                                  aislePositions.includes(seatNumber);

                                // Disable unselected seats when limit reached (selected ones remain clickable for deselect)
                                const isDisabledByLimit =
                                  !isSelected && hasReachedLimit;

                                const disabled = isBooked || isDisabledByLimit;

                                return (
                                  <React.Fragment key={seatIndex}>
                                    <button
                                      onClick={() => handleSeatClick(seatId)}
                                      disabled={disabled}
                                      className={`w-6 h-6 m-0.5 rounded flex items-center justify-center border text-[10px]
                                        ${
                                          isBooked
                                            ? "bg-orange-600 text-white font-bold cursor-not-allowed"
                                            : isSelected
                                            ? "bg-green-500 text-white shadow-[0_0_8px_rgba(0,255,0,0.7)]"
                                            : disabled
                                            ? "bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed"
                                            : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                                        } transition-all duration-200`}
                                    >
                                      {seatNumber}
                                    </button>
                                    {extraSpace && <div className="w-6" />}
                                  </React.Fragment>
                                );
                              }
                            )}
                          </div>

                          <span className="w-6 font-bold">{rowLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Screen */}
                <div className="mt-6 mb-2 w-2/3 h-8 bg-green-600 rounded flex items-center justify-center text-sm text-white">
                  All eyes this way please
                </div>
              </div>
            </main>

            {/* RIGHT: selected seats */}
            <aside className="w-fit shrink-0 sticky top-24 self-start">
              <h4 className="font-semibold text-lg text-white">
                Selected Seats ({selectedSeats.length}/{MAX_SEATS})
              </h4>
              <div className="mt-2 max-h-[50vh] overflow-auto pr-1 w-fit">
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-300 text-sm">No seats selected</p>
                ) : (
                  <ul className="space-y-1 text-sm w-fit">
                    {selectedSeats.map((s) => (
                      <li
                        key={s}
                        className="bg-white text-green-600 font-semibold border border-gray-700 rounded px-2 py-1 w-fit"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Limit notice */}
              <p className="text-sm text-yellow-300 text-center mt-1">
                *Maximum {MAX_SEATS} seats per booking
                {hasReachedLimit && (
                  <span className="block text-center text-base font-semibold text-[#EF233C] rounded-full mt-1">
                    Seat limit reached
                  </span>
                )}
              </p>
            </aside>
          </div>
        </div>
      </div>

      {/* Footer: total + proceed */}
      <div className="w-full border-t border-gray-700 p-3 bg-white flex mt-2 justify-end gap-5 items-center text-sm">
        <div className="text-black">
          <h4 className="font-semibold text-lg">Total : ₹{totalPrice}</h4>
        </div>
        <button
          disabled={selectedSeats.length === 0}
          onClick={() => setShowModal(true)}
          className={`px-4 py-2 rounded text-lg font-semibold ${
            selectedSeats.length === 0
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Proceed
        </button>
      </div>

      {/* Modal popup */}
      {/* 🚀 POPUP MODAL START */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg text-black relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* Title + Info (no poster here) */}
            <div className="flex justify-between">
              <div className="w-1/2">
                <div>
                  <h2 className="text-xl font-bold font-kufam">{title}</h2>
                  <p className="text-md text-green-600">
                    {duration
                      ? `${Math.floor(duration / 60)}h ${duration % 60}m`
                      : "—"}
                  </p>
                  <p className="text-md text-[#EF233C] flex items-center span-3">
                    {placeName}
                    <IoLocationSharp />
                  </p>
                </div>

                {/* ShowTime + Date */}
                <div className="mt-4">
                  <p>
                    <span className="font-semibold text-green-600">Date:</span>{" "}
                    {date}
                  </p>
                  <p>
                    <span className="font-semibold text-green-600">Time:</span>{" "}
                    {showTime}
                  </p>
                </div>

                {/* Seats */}
                <div className="mt-4">
                  <p className="font-semibold">Seats:</p>
                  {selectedSeats.length > 0 ? (
                    <ul className="flex flex-wrap gap-2 mt-1">
                      {selectedSeats.map((s) => (
                        <li
                          key={s}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No seats selected</p>
                  )}
                </div>
              </div>

              {/* Poster above payment button */}
              {poster && (
                <div className="mt-6 flex justify-end">
                  <img
                    src={poster}
                    alt="Movie Poster"
                    className="w-44 h-fit object-cover rounded-lg shadow"
                  />
                </div>
              )}
            </div>

            {/* Total + Payment */}
            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-green-600">
                Total: <span className="text-black"> ₹{totalPrice}</span>
              </h3>
              <button
                onClick={() => (window.location.href = "/payment")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🚀 POPUP MODAL END */}

      <Footer />
    </div>
  );
};

export default SeatSelection;
