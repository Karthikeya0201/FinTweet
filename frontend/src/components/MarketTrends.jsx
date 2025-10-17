// src/components/MarketTrends.jsx
import React, { useState, useEffect } from "react";
import axios from "../axios";
import { Line } from "react-chartjs-2";
import ReactMarkdown from "react-markdown";
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
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

export default function MarketTrends() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const fetchAnalysis = async (company) => {
    if (!company) return;
    setLoading(true);
    setAnalysis(null);
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

  const getChartData = () => {
    if (!analysis) return { labels: [], datasets: [], predictedIndex: 0 };

    const labels = analysis.data.map((d) => new Date(d.ds).toLocaleDateString());
    const predictedIndex = analysis.data.findIndex((d) => d.predicted !== d.actual);

    // Mask actual for future
    const actualData = analysis.data.map((d, idx) =>
      idx < predictedIndex ? d.actual : null
    );
    const predictedData = analysis.data.map((d) => d.predicted);

    const datasets = [
      {
        label: "Actual Price",
        data: actualData,
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Predicted Price",
        data: predictedData,
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
        fill: true,
      },
    ];

    return { labels, datasets, predictedIndex };
  };

  const { labels, datasets, predictedIndex } = getChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
      annotation: {
        annotations: {
          forecastLine: {
            type: "line",
            xMin: predictedIndex > 0 ? labels[predictedIndex] : 0,
            xMax: predictedIndex > 0 ? labels[predictedIndex] : 0,
            borderColor: "red",
            borderWidth: 2,
            borderDash: [6, 6], // dotted line
            label: {
              content: "Forecast Start",
              enabled: true,
              position: "top",
              color: "red",
            },
          },
        },
      },
    },
    scales: {
      x: { grid: { drawOnChartArea: true } },
      y: { grid: { drawOnChartArea: true } },
    },
  };

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

      {loading && <p className="text-gray-500 p-6">Loading analysis...</p>}

      {!loading && analysis && (
        <>
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-gray-500">Last Price (as of today)</div>
              <div className="text-xl font-semibold">${analysis.last_price}</div>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-gray-500">Predicted Price (90 days)</div>
              <div className="text-xl font-semibold">${analysis.predicted_price}</div>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
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
          </div>

          {/* Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">📊 Price Chart</h2>
            <Line
              key={analysis.data.length}
              data={{ labels, datasets }}
              options={chartOptions}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-gray-500">Stock Score</div>
              <div className="text-xl font-semibold">{analysis.stock_score}</div>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-gray-500">Tweet Score</div>
              <div className="text-xl font-semibold">{analysis.tweet_score}</div>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-gray-500">Final Score</div>
              <div className="text-xl font-semibold">{analysis.final_score}</div>
            </div>
          </div>

          {/* Recommendation & Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded shadow text-center ${
                analysis.recommendation === "Buy"
                  ? "bg-green-100 text-green-700"
                  : analysis.recommendation === "Sell"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <div className="font-semibold">Recommendation</div>
              <div className="text-xl font-bold">{analysis.recommendation}</div>
            </div>
            <div
              className={`p-4 rounded shadow text-center ${
                analysis.risk === "Low"
                  ? "bg-green-100 text-green-700"
                  : analysis.risk === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div className="font-semibold">Risk Level</div>
              <div className="text-xl font-bold">{analysis.risk}</div>
            </div>
          </div>

          {/* LLM Explanation */}
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">💡 Analysis Summary</h2>
            <ReactMarkdown>{analysis.explanation}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}
