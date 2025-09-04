// src/Components/JsCompo/Timings.jsx
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";

// Props:
// - theatreName: string
// - slots: string[] (ISO timestamps)
// - format: (iso)=>string display
// - onProceed: (iso)=>void  // called when Proceed is clicked with selected slot
export default function Timings({ theatreName, slots = [], format, onProceed }) {
  const [selectedIso, setSelectedIso] = useState(null);

  return (
    // inline-flex + w-fit makes the card hug its content instead of full width
    <div className="inline-flex items-stretch mb-4 rounded-lg bg-white/10 p-2 w-fit max-w-full gap-2">
      {/* Left: theatre / hall */}
      <div className="px-4 py-3 border-r border-white/30">
        <div className="flex items-center gap-2">
         
          <p className="font-medium">{theatreName}</p>
        </div>
        <div className="text-xs pt-1 text-white/80">Cancellation Available</div>
      </div>

      {/* Middle: time slots */}
      <div className="flex flex-wrap items-center gap-2 py-2 px-3">
        {slots && slots.length > 0 ? (
          slots.map((iso, idx) => {
            const active = selectedIso === iso;
            return (
              <button
                key={`${iso}-${idx}`}
                onClick={() => setSelectedIso(iso)}
                className={`min-w-[84px] rounded border px-3 py-1.5 text-sm transition
                  ${active
                    ? "bg-white text-black border-white"
                    : "bg-white/10 text-white border-white/40 hover:bg-white/20"
                  }`}
                title={new Date(iso).toLocaleString()}
              >
                {format ? format(iso) : iso}
              </button>
            );
          })
        ) : (
          <span className="text-sm text-white/70">No timings</span>
        )}
      </div>

      {/* Right: info + Proceed button */}
      <div className="flex items-center gap-2 pr-2 pl-1">
        <IoIosInformationCircle className="opacity-80" />
        <button
          disabled={!selectedIso}
          onClick={() => selectedIso && onProceed?.(selectedIso)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition
            ${selectedIso
              ? "bg-[#EF233C] text-white hover:bg-[#d61f34]"
              : "bg-white/10 text-white/50 cursor-not-allowed"}`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
