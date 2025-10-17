// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Overview";
import MyPortfolio from "../components/MyPortfolio";
import MarketTrends from "../components/MarketTrends";
import Settings from "../components/Settings";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("overview");

  const fetchUser = () => {
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
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activePage === "overview" && <Overview user={user} />}
        {activePage === "portfolio" && <MyPortfolio user={user} />}
        {activePage === "trends" && <MarketTrends />}
        {activePage === "settings" && <Settings user={user} refreshUser={fetchUser} />}
      </div>
    </div>
  );
}
