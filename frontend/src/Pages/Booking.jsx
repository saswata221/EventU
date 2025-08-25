import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import DateCard from "../Components/JsCompo/DateCard";
import Timings from "../Components/JsCompo/Timings";
import PriceRangeDropdown from "../Components/JsCompo/PDropDown";
import TimeDropdown from "../Components/JsCompo/PTimeDrop";

function Booking(props) {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const [isEvent, setIsEvent] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                try {
                    const eventResponse = await fetch(`http://localhost:5000/api/events/${id}`);
                    const eventResult = await eventResponse.json();
                    
                    if (eventResult.success) {
                        setData(eventResult.data);
                        setIsEvent(true);
                        setLoading(false);
                        return;
                    }
                } catch (eventErr) {
                    console.log("Not an event, trying movie...");
                }
                
                // If event fetch fails, try to fetch as a movie
                try {
                    const movieResponse = await fetch(`http://localhost:5000/booking/${id}`);
                    const movieResult = await movieResponse.json();
                    
                    if (movieResult && movieResult.title) {
                        setData(movieResult);
                        setIsEvent(false);
                        setLoading(false);
                        return;
                    }
                } catch (movieErr) {
                    console.error("Movie fetch also failed:", movieErr);
                }
                
                // If both fail, set error
                setError('No data found for this ID');
                
            } catch (err) {
                setError('Error fetching data');
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const formatDuration = (durationHours) => {
        if (!durationHours) return 'Duration not specified';
        
        if (durationHours >= 1) {
            const hours = Math.floor(durationHours);
            const minutes = Math.round((durationHours - hours) * 60);
            return minutes > 0 ? `${hours}hr ${minutes}min` : `${hours}hr`;
        } else {
            const minutes = Math.round(durationHours * 60);
            return `${minutes}min`;
        }
    };

    const formatLanguages = (languages) => {
        if (!languages || languages.length === 0) return 'Language not specified';
        return languages.join(', ');
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="bg-white py-20 text-center">
                    <p className="text-2xl">Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div>
                <Navbar />
                <div className="bg-white py-20 text-center">
                    <p className="text-2xl text-red-500">{error || 'Data not found'}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            
            {/* Title and Details Section */}
            <div className="bg-white py-4 px-10">
                <h1 className="text-3xl">{data.title}</h1>
                <div className="flex gap-3 pt-3">
                    {isEvent ? (
                        // Event-specific details
                        <>
                            <p className="border-solid border-2 border-[#EF233C]/50 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer text-[#EF233C] font-semibold rounded-xl">
                                {formatDuration(data.duration_hours)}
                            </p>
                            <p className="border-solid border-2 border-black/30 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer hover:border-solid hover:border-[#81a0da] rounded-xl">
                                {data.age_limit ? `${data.age_limit}+` : 'All Ages'}
                            </p>
                            <p className="border-solid border-2 border-black/30 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer hover:border-solid hover:border-[#81a0da] rounded-xl">
                                {data.category || 'Event'}
                            </p>
                            {data.languages && data.languages.map((lang, index) => (
                                <p key={index} className="border-solid border-2 border-black/30 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer hover:border-solid hover:border-[#81a0da] rounded-xl">
                                    {lang}
                                </p>
                            ))}
                        </>
                    ) : (
                        // Movie-specific details (existing code)
                        <>
                            <p className="border-solid border-2 border-[#EF233C]/50 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer text-[#EF233C] font-semibold rounded-xl">
                                {Math.floor(data.duration/60)}hr {data.duration%60}min
                            </p>
                            <p className="border-solid border-2 border-black/30 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer hover:border-solid hover:border-[#81a0da] rounded-xl">
                                {data.is_adult ? '18+' : '13+'}
                            </p>
                            {data.genres && data.genres.map((genre, index) => (
                                <p key={index} className="border-solid border-2 border-black/30 px-2 hover:bg-[#E0EBFF] hover:cursor-pointer hover:border-solid hover:border-[#81a0da] rounded-xl">
                                    {genre}
                                </p>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Date and Filter Section */}
            <div className="bg-[#E0EBFF] w-full h-fit border-t-2 border-black flex justify-between">
                <div className="py-4 px-10 flex gap-4">
                    <DateCard />
                </div>
                <div className="flex">
                    <p className="border-l-[1px] border-black h-full px-4 flex w-50 items-center text-[1.5rem]">
                        <PriceRangeDropdown />
                    </p>
                    <p className="border-l-[1px] border-black h-full px-4 flex w-70 items-center text-[1.5rem]">
                        <TimeDropdown />
                    </p>
                    <p className="border-l-[1px] border-black h-full px-4 flex w-40 items-center text-[1.5rem]">
                        {isEvent ? (
                            formatLanguages(data.languages)
                        ) : (
                            'Hindi-2D'
                        )}
                    </p>
                </div>
            </div>

            {/* Timings and Theaters Section */}
            <div className="bg-[#09101E] w-full h-fit">
                <div className="py-10 px-10 text-white">
                    <Timings />
                    <Timings />
                    <Timings />
                </div>
                <div className="flex items-center justify-center p-4">
                    <div className="w-fit text-center text-white">
                        <h1 className="mb-2">Unable to find what you are looking for?</h1>
                        <div className="flex justify-center">
                            <h1 className="bg-[#EF233C] w-fit py-1 px-6 flex justify-center rounded-sm cursor-pointer hover:bg-[#EF233C]/80">
                                Change Location
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Booking;