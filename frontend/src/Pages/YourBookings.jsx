import React from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import BookCard from "../Components/JsCompo/BookCard";


function YourBookings(){
    return (<div>
        <Navbar/>
        {/* ............... */}
        <div className="bg-[#09101E] flex">
            <div className="w-1/3 text-white p-10">                
                <p className="text-2xl">Filters</p>
            </div>
            <div className="w-2/3">
                <div className="text-white p-10">
                    <p className="text-2xl">Your Booking History</p>
                </div>
                <div className="px-10 pb-10">
                    <BookCard/>
                    <BookCard/>
                    <BookCard/>
                    <BookCard/>
                    <BookCard/>
                </div>
            </div>
        </div>
        {/* ............. */}
        <Footer/>

    </div>)
}


export default YourBookings;