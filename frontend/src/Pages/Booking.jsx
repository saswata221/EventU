// src/Pages/Booking.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import DateCard from "../Components/JsCompo/DateCard";
import Timings from "../Components/JsCompo/Timings";
import PriceRangeDropdown from "../Components/JsCompo/PDropDown";
import TimeDropdown from "../Components/JsCompo/PTimeDrop";
import { useAuth } from "../context/AuthContext";
import Loader from "../Components/JsCompo/Loader"; // 🔹 Spinner loader

// --- helpers ---
function asHrMin(totalMinutes) {
  if (totalMinutes == null) return "—";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}hr ${m}min`;
}
function fmt(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}
// Local YYYY-MM-DD (avoid UTC shift)
function toLocalISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Booking() {
  const { id } = useParams(); // tmdb_id for movie or numeric id for event
  const navigate = useNavigate();
  const { requireLogin } = useAuth();

  const [data, setData] = useState(null);
  const [isEvent, setIsEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const todayISO = useMemo(() => toLocalISODate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(todayISO);

  // Filters (price reserved for later, time is applied on server)
  const [timeFilter, setTimeFilter] = useState(null); // morning|afternoon|evening|night|null
  const [priceFilter, setPriceFilter] = useState(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Try EVENT first
      const eventRes = await fetch(`http://localhost:5000/api/events/${id}`);
      const eventJson = await eventRes.json().catch(() => ({}));

      if (eventJson?.success) {
        setIsEvent(true);
        const url = new URL(`http://localhost:5000/booking/${id}`);
        url.searchParams.set("date", selectedDate);
        if (timeFilter) url.searchParams.set("timeRange", timeFilter);

        const hallRes = await fetch(url.toString());
        const hallJson = await hallRes.json();

        if (hallJson?.type === "event") {
          // Merge the event doc with hall timings payload
          setData({ ...eventJson.data, ...hallJson });
        } else {
          setData(eventJson.data);
        }
        setLoading(false);
        return;
      }

      // Else treat as MOVIE
      setIsEvent(false);
      const url = new URL(`http://localhost:5000/booking/${id}`);
      url.searchParams.set("date", selectedDate);
      if (timeFilter) url.searchParams.set("timeRange", timeFilter);

      const movieRes = await fetch(url.toString());
      const movieJson = await movieRes.json();

      if (movieJson?.title) {
        // Ensure poster_url and duration exist by also fetching /movies/:id
        try {
          const detailsRes = await fetch(
            `http://localhost:5000/movies/${movieJson.tmdb_id || id}`
          );
          const details = await detailsRes.json();
          movieJson.poster_url =
            movieJson.poster_url || details?.poster_url || "";
          movieJson.duration = movieJson.duration ?? details?.duration ?? null;
          movieJson.title = movieJson.title || details?.title || "";
        } catch {
          // Safe to ignore; continue without extra fields
        }

        setData(movieJson);
      } else {
        setError("No data found for this ID");
      }
    } catch (e) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedDate, timeFilter]);

  // Navigate when user clicks Proceed in a Timings card
  function onProceed(placeId, placeName, isoTime, allIsoTimesForThisPlace) {
    const timesDisplay = (allIsoTimesForThisPlace || []).map(fmt);
    const selectedDisplay = fmt(isoTime);

    if (isEvent) {
      navigate("/event-booking", {
        state: {
          type: "event",
          eventId: data?.id || id,
          title: data?.title || "",
          placeId,
          placeName,
          showTime: selectedDisplay, // human display e.g. "07:30 PM"
          showTimeISO: isoTime, // raw ISO if needed later
          date: selectedDate,
          times: timesDisplay, // all times for this hall (display format)
        },
      });
    } else {
      requireLogin(() =>
        navigate("/seats", {
          state: {
            type: "movie",
            movieId: data?.id || null,
            tmdb_id: data?.tmdb_id || id,
            title: data?.title || "",
            poster: data?.poster_url || "", // ensure poster is passed
            duration: data?.duration || null, // ensure duration is passed
            placeId,
            placeName,
            showTime: selectedDisplay,
            showTimeISO: isoTime,
            date: selectedDate,
            times: timesDisplay,
          },
        })
      );
    }
  }

  return (
    <div>
      <Navbar />

      {/* Title and Details Section */}
      <div className="bg-white py-4 px-10">
        {loading ? (
          <div className="flex items-center justify-center h-[30vh]">
            <Loader /> {/* 🔹 spinner loader */}
          </div>
        ) : error || !data ? (
          <h1 className="text-2xl text-red-500">{error || "Data not found"}</h1>
        ) : (
          <>
            <h1 className="text-3xl">{data.title}</h1>
            <div className="flex gap-3 pt-3">
              {isEvent ? (
                <>
                  <p className="border-solid border-2 border-[#EF233C]/50 px-2 text-[#EF233C] font-semibold rounded-xl">
                    {data.duration_hours
                      ? `${Math.floor(data.duration_hours)}hr ${Math.round(
                          (data.duration_hours -
                            Math.floor(data.duration_hours)) *
                            60
                        )}min`
                      : "Duration not specified"}
                  </p>
                  <p className="border-solid border-2 border-black/30 px-2 rounded-xl">
                    {data.age_limit ? `${data.age_limit}+` : "All Ages"}
                  </p>
                  <p className="border-solid border-2 border-black/30 px-2 rounded-xl">
                    {data.category || "Event"}
                  </p>
                  {Array.isArray(data.languages) &&
                    data.languages.map((lang, i) => (
                      <p
                        key={i}
                        className="border-solid border-2 border-black/30 px-2 rounded-xl"
                      >
                        {lang}
                      </p>
                    ))}
                </>
              ) : (
                <>
                  <p className="border-solid border-2 border-[#EF233C]/50 px-2 text-[#EF233C] font-semibold rounded-xl">
                    {asHrMin(data.duration)}
                  </p>
                  <p className="border-solid border-2 border-black/30 px-2 rounded-xl">
                    {data.is_adult ? "18+" : "13+"}
                  </p>
                  {Array.isArray(data.genres) &&
                    data.genres.map((g, i) => (
                      <p
                        key={i}
                        className="border-solid border-2 border-black/30 px-2 rounded-xl"
                      >
                        {g}
                      </p>
                    ))}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Date and Filter Section */}
      {!loading && !error && data && (
        <div className="bg-[#E0EBFF] w-full h-fit border-t-2 border-black flex justify-between">
          <div className="py-4 px-10 flex gap-4">
            <DateCard selectedDate={selectedDate} onSelect={setSelectedDate} />
          </div>
          <div className="flex">
            <p className="border-l-[1px] border-black h-full px-4 flex items-center text-[1.5rem]">
              <PriceRangeDropdown onChange={setPriceFilter} />
            </p>
            <p className="border-l-[1px] border-black h-full px-4 flex items-center text-[1.5rem]">
              <TimeDropdown onChange={setTimeFilter} />
            </p>
            <p className="border-l-[1px] border-black h-full px-4 flex items-center text-[1.5rem]">
              {isEvent
                ? Array.isArray(data?.languages)
                  ? data.languages.join(", ")
                  : "Language not specified"
                : "Hindi-2D"}
            </p>
          </div>
        </div>
      )}

      {/* Timings and Theatres Section */}
      <div className="bg-[#09101E] w-full h-fit">
        <div className="py-10 px-10 text-white space-y-3 flex flex-col items-center">
          {loading ? (
            <div className="flex items-center justify-center h-[40vh]">
              <Loader /> {/* 🔹 centered loader while fetching timings */}
            </div>
          ) : !error && data ? (
            <>
              {/* Movies → multiple theatres */}
              {!isEvent &&
                Array.isArray(data.theatres) &&
                data.theatres.length > 0 &&
                data.theatres.map((th) => (
                  <Timings
                    key={th.id}
                    theatreName={th.name}
                    slots={Array.isArray(th.showtimes) ? th.showtimes : []}
                    format={fmt}
                    onProceed={(iso) =>
                      onProceed(th.id, th.name, iso, th.showtimes)
                    }
                  />
                ))}

              {/* Events → single hall */}
              {isEvent && data.hall && (
                <Timings
                  key={data.hall.id}
                  theatreName={data.hall.name}
                  slots={
                    Array.isArray(data.hall?.showtimes)
                      ? data.hall.showtimes
                      : []
                  }
                  format={fmt}
                  onProceed={(iso) =>
                    onProceed(
                      data.hall.id,
                      data.hall.name,
                      iso,
                      data.hall.showtimes
                    )
                  }
                />
              )}

              {/* Empty state */}
              {(isEvent && (!data.hall || !data.hall.showtimes?.length)) ||
              (!isEvent &&
                (!data.theatres ||
                  !data.theatres.some((t) => t.showtimes?.length))) ? (
                <p className="text-slate-300">
                  No timings for the selected filters/date.
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-red-400">{error}</p>
          )}
        </div>

        {/* Bottom helper */}
        <div className="flex items-center justify-center p-4">
          <div className="w-fit text-center text-white">
            <h1 className="mb-2">Unable to find what you are looking for?</h1>
            <div className="flex justify-center">
              <Link to={"/care"}>
                <h1 className="bg-[#EF233C] w-fit py-1 px-6 flex justify-center rounded-sm cursor-pointer hover:bg-[#EF233C]/80">
                  Send Us a message
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
