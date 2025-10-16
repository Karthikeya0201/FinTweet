// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  axios.get("/auth/me")
    .then((res) => {
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    })
    .catch((err) => {
      console.error(err);
      alert("Session expired, please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    });
}, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.username}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Your Portfolio</h2>
      {user.portfolio && user.portfolio.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Company</th>
              <th className="border px-4 py-2">Ticker</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Purchase Date</th>
              <th className="border px-4 py-2">Current Price</th>
            </tr>
          </thead>
          <tbody>
            {user.portfolio.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{item.companyName}</td>
                <td className="border px-4 py-2">{item.companyId}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">{item.purchaseDate}</td>
                <td className="border px-4 py-2">{item.currentPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No portfolio items yet.</p>
      )}

      <p className="mt-4 font-semibold">Total Profit: ${user.profit.toFixed(2)}</p>
    </div>
  );
}
