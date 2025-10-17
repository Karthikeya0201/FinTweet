// src/components/Sidebar.jsx
import React from "react";
import { Home, Briefcase, TrendingUp, Settings, LogOut } from "lucide-react";

export default function Sidebar({ activePage, setActivePage, user, handleLogout }) {
  const menuItems = [
    { name: "overview", label: "Overview", icon: <Home size={20} /> },
    { name: "portfolio", label: "My Portfolio", icon: <Briefcase size={20} /> },
    { name: "trends", label: "Market Trends", icon: <TrendingUp size={20} /> },
    { name: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-blue-50 to-purple-50 shadow-xl flex flex-col justify-between h-screen overflow-hidden z-50">
      {/* Header */}
      <div>
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">FinTweet</h1>
          <p className="text-center text-blue-100 text-xs mt-1 font-medium">Financial Insights</p>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                activePage === item.name
                  ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-white hover:shadow-sm hover:translate-x-1"
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-t-lg shadow-lg">
        <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.username}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-rose-400 text-white font-semibold rounded-lg hover:from-red-500 hover:to-rose-500 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}