import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function EventInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/events/${id}`);
                const data = await response.json();
                
                if (data.success) setEvent(data.data);
                else setError(data.message || 'Failed to fetch event');
            } catch (err) {
                setError('Error fetching event data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEvent();
    }, [id]);

    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startFormatted = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const endFormatted = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        return `${startFormatted} - ${endFormatted}`;
    };

    const formatLanguages = (languages) => !languages || languages.length === 0 ? 'Not specified' : languages.join(', ');

    const formatDuration = (hours) => {
        if (!hours) return 'Not specified';
        if (hours === 1) return '1 hour';
        if (hours < 1) return `${Math.round(hours * 60)} minutes`;
        if (hours % 1 === 0) return `${hours} hours`;
        return `${hours} hours`;
    };

    const handleProceedToBookings = () => {
        navigate(`/bookings/${id}`);
    };

    if (loading) return (
        <div>
            <Navbar />
            <div className="bg-gray-900 p-10 min-h-screen flex items-center justify-center">
                <p className="text-2xl font-inria text-white animate-pulse">Loading event details...</p>
            </div>
            <Footer />
        </div>
    );

    if (error || !event) return (
        <div>
            <Navbar />
            <div className="bg-gray-900 p-10 min-h-screen flex items-center justify-center">
                <p className="text-2xl font-inria text-red-500">{error || 'Event not found'}</p>
            </div>
            <Footer />
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="bg-[#1A1A2E] p-10 text-white">
                <div className="flex justify-between items-center">
                    <p className="text-3xl font-inria text-[#E8D8E0]">{event.title}</p> 
                    <div className="text-3xl rounded-full p-2 hover:bg-pink-600/20 text-white cursor-pointer">
                        <MdOutlineShare />
                    </div>
                </div>

                <div className="flex py-4 gap-52">
                    <div>
                        <img 
                            src={event.image_url || comedyLadder} 
                            alt={event.title} 
                            className="rounded-2xl w-[720px] h-[360px] object-cover "
                            onError={(e) => { e.target.src = comedyLadder; }}
                        />
                    </div>

                    <div className="text-center">
                        <div className="flex gap-2 items-center justify-center font-inria text-[#E8D8E0]">
                            <FaIndianRupeeSign />
                            <p className="text-lg">{event.price_from} onwards</p>
                        </div>

                        <div className="border border-gray-700 rounded-xl p-5 bg-slate-800">
                            <div className="gap-3 p-1 flex items-center text-cyan-300">
                                <FaCalendarDays className="text-2xl font-semibold" />
                                {formatDateRange(event.start_date, event.end_date)}
                            </div>
                            <div className="gap-3 p-1 flex items-center text-green-300">
                                <FaLanguage className="text-2xl font-semibold" />
                                {formatLanguages(event.languages)}
                            </div>
                            <div className="gap-3 p-1 flex items-center text-orange-300">
                                <GoPeople className="text-2xl font-semibold" /> 
                                Age Limit - {event.age_limit ? `${event.age_limit}+` : 'Not specified'}
                            </div>
                            <div className="gap-3 p-1 flex items-center text-purple-300">
                                <PiClockUserBold className="text-2xl font-semibold" /> 
                                {formatDuration(event.duration_hours)}
                            </div>
                            <div className="gap-3 p-1 flex items-center text-pink-300">
                                <MdOutlineTheaterComedy className="text-2xl font-semibold" /> 
                                {event.category}
                            </div>
                        </div>

                        <button 
                            onClick={handleProceedToBookings}
                            className="bg-[#EF233C]/90 hover:bg-[#EF233C]/70 text-white p-2 rounded-lg m-5 cursor-pointer transition-colors duration-200"
                        >
                            Proceed To Bookings
                        </button>
                    </div>
                </div>

                <div className="flex">
                    <div className="w-1/2 pr-5">
                        <p className="text-3xl font-inria text-[#E8D8E0]">About The Event</p>
                        <p className="py-3 text-gray-200">{event.description || 'No description available for this event.'}</p>
                        {event.venue && (
                            <div className="py-2">
                                <p className="text-lg font-semibold text-cyan-300">Venue: {event.venue}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-3xl font-inria pl-10 text-[#E8D8E0]">Artists</p>
                        <div className="p-3 flex flex-wrap ">
                            {event.artist_names && event.artist_names.length > 0 ? (
                                event.artist_names.map((artistName, index) => (
                                    <div key={index} className="text-center">
                                        <img 
                                            src={event.artist_images && event.artist_images[index] ? 
                                                event.artist_images[index] : comedyLadder} 
                                            alt={artistName} 
                                            className="h-32 w-32 mx-6  rounded-full object-cover shadow-lg "
                                            onError={(e) => { e.target.src = comedyLadder; }}
                                        />
                                        <p className="mt-2 font-inria text-lg text-purple-300">{artistName}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center w-full">
                                    <p className="text-gray-400">No artists information available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EventInfo;