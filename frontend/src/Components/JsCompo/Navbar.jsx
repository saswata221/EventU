// src/Components/JsCompo/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/logo.png";
import { IoLocationSharp } from "react-icons/io5";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaRegUserCircle } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { useAuth } from "../../context/AuthContext";
import Search from "./SearchBar";
import { useMemo, useState } from "react";

function Navbar({ onLoginClick }) {
  const navigate = useNavigate();
  const { user, logout, openAuthModal } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const firstName = useMemo(() => {
    if (!user?.name) return "";
    return user.name.trim().split(" ")[0];
  }, [user]);

  async function onLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="bg-[#]">
      {/* Header bar */}
      <div className="flex h-[83px] w-full flex-wrap items-center justify-between bg-[#1A1A2E] text-white relative z-50">
        <div className="pl-20">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="h-fit w-[60px] scale-150 cursor-pointer"
            />
          </Link>
        </div>

        <Search />

        <div className="flex items-center gap-10 pr-10 text-[1rem]">
          <p
            className="flex items-center gap-1 cursor-not-allowed relative group text-gray-400"
            title="Coming soon"
          >
            <IoLocationSharp />
            Location
            <TiArrowSortedDown />
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              This feature is not yet available
            </span>
          </p>

          <Link to="/event">
            <p>Events</p>
          </Link>
          <Link to="/care">
            <p>Contact Us</p>
          </Link>

          {/* Auth area */}
          {!user ? (
            <button
              onClick={onLoginClick || openAuthModal}
              className="rounded-3xl bg-[#EF233C] px-3 py-1 text-white"
            >
              Sign In
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-2 rounded-3xl bg-[#EF233C]/100 px-3 py-1 hover:bg-white/15"
              >
                <FaRegUserCircle />
                <span className="font-semibold">Hi, {firstName}</span>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-md bg-white text-slate-800 shadow-lg ring-1 ring-black/5 z-50"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/yourbookings");
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    Your Bookings
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="relative group inline-block text-gray-400">
            <TiThMenu className="scale-150 cursor-not-allowed" />

            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Secondary row */}
      <div className="flex justify-between bg-[#51557E] text-white">
        <div className="flex gap-10 px-5">
          <p className="flex items-center">
            Generes <TiArrowSortedDown />
          </p>
          <p>TV Shows</p>
          <Link to="/movielist">
            <p>Movies</p>
          </Link>
          <Link to="/openair">
            <p>Sports</p>
          </Link>
        </div>
        <div className="flex gap-10 px-5">
          <Link to="/listshow">
            <p>List Your Show</p>
          </Link>
          <p>Corporates</p>
          <p>Offers</p>
          <p>Gift Cards</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
