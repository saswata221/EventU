import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import Recomend from "../Components/JsCompo/Recomend";
import { IoIosStar, IoIosArrowForward } from "react-icons/io";
import Loader from "../Components/JsCompo/Loader"; // 🔹 Spinner loader

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  return `${day}, ${month}`;
}

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 loading state
  const [error, setError] = useState(null);

  // Fetch current movie
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/movies/${id}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie details");
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  // Fetch recommendations
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/movies/${id}/recommendations`)
        .then((res) => res.json())
        .then((data) => setRecommendations(data))
        .catch((err) => console.error("Error fetching recommendations:", err));
    }
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="bg-[#09101e] min-h-screen flex items-center justify-center">
          <Loader /> {/* 🔹 Spinner loader centered */}
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div>
        <Navbar />
        <div className="bg-[#09101e] min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-xl">{error || "Movie not found"}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* BACKDROP SECTION */}
      <div
        className="relative h-[400px] w-full bg-auto bg-center flex items-center bg-no-repeat"
        style={{
          backgroundImage: `url(${movie.backdrop_url})`,
          backgroundSize: "cover",
          backgroundPosition: "75% center",
        }}
      >
        <div className="absolute top-0 left-0 bottom-0 w-[45%] bg-gradient-to-r from-[#012a4a]/100 to-transparent z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-[35%] bg-gradient-to-l from-[#012a4a]/90 to-transparent z-10" />

        <div className="relative z-20 flex items-center px-[4rem] gap-6">
          <img
            src={movie.poster_url}
            alt="Event Poster"
            className="w-[12.5rem] h-fit object-cover rounded-3xl shadow-rounded-3xl"
          />

          <div className="text-white">
            <h1 className="text-3xl font-bold my-3 font-kufam">
              {movie.title}
            </h1>

            <div className="flex gap-3 w-fit my-3 bg-[#121A28]/80 text-white items-center p-2 rounded-lg">
              <IoIosStar className="scale-110 text-[#EF233C]" />
              <h4>{parseFloat(movie.rating).toFixed(1)}/10</h4>
              <p className="text-sm">({movie.vote_count + "k"} Votes)</p>
              <div className="w-fit bg-white text-black rounded-md px-1">
                <h3>Rate Now</h3>
              </div>
            </div>

            <ul className="flex gap-6 flex-wrap text-sm font-semibold my-3 marker:text-[#EF233C] list-disc list-outside pl-4 bg-[#10002b]/60 p-2 rounded-lg">
              <li className="ml-2">
                {Math.floor(movie.duration / 60)}hr {movie.duration % 60}min
              </li>
              <li>{movie.genres[0]}</li>
              {movie.genres[1] ? <li>{movie.genres[1]}</li> : null}
              {movie.is_adult ? <li>18+</li> : <li>13+</li>}
              <li>{formatDate(movie.release_date)}</li>
            </ul>

            <Link to={`/booking/${movie.tmdb_id}`}>
              <button className="px-4 py-2 my-3 bg-[#EF233C] rounded-3xl text-white">
                Book Tickets
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="w-full h-fit flex bg-white py-5">
        <div className="w-[50%] px-8">
          <h1 className="text-lg font-semibold">About the Movie</h1>
          <p className="text-md font-light">{movie.overview}</p>
        </div>
        <div className="w-[50%] px-8">
          <h1 className="text-lg font-semibold">Cast</h1>
          <div className="flex flex-wrap gap-3">
            {movie.casts?.map((actor, i) => (
              <div
                key={i}
                className="bg-[#EF233C] w-fit text-white px-2 py-1 rounded-md"
              >
                {actor}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="bg-[#09101e] h-fit w-full text-white">
        <div className="flex justify-between">
          <h1 className="p-5 pb-0 text-lg">You may also like</h1>
          <Link to={"/movielist"}>
            <p className="p-5 pb-0 flex items-center gap-1">
              See All <IoIosArrowForward className="text-[#EF233C]" />
            </p>
          </Link>
        </div>
        <div className="flex flex-wrap justify-between p-5">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <Recomend key={rec.tmdb_id} movie={rec} />
            ))
          ) : (
            <p className="text-gray-400">No recommendations available</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Movie;
