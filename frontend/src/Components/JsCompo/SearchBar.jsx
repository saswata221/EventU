import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoIosStar } from "react-icons/io";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.length > 1) {
      fetch(`http://localhost:5000/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Search error:", err));
    } else {
      setResults([]);
    }
  }, [query]);

  // Clear search when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setQuery("");
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchRef}
      className="relative flex flex-col items-start w-full max-w-xl my-auto"
    >
      {/* Input Box */}
      <div className="relative w-full">
        <FiSearch className="absolute left-3 top-2.5 text-gray-700 text-xl" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Movies, Events, Shows & more"
          className="w-[90%] pl-10 pr-4 py-2 rounded-2xl border border-gray-300 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-indigo-600 
                     focus:border-indigo-600 text-gray-900 placeholder-gray-400 
                     transition duration-200"
        />
      </div>

      {/* Suggestions */}
      {results.length > 0 && (
        <div className="absolute top-12 left-0 bg-white shadow-lg rounded-xl w-[90%] max-h-60 overflow-y-auto z-50">
          {results.map((item) => (
            <Link
              key={item.tmdb_id}
              to={
                item.type === "event"
                  ? `/eventinfo/${item.tmdb_id}`
                  : `/movie/${item.tmdb_id}`
              }
              className="flex items-center justify-between gap-3 px-4 py-2 rounded-xl hover:bg-[#E0EBFF] transition"
            >
              {/* Poster Image */}
              <img
                src={
                  item.type === "event"
                    ? item.poster_url || "/fallback-poster.png" // event posters are full URLs
                    : item.poster_url
                    ? `https://image.tmdb.org/t/p/w92${item.poster_url}` // movies need TMDB base
                    : "/fallback-poster.png"
                }
                alt={item.title}
                className="w-10 h-14 object-cover rounded flex-shrink-0"
              />

              {/* Title + Cast/Artists */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-semibold text-[#EF233C] truncate">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {item.casts?.slice(0, 3).join(", ")}
                </p>
              </div>

              {/* Rating */}
              <span className="ml-2 flex items-center justify-start px-2 py-1 rounded-lg text-black whitespace-nowrap gap-[2px]">
                <s className="text-[#EF233C] font-bold">
                  <IoIosStar />
                </s>{" "}
                {item.rating === 0
                  ? "5.0"
                  : parseFloat(item.rating).toFixed(1) || "N/A"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
