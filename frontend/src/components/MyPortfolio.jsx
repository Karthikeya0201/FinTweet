// src/pages/MyPortfolio.jsx
import React from "react";

export default function MyPortfolio({ user }) {
  const portfolio = user?.portfolio || [];

  // Calculate total profit safely
  const totalProfit = user?.profit ?? 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📊 My Portfolio</h2>

      {portfolio.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Company</th>
                <th className="border px-4 py-2">Ticker</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Purchase Date</th>
                <th className="border px-4 py-2">Purchase Price</th>
                <th className="border px-4 py-2">Current Price</th>
                <th className="border px-4 py-2">Profit/Share</th>
                <th className="border px-4 py-2">Total Profit</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item, idx) => {
                const profitPerShare = item.profitPerShare ?? 0;
                const totalItemProfit = item.totalProfit ?? 0;
                const isProfit = totalItemProfit >= 0;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="border px-4 py-2">{item.companyName}</td>
                    <td className="border px-4 py-2">{item.companyId}</td>
                    <td className="border px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border px-4 py-2">
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      ${item.purchasePrice?.toFixed(2) ?? "-"}
                    </td>
                    <td className="border px-4 py-2">
                      ${item.currentPrice?.toFixed(2) ?? "-"}
                    </td>
                    <td
                      className={`border px-4 py-2 font-semibold ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {profitPerShare >= 0 ? "+" : "-"}$
                      {Math.abs(profitPerShare).toFixed(2)}
                    </td>
                    <td
                      className={`border px-4 py-2 font-semibold ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {totalItemProfit >= 0 ? "+" : "-"}$
                      {Math.abs(totalItemProfit).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Total summary */}
          <div className="mt-6 text-lg font-semibold">
            Total Portfolio Profit:{" "}
            <span
              className={
                totalProfit >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {totalProfit >= 0 ? "+" : "-"}$
              {Math.abs(totalProfit).toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No portfolio items yet.</p>
      )}
    </div>
  );
}
