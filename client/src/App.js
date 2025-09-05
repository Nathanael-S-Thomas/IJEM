import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CalendarPage from './CalendarPage';
import './App.css';
import logo from './assets/logo.png';
import { API_BASE_URL } from './config';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const locationData = {
  India: {
    "Andhra Pradesh": [], "Arunachal Pradesh": [], Assam: [], Bihar: [], Chhattisgarh: [], Goa: [],
    Gujarat: [], Haryana: [], "Himachal Pradesh": [], Jharkhand: [], Karnataka: [], Kerala: [],
    "Madhya Pradesh": [], Maharashtra: [], Manipur: [], Meghalaya: [], Mizoram: [], Nagaland: [],
    Odisha: [], Punjab: [], Rajasthan: [], Sikkim: [], "Tamil Nadu": [], Telangana: [], Tripura: [],
    "Uttar Pradesh": [], Uttarakhand: [], "West Bengal": []
  },
  Nepal: {
    Province1: [], Bagmati: []
  }
};

function App() {
  const [formData, setFormData] = useState({
    pastorName: '',
    churchName: '',
    phone: '',
    country: 'India',
    state: '',
    month: '',
    session: 'Full Day',
    days: '3',
  });

  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showForm, setShowForm] = useState(false);
  const [bookings, setBookings] = useState([]);

  // ✅ Load login status from localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      fetchBookings();
    }
  }, []);

  // ✅ Handle input changes
  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === '1234') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); // Save to localStorage
      fetchBookings();
    } else {
      alert('Invalid credentials');
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // ✅ Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message || 'Booking successful!');
      setFormData({
        pastorName: '',
        churchName: '',
        phone: '',
        country: 'India',
        state: '',
        month: '',
        session: 'Full Day',
        days: '3',
      });
      fetchBookings();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Something went wrong while booking.');
      console.error(err);
    }
  };

  // ✅ Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  // ✅ Group bookings by state for chart
  const groupedBookings = bookings.reduce((acc, b) => {
    const state = b.state || 'Unknown';
    if (!acc[state]) acc[state] = [];
    acc[state].push(b);
    return acc;
  }, {});

  const chartData = Object.entries(groupedBookings).map(([state, bookings]) => ({
    state,
    count: bookings.length,
  }));

  const states = formData.country ? Object.keys(locationData[formData.country] || {}) : [];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <img src={logo} alt="Logo" className="firm-logo" />
          <h1 className="firm-name">IN JESUS EVER MINISTRIES</h1>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                // ✅ Login Form
                <form className="card-form" onSubmit={handleLogin}>
                  <h2>WELCOME</h2>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <button type="submit">Login</button>
                </form>
              ) : (
                // ✅ Dashboard View
                <div className="dashboard">
                  <h2>📊 Dashboard</h2>

                  {/* Dashboard Summary Cards */}
                  <div className="dashboard-cards">
                    <div className="card">📖 Total Bookings: {bookings.length}</div>
                    <div className="card">🌍 States Booked: {Object.keys(groupedBookings).length}</div>
                    <div
                      className="card"
                      onClick={() => setShowForm(!showForm)}
                      style={{ cursor: 'pointer' }}
                    >
                      ➕ {showForm ? 'Hide Booking Form' : 'Add Booking'}
                    </div>
                    <div className="card">
                      <Link to="/calendar">📅 View Calendar</Link>
                    </div>
                    <div className="card" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      🚪 Logout
                    </div>
                  </div>

                  {/* Booking Chart */}
                  <div className="chart-container">
                    <h3>State-wise Bookings</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <XAxis dataKey="state" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Booking Form */}
                  {showForm && (
                    <form className="card-form" onSubmit={handleSubmit}>
                      <h2>📋 VBS Booking Form</h2>
                      <input type="text" name="pastorName" placeholder="Pastor's Name" value={formData.pastorName} onChange={handleChange} required />
                      <input type="text" name="churchName" placeholder="Church Name" value={formData.churchName} onChange={handleChange} required />
                      <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />

                      <select name="country" value={formData.country} onChange={handleChange}>
                        {Object.keys(locationData).map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>

                      <select name="state" value={formData.state} onChange={handleChange} required>
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>

                      <select name="month" value={formData.month} onChange={handleChange} required>
                        <option value="">Select Month</option>
                        {months.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>

                      <select name="days" value={formData.days} onChange={handleChange} required>
                        <option value="3">3 Days</option>
                        <option value="5">5 Days</option>
                        <option value="7">7 Days</option>
                      </select>

                      <select name="session" value={formData.session} onChange={handleChange}>
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day">Half Day</option>
                      </select>

                      <button type="submit">Book Now</button>
                      {message && <p>{message}</p>}
                    </form>
                  )}
                </div>
              )
            }
          />

          {/* Calendar Route */}
          <Route
            path="/calendar"
            element={<CalendarPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
