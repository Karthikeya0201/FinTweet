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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Settings ⚙️</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <h3 className="text-xl font-semibold mt-4">Portfolio</h3>
        {portfolio.map((item, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-4 items-end mt-2">
            <div>
              <label>Company</label>
              <select
                value={item.companyId}
                onChange={(e) => handlePortfolioChange(idx, "companyId", e.target.value)}
                className="w-full border p-2 rounded"
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
              <label>Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handlePortfolioChange(idx, "quantity", e.target.value)}
                className="w-full border p-2 rounded"
                min="0"
                required
              />
            </div>
            <div>
              <label>Purchase Date</label>
              <input
                type="date"
                value={item.purchaseDate}
                onChange={(e) => handlePortfolioChange(idx, "purchaseDate", e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <button type="button" onClick={() => removePortfolioItem(idx)} className="px-2 py-1 bg-red-500 text-white rounded">
                Remove
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addPortfolioItem} className="px-4 py-2 bg-blue-500 text-white rounded mt-2">
          Add Company
        </button>

        <button
          type="submit"
          className={`px-6 py-2 bg-green-500 text-white rounded mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
