import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import Carousel from "../Components/JsCompo/Carousal";
import Card from "../Components/JsCompo/Card";
import FavCard from "../Components/JsCompo/FavCard";
import OpenAirCard from "../Components/JsCompo/OpenAirCard";

import fanfav from "../database/FanFav";
import OpenAir from "../database/OpenAir.js";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import Modal from "../Components/JsCompo/Modal.jsx";
import LogIn from "./LogIn";

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then(setMovies)
      .catch(console.error);
  }, []);

  const bgClasses = isLoginOpen
    ? "blur-[2px] scale-[.998] pointer-events-none select-none"
    : "";

  return (
    <div className="relative min-h-screen w-full bg-[#0d0d11]">
      {/* Background stays visible & dynamic */}
      <div
        className={`transition-all duration-150 ${bgClasses}`}
        inert={isLoginOpen ? "" : undefined}
      >
        <Navbar onLoginClick={() => setIsLoginOpen(true)} />

        {/* Hero / carousel */}
        <Carousel />

        {/* Divider */}
        <div className="h-2 w-full bg-slate-400" />

        {/* Recommended */}
        <section className="flex h-fit justify-between">
          <h3 className="mx-8 my-2 text-xl text-white">Recommended</h3>
          <button
            onClick={() => navigate("/movielist")}
            className="mr-20 flex items-center gap-1 text-white"
          >
            See All
            <span className="flex items-center text-[2rem] font-light text-[#EF233C]">
              <MdKeyboardDoubleArrowRight />
            </span>
          </button>
        </section>

        <div className="mt-2 mb-5 flex w-full justify-center">
          <div className="w-fit rounded-3xl bg-[#111e2c] px-2 py-3">
            <div className="flex flex-wrap justify-center gap-4">
              {movies.slice(0, 5).map((movie) => (
                <Card
                  key={movie.id}
                  tmdb_id={movie.tmdb_id}
                  date={movie.release_date}
                  image={movie.poster_url}
                  rating={movie.rating}
                  likes={movie.likes}
                  price={movie.price}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Fan favourites */}
        <section>
          <div className="mb-2 flex h-fit justify-between">
            <h3 className="mx-8 my-2 text-xl text-white">
              Fan Favourite Categories
            </h3>
          </div>

          <div className="mt-2 mb-5 flex w-full justify-center">
            <div className="w-fit rounded-3xl bg-[#f0e0c9] px-2 py-3">
              <div className="flex flex-wrap justify-center gap-4">
                {fanfav.map((item) => (
                  <FavCard
                    key={item.id}
                    imageURL={item.imageURL}
                    category={item.category}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Open Air Fan parks */}
        <section>
          <div className="mb-5 flex h-fit justify-between">
            <h3 className="mx-8 my-2 text-xl text-white">Open Air Fan Parks</h3>
            <button className="mr-20 flex items-center gap-1 text-white">
              See All
              <span className="flex items-center text-[2rem] font-light text-[#EF233C]">
                <MdKeyboardDoubleArrowRight />
              </span>
            </button>
          </div>

          <div className="mt-2 mb-5 flex w-full justify-center">
            <div className="w-fit rounded-3xl bg-[#efebce] px-2 py-3">
              <div className="flex flex-wrap justify-center gap-4">
                {OpenAir.map((o) => (
                  <OpenAirCard
                    key={o.id}
                    text={o.text}
                    imageURL={o.imageURL}
                    route={o.route}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="h-2 w-full bg-[#292f39]" />
        <Footer />
      </div>

      {/* Login Modal on top */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LogIn onClose={() => setIsLoginOpen(false)} />
      </Modal>
    </div>
  );
}
