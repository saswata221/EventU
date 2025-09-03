import React from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import performance from "../Components/Images/performance.png"
import exhivition from "../Components/Images/exhivition.png";
import sports from "../Components/Images/sports.png"
import conference from "../Components/Images/conference.png"
import castle from "../Components/Images/castle.png"
import disco from "../Components/Images/disco.png"



function ListShow(){
    return <div>
        <Navbar/>
        
{/* ................... */}
<div className="bg-[#11001c] w-full h-fit p-10">
    <div>
        <div className="text-center ">
            <p className="text-white text-5xl font-yatra">What can you host ?</p>
            <p className="text-white pt-3"> As the purveyor of entertainment, BookMyShow enables your event with end to end solutions
                 from the time you </p>
            <p className="text-white">register to the completion of the event. Let's look at what you can host.</p>
        </div>

        <div className="flex justify-center items-center p-10">
            <div className="flex flex-wrap justify-center gap-10 w-4/5">
                <div className="w-72 h-80 p-4 bg-[#BBE4A0] rounded-lg   transition-all duration-300 ease-in-out "> <img src={performance} className="hover:scale-110" alt="performance"/> <p className=" font-yatra text-xl text-center pt-2">Performance</p></div>
                <div className="w-72 h-80 p-4 bg-[#BBE4A0] rounded-lg   transition-all duration-300 ease-in-out "> <img src={castle} className="hover:scale-110" alt="performance"/> <p className=" font-yatra text-xl text-center pt-2">Experience</p></div>
                <div className="w-72 h-80 p-4 bg-[#BBE4A0] rounded-lg   transition-all duration-300 ease-in-out "> <img src={sports} className="hover:scale-110" alt="performance"/> <p className=" font-yatra text-xl text-center pt-2">Sports</p></div>
                <div className="w-72 h-80 p-4 bg-[#BBE4A0] rounded-lg   transition-all duration-300 ease-in-out "> <img src={disco} className="hover:scale-110" alt="performance"/> <p className=" font-yatra text-xl text-center pt-2">Party</p></div>
                <div className="w-72 h-80 p-4 bg-[#BBE4A0] rounded-lg   transition-all duration-300 ease-in-out "> <img src={exhivition} className="hover:scale-110" alt="performance"/> <p className=" font-yatra text-xl text-center pt-2">Exhibition</p></div>
                <div className="w-72 h-80 p-4 bg-[#BBE4A0] rounded-lg   transition-all duration-300 ease-in-out "> <img src={conference} className="hover:scale-110" alt="performance"/> <p className=" font-yatra text-xl text-center pt-2">Conference</p></div>              
            </div>
        </div>
        <div className="flex justify-center">
            <button className="text-white bg-[#EF233C] px-6 py-2 rounded-lg w-fit">List Your Show</button>
        </div>
    </div>
</div>
{/* ............. */}
        <Footer/>
    </div>
}
export default ListShow;