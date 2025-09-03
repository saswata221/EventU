// All the events except Movies will be listed here....

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";  
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import Card from "../Components/JsCompo/Card";

function EventList() {
  const location = useLocation();


  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") || "";
  const initialRating = params.get("rating") || "";

  const [events, setEvents] = useState([]);
  const [genreOpen, setGenreOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState(initialCategory);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  // if URL query changes (e.g., navigating from FavCard), sync filters
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSelectedGenre(p.get("category") || "");
    setSelectedRating(p.get("rating") || "");
  }, [location.search]);

  // 🔹 Fetch events whenever filters change
  useEffect(() => {
    let url = "http://localhost:5000/api/events?";
    if (selectedGenre) url += `category=${encodeURIComponent(selectedGenre)}&`;
    if (selectedRating) url += `rating=${encodeURIComponent(selectedRating)}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedGenre, selectedRating]);

  return (
    <div>
      <Navbar />
      {/* ......... */}
      <div className="bg-[#130620] flex h-screen">
        {/* Sidebar Filters */}
        <div className="w-1/4 text-white p-8">
          <p className="text-2xl">Filters</p>

          {/* Category Filter */}
          <div className="bg-white text-black/80 rounded-md mt-4">
            <div
              className="cursor-pointer flex"
              onClick={() => setGenreOpen((prev) => !prev)}
            >
              <p className="text-xl p-2 pl-4">Categories</p>
            </div>
            {genreOpen && (
              <div className="w-full p-2 rounded-sm">
                <ul className="flex flex-wrap gap-x-3 text-[#EF233C] gap-y-2 text-sm pl-2">
                  {["Comedy", "Music", "Magic Shows", "Kids", "Theatre Shows"].map((g) => (
  <li
    key={g}
    onClick={() => setSelectedGenre(g)}
    className={`py-[2px] px-2 border border-slate-400 rounded-sm cursor-pointer 
      ${selectedGenre === g ? "bg-[#EF233C] text-white" : ""}`}
  >
    {g}
  </li>
))}

                </ul>
              </div>
            )}
          </div>

          {/* Rating Filter */}
          <div className="bg-white text-black/80 rounded-md mt-3">
            <div
              className="cursor-pointer flex"
              onClick={() => setRatingOpen((prev) => !prev)}
            >
              <p className="text-xl p-2 pl-4">Ratings</p>
            </div>
            {ratingOpen && (
              <div className="w-full p-2 rounded-sm">
                <ul className="flex flex-wrap gap-x-3 text-[#EF233C] gap-y-2 text-sm pl-2">
                  {[9, 8, 7, 6, 5, 4, 3].map((r) => (
                    <li
                      key={r}
                      onClick={() => setSelectedRating(String(r))}
                      className={`py-[2px] px-2 border border-slate-400 rounded-sm cursor-pointer 
                        ${String(selectedRating) === String(r) ? "bg-[#EF233C] text-white" : ""}`}
                    >
                      {r}+
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {(selectedGenre || selectedRating) && (
            <button
              onClick={() => {
                setSelectedGenre("");
                setSelectedRating("");
              }}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Events Section */}
        <div className="text-white p-8 pr-0 w-3/4 overflow-y-auto h-screen scrollbar-hide">
          <div>
            <p className="text-white text-2xl">Event Shows In Kolkata</p>
            <div className="flex flex-wrap ">
              {events.length === 0 ? (
                <p className="text-gray-400">No events found.</p>
              ) : (
                events.map((event) => (
                  <Card
                    key={event.id}
                    tmdb_id={event.id}
                    date={event.start_date}
                    image={event.poster_url}
                    rating={event.rating || 0}
                    likes={event.likes ? event.likes + "k" : "0k"}
                    price={event.price_from}
                    type="event"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* .......... */}
      <Footer />
    </div>
  );
}

export default EventList;
