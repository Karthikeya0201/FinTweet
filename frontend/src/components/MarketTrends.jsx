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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MarketTrends() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  // Fetch analysis with smooth transition
  const fetchAnalysis = async (company) => {
    if (!company) return;
    setLoading(true);
    setShowLoading(true);
    setAnalysis(null);
    try {
      const res = await axios.get(`/analyze/${company}`);
      setAnalysis(res.data);
      // Smooth exit transition
      setTimeout(() => {
        setShowLoading(false);
        setTimeout(() => setLoading(false), 300);
      }, 200);
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setShowLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) fetchAnalysis(selectedCompany);
  }, [selectedCompany]);

  // Chart data with vertical line for forecast
  const getChartData = () => {
    if (!analysis) return { labels: [], datasets: [] };

    const labels = analysis.data.map((d) => new Date(d.ds).toLocaleDateString());
    const predictedIndex = analysis.data.findIndex((d) => d.actual === 0);
    
    // Split actual data - only show up to where predictions start
    const actualData = analysis.data.map((d, idx) => {
      if (predictedIndex > 0 && idx >= predictedIndex) {
        return null; // Hide actual price for future dates
      }
      return d.actual;
    });

    const datasets = [
      {
        label: "Actual Price",
        data: actualData,
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.3,
        fill: false,
        spanGaps: false, // Don't connect gaps
      },
      {
        label: "Predicted Price",
        data: analysis.data.map((d) => d.predicted),
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
    },
    scales: {
      x: {
        grid: { drawOnChartArea: true },
      },
      y: {
        grid: { drawOnChartArea: true },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
              <span className="text-4xl">📈</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Company Analysis Dashboard
              </h1>
              <p className="text-gray-600 mt-1">AI-Powered Market Intelligence & Predictions</p>
            </div>
          </div>

          {/* Company selector */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              <span>Select Company:</span>
            </label>
            <select
              className="flex-1 border-2 border-indigo-200 rounded-lg px-4 py-2 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
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
        </div>

        {/* Enhanced Loading with Smooth Transition */}
        {loading && (
          <div className={`bg-gradient-to-br from-blue-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-sm flex justify-center items-center rounded-2xl shadow-xl min-h-96 transition-opacity duration-500 ease-in-out ${showLoading ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center transform transition-all duration-300 ease-in-out scale-100">
              {/* Pulsing Spinner */}
              <div className="relative mb-8">
                <div className="inline-block animate-spin">
                  <span className="text-7xl drop-shadow-2xl">⚙️</span>
                </div>
                {/* Multiple pulse rings for extra flair */}
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-20 animate-ping" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-white text-2xl font-bold animate-pulse drop-shadow-lg">
                Analyzing Market Data...
              </p>
              {/* Animated dots */}
              <div className="flex justify-center mt-6 space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis with fade-in animation */}
        {!loading && analysis && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top row: Price info with gradient cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">💵</span>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    CURRENT
                  </div>
                </div>
                <div className="text-blue-100 text-sm font-medium mb-1">Last Price (Today)</div>
                <div className="text-4xl font-bold">${analysis.last_price}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">🔮</span>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    90 DAYS
                  </div>
                </div>
                <div className="text-purple-100 text-sm font-medium mb-1">Predicted Price</div>
                <div className="text-4xl font-bold">${analysis.predicted_price}</div>
              </div>

              <div className={`bg-gradient-to-br ${analysis.pct_change >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'} p-6 rounded-2xl shadow-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{analysis.pct_change >= 0 ? "📈" : "📉"}</span>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    CHANGE
                  </div>
                </div>
                <div className={`${analysis.pct_change >= 0 ? 'text-green-100' : 'text-red-100'} text-sm font-medium mb-1`}>
                  Percentage Change
                </div>
                <div className="text-4xl font-bold">
                  {analysis.pct_change >= 0 ? "+" : ""}
                  {analysis.pct_change.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Price Chart & Forecast</h2>
              </div>
              <Line
                key={analysis.data.length}
                data={{
                  labels,
                  datasets,
                }}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    annotation: {
                      annotations: predictedIndex > 0 ? {
                        forecastLine: {
                          type: "line",
                          xMin: labels[predictedIndex],
                          xMax: labels[predictedIndex],
                          borderColor: "red",
                          borderWidth: 2,
                          label: {
                            content: "Forecast Start",
                            enabled: true,
                            position: "top",
                          },
                        },
                      } : {},
                    },
                  },
                }}
              />
            </div>

            {/* Stats row with modern cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                  <div className="text-gray-600 font-semibold">Stock Score</div>
                </div>
                <div className="text-4xl font-bold text-gray-800">{analysis.stock_score.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-2">Historical Performance</div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-cyan-500 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <span className="text-3xl">🐦</span>
                  </div>
                  <div className="text-gray-600 font-semibold">Tweet Score</div>
                </div>
                <div className="text-4xl font-bold text-gray-800">{analysis.tweet_score.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-2">Social Sentiment</div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-amber-500 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <div className="text-gray-600 font-semibold">Final Score</div>
                </div>
                <div className="text-4xl font-bold text-gray-800">{analysis.final_score}</div>
                <div className="text-xs text-gray-500 mt-2">Overall Rating</div>
              </div>
            </div>

            {/* Recommendation & Risk with modern design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 ${
                analysis.recommendation === "Buy"
                  ? "bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200"
                  : analysis.recommendation === "Sell"
                  ? "bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-200"
                  : "bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-200"
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-xl shadow-lg ${
                    analysis.recommendation === "Buy"
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : analysis.recommendation === "Sell"
                      ? "bg-gradient-to-br from-red-400 to-rose-500"
                      : "bg-gradient-to-br from-yellow-400 to-amber-500"
                  }`}>
                    <span className="text-5xl">
                      {analysis.recommendation === "Buy" 
                        ? "🟢" 
                        : analysis.recommendation === "Sell" 
                        ? "🔴" 
                        : "🟡"}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-600">Our Recommendation</div>
                    <div className={`text-5xl font-bold mt-1 ${
                      analysis.recommendation === "Buy"
                        ? "text-green-700"
                        : analysis.recommendation === "Sell"
                        ? "text-red-700"
                        : "text-amber-700"
                    }`}>{analysis.recommendation}</div>
                  </div>
                </div>
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  analysis.recommendation === "Buy"
                    ? "bg-green-200/50 text-green-800"
                    : analysis.recommendation === "Sell"
                    ? "bg-red-200/50 text-red-800"
                    : "bg-amber-200/50 text-amber-800"
                }`}>
                  📊 Based on AI analysis and market trends
                </div>
              </div>

              <div className={`rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 ${
                analysis.risk === "Low"
                  ? "bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-200"
                  : analysis.risk === "Medium"
                  ? "bg-gradient-to-br from-orange-50 to-yellow-100 border-2 border-orange-200"
                  : "bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200"
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-xl shadow-lg ${
                    analysis.risk === "Low"
                      ? "bg-gradient-to-br from-blue-400 to-cyan-500"
                      : analysis.risk === "Medium"
                      ? "bg-gradient-to-br from-orange-400 to-yellow-500"
                      : "bg-gradient-to-br from-purple-400 to-pink-500"
                  }`}>
                    <span className="text-5xl">
                      {analysis.risk === "Low" 
                        ? "🛡️" 
                        : analysis.risk === "Medium" 
                        ? "⚠️" 
                        : "🚨"}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-600">Risk Assessment</div>
                    <div className={`text-5xl font-bold mt-1 ${
                      analysis.risk === "Low"
                        ? "text-blue-700"
                        : analysis.risk === "Medium"
                        ? "text-orange-700"
                        : "text-purple-700"
                    }`}>{analysis.risk}</div>
                  </div>
                </div>
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  analysis.risk === "Low"
                    ? "bg-blue-200/50 text-blue-800"
                    : analysis.risk === "Medium"
                    ? "bg-orange-200/50 text-orange-800"
                    : "bg-purple-200/50 text-purple-800"
                }`}>
                  📉 Volatility & market risk evaluation
                </div>
              </div>
            </div>

            {/* LLM Explanation with elegant design */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-200 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-indigo-100">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg">
                  <span className="text-4xl">💡</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    AI Analysis Summary
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Powered by Advanced Machine Learning</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-l-4 border-indigo-500">
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-indigo-700 font-bold" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 my-4" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-bold text-indigo-700 mt-6 mb-3" {...props} />,
                    }}
                  >
                    {analysis.explanation}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
              <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = `data:application/pdf;base64,${analysis.pdf_report}`;
                link.download = analysis.pdf_filename;
                link.click();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            >
              📄 Download Report
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

// Add this to your global CSS file (e.g., index.css or App.css)
/*
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
*/