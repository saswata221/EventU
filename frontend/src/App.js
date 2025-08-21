import React from "react";
// import Card from "./Components/Card";
// import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/JsCompo/ScrollTop";
import Movie from "./Pages/Movie";
import LogIn from "./Pages/LogIn";
import Booking from "./Pages/Booking";
import ListShow from "./Pages/ListShow";
import EventInfo from "./Pages/EventInfo";
import Home from "./Pages/Home";
import Event from "./Pages/Event";
import YourBookings from "./Pages/YourBookings";
import MovieList from "./Pages/MovieList";
import Customercare from "./Pages/CustomerCare";
// import Carousel from "./Components/Carousal";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/movielist" element={<MovieList />}></Route>
        <Route path="/Event" element={<Event />}></Route>
        <Route path="/booking/:id" element={<Booking />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/listshow" element={<ListShow />}></Route>
        <Route path="/eventinfo" element={<EventInfo />}></Route>
        <Route path="/yourbookings" element={<YourBookings />} />
        <Route path="/care" element={<Customercare />} />
      </Routes>
    </Router>
  );
}

export default App;
