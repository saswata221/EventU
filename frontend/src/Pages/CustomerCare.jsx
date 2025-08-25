import React, { useState } from "react";
import Navbar from "../Components/JsCompo/Navbar";
import Footer from "../Components/JsCompo/Footer";

function CustomerCare() {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackSubmit = async () => {
    if (!feedback) {
      alert("Please write some feedback!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Feedback submitted successfully!");
        setFeedback("");
      } else alert("Something went wrong!");
    } catch (err) {
      console.error("Error:", err);
      alert("Server error!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else alert("Something went wrong!");
    } catch (err) {
      console.error("Error:", err);
      alert("Server error!");
    }
  };

  return (
    <div className="bg-gray-950 text-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
          alt="Customer Support Team"
          className="w-full h-[450px] object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-400">
            We’re Here to Help
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gray-300 max-w-2xl">
            Whether it’s bookings, payments, or event details – our support team
            is always available.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* FAQ Section */}
<section>
  <h2 className="text-3xl font-bold text-cyan-400 mb-12 text-center">
     Frequently Asked Questions
  </h2>
  <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
    {/* FAQ Card 1 */}
    <div className="bg-cyan-500 p-6 rounded-2xl shadow-lg text-gray-900 flex flex-col gap-4 hover:shadow-cyan-400/50 transition">
      <h3 className="font-bold text-xl flex items-center gap-2">
        ❌ How can I cancel my booking?
      </h3>
      <p>Go to 'Your Bookings' page, select the booking, and click cancel. Refunds may take 3–5 working days.</p>
    </div>


    {/* FAQ Card 3 */}
    <div className="bg-yellow-400 p-6 rounded-2xl shadow-lg text-gray-900 flex flex-col gap-4 hover:shadow-yellow-300/50 transition">
      <h3 className="font-bold text-xl flex items-center gap-2">
        💳 What payment methods are accepted?
      </h3>
      <p>We accept UPI, credit/debit cards, and popular wallets like Paytm, PhonePe, and Google Pay.</p>
    </div>
    
    {/* FAQ Card 2 */}
    <div className="bg-purple-500 p-6 rounded-2xl shadow-lg text-gray-900 flex flex-col gap-4 hover:shadow-purple-400/50 transition">
      <h3 className="font-bold text-xl flex items-center gap-2">
        🔄 Can I reschedule an event?
      </h3>
      <p>Rescheduling depends on event organizers. Check event info or contact support directly.</p>
    </div>

    {/* FAQ Card 4 */}
    <div className="bg-pink-400 p-6 rounded-2xl shadow-lg text-gray-900 flex flex-col gap-4 hover:shadow-pink-300/50 transition">
      <h3 className="font-bold text-xl flex items-center gap-2">
        🎟️ Do I need to print my ticket?
      </h3>
      <p>No, digital tickets with QR codes are accepted at all venues.</p>
    </div>

    {/* FAQ Card 5 */}
    <div className="bg-green-500 p-6 rounded-2xl shadow-lg text-gray-900 flex flex-col gap-4 hover:shadow-green-400/50 transition">
      <h3 className="font-bold text-xl flex items-center gap-2">
        📞 How do I contact event organizers?
      </h3>
      <p>Each event page has organizer details. You can directly message or email them from the event info section.</p>
    </div>

    {/* FAQ Card 6 */}
    <div className="bg-red-500 p-6 rounded-2xl shadow-lg text-gray-900 flex flex-col gap-4 hover:shadow-red-400/50 transition">
      <h3 className="font-bold text-xl flex items-center gap-2">
        📧 I didn’t receive my confirmation email. What should I do?
      </h3>
      <p>Check your spam/junk folder. If not found, visit 'Your Bookings' to download your ticket or contact us.</p>
    </div>
  </div>
</section>


        {/* Contact Us Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#EF233C] mb-8 text-center">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* LEFT: Map + Feedback */}
            <div className="flex flex-col gap-6 h-full">
              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-700">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.184497595107!2d87.29201107488474!3d23.545556178823804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f77255f8b79e13%3A0xf56e59e21c1f07f!2sNational%20Institute%20of%20Technology%2C%20Durgapur!5e0!3m2!1sen!2sin!4v1693051523934!5m2!1sen!2sin"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Feedback Form */}
              <div className="bg-gray-900/70 p-6 rounded-2xl shadow-md flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-[#EF233C] mb-4">
                  Share Your Feedback
                </h3>
                <p className="text-gray-400 mb-3">
                  Help us improve your experience by sharing your suggestions.
                </p>
                <textarea
                  placeholder="Write your feedback here..."
                  rows="3"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EF233C] mb-4"
                />
                <button
                  onClick={handleFeedbackSubmit}
                  className="bg-[#EF233C] hover:bg-[#EF233C]/90 px-6 py-2 rounded-lg font-semibold text-white transition w-full mt-auto"
                >
                  Submit Feedback
                </button>
              </div>
            </div>

            {/* RIGHT: Contact Info + Message Form */}
            <div className="flex flex-col gap-6 h-full">
              {/* Contact Info */}
              <div className="bg-gray-900/70 p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold text-[#EF233C] mb-4">
                  Get in Touch
                </h3>
                <div className="space-y-2 text-gray-400">
                  <p>
                    <span className="font-semibold text-gray-200">📍 Address:</span>{" "}
                    NIT Durgapur, India
                  </p>
                  <p>
                    <span className="font-semibold text-gray-200">📞 Phone:</span>{" "}
                    +91 123456789
                  </p>
                  <p>
                    <span className="font-semibold text-gray-200">✉️ Email:</span>{" "}
                    support@eventU.com
                  </p>
                  <p>
                    <span className="font-semibold text-gray-200">⏰ Working Hours:</span>{" "}
                    Mon – Sat: 9 AM – 9 PM
                  </p>
                </div>
              </div>

              {/* Message Form */}
              <div className="bg-gray-900/70 p-6 rounded-2xl shadow-md flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-[#EF233C] mb-2">
                  Send us a Message
                </h3>
                <div className="flex justify-center mb-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3771/3771518.png"
                    alt="Sticker"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <form onSubmit={handleSubmit} className="space-y-3 flex flex-col flex-1">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EF233C]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EF233C]"
                    required
                  />
                  <textarea
                    placeholder="Your Message"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EF233C]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#EF233C] text-white py-2 rounded-lg hover:bg-[#d90429] transition mt-auto"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default CustomerCare;
