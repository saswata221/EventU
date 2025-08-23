import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";

const SeatSelection = () => {
  const { movieId } = useParams();
  const [movieName, setMovieName] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:20 AM");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([
    "Silver-F-5",
    "Gold-D-8",
    "Platinum-B-3",
  ]);

  useEffect(() => {
    const movies = {
      1: "War 2 (Hindi)",
      2: "Jawan (Hindi)",
      3: "KGF 3",
    };
    setMovieName(movies[movieId] || "Movie");
  }, [movieId]);

  const sections = [
    { type: "Platinum", price: 450, rows: 2, seatsPerRow: 12 },
    { type: "Gold", price: 350, rows: 3, seatsPerRow: 16 },
    { type: "Silver", price: 210, rows: 4, seatsPerRow: 20 },
  ];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const sectionType = seatId.split("-")[0];
    const section = sections.find((s) => s.type === sectionType);
    return sum + (section ? section.price : 0);
  }, 0);

  let globalRowIndex = 0;

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-gray-800">
        <h2 className="text-lg font-bold">{movieName}</h2>
        <div className="flex gap-2">
          {["10:20 AM", "01:20 PM", "05:55 PM", "09:35 PM"].map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-3 py-1 rounded text-sm ${
                selectedTime === time
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="flex flex-col items-center mt-4 space-y-6 flex-1 overflow-auto">
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="text-center">
            <h3 className="text-md font-semibold mb-2">
              ₹{section.price} {section.type.toUpperCase()}
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
                        const isSelected = selectedSeats.includes(seatId);

                        let aislePositions = [];
                        if (section.type === "Silver") aislePositions = [5, 15];
                        if (section.type === "Gold") aislePositions = [4, 12];
                        if (section.type === "Platinum") aislePositions = [6];

                        const extraSpace = aislePositions.includes(seatNumber);

                        return (
                          <React.Fragment key={seatIndex}>
                            <button
                              onClick={() => handleSeatClick(seatId)}
                              disabled={isBooked}
                              className={`w-6 h-6 m-0.5 rounded flex items-center justify-center border text-[10px] 
                                ${
                                  isBooked
                                    ? "bg-orange-600 text-white font-bold cursor-not-allowed"
                                    : isSelected
                                    ? "bg-green-500 text-white shadow-[0_0_8px_rgba(0,255,0,0.7)]"
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
        <div className="mt-6 mb-2 w-2/3 h-8 bg-gray-700 rounded flex items-center justify-center text-sm text-gray-200">
          All eyes this way please
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-gray-700 p-3 bg-white flex mt-6 justify-between items-center text-sm">
        <div>
          <h4 className="font-semibold text-lg text-green-600">Selected Seats:</h4>
          <p className="text-black text-base font-medium">
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "No seats selected"}
          </p>
        </div>
        <div className="text-right">
          <h4 className="font-semibold">Total: ₹{totalPrice}</h4>
          <button
            disabled={selectedSeats.length === 0}
            className={`px-3 py-1 rounded text-xl font-semibold ${
              selectedSeats.length === 0
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Proceed
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeatSelection;
