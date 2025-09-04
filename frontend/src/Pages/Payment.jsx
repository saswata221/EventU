import React from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";

export default function Payment() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Payments</h1>
          <p className="text-gray-600">This feature will be available soon...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
