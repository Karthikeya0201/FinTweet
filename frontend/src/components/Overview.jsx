// src/components/Overview.jsx
import React from "react";

export default function Overview({ user }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome back, {user.username} 👋</h2>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2">📧 Email: {user.email}</p>
        <p className="mb-2">💰 Total Profit: ${user.profit.toFixed(2)}</p>
        <p>💼 Companies in Portfolio: {user.portfolio.length}</p>
      </div>
    </div>
  );
}
