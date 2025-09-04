// src/Components/JsCompo/DateCard.jsx
import React from "react";

const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Local YYYY-MM-DD (NOT UTC)
function toLocalISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DateCard({ selectedDate, onSelect }) {
  const today = new Date();

  const dayCards = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = toLocalISODate(d); // ✅ LOCAL date
    return {
      iso,
      day: days[d.getDay()],
      date: String(d.getDate()).padStart(2, "0"),
      month: months[d.getMonth()],
      isToday: i === 0,
    };
  });

  return (
    <div className="flex gap-4 flex-wrap">
      {dayCards.map((d) => {
        const active = selectedDate === d.iso;
        return (
          <button
            key={d.iso}
            onClick={() => onSelect?.(d.iso)}
            className={`py-2 px-4 w-fit rounded-xl text-center transition ${
              active
                ? "bg-[#EF233C] text-white"
                : "border border-black hover:bg-[#EF233C] hover:border-transparent hover:text-white"
            }`}
            title={d.iso}
          >
            <p className="text-[0.8rem]">{d.day}</p>
            <h1 className="text-[1.5rem]">{d.date}</h1>
            <p className="text-[0.8rem]">{d.month}</p>
          </button>
        );
      })}
    </div>
  );
}
