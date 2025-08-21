//HOME page of the website

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/JsCompo/Card";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import Carousel from "../Components/JsCompo/Carousal";
import FavCard from "../Components/JsCompo/FavCard";
import fanfav from "../database/FanFav";
import OpenAir from "../database/OpenAir.js";
import OpenAirCard from "../Components/JsCompo/OpenAirCard";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import MoviesDb from "../database/MoviesDb";



function Home (){

    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

    return (
        <div className="bg-[#0d0d11] grid  h-fit w-full">
            <div>
                <Navbar />
            </div>
            <div> 
                <Carousel />
            </div>
            <div className="h-2 bg-slate-400 w-full"></div>
            <div className="flex h-fit justify-between">
            <h3 className="text-white flex items-center mx-8 my-2  text-xl">
              Recommended{" "}
            </h3>
            <button onClick={() => navigate("/movielist")} className="text-white flex items-center mr-20 hover:cursor-pointer">
              See All{" "}
              <div className="text-[#EF233C] flex items-center text-[2rem] font-light hover:cursor-pointer">
                <MdKeyboardDoubleArrowRight  />
              </div>
            </button>
            </div>
            <div className=" flex justify-center w-[100%] mt-2 mb-5">
            <div className="flex flex-wrap gap-4 justify-center bg-[#111e2c] py-3 px-2 rounded-3xl w-fit ">
                {movies.slice(0,5).map((movie) => (
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
            <div>
                <div className="mx-10 my-5 rounded-3xl bg-white/40 h-[100px]" >
                </div>
            </div>
            <div>
            <div className="flex h-fit justify-between mb-5">
                 <h3 className="text-white flex items-center mx-8 my-2  text-xl">
                  Fan Favoutite Catagories
                  </h3>
            </div>
            <div>
                <div className=" flex justify-center w-[100%] mt-2 mb-5">
                    <div className="flex flex-wrap gap-4 justify-center bg-[#f0e0c9] py-3 px-2 rounded-3xl w-fit ">
                      {/* <FavCard/> <FavCard/><FavCard/> <FavCard/> <FavCard/> */}
                      {fanfav.map((fab)=>(
                        <FavCard
                        key={fab.id}
                        imageURL={fab.imageURL}
                        />
                      ))}
                    </div>
                </div>
            </div>
            </div>
            <div className="flex h-fit justify-between mb-5">
            <h3 className="text-white flex items-center mx-8 my-2  text-xl">
             Open Air Fan parks
            </h3>
            <h4 className="text-white flex items-center mr-20 hover:cursor-pointer">
              See All{" "}
              <div className="text-[#EF233C] flex items-center text-[2rem] font-light hover:cursor-pointer">
                <MdKeyboardDoubleArrowRight />
              </div>
            </h4> 
            </div>
             <div>
                <div className=" flex justify-center w-[100%] mt-2 mb-5">
                    <div className="flex flex-wrap gap-4 justify-center bg-[#efebce] py-3 px-2 rounded-3xl w-fit ">
                      {/* <OpenAirCard/> <OpenAirCard/><OpenAirCard/> <OpenAirCard/> <OpenAirCard/> */}
                      {OpenAir.map((air)=>(
                        <OpenAirCard
                         key={air.id}
                        text={air.text}
                        imageURL={air.imageURL}                       
                        />
                      ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="h-2 bg-[#292f39] w-full"></div>
                <Footer />
            </div>
            </div>
    )
};

export default Home; 