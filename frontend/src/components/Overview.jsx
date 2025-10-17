import React, { useState, useEffect } from "react";
import axios from "../axios";
import { Line, Doughnut } from 'react-chartjs-2'; // Assuming Chart.js is installed
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Overview({ user, refreshUser }) {
  const [portfolio, setPortfolio] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [marketData, setMarketData] = useState({ indices: [], topMovers: [] });
  const [loading, setLoading] = useState(true);

  // Fetch portfolio and companies
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const [portfolioRes, companiesRes, marketRes] = await Promise.all([
          axios.get("/user/portfolio", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/companies"),
          axios.get("/market/highlights") // Assume backend endpoint for market data
        ]);
        setPortfolio(portfolioRes.data);
        setCompanies(companiesRes.data);
        setMarketData(marketRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshUser]);

  // Calculate portfolio stats
  const totalProfit = portfolio.reduce((sum, item) => sum + (item.currentValue - item.investedValue), 0);
  const totalValue = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
  const allocation = portfolio.reduce((acc, item) => {
    const sector = item.company?.sector || 'Other';
    acc[sector] = (acc[sector] || 0) + item.currentValue;
    return acc;
  }, {});

  // Sparkline data (mock for 7 days; fetch real from backend)
  const sparklineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      data: [100, 105, 102, 110, 108, 115, totalValue],
      borderColor: totalProfit > 0 ? 'green' : 'red',
      backgroundColor: 'rgba(0,0,0,0)',
      tension: 0.1
    }]
  };

  // Doughnut chart data for allocation
  const pieData = {
    labels: Object.keys(allocation),
    datasets: [{
      data: Object.values(allocation),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };

  // Recent activity (mock; fetch from backend)
  const recentActivity = [
    { action: "Bought 10 shares of INFY", date: "Oct 17" },
    { action: "Sold 5 shares of TCS", date: "Oct 16" },
    { action: "Portfolio updated", date: "Oct 15" }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user.username} 👋</h1>
        <p className="text-gray-600">Here's a quick overview of your investments.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Value Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-green-400">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
          <div className="mt-4 h-20">
            <Line data={sparklineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
          </div>
          <p className={`text-sm font-medium ${totalProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalProfit > 0 ? '↑' : '↓'} ${Math.abs(totalProfit).toFixed(2)} ({((totalProfit / (totalValue - totalProfit)) * 100).toFixed(1)}%)
          </p>
        </div>

        {/* Total Profit Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-400">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Profit</h3>
          <p className={`text-3xl font-bold ${totalProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm mt-2">YTD Performance</p>
        </div>

        {/* Companies Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 border-blue-400">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Companies in Portfolio</h3>
          <p className="text-3xl font-bold text-gray-800">{portfolio.length}</p>
          <p className="text-gray-500 text-sm mt-2">Diversified Holdings</p>
        </div>
      </div>

      {/* Allocation Doughnut Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Portfolio Allocation</h3>
          <div className="h-64">
            <Doughnut data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Highlights */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Market Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Indices */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Major Indices</h4>
            {marketData.indices.map((index, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{index.name}</span>
                <span className={`font-medium ${index.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {index.value} ({index.change > 0 ? '+' : ''}{index.change}%)
                </span>
              </div>
            ))}
          </div>
          {/* Top Movers */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Top Movers</h4>
            {marketData.topMovers.slice(0, 4).map((mover, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{mover.symbol}</span>
                <span className={`font-medium ${mover.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mover.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition shadow-md">
          ➕ Add Stock
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-md">
          📊 View Trends
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition shadow-md">
          📤 Share Portfolio
        </button>
      </div>
    </div>
  );
}