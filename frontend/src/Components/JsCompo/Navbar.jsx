import { Link } from "react-router-dom";
import logo from "../Images/logo.png";
import { IoLocationSharp } from "react-icons/io5";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaRegUserCircle } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import Search from "./SearchBar";

function Navbar() {
  return <div className=" bg-[#]">
    <div className="h-[83px] w-full flex flex-wrap bg-[#1A1A2E] text-white justify-between">
      <div className="pl-20 flex items-center m-">
        <Link to="/">
      <img 
        src={logo} 
        alt="logo" 
        className="h-fit w-[60px] scale-150 cursor-pointer" 
      />
    </Link>
      </div>
      {/* <div> */}
        <Search/>
      {/* </div> */}
      <div className="flex text-[1rem] items-center gap-10 pr-10">
        <p className="flex items-center gap-1">
          <IoLocationSharp />
          Location
          <TiArrowSortedDown />
        </p>
        <Link to="/event"><p>Events</p></Link>
        <p>Contact Us</p>
        <p className="bg-[#EF233C] px-3 py-1 text-white rounded-3xl">Sign In</p>
        <FaRegUserCircle className="scale-150" />
        <TiThMenu className="scale-150" />
      </div>
    </div>
    <div className="bg-[#51557E] text-white flex justify-between">
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
}


export default Navbar;