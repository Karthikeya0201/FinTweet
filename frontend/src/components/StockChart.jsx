// src/components/StockChart.jsx
import React, { useEffect, useState } from "react";
import axios from "../axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ company, portfolioItem }) {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState("1m");
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!company) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/stocks/history/${company}?range=${timeRange}`);
        const prices = res.data.prices.map((p) => ({
          date: new Date(p.date).toLocaleDateString(),
          close: p.close,
        }));
        setData(prices);

        const currentPrice = res.data.currentPrice;
        const profitPerShare = currentPrice - portfolioItem.purchasePrice;
        const totalProfit = profitPerShare * portfolioItem.quantity;

        setStats({ currentPrice, profitPerShare, totalProfit });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [company, timeRange, portfolioItem]);

  return (
    <div className="mb-6">
      {/* Time range buttons */}
      <div className="flex gap-2 mb-2">
        {["5d", "1m", "3m", "6m", "1y", "max"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded ${
              timeRange === range ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-50 p-4 rounded shadow mb-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="close" stroke="#4f46e5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-l-4 border-cyan-500 rounded shadow">
          <div className="text-cyan-600 text-xs font-semibold uppercase tracking-wide">Current Price</div>
          <div className="text-lg font-semibold text-cyan-700 mt-1">${stats.currentPrice?.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded shadow">
          <div className="text-orange-600 text-xs font-semibold uppercase tracking-wide">Profit/Share</div>
          <div className={`text-lg font-semibold mt-1 ${stats.profitPerShare >= 0 ? "text-green-600" : "text-red-600"}`}>
            {stats.profitPerShare >= 0 ? "+" : "-"}${Math.abs(stats.profitPerShare)?.toFixed(2)}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-l-4 border-rose-500 rounded shadow">
          <div className="text-rose-600 text-xs font-semibold uppercase tracking-wide">Total Profit</div>
          <div className={`text-lg font-semibold mt-1 ${stats.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {stats.totalProfit >= 0 ? "+" : "-"}${Math.abs(stats.totalProfit)?.toFixed(2)}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-500 rounded shadow">
          <div className="text-teal-600 text-xs font-semibold uppercase tracking-wide">Quantity</div>
          <div className="text-lg font-semibold text-teal-700 mt-1">{portfolioItem.quantity}</div>
        </div>
      </div>
    </div>
  );
}