// OpenAirCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong, FaHeart, FaIndianRupeeSign } from "react-icons/fa6";

function OpenAirCard({ imageURL, text, route, sport }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route);
      return;
    }
    if (sport) {
      // normalize sport param
      const s = String(sport).toLowerCase();
      navigate(`/openair?sport=${encodeURIComponent(s)}`);
      return;
    }
    // default: go to combined view
    navigate("/openair");
  };

  return (
    <div
      className="mx-5 my-4 hover:scale-[101%] cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-[#0b131c] rounded-3xl text-white">
        <img
          src={imageURL}
          alt={text || "open-air-park"}
          className="rounded-t-3xl aspect-square max-w-[230px] max-h-[350px] object-cover object-center"
        />

        <div>
          <div className="px-3 pt-1 pb-3 text-[1rem]">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">{text}</div>
              <div className="flex items-center gap-1">
                <FaHeart className="text-white hover:text-[#EF233C]" />
              </div>
            </div>

            <div className="flex items-center">
              <FaIndianRupeeSign className="text-[#EF233C]" />
              150 <span className="text-slate-400 pl-1"> onwards</span>
            </div>

            <div className="flex items-center gap-5">
              Book yours now <FaArrowRightLong className="text-[#EF233C]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenAirCard;
