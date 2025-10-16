import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-5xl font-bold mb-10">FinTweet</h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
