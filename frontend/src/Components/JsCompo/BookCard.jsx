import React from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";


function BookCard(){
    return (
        <div>
            <div className="bg-[#d0fdf8] flex justify-around rounded-md m-6">
                <div className=" p-3 my-2 text-center">
                    <p className="text-xl">Comedy Ladder</p>
                    <p className="font-semibold text-[#EF233C]">Kolkata</p>
                </div>
                <div className=" p-3 my-2 text-center border-black border-l-[1px]">
                    <p className="text-xl">27th June,2025</p>
                    <div className="flex gap-3 font-semibold text-[#EF233C]">
                        <p>7:00 PM</p> | <p>3 Hrs</p>
                    </div>
                </div>
                <div className=" p-3 my-2 text-center border-black border-l-[1px] ">
                    <p className="text-xl">3rd Row </p>
                    <p className=" text-[#EF233C] font-semibold">( 12,13,14 )</p>
                </div>
                <div className=" p-3 my-2 text-center border-black border-l-[1px]">
                    <p className="text-xl flex items-center"><FaIndianRupeeSign/>800</p>
                   <div className="pt-2"> <IoIosInformationCircle className="scale-125 text-[#EF233C]"/></div>
                </div>
            </div>
        </div>
    )
}


export default BookCard;