import React from "react";
import { IoIosStar } from "react-icons/io";
import { Link } from "react-router-dom";

function Recomend({ movie }) {
  const hours = movie.duration ? Math.floor(movie.duration / 60) : 0;
  const minutes = movie.duration ? movie.duration % 60 : 0;

  return (
    <div className="flex bg-white/10 p-3 items-center  rounded-xl gap-5 w-[350px]">
      <img
        src={movie.poster_url}
        alt={movie.title}
        className="w-fit h-56 rounded-xl object-cover"
      />
      <div>
        <h1 className="font-light text-lg my-2">{movie.title}</h1>
        <p className="my-2">{hours}h {minutes}min</p>

        <div className="flex items-center my-2 gap-2 bg-black/40 w-fit px-3 py-1 rounded-lg">
          <IoIosStar className="text-[#EF233C] scale-110" />
          {parseFloat(movie.rating).toFixed(1)}/10
        </div>

        <Link to={`/movie/${movie.tmdb_id}`}>
          <div className="bg-white my-3 px-2 py-1 text-black w-fit rounded-lg cursor-pointer hover:bg-gray-200">
            More Info
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Recomend;
