import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";
import Loader from "../Components/JsCompo/Loader";
import OpenCard from "../Components/JsCompo/OpenCard";

function formatTimeFromIso(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    const opts = { hour: "numeric", minute: "2-digit" };
    return d.toLocaleTimeString(undefined, opts);
  } catch {
    return "";
  }
}

function toDateOnly(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return "";
  }
}

function OpenAir() {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [teamOpen, setTeamOpen] = useState(false);
  const [tournamentOpen, setTournamentOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [loading, setLoading] = useState(true);

  const BACKEND_BASE = "http://localhost:5000";

  const params = new URLSearchParams(location.search);
  const sportQuery = (
    params.get("sport") ||
    params.get("sports") ||
    "all"
  ).toLowerCase();

  useEffect(() => {
    let cancelled = false;
    async function fetchEvents() {
      setLoading(true);
      try {
        const sportParam =
          sportQuery && sportQuery !== "all"
            ? `&sport=${encodeURIComponent(sportQuery)}`
            : "";
        const url = `${BACKEND_BASE}/api/openair?limit=200${sportParam}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const rows = Array.isArray(data) ? data : data.events || [];

        const resolveLogo = (fullUrl, id) => {
          if (fullUrl && String(fullUrl).startsWith("http")) return fullUrl;
          if (id)
            return `/api/teamlogo/cricbuzz/${encodeURIComponent(String(id))}`;
          return "";
        };

        const mapped = rows.map((r) => {
          const stadium = r.venue || r.openpark_name || "";
          const locationStr = r.openpark_name || r.venue || "";
          const dateOnly = toDateOnly(r.kickoff_utc);
          const timePretty = formatTimeFromIso(r.kickoff_utc);

          const team1Name =
            r.home_name ||
            (r.home_team_id ? `Team-${r.home_team_id}` : "Team-Unknown");
          const team2Name =
            r.away_name ||
            (r.away_team_id ? `Team-${r.away_team_id}` : "Team-Unknown");

          const team1Full =
            r.home_logo ||
            r.home_logo_url ||
            r.logo_url ||
            r.home_team_logo ||
            null;
          const team2Full =
            r.away_logo || r.away_logo_url || r.away_team_logo || null;

          const team1Id =
            r.home_logo_id || r.home_image_id || r.home_logo_id || null;
          const team2Id =
            r.away_logo_id || r.away_image_id || r.away_logo_id || null;

          return {
            id: r.id,
            external_id: r.external_id,
            team1: team1Name,
            team2: team2Name,
            tournament:
              r.competition_name || r.competition_external_id || "Unknown",
            stadium,
            date: dateOnly,
            time: timePretty,
            location: locationStr,
            price:
              typeof r.price === "number"
                ? r.price
                : r.price
                ? Number(r.price)
                : null,
            team1Logo: resolveLogo(team1Full, team1Id),
            team2Logo: resolveLogo(team2Full, team2Id),
            _raw: r,
            sport: r.sport || sportQuery || "all",
          };
        });

        if (!cancelled) setEvents(mapped);
      } catch (err) {
        console.error("Failed to load events:", err);
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, [sportQuery]);

  const teamOptions = Array.from(
    new Set(events.flatMap((e) => [e.team1, e.team2].filter(Boolean)))
  );
  const tournamentOptions = Array.from(
    new Set(events.map((e) => e.tournament).filter(Boolean))
  );

  const filteredEvents = events.filter((e) => {
    const teamMatch = selectedTeam
      ? e.team1 === selectedTeam || e.team2 === selectedTeam
      : true;
    const tourMatch = selectedTournament
      ? e.tournament === selectedTournament
      : true;
    return teamMatch && tourMatch;
  });

  return (
    <div className="min-h-screen bg-[#130620] text-white">
      <Navbar />

      <div className="bg-[#130620] flex">
        {/* Sidebar Filters */}
        <div className="w-1/4 text-white p-8">
          <p className="text-2xl">Filters</p>

          {/* Team Filter */}
          <div className="bg-white text-black/80 rounded-md mt-4">
            <div
              className="cursor-pointer flex items-center justify-between"
              onClick={() => setTeamOpen((prev) => !prev)}
            >
              <p className="text-xl p-2 pl-4">Team</p>
              <div className="p-2">{teamOpen ? "▲" : "▼"}</div>
            </div>
            {teamOpen && (
              <div className="w-full p-2 rounded-sm">
                <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm pl-2">
                  {teamOptions.map((t) => (
                    <li
                      key={t}
                      onClick={() =>
                        setSelectedTeam((prev) => (prev === t ? "" : t))
                      }
                      className={`py-[4px] px-3 border border-slate-400 rounded-sm cursor-pointer select-none ${
                        selectedTeam === t
                          ? "bg-[#EF233C] text-white"
                          : "bg-white/80 text-black/80"
                      }`}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tournament Filter */}
          <div className="bg-white text-black/80 rounded-md mt-3">
            <div
              className="cursor-pointer flex items-center justify-between"
              onClick={() => setTournamentOpen((prev) => !prev)}
            >
              <p className="text-xl p-2 pl-4">Tournament</p>
              <div className="p-2">{tournamentOpen ? "▲" : "▼"}</div>
            </div>
            {tournamentOpen && (
              <div className="w-full p-2 rounded-sm">
                <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm pl-2">
                  {tournamentOptions.map((tr) => (
                    <li
                      key={tr}
                      onClick={() =>
                        setSelectedTournament((prev) => (prev === tr ? "" : tr))
                      }
                      className={`py-[4px] px-3 border border-slate-400 rounded-sm cursor-pointer select-none ${
                        selectedTournament === tr
                          ? "bg-[#EF233C] text-white"
                          : "bg-white/80 text-black/80"
                      }`}
                    >
                      {tr}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {(selectedTeam || selectedTournament) && (
            <button
              onClick={() => {
                setSelectedTeam("");
                setSelectedTournament("");
              }}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Main content */}
        <div className="text-white px-10 py-8 w-3/4 overflow-y-auto h-screen scrollbar-hide">
          <p className="text-white text-2xl mb-4">
            Open Air
            <span className="text-[#EF233C] font-inknut">
              {" "}
              {sportQuery && sportQuery !== "all"
                ? sportQuery.charAt(0).toUpperCase() +
                  sportQuery.slice(1).toLowerCase()
                : ""}
            </span>{" "}
            Events in Kolkata
          </p>

          {loading ? (
            <div className="flex items-center justify-center h-[70vh]">
              <Loader />
            </div>
          ) : filteredEvents.length === 0 ? (
            <p className="text-3xl text-center text-[#EF233C]">
              No events found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((ev) => (
                <OpenCard key={`${ev.sport || "all"}-${ev.id}`} event={ev} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OpenAir;
