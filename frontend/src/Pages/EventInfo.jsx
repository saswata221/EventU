// Detailed infos of the events except Movies will show here..

import React from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import comedyLadder from "../Components/Images/comedyLadder.jpg";
import { MdOutlineShare } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";
import { FaLanguage } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import { MdOutlineTheaterComedy } from "react-icons/md";
import { PiClockUserBold } from "react-icons/pi";

function EventInfo(){
    return <div>
        <Navbar/>
        {/* ......... */}
        <div className="bg-[#DBE8FF] p-10" >
            <div className="flex justify-between items-center">
                <p className="text-3xl font-inria">Comedy Ladder</p> <div className="text-3xl rounded-full p-2 hover:bg-black/20 "><MdOutlineShare/></div>
            </div>
            <div className="flex py-4  gap-52">
                <div className="">
                    <img  src={comedyLadder} alt="comedy" className="rounded-2xl"/>
                </div>
               <div className="text-center">
                 <div className="flex gap-2 items-center  justify-center font-inria">
                    <FaIndianRupeeSign/><p className="text-lg ">250 onwards</p>
                </div>
                <div className="border border-black rounded-xl p-5">
                    <div className="gap-3 p-1 flex items-center"><FaCalendarDays className="text-2xl font-semibold"/>6th - 27th June 2025</div>
                    <div className="gap-3 p-1 flex items-center"><FaLanguage className="text-2xl font-semibold"/>English, Hindi</div>
                    <div className="gap-3 p-1 flex items-center"><GoPeople className="text-2xl font-semibold"/> Age Limit - 16+</div>
                    <div className="gap-3 p-1 flex items-center"><PiClockUserBold className="text-2xl font-semibold"/> 2 hours</div>
                    <div className="gap-3 p-1 flex items-center"><MdOutlineTheaterComedy className="text-2xl font-semibold"/> Comedy</div>
                </div>
                <button className="bg-[#EF233C] text-white p-2 rounded-lg m-5">Proceed To Bookings </button>
               </div>
            </div>
            <div className="flex">
                <div className="w-1/2">
                <p className="text-3xl font-inria">About The Event</p>
                <p className="py-3">
                    Comedy Ladder is the mothership to everything comedy. Started in 2016 and now in its 7th year in the industry, Comedy Ladder has built a name for itself. We do shows all over the country. We have shows in venues such as:
                    - NCPA, Mumbai
                    - Integral Space, Mumbai
                    - Jeff Goldberg Studio, Mumbai
                    - Happy High, Delhi
                    ...and many more.
                    Comedy Ladder is not just a base to start, it also provides a stage for comics to do their one-hour solo shows.
                    We work with the biggest names in the industry such as Aditi Mittal, Jeeya Sethi, Shreeja Chaturvedi, Sumaira Shaikh, Niv Prakasam, Sumukhi Suresh, Prashasti Singh, Kajol Srinivasan, Sonali Thakker, Pavitra Shetty, Gurleen
                    Pannu, Sherya Priyam Roy, Biswa Kalyan Rath, Siddharth Dudeja, Kunal Kamra, Chirag Punjwani, Ashish Dash,
                    Anand Reghu, Shridhar V, Navin Noronha and many more!
                    With over 2000 shows, Comedy Ladder is a household name in the industry.
                </p>
               </div>
               <div>
                <div>
                    <p className="text-3xl font-inria pl-3">Artists</p>
                    <div className="p-3 flex flex-wrap gap-8">
                        <img src={comedyLadder} alt="artist" className="h-40 w-40 mx-6 bg-orange-400 rounded-full"/>
                        <img src={comedyLadder} alt="artist" className="h-40 w-40 mx-6 bg-orange-400 rounded-full"/>
                        <img src={comedyLadder} alt="artist" className="h-40 w-40 mx-6 bg-orange-400 rounded-full"/>
                        
                    </div>
                </div>
               </div>
            </div>
        </div>
        {/* ...... */}
        <Footer/>
    </div>
}


export default EventInfo;