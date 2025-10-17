import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function Settings({ user, refreshUser }) {
  const [username, setUsername] = useState(user.username);
  const [portfolio, setPortfolio] = useState(user.portfolio || []);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  // Fetch companies from backend
  useEffect(() => {
    axios.get("/companies") // create this endpoint in backend
      .then(res => setCompanies(res.data))
      .catch(err => console.error("Failed to fetch companies", err));
  }, []);

  const handlePortfolioChange = (index, field, value) => {
    const updated = [...portfolio];
    updated[index][field] = field === "quantity" ? Number(value) : value;
    setPortfolio(updated);
  };

  const addPortfolioItem = () => {
    setPortfolio([...portfolio, { companyId: "", quantity: 0, purchaseDate: new Date().toISOString().slice(0,10) }]);
  };

  const removePortfolioItem = (index) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        "/user/update",
        { username, portfolio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      refreshUser();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const colorPalette = [
    { bg: "bg-gradient-to-r from-blue-50 to-cyan-50", border: "border-l-4 border-blue-400", label: "text-blue-600", icon: "🔵" },
    { bg: "bg-gradient-to-r from-purple-50 to-pink-50", border: "border-l-4 border-purple-400", label: "text-purple-600", icon: "🟣" },
    { bg: "bg-gradient-to-r from-green-50 to-emerald-50", border: "border-l-4 border-green-400", label: "text-green-600", icon: "🟢" },
    { bg: "bg-gradient-to-r from-orange-50 to-yellow-50", border: "border-l-4 border-orange-400", label: "text-orange-600", icon: "🟠" },
    { bg: "bg-gradient-to-r from-rose-50 to-pink-50", border: "border-l-4 border-rose-400", label: "text-rose-600", icon: "🌹" },
    { bg: "bg-gradient-to-r from-indigo-50 to-blue-50", border: "border-l-4 border-indigo-400", label: "text-indigo-600", icon: "🟦" },
  ];

  return (
    <div className="min-h-screen bg-white p-0 m-0 w-full">
      {/* Header */}
      <div className="p-8 w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">⚙️ Settings</h2>
          <p className="text-gray-600 mt-2 text-lg">Manage your profile and portfolio</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Section */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-400 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <label className="block font-bold text-cyan-700 text-sm uppercase tracking-wide mb-3">👤 Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-cyan-300 p-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition bg-white"
                required
              />
            </div>

            {/* Unified Portfolio Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition hover:shadow-xl">
              {/* Portfolio Header */}
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-4 text-white">
                <h3 className="text-3xl font-bold flex items-center">
                  📈 Portfolio
                  <span className="ml-2 text-purple-100 text-sm font-medium">({portfolio.length} holdings)</span>
                </h3>
                <p className="text-purple-100 text-sm mt-1">Add or edit your stock holdings</p>
              </div>

              {/* Portfolio Content */}
              <div className="p-6">
                {portfolio.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-purple-600 text-xl font-bold">📭 No portfolio items yet</p>
                    <p className="text-purple-500 text-sm mt-2">Click "Add Company" below to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolio.map((item, idx) => {
                      // Lock to first color (blue) for all boxes; change index to cycle if preferred
                      const colors = colorPalette[0];
                      return (
                        <div key={idx} className={`${colors.bg} ${colors.border} rounded-lg p-5 shadow-sm hover:shadow-md transition border border-gray-100`}>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div>
                              <label className={`${colors.label} block font-semibold text-xs uppercase tracking-wide mb-2`}>{colors.icon} Company</label>
                              <select
                                value={item.companyId}
                                onChange={(e) => handlePortfolioChange(idx, "companyId", e.target.value)}
                                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white font-medium text-gray-700"
                                required
                              >
                                <option value="">Select Company</option>
                                {companies.map((c) => (
                                  <option key={c.ticker} value={c.ticker}>
                                    {c.name} ({c.ticker})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-gray-700 block font-semibold text-xs uppercase tracking-wide mb-2">Quantity</label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handlePortfolioChange(idx, "quantity", e.target.value)}
                                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white font-medium text-gray-700"
                                min="0"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-gray-700 block font-semibold text-xs uppercase tracking-wide mb-2">Purchase Date</label>
                              <input
                                type="date"
                                value={item.purchaseDate}
                                onChange={(e) => handlePortfolioChange(idx, "purchaseDate", e.target.value)}
                                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white font-medium text-gray-700"
                                required
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removePortfolioItem(idx)}
                                className="px-3 py-2 bg-gradient-to-r from-red-400 to-rose-400 text-white font-semibold text-sm rounded-lg hover:from-red-500 hover:to-rose-500 transition shadow-md hover:shadow-lg"
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Add Company and Save Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              <button
                type="button"
                onClick={addPortfolioItem}
                className="px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition shadow-md hover:shadow-lg text-base"
              >
                ➕ Add Company
              </button>

              <button
                type="submit"
                className={`px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-semibold rounded-lg hover:from-green-500 hover:to-emerald-500 transition shadow-md hover:shadow-lg text-base ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "💾 Updating..." : "✓ Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}