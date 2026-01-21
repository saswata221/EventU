import React from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";

import performance from "../Components/Images/performance.png";
import exhivition from "../Components/Images/exhivition.png";
import sports from "../Components/Images/sports.png";
import conference from "../Components/Images/conference.png";
import castle from "../Components/Images/castle.png";
import disco from "../Components/Images/disco.png";

function ListShow() {
  const cards = [
    { img: performance, title: "Performance" },
    { img: castle, title: "Experience" },
    { img: sports, title: "Sports" },
    { img: disco, title: "Party" },
    { img: exhivition, title: "Exhibition" },
    { img: conference, title: "Conference" },
  ];

  return (
    <div>
      <Navbar />

      {/* ---------------- Section ---------------- */}
      <div className="bg-[#11001c] w-full h-fit p-10">
        {/* Heading */}
        <div className="text-center">
          <p className="text-white text-5xl font-yatra">What can you host ?</p>
          <p className="text-white pt-3">
            As the purveyor of entertainment, BookMyShow enables your event with
            end to end solutions
          </p>
          <p className="text-white">
            from the time you register to the completion of the event. Let's
            look at what you can host.
          </p>
        </div>

        {/* Cards */}
        <div className="flex justify-center items-center p-10">
          <div className="flex flex-wrap justify-center gap-10 w-4/5">
            {cards.map((item, index) => (
              <div
                key={index}
                className="
                  w-72 h-80 p-4 rounded-lg bg-[#F8F9FC]
                  border border-black/5
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-2xl
                "
              >
                {/* Image animation */}
                <div className="overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="
                      transition-all duration-300 ease-out
                      hover:-translate-y-1 hover:scale-[1.05]
                      hover:brightness-105
                    "
                  />
                </div>

                <p className="font-yatra text-xl text-center pt-4 text-black">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            className="
              text-white bg-[#EF233C] px-6 py-2 rounded-lg w-fit
              hover:bg-[#d91e33] transition-colors duration-300
            "
          >
            List Your Show
          </button>
        </div>
      </div>
      {/* ------------------------------------------ */}

      <Footer />
    </div>
  );
}

export default ListShow;
