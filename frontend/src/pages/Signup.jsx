// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post["Content-Type"] = "application/json";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        portfolio: [{ company: "", quantity: 0, purchaseDate: "" }],
        useToday: true,
    });

    const [companies, setCompanies] = useState([]);

    // Fetch companies from backend
    useEffect(() => {
    axios.get("/companies")
        .then((res) => {
            // Ensure res.data is an array
            if (Array.isArray(res.data)) {
                console.log("Fetched companies:", res.data);
                setCompanies(res.data);
            } else if (res.data.companies && Array.isArray(res.data.companies)) {
               
                setCompanies(res.data.companies);
            } else {
                console.log("kjdna");

                setCompanies([]); // fallback
            }
        })
        .catch((err) => {
            console.error("Failed to fetch companies:", err);
            setCompanies([]); // fallback
        });
}, []);


    const handleChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        if (name === "useToday") {
            setForm({ ...form, useToday: checked });
        } else if (["company", "quantity", "purchaseDate"].includes(name)) {
            const newPortfolio = [...form.portfolio];
            newPortfolio[index][name] = type === "number" ? Number(value) : value;
            setForm({ ...form, portfolio: newPortfolio });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const addPortfolioItem = () => {
        setForm({
            ...form,
            portfolio: [...form.portfolio, { company: "", quantity: 0, purchaseDate: "" }],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.post("/register", form); // FastAPI register endpoint
            console.log(res.data);
            alert("Registered successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.detail) {
                alert(`Error: ${err.response.data.detail}`);
            } else {
                alert("Error submitting form");
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
            <h2 className="text-2xl font-bold mb-4">Register & Add Portfolio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <h3 className="text-xl font-semibold mt-4">Portfolio</h3>
                {form.portfolio.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-4 items-end mt-2">
                        <div>
                            <label>Company</label>
                            <select
                                name="company"
                                value={item.company}
                                onChange={(e) => handleChange(e, idx)}
                                className="w-full border p-2 rounded"
                                required
                            >
                                <option value="">Select</option>
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
                                name="quantity"
                                value={item.quantity}
                                onChange={(e) => handleChange(e, idx)}
                                className="w-full border p-2 rounded"
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label>Purchase Date</label>
                            <input
                                type="date"
                                name="purchaseDate"
                                value={item.purchaseDate}
                                onChange={(e) => handleChange(e, idx)}
                                className="w-full border p-2 rounded"
                                disabled={form.useToday}
                            />
                        </div>
                    </div>
                ))}

                <div className="mt-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="useToday"
                            checked={form.useToday}
                            onChange={handleChange}
                        />
                        <span>Use today's date for all purchases</span>
                    </label>
                </div>

                <button
                    type="button"
                    onClick={addPortfolioItem}
                    className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                >
                    Add Another Company
                </button>

                <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded mt-4"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
