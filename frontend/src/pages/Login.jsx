import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/login", form);
      const token = res.data.access_token;
      if (token) {
        // Store token and email
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", form.email);
      }
      alert("Login successful!");
      navigate("/dashboard"); // redirect
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.detail || "Login failed. Check email/password.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className={`w-full py-2 bg-blue-500 text-white font-semibold rounded mt-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
