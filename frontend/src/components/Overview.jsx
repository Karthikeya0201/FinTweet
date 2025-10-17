// src/components/Overview.jsx
import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function Overview({ user }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // 1️⃣ Fetch all companies
        const res = await axios.get("/companies");
        const companyList = res.data;

        // 2️⃣ Fetch stock data in parallel
        const promises = companyList.map((c) =>
          axios
            .get(`/stocks/history/${c.ticker}`)
            .then((stockRes) => ({
              name: c.name,
              ticker: c.ticker,
              currentPrice: stockRes.data.currentPrice,
              dailyChange: stockRes.data.dailyChange,
            }))
            .catch(() => null) // skip failed fetches
        );

        // 3️⃣ Wait for all promises to settle
        const results = await Promise.allSettled(promises);

        // 4️⃣ Filter out failed requests
        const companiesWithData = results
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value);

        setCompanies(companiesWithData);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading companies...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Welcome back, {user.username} 👋</h2>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2">📧 Email: {user.email}</p>
        <p className="mb-2">💰 Total Profit: ${user.profit.toFixed(2)}</p>
        <p>💼 Companies in Portfolio: {user.portfolio.length}</p>
      </div>

        <div>Global Market Today</div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {companies.map((c) => (
          <div key={c.ticker} className="bg-white p-4 rounded shadow flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg">{c.name}</h3>
              <p className="text-gray-500 text-sm">{c.ticker}</p>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold">${c.currentPrice.toFixed(2)}</p>
              <p
                className={`text-sm font-semibold ${
                  c.dailyChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {c.dailyChange >= 0 ? "+" : "-"}${Math.abs(c.dailyChange).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
