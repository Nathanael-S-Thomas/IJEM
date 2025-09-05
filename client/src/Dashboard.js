// src/Dashboard.js

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Dashboard.css';
import { API_BASE_URL } from './config';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#FF6F91', '#2C73D2'];

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch(`${API_BASE_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  // 📊 Prepare state-wise counts
  const stateCounts = bookings.reduce((acc, booking) => {
    const state = booking.state;
    acc[state] = acc[state] ? acc[state] + 1 : 1;
    return acc;
  }, {});

  const stateChartData = Object.keys(stateCounts).map((state) => ({
    name: state,
    value: stateCounts[state],
  }));

  // 📅 Prepare month-wise counts
  const monthCounts = bookings.reduce((acc, booking) => {
    const month = booking.month;
    acc[month] = acc[month] ? acc[month] + 1 : 1;
    return acc;
  }, {});

  const barChartData = Object.keys(monthCounts).map((month) => ({
    name: month,
    bookings: monthCounts[month],
  }));

  return (
    <div className="dashboard-container">
      <h2>📊 VBS Booking Dashboard</h2>

      <div className="card-container">
        <div className="dashboard-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>States Covered</h3>
          <p>{Object.keys(stateCounts).length}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-box">
          <h4>📅 Bookings per Month</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>📍 Bookings by State</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stateChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {stateChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
