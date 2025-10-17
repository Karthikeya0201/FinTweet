// src/components/Sidebar.jsx
import React from "react";
import { Home, Briefcase, TrendingUp, Settings, LogOut } from "lucide-react";

export default function Sidebar({ activePage, setActivePage, user, handleLogout }) {
  const menuItems = [
    { name: "overview", label: "Overview", icon: <Home size={18} /> },
    { name: "portfolio", label: "My Portfolio", icon: <Briefcase size={18} /> },
    { name: "trends", label: "Market Trends", icon: <TrendingUp size={18} /> },
    { name: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold text-center mt-4 mb-6">FinTweet</h1>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex items-center gap-3 w-full text-left px-6 py-3 hover:bg-gray-100 ${
                activePage === item.name ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <p className="text-sm font-medium mb-2">👤 {user.username}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
