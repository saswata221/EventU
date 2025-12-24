import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // Dec
  const year = String(date.getFullYear()).slice(2); // 25
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

function formatTime12(timeStr) {
  if (!timeStr) return "";
  if (timeStr.includes("T") || timeStr.includes("Z") || timeStr.includes("+")) {
    const d = new Date(timeStr);
    if (!isNaN(d)) {
      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      const mins = String(minutes).padStart(2, "0");
      return `${hours}:${mins} ${ampm}`;
    }
  }

  const hhmm = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (hhmm) {
    let h = parseInt(hhmm[1], 10);
    const m = hhmm[2];
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  return timeStr;
}

function TeamAvatar({ logo, name, size = 48 }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "TBD").slice(0, 3).toUpperCase();

  const sizeClass =
    size <= 32
      ? "w-8 h-8 text-sm"
      : size <= 48
      ? "w-12 h-12 text-base"
      : "w-16 h-16 text-lg";

  if (logo && !imgError) {
    return (
      <img
        src={logo}
        alt={name || initials}
        onError={() => setImgError(true)}
        className={`${sizeClass} object-contain rounded-full bg-transparent flex-shrink-0`}
        style={{ display: "block" }}
        title={name}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center bg-slate-700 text-white font-semibold flex-shrink-0`}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

function OpenCard({ event }) {
  const navigate = useNavigate();

  const team1 = event.team1 || "Team-Unknown";
  const team2 = event.team2 || "Team-Unknown";
  const team1Logo = event.team1Logo || "";
  const team2Logo = event.team2Logo || "";
  const timePretty = formatTime12(event.time || "");

  const handleBook = () => {
    navigate("/payment", { state: { event } });
  };

  return (
    <div className="w-full bg-[#220135] backdrop-blur-sm rounded-2xl p-4 border border-purple-600 hover:shadow-lg hover:scale-[103%] transition-shadow flex flex-col gap-3">
      {event.time && (
        <p className="text-sm text-white/70 px-2">
          Starts from:{" "}
          <span className="text-white font-medium">{timePretty}</span>
        </p>
      )}

      {/* Teams row */}
      <div className="flex items-center justify-between px-2 gap-3">
        {/* Left team */}
        <div className="flex items-center gap-3 min-w-0">
          <TeamAvatar logo={team1Logo} name={team1} size={48} />
          <div className="min-w-0">
            <p
              className="text-lg font-semibold text-white truncate max-w-[220px]"
              title={team1}
            >
              {team1}
            </p>
          </div>
        </div>

        {/* VS */}
        <div className="flex-shrink-0 px-2">
          <p className="text-[#EF233C] font-bold text-xl">VS</p>
        </div>

        {/* Right team */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0 text-right">
            <p
              className="text-lg font-semibold text-white truncate max-w-[220px]"
              title={team2}
            >
              {team2}
            </p>
          </div>
          <TeamAvatar logo={team2Logo} name={team2} size={48} />
        </div>
      </div>

      {/* Match details */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-sm text-white/70 px-2 gap-3">
        {/* Left details */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <span
            className="font-medium text-white whitespace-nowrap truncate max-w-[120px] md:max-w-[200px]"
            title={event.tournament}
          >
            {event.tournament || "—"}
          </span>

          <span
            className="truncate max-w-[140px] md:max-w-[240px] overflow-ellipsis"
            title={event.stadium}
          >
            {event.stadium || "—"}
          </span>
          <span className="whitespace-nowrap hidden md:inline">
            {formatDate(event.date)}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="whitespace-nowrap md:hidden">
            {formatDate(event.date)}
          </span>

          {event.price && (
            <span className="text-[#EF233C] font-semibold whitespace-nowrap">
              ₹{event.price}
            </span>
          )}
        </div>
      </div>

      {event.location && (
        <div className="flex items-center justify-between text-sm text-white/70 px-2 pt-1 border-t border-slate-700 mt-2">
          <p className="truncate max-w-[70%]">
            Open Air Park at:{" "}
            <span className="text-white font-medium">{event.location}</span>
          </p>

          <button
            onClick={handleBook}
            className="bg-[#EF233C] hover:bg-[#d91e33] text-white text-sm font-semibold px-3 py-1 rounded-md shadow-md transition-colors"
          >
            Book Tickets
          </button>
        </div>
      )}
    </div>
  );
}

export default OpenCard;
