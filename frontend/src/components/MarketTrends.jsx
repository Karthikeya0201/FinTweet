// src/components/MarketTrends.jsx
import React, { useState, useEffect } from "react";
import axios from "../axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MarketTrends() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(""); // default nothing
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Fetch companies from backend
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/companies");
      setCompanies(res.data);
      // Do NOT auto-select
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  // Fetch analysis for selected company
  const fetchAnalysis = async (company) => {
    if (!company) return;
    setLoading(true);
    setAnalysis(null); // clear old analysis
    try {
      const res = await axios.get(`/analyze/${company}`);
      setAnalysis(res.data);
    } catch (err) {
      console.error("Error fetching analysis:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) fetchAnalysis(selectedCompany);
  }, [selectedCompany]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📈 Company Analysis</h1>

      {/* Company selector */}
      <div>
        <label className="mr-2 font-semibold">Select Company:</label>
        <select
          className="border rounded px-3 py-1"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">-- Select a company --</option>
          {companies.map((c) => (
            <option key={c.ticker} value={c.ticker}>
              {c.name} ({c.ticker})
            </option>
          ))}
        </select>
      </div>

      {/* Show loading if fetching analysis */}
      {loading && <p className="text-gray-500 p-6">Loading analysis...</p>}

      {/* Show analysis only if loaded */}
      {!loading && analysis && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Last Price</div>
              <div className="text-xl font-semibold">${analysis.last_price}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Predicted Price</div>
              <div className="text-xl font-semibold">${analysis.predicted_price}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">% Change</div>
              <div
                className={`text-xl font-semibold ${
                  analysis.pct_change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {analysis.pct_change >= 0 ? "+" : "-"}
                {Math.abs(analysis.pct_change).toFixed(2)}%
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Stock Score</div>
              <div className="text-xl font-semibold">{analysis.stock_score}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Tweet Score</div>
              <div className="text-xl font-semibold">{analysis.tweet_score}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Final Score</div>
              <div className="text-xl font-semibold">{analysis.final_score}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Recommendation</div>
              <div className="text-xl font-semibold">{analysis.recommendation}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Risk</div>
              <div className="text-xl font-semibold">{analysis.risk}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">📊 Price Chart</h2>
            <Line
              data={{
                labels: analysis.data.map((d) =>
                  new Date(d.ds).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "Actual / Predicted Price",
                    data: analysis.data.map((d) => d.predicted ?? d.actual),
                    borderColor: "rgba(34,197,94,1)",
                    backgroundColor: "rgba(34,197,94,0.2)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
            />
          </div>

          {/* Explanation */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">💡 Analysis Summary</h2>
            <p>{analysis.explanation}</p>
          </div>
        </>
      )}
    </div>
  );
}
