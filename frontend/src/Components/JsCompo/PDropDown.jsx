import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


export default function PriceDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const s = "Price Range"
  const [isChange,setIsChange]=useState(s);
const priceRanges = [
   "₹ 0 - ₹ 100",
  "₹ 100 - ₹ 200",
  "₹ 200 - ₹ 300",
  "₹ 300 - ₹ 400",
  "₹ 400 - ₹ 500",
  "₹ 500 - ₹ 600",
  "₹ 600 - ₹ 700",
  "₹ 700 - ₹ 800",
  "₹ 800 - ₹ 900",
  "₹ 900 - ₹ 1K",
  "₹ 1K+"
];
const resetState = () => {
    setIsChange(s); 
  };



  return (
    <div className="relative inline-block text-left">
      {/* Main dropdown button */}
      <div
        onClick={() => {setIsOpen(!isOpen);
            resetState();
        }}
        className=" h-full px-4 flex items-center text-[1.5rem] cursor-pointer select-none"
      >
        <span>{isChange}</span>
        {isOpen ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white filter backdrop-blur-3xl  rounded shadow-lg z-50">
          {priceRanges.map((range, idx) => (
            <div
              key={idx}
              className="m-1 px-2 text-center text-base hover:bg-[#EF233C] hover:text-white cursor-pointer"
              onClick={() => {
                console.log("Selected:", range); // later use this to filter seats
                setIsChange(range);
                setIsOpen(false);
              }}
            >
              {range}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
