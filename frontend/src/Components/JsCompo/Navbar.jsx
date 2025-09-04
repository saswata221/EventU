import { Link } from "react-router-dom";
import logo from "../Images/logo.png";
import { IoLocationSharp } from "react-icons/io5";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaRegUserCircle } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import Search from "./SearchBar";

// Accept onLoginClick from Home to open the modal (no navigation to /login)
function Navbar({ onLoginClick }) {
  return (
    <div className="bg-[#]">
      <div className="flex h-[83px] w-full flex-wrap items-center justify-between bg-[#1A1A2E] text-white">
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
          <p className="flex items-center gap-1">
            <IoLocationSharp />
            Location
            <TiArrowSortedDown />
          </p>
          <Link to="/event"><p>Events</p></Link>
          <p>Contact Us</p>

          {/* Opens the login modal */}
          <button
            onClick={onLoginClick}
            className="rounded-3xl bg-[#EF233C] px-3 py-1 text-white"
          >
            Sign In
          </button>

          <FaRegUserCircle className="scale-150" />
          <TiThMenu className="scale-150" />
        </div>
      </div>

      <div className="flex justify-between bg-[#51557E] text-white">
        <div className="flex gap-10 px-5">
          <p className="flex items-center">
            Generes <TiArrowSortedDown />
          </p>
          <p>TV Shows</p>
          <Link to="/movielist">
            <p>Movies</p>
          </Link>
          <p>SPORTS</p>
        </div>
        <div className="flex gap-10 px-5">
          <Link to="/listshow"><p>List Your Show</p></Link>
          <p>Corporates</p>
          <p>Offers</p>
          <p>Gift Cards</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
