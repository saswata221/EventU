// import React from "react";
import { IoIosStar } from "react-icons/io";
import { BiSolidLike } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";

function PText(props){
    return <div>
        <div className="px-3 pt-1 pb-3 text-[1rem]">
                    <div className="flex justify-between ">
                      <div className="flex items-center gap-1">
                        <IoIosStar className="text-[#EF233C]" />
                        {props.rating}/10
                      </div>
                      <div className="flex items-center gap-1">
                        <BiSolidLike className="text-[#EF233C]" />
                        {props.likes} likes
                      </div>
                      <div className="flex items-center gap-1">
                        <FaHeart className="text-white hover:text-[#EF233C]" />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaIndianRupeeSign className="text-[#EF233C]" />
                      {props.price} <span className="text-slate-400 pl-1"> onwards</span>
                    </div>
                    <div className="flex items-center gap-5">
                      Book yours now <FaArrowRightLong className="text-[#EF233C]" />
                    </div>
                  </div>
    </div>
}

export default  PText;