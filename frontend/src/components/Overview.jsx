import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function Overview({ user }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // 🔹 1️⃣ Try loading from localStorage first
        const cachedData = localStorage.getItem("companiesData");
        const cachedTimestamp = localStorage.getItem("companiesDataTimestamp");
        const oneDay = 24 * 60 * 60 * 1000;

        if (cachedData && cachedTimestamp) {
          const parsedCache = JSON.parse(cachedData);
          const isFresh = Date.now() - cachedTimestamp < oneDay;

          // ⚠️ Use cache only if it’s fresh AND not empty
          if (isFresh && Array.isArray(parsedCache) && parsedCache.length > 0) {
            console.log("📦 Using cached company data");
            setCompanies(parsedCache);
            setLoading(false);
            return;
          } else {
            console.warn("⚠️ Cache expired or empty, refetching data...");
            // Clear invalid cache
            localStorage.removeItem("companiesData");
            localStorage.removeItem("companiesDataTimestamp");
          }
        }


        // 🔹 2️⃣ Fetch all companies
        const res = await axios.get("/companies");
        const companyList = res.data;

        // 🔹 3️⃣ Fetch stock data in parallel
        const promises = companyList.map((c) =>
          axios
            .get(`/stocks/history/${c.ticker}`)
            .then((stockRes) => ({
              name: c.name,
              ticker: c.ticker,
              currentPrice: stockRes.data.currentPrice,
              dailyChange: stockRes.data.dailyChange,
            }))
            .catch(() => null)
        );

        // 🔹 4️⃣ Wait for all promises to settle
        const results = await Promise.allSettled(promises);

        // 🔹 5️⃣ Filter out failed requests
        const companiesWithData = results
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value);

        // 🔹 6️⃣ Cache results in localStorage
        localStorage.setItem("companiesData", JSON.stringify(companiesWithData));
        localStorage.setItem("companiesDataTimestamp", Date.now().toString());

        setCompanies(companiesWithData);
      } catch (err) {
        console.error("❌ Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl h-32 border border-gray-200"></div>
            <div className="bg-white p-6 rounded-xl h-32 border border-gray-200"></div>
            <div className="bg-white p-6 rounded-xl h-32 border border-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // 🧮 Compute market stats
  const marketStats = {
    gainers: companies.filter((c) => c.dailyChange > 0).length,
    losers: companies.filter((c) => c.dailyChange < 0).length,
    avgChange: companies.reduce((sum, c) => sum + c.dailyChange, 0) / companies.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back, {user.username} 👋
          </h1>
          <p className="text-gray-600">Track your portfolio and market insights</p>
        </div>

        {/* Market Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Global Market Today</h2>
            <span className="text-2xl">🌍</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg text-center hover:bg-green-200 transition-colors">
              <p className="text-3xl font-bold text-green-700">{marketStats.gainers}</p>
              <p className="text-sm text-gray-600 mt-1">Gainers</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center hover:bg-red-200 transition-colors">
              <p className="text-3xl font-bold text-red-700">{marketStats.losers}</p>
              <p className="text-sm text-gray-600 mt-1">Losers</p>
            </div>
            <div
              className={`${
                marketStats.avgChange >= 0
                  ? "bg-blue-100 hover:bg-blue-200"
                  : "bg-orange-100 hover:bg-orange-200"
              } p-4 rounded-lg text-center transition-colors`}
            >
              <p
                className={`text-3xl font-bold ${
                  marketStats.avgChange >= 0 ? "text-blue-700" : "text-orange-700"
                }`}
              >
                {marketStats.avgChange >= 0 ? "+" : ""}
                {marketStats.avgChange.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Avg Change</p>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Companies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {companies.map((c) => (
              <div
                key={c.ticker}
                className={`bg-white p-5 rounded-lg shadow-md border-2 ${
                  c.dailyChange >= 0
                    ? "border-green-400 hover:border-green-500 hover:shadow-green-200"
                    : "border-red-400 hover:border-red-500 hover:shadow-red-200"
                } hover:shadow-lg transition-all duration-200 cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                      {c.name}
                    </h3>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {c.ticker}
                    </span>
                  </div>
                  <div className={`ml-2 text-2xl`}>
                    {c.dailyChange >= 0 ? "📈" : "📉"}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Price</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${c.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Daily Change</p>
                      <p
                        className={`text-lg font-bold ${
                          c.dailyChange >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {c.dailyChange >= 0 ? "+" : ""}${Math.abs(c.dailyChange).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
