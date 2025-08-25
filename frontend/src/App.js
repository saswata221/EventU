import React from "react";
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
import SeatSelection from "./Pages/SeatDetail";

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
        <Route path="/bookings/:id" element={<Booking />}></Route>{" "}
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/listshow" element={<ListShow />}></Route>
        <Route path="/eventinfo/:id" element={<EventInfo />}></Route>
        <Route path="/yourbookings" element={<YourBookings />} />
        <Route path="/care" element={<Customercare />} />
        <Route path="/seats" element={<SeatSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
