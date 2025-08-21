import React from "react";

function DateCard() {
  const today = new Date();

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // Generate array of 7 days starting from today
  const dayCards = Array.from({ length: 7 }, (_, i) => {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + i);
    return {
      day: days[nextDate.getDay()],
      date: String(nextDate.getDate()).padStart(2, "0"),
      month: months[nextDate.getMonth()],
      isToday: i === 0 // Mark today
    };
  });

  return (
    <div className="flex gap-4 flex-wrap">
      {dayCards.map((d, index) => (
        <div
          key={index}
          className={`py-2 px-4 w-fit rounded-xl text-center ${
            d.isToday
              ? "bg-[#EF233C] text-white "
              : "border border-black hover:bg-[#EF233C] hover:border-transparent hover:text-white"
          }`}
        >
          <p className="text-[0.8rem]">{d.day}</p>
          <h1 className="text-[1.5rem]">{d.date}</h1>
          <p className="text-[0.8rem]">{d.month}</p>
        </div>
      ))}
    </div>
  );
}

export default DateCard;
