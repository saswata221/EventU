import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/JsCompo/ScrollTop";
import Movie from "./Pages/Movie";
import Booking from "./Pages/Booking";
import ListShow from "./Pages/ListShow";
import EventInfo from "./Pages/EventInfo";
import Home from "./Pages/Home";
import Event from "./Pages/Event";
import YourBookings from "./Pages/YourBookings";
import MovieList from "./Pages/MovieList";
import Customercare from "./Pages/CustomerCare";
import SeatSelection from "./Pages/SeatDetail";
import Payment from "./Pages/Payment";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/JsCompo/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/movielist" element={<MovieList />}></Route>
          <Route path="/Event" element={<Event />}></Route>
          <Route path="/booking/:id" element={<Booking />}></Route>
          <Route path="/bookings/:id" element={<Booking />}></Route>
          <Route path="/listshow" element={<ListShow />}></Route>
          <Route path="/eventinfo/:id" element={<EventInfo />}></Route>

          {/* Only logged-in users can view their bookings */}
          <Route
            path="/yourbookings"
            element={
              <ProtectedRoute>
                <YourBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          {/* Seat selection stays public (you wanted pre-login visit allowed) */}
          <Route path="/seats" element={<SeatSelection />} />

          <Route path="/care" element={<Customercare />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
