import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OpenAirModal from "./OpenAirModal";

/* ---------- Helpers ---------- */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = String(date.getFullYear()).slice(2);
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
      return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
    }
  }

  const hhmm = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (hhmm) {
    let h = parseInt(hhmm[1], 10);
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h}:${hhmm[2]} ${ampm}`;
  }
  return timeStr;
}

/* ---------- Team Avatar ---------- */
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
        className={`${sizeClass} object-contain  flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center bg-slate-700 text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

/* ---------- OpenCard ---------- */
function OpenCard({ event }) {
  const [showModal, setShowModal] = useState(false);

  const team1 = event.team1 || "Team-Unknown";
  const team2 = event.team2 || "Team-Unknown";
  const team1Logo = event.team1Logo || "";
  const team2Logo = event.team2Logo || "";
  const timePretty = formatTime12(event.time || "");

  return (
    <>
      <div className="w-full bg-[#220135] rounded-2xl p-4 border border-purple-600 hover:shadow-lg hover:scale-[103%] transition-all flex flex-col gap-3">
        {/* Time */}
        {event.time && (
          <p className="text-sm text-white/70 px-2">
            Starts from:{" "}
            <span className="text-white font-medium">{timePretty}</span>
          </p>
        )}

        {/* Teams */}
        <div className="flex items-center justify-between px-2 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <TeamAvatar logo={team1Logo} name={team1} />
            <p className="text-lg font-semibold text-white truncate">{team1}</p>
          </div>

          <p className="text-[#EF233C] font-bold text-xl">VS</p>

          <div className="flex items-center gap-3 min-w-0">
            <p className="text-lg font-semibold text-white truncate text-right">
              {team2}
            </p>
            <TeamAvatar logo={team2Logo} name={team2} />
          </div>
        </div>

        {/* Match Info */}
        <div className="flex flex-col md:flex-row justify-between text-sm text-white/70 px-2 gap-3">
          <div className="flex items-center gap-4 truncate">
            <span className="font-medium text-white truncate">
              {event.tournament || "—"}
            </span>
            <span className="truncate">{event.stadium || "—"}</span>
            <span className="hidden md:inline">{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="md:hidden">{formatDate(event.date)}</span>
            {event.price && (
              <span className="text-[#EF233C] font-semibold">
                ₹{event.price}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        {event.location && (
          <div className="flex items-center justify-between text-sm text-white/70 px-2 pt-2 border-t border-slate-700">
            <p className="truncate">
              Open Air Park at{" "}
              <span className="text-white font-medium">{event.location}</span>
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#EF233C] hover:bg-[#d91e33] text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors"
            >
              Book Tickets
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <OpenAirModal event={event} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default OpenCard;
