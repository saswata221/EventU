import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/logo.png";
import { FaHeadset } from "react-icons/fa6";
import { BsPersonHeart } from "react-icons/bs";
import { HiTicket } from "react-icons/hi2";
import { RiImageCircleAiFill } from "react-icons/ri";
import { PiCityBold } from "react-icons/pi";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FaLinkedin } from "react-icons/fa";
// import { FaYoutube } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";



function Footer(){
    return <div>
        <div className="bg-[#334158] h-fit flex items-center justify-evenly" > 
            <Link to="/care">
            <div className="">
                <div className=" flex items-center justify-center text-white text-5xl my-2 "> <FaHeadset /></div>
                <div className=" flex items-center justify-center text-white mb-3 font-thin"> <p>Customer Care</p></div>
            </div>            
            </Link>
            <Link to="/listshow">
            <div className="">
                <div className=" flex items-center justify-center text-white text-5xl my-2"> <BsPersonHeart /></div>
                <div className=" flex items-center justify-center text-white mb-3 font-thin"> <p>Become A Partner</p></div>
            </div>
            </Link>
            <div className="">
                <div className=" flex items-center justify-center text-white text-5xl my-2"> <HiTicket /></div>
                <div className=" flex items-center justify-center text-white mb-3 font-thin"> <p>Your Booking Info</p></div>
            </div>
            <div className="">
                <div className=" flex items-center justify-center text-white text-5xl my-2"> <RiImageCircleAiFill /></div>
                <div className=" flex items-center justify-center text-white mb-3 font-thin"> <p>Gallary</p></div>
            </div>
            <div className="">
                <div className=" flex items-center justify-center text-white text-5xl my-2"> <PiCityBold /></div>
                <div className=" flex items-center justify-center text-white mb-3 font-thin"> <p>Open Air Cities</p></div>
            </div>
           
        </div>
        <div className="bg-[#1b263b] h-fit  flex items-center justify-evenly">
            <div className="text-white font-thin text-center my-2">
                <h2 className="font-bold underline underline-offset-2">User Bookings</h2>
                <p>My Bookings</p>
                <p>Cancel Bookings</p>
                <p>Reschedule Booking</p>
                <p>Payment History</p>
                <p>Profile</p>
            </div>
            <div className="text-white font-thin text-center my-2">
                <h2 className="font-bold underline underline-offset-2">User Bookings</h2>
                <p>My Bookings</p>
                <p>Cancel Bookings</p>
                <p>Reschedule Booking</p>
                <p>Payment History</p>
                <p>Profile</p>
            </div>
            <div className="text-white font-thin text-center my-2 block">
                <h2 className="font-bold underline underline-offset-2">Subscribe Newsteller</h2>
                <p>Get latest updates, offers & event alerts!</p>
                <div>Email: <input type="text" placeholder="Enter your email & subscribe EventU" className="w-[260px] py-[2px] px-2 rounded-md focus:text-black focus:font-normal focus:outline-none"></input></div>
                <div className=" w-[100%] flex justify-end"><div className="bg-[#EF233C] text-white w-fit px-3 mt-2 rounded-md text-xl "><h3>Subscribe</h3></div></div>
            </div>
            <div className="text-white font-thin text-center my-2">
                <h2 className="font-bold underline underline-offset-2">User Bookings</h2>
                <p>My Bookings</p>
                <p>Cancel Bookings</p>
                <p>Reschedule Booking</p>
                <p>Payment History</p>
                <p>Profile</p>
            </div>
            <div className="text-white font-thin text-center my-2">
                <h2 className="font-bold underline underline-offset-2">User Bookings</h2>
                <p>My Bookings</p>
                <p>Cancel Bookings</p>
                <p>Reschedule Booking</p>
                <p>Payment History</p>
                <p>Profile</p>
            </div>
        </div>
        <div className="text-white font-light bg-[#1b263b] flex justify-center pt-8 pb-4 italic">
            <div className="flex gap-x- opacity-75">
                <p>Terms & Conditions</p> <span> /</span>
                <p> Private Policy</p> <span> /</span>
                <p> Refund & Cancelation Policy</p>
            </div>
        </div>
        <div className="bg-[#1b263b] h-fit flex justify-center items-center pb-3">
            <div className="h-[2px] w-[38%] bg-white mx-6"></div>
            <img  src={logo} alt="Logo " className="w-[100px] h-fit"/>
            <div className="h-[2px] w-[38%] bg-white mx-6"></div>
        </div>
        <div className="bg-[#1b263b]  flex justify-center items-center  pb-2 gap-x-6">
            <div className="bg-white h-7 rounded-full w-5 flex items-center justify-center"><div className="text-[#17A9FD]  text-3xl"><FaFacebook /></div></div>
            <div className="bg-black rounded-full "><div className="text-white scale-75 text-3xl" >< FaXTwitter/></div></div>
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-3xl  text-white"><GrInstagram /></div>
    
            <div className="bg-white h-5 w-5 flex items-center justify-center"><div className="text-[#0A66C2] text-3xl">< FaLinkedin/></div></div>
            <div className="bg-white rounded-full h-5 w-fit flex items-center justify-center"><div className="text-[#e63333]  text-4xl">< IoLogoYoutube/></div></div>

        </div>
        <div className="text-white bg-[#1b263b] italic font-light flex justify-center pb-4">
            <p>© 2025 Your Event Booking Platform. All rights reserved.</p>
        </div>
        
    </div>;
}


export default Footer;