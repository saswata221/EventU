import React from"react";
// import { IoIosStar } from "react-icons/io";
// import { BiSolidLike } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";


function OpenAirCard(props){ 
    return <div className="mx-5 my-4 hover:scale-[101%]">
        <div className="bg-[#0b131c] rounded-3xl text-white">
          {/* <div className="absolute text-white px-4 py-1 bg-[#EF233C] text-xl   rounded-tl-3xl">23 May</div> */}
          <img src={props.imageURL} alt="open-air-park" className="rounded-t-3xl aspect-square max-w-[230px] max-h-[350px] object-cover object-center "
          />
          <div>
            <div className="px-3 pt-1 pb-3 text-[1rem]">
                              <div className="flex justify-between ">
                                <div className="flex items-center gap-1">
                                  {props.text}
                                </div>
                               
                                <div className="flex items-center gap-1">
                                  <FaHeart className="text-white hover:text-[#EF233C]" />
                                </div>
                              </div>
                              <div className="flex items-center">
                                <FaIndianRupeeSign className="text-[#EF233C]" />
                                150 <span className="text-slate-400 pl-1"> onwards</span>
                              </div>
                              <div className="flex items-center gap-5">
                                Book yours now <FaArrowRightLong className="text-[#EF233C]" />
                              </div>
                            </div>
              </div>
          
        </div>
      </div>
}

export default OpenAirCard;