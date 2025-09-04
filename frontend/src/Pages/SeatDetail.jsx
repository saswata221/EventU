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
    const movies = { 1: "War 2 (Hindi)", 2: "Jawan (Hindi)", 3: "KGF 3" };
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
    <div className="w-full min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      {/* Main 3-column flex row (responsive) */}
      <div className="flex-1 px-4 md:px-6 py-4">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-6">

            {/* LEFT: movie + timings (fit-content) */}
            <aside className="w-fit shrink-0 sticky top-24 self-start">
              <h2 className="text-xl font-bold mb-3">{movieName}</h2>
              <div className="flex flex-col gap-2 w-fit">
                {["10:20 AM", "01:20 PM", "05:55 PM", "09:35 PM"].map((time) => (
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
                Selected time: <span className="text-green-400">{selectedTime}</span>
              </p>
            </aside>

            {/* CENTER: seat layout (flex-1) */}
            <main className="flex-1">
              <div className="flex flex-col items-center space-y-6 overflow-auto">
                {sections.map((section, sIndex) => (
                  <div key={sIndex} className="text-center">
                    <h3 className="text-md text-green-600font-semibold mb-2">
                     <span className="text-green-500"> ₹{section.price}</span> {section.type.toUpperCase()}
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
                <div className="mt-6 mb-2 w-2/3 h-8 bg-green-600 rounded flex items-center justify-center text-sm text-white ">
                  All eyes this way please
                </div>
              </div>
            </main>

            {/* RIGHT: selected seats (fit-content) */}
            <aside className="w-fit shrink-0 sticky top-24 self-start">
              <h4 className="font-semibold text-lg text-white">
                Selected Seats ({selectedSeats.length})
              </h4>
              <div className="mt-2 max-h-[50vh] overflow-auto pr-1 w-fit">
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-300 text-sm">No seats selected</p>
                ) : (
                  <ul className="space-y-1 text-sm w-fit">
                    {selectedSeats.map((s) => (
                      <li
                        key={s}
                        className="bg-white text-green-600  font-semibold border  border-gray-700 rounded px-2 py-1 w-fit"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* Footer: total + proceed */}
      <div className="w-full border-t border-gray-700 p-3 bg-white flex mt-2 justify-end gap-5 items-center text-sm">
        <div className="text-black">
          <h4 className="font-semibold text-lg">
            Total :&nbsp;₹{totalPrice}
          </h4>
        </div>
        <button
          disabled={selectedSeats.length === 0}
          className={`px-4 py-2 rounded text-lg font-semibold ${
            selectedSeats.length === 0
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Proceed
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default SeatSelection;
