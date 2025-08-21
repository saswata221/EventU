import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import event1 from "../Images/event1.jpeg";
import event2 from "../Images/event2.png";
import event3 from "../Images/event3.jpeg";


const images = [
  event1,
  event2,
  event3,
];

const slogans = [
    'Where Every Event Starts With You.',
  'Book it. Love it. Live it.',
  'Join Us and Celebrate Every Moment.',
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [sloganIdx, setSloganIdx] = useState(0);
  const timeoutRef = useRef(null);

  // Auto-slide images
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // Auto-change slogan
  useEffect(() => {
    const sloganTimer = setInterval(() => {
      setSloganIdx((prev) => (prev + 1) % slogans.length);
    }, 2500);
    return () => clearInterval(sloganTimer);
  }, []);

  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full" style={{ aspectRatio: '3 / 1' }}>
      {/* Carousel Image */}
      <img
        src={images[current]}
        alt="Event"
        className="w-full h-full object-cover transition-all brightness-95 duration-700"
        style={{ aspectRatio: '3 / 1' }}
      />
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 bottom-0 w-[50%] bg-gradient-to-r from-black/100 to-transparent z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-[50%] bg-gradient-to-l from-black/100 to-transparent z-10" />
        {/* Auto-changing Slogan */}
       <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 w-2/3 sm:w-11/12 flex flex-col items-center z-20">
        <div className="mt-6 md:mt-8 font-inknut text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center drop-shadow-lg transition-all duration-500">
          {slogans[sloganIdx]}
        </div>
      </div>
      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-[40%] text-5xl hover:text-[#EF233C] text-white rounded-full p-3 z-10"
        aria-label="Previous"
      >
        <IoIosArrowBack/>
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-[40%] text-5xl  hover:text-[#EF233C] text-white rounded-full p-3 z-10"
        aria-label="Next"
      >
        <IoIosArrowForward/>
      </button>
    </div>
  );
} 