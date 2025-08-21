// All the events except Movies will be listed here....

import React, { useState} from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import Card from "../Components/JsCompo/Card";
import MoviesDb from "../database/MoviesDb";


function Event(){
    const [genre,setGenre] = useState(false);




    return <div>
        <Navbar/>
        {/* ......... */}
        <div className="bg-[#09101E] flex">
            <div className="w-1/4 text-white p-8">                
                <p className="text-2xl">Filters</p>
                <div className="bg-white text-black/80 rounded-md mt-4">
                    <div className="cursor-pointer flex " onClick={()=>setGenre((prev)=>!prev)}>
                        <p className="text-xl p-2 pl-4 ">Genres</p>
                    </div>
                    { genre &&
                    <div className=" w-full p-2 rounded-sm">
                    <ul className="flex  flex-wrap gap-x-3 text-[#EF233C] gap-y-2 text-sm pl-2">
                        <li className="py-[2px] px-2 border border-slate-400 rounded-sm">Standup Comedy</li>
                        <li className="py-[2px] px-2 border border-slate-400 rounded-sm">Kids</li>
                        <li className="py-[2px] px-2 border border-slate-400 rounded-sm">OpenMic</li>
                        <li className="py-[2px] px-2 border border-slate-400 rounded-sm">Music Show</li>
                        <li className="py-[2px] px-2 border border-slate-400 rounded-sm">Shyari</li>
                        <li className="py-[2px] px-2 border border-slate-400 rounded-sm">Magic Show</li>
                       
                    </ul>
                    </div>
                    }
                </div>
            </div>
            <div className="text-white p-8 pr-0 w-3/4">
                <div>
                    <p className="text-white text-2xl">Shows In Kolkata</p>
                    <div className="flex flex-wrap p-4">
                        {MoviesDb.map((movie) => (
                                      <Card
                                        key={movie.id}
                                        date={movie.date}
                                        image={movie.imageURL}
                                        rating={movie.rating}
                                        likes={movie.likes}
                                        price={movie.price}
                                      />
                                    ))}

                    </div>
                </div>
            </div>
        </div>



{/* .......... */}
        <Footer/>
    </div>
}


export default Event;