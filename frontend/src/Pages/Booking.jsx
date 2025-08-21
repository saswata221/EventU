//Booking page for all 
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import DateCard from "../Components/JsCompo/DateCard";
import Timings from "../Components/JsCompo/Timings";
import PriceRangeDropdown from "../Components/JsCompo/PDropDown";
import TimeDropdown from "../Components/JsCompo/PTimeDrop";

function Booking(props){

    const { id } = useParams(); 
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/booking/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error("Error fetching movie:", err));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

    return (
    <div>
        <Navbar/>
{/* .... */}

<div className="bg-white py-4 px-10">
    <h1 className="text-3xl
    ">{movie.title}</h1>
    <div className="flex gap-3 pt-3">
        <p className="border-solid border-2 border-[#EF233C]/50 px-2 hover:bg-[#E0EBFF]  hover:cursor-pointer  text-[#EF233C] font-semibold rounded-xl">{Math.floor(movie.duration/60)}hr {movie.duration%60}min</p>
        <p className="border-solid border-2 border-black/30 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer  hover:border-solid hover:border-[#81a0da] rounded-xl">{movie.is_adult?<p>18+</p>:<p>13+</p>}</p>
        {movie.genres.map((p)=>
        <p className="border-solid border-2 border-black/30 px-2 hover:bg-[#E0EBFF]  hover:cursor-pointer  hover:border-solid hover:border-[#81a0da] rounded-xl">{p}</p>
        )}
    </div>
</div>
<div className="bg-[#E0EBFF] w-full h-fit border-t-2 border-black flex justify-between">
    <div className="py-4 px-10 flex  gap-4"> 
        <DateCard/>
        
         
    </div>
    <div className="flex">
        <p className="border-l-[1px] border-black h-full px-4 flex w-50 items-center text-[1.5rem]"><PriceRangeDropdown/></p>
        <p className="border-l-[1px] border-black h-full px-4 flex w-70 items-center text-[1.5rem]"><TimeDropdown/></p>
        <p className="border-l-[1px] border-black h-full px-4 flex w-40 items-center text-[1.5rem]">Hindi-2D</p>
    </div>
</div>
<div className="bg-[#09101E] w-full h-fit">
    <div className="py-10 px-10 text-white">
        <Timings/>
        <Timings/>
        <Timings/>
       
        
    </div>
    <div className="flex items-center justify-center p-4">
        <div className="w-fit text-center  text-white ">
        <h1 className="mb-2">Unable to fond what yor are looking for?</h1>
        <div className="flex justify-center"><h1 className="bg-[#EF233C] w-fit py-1 px-6 flex justify-center rounded-sm">Change Location</h1></div>

    </div>
    </div>
</div>




{/* ,,,,,,,,,,, */}
<Footer/>
    </div>
    )
};
export default Booking;
