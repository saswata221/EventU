import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function TimeDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const t="Preferred Time";
  const [selectedTime, setSelectedTime] = useState(t);
  const dropdownRef = useRef(null);
  const resetState = () => {
    setSelectedTime(t); 
  };


  const timeSlots = [
    { label: "Morning", range: "12:00 AM - 11:59 AM", icon: "🌅" },
    { label: "Afternoon", range: "12:00 PM - 3:59 PM", icon: "🌞" },
    { label: "Evening", range: "4:00 PM - 6:59 PM", icon: "🌇" },
    { label: "Night", range: "7:00 PM - 11:59 PM", icon: "🌙" }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button */}
      <div
        onClick={() => {setIsOpen(!isOpen);
            resetState();
        }}
        className="flex items-center px-4 py-2  cursor-pointer  "
      >
        <span>{selectedTime}</span>
        {isOpen ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-fit bg-white border rounded-md shadow-lg z-50">
          {timeSlots.map((slot, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedTime(slot.label);
                setIsOpen(false);
              }}
              className=" group flex items-center px-3 py-2 m-1 hover:bg-red-500 hover:text-white cursor-pointer"
            >
              <span className="mr-2">{slot.icon}</span>
              <div>
                <div className=" text-base">{slot.label}</div>
                <div className="text-sm text-gray-500 group-hover:text-white">
                  {slot.range}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
