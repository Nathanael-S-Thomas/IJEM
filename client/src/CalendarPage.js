import React, { useEffect, useState } from "react";
import "./App.css";
import { API_BASE_URL } from "./config";

function CalendarPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookings`);
        const data = await res.json();

        console.log("📦 Bookings from API:", data);

        setBookings(data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = selectedMonth
    ? bookings.filter((b) => b.month === selectedMonth)
    : [];

  return (
    <div className="calendar-page">
      <h2>📅 VBS Booking Calendar</h2>

      <div className="calendar-container">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">-- Select Month --</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <h3>📌 Bookings for {selectedMonth || "..."}</h3>

      {filteredBookings.length === 0 ? (
        <p>🚫 No bookings for this month.</p>
      ) : (
        <ul className="booking-list">
          {filteredBookings.map((b, idx) => (
            <li key={idx}>
              <strong>{b.name}</strong> – {b.phone} ({b.session}) <br />
              🌍 {b.country}, {b.state}, {b.city}
            </li>
          ))}
        </ul>
      )}

      <a href="/" className="back-link">
        🔙 Back to Dashboard
      </a>
    </div>
  );
}

export default CalendarPage;
