import React  from "react";
import { FaHeart } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import SelectTime from "./Select_time";

function Timings(){
    return <div className="flex mb-4 bg-white/10  rounded-lg p-1 justify-between">
                <div className=" p-5 border-r-2 border-white">
                    <div className="flex gap-2 text-center items-center "><FaHeart className="scale-150  hover:text-[#EF233C]"/><p>INOX : South City Mall,Kolkata</p></div>
                    <div className="text-center text-sm pt-2">Cancellation Available</div>
                </div>
                <div className=" flex flex-wrap py-3 px-8 gap-x-4 justify-start">
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    <SelectTime/>
                    
                </div>
                <div><IoIosInformationCircle className="scale-130"/></div>
            </div>
};

export default Timings;