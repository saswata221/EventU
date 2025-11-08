// All the events except Movies will be listed here....

import React, { useState, useEffect } from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import Card from "../Components/JsCompo/Card";
import Loader from "../Components/JsCompo/Loader"; // 🔹 Spinner loader

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [genreOpen, setGenreOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const [loading, setLoading] = useState(true); // 🔹 loading state

  // 🔹 Fetch movies whenever filters change
  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:5000/movies?";
    if (selectedGenre) url += `genre=${selectedGenre}&`;
    if (selectedRating) url += `rating=${selectedRating}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, [selectedGenre, selectedRating]);

  return (
    <div>
      <Navbar />
      <div className="bg-[#130620] flex h-screen">
        {/* Sidebar Filters */}
        <div className="w-1/4 text-white p-8">
          <p className="text-2xl">Filters</p>

          {/* Genre Filter */}
          <div className="bg-white text-black/80 rounded-md mt-4">
            <div
              className="cursor-pointer flex"
              onClick={() => setGenreOpen((prev) => !prev)}
            >
              <p className="text-xl p-2 pl-4">Genres</p>
            </div>
            {genreOpen && (
              <div className="w-full p-2 rounded-sm">
                <ul className="flex flex-wrap gap-x-3 text-[#EF233C] gap-y-2 text-sm pl-2">
                  {[
                    "Action",
                    "Adventure",
                    "Comedy",
                    "Thriller",
                    "Animation",
                    "Family",
                  ].map((g) => (
                    <li
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`py-[2px] px-2 border border-slate-400 rounded-sm cursor-pointer 
                        ${
                          selectedGenre === g ? "bg-[#EF233C] text-white" : ""
                        }`}
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
                      onClick={() => setSelectedRating(r)}
                      className={`py-[2px] px-2 border border-slate-400 rounded-sm cursor-pointer 
                        ${
                          selectedRating === r ? "bg-[#EF233C] text-white" : ""
                        }`}
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

        {/* Movies Section */}
        <div className="text-white p-8 pr-0 w-3/4 overflow-y-auto h-screen scrollbar-hide">
          <div>
            <p className="text-white text-2xl mb-4">Movie Shows In Kolkata</p>

            {loading ? (
              <div className="flex items-center justify-center h-[70vh]">
                <Loader />
              </div>
            ) : movies.length === 0 ? (
              <p className="text-3xl text-center text-[#EF233C]">
                No movies found.
              </p>
            ) : (
              <div className="flex flex-wrap">
                {movies.map((movie) => (
                  <Card
                    key={movie.id}
                    tmdb_id={movie.tmdb_id}
                    date={movie.release_date}
                    image={movie.poster_url}
                    rating={movie.rating}
                    likes={movie.likes + "k"}
                    price={movie.price}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MovieList;
