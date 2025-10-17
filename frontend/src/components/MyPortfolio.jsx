import React, { useState } from "react";
import StockChart from "../components/StockChart";

export default function MyPortfolio({ user }) {
    const portfolio = user?.portfolio || [];
    const totalProfit = user?.profit ?? 0;

    const [selectedCompanyId, setSelectedCompanyId] = useState(portfolio[0]?.companyId || "");

    const selectedPortfolioItem = portfolio.find((p) => p.companyId === selectedCompanyId);

    return (
        <div className="p-6 bg-white min-h-screen">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">📊 My Portfolio</h2>

            {/* Portfolio Table */}
            {portfolio.length > 0 ? (
                <div className="space-y-6">
                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-md">
                            <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Total Holdings</p>
                            <p className="text-3xl font-bold text-blue-700 mt-2">{portfolio.length}</p>
                        </div>
                        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 shadow-md">
                            <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide">Portfolio Value</p>
                            <p className="text-3xl font-bold text-purple-700 mt-2">${portfolio.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0).toFixed(2)}</p>
                        </div>
                        <div className={`${totalProfit >= 0 ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"} rounded-lg p-4 shadow-md`}>
                            <p className={`${totalProfit >= 0 ? "text-green-600" : "text-red-600"} text-xs font-semibold uppercase tracking-wide`}>Total Profit</p>
                            <p className={`text-3xl font-bold mt-2 ${totalProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                                {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full border-collapse bg-white">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                                    <th className="border px-4 py-3 text-left font-semibold">Company</th>
                                    <th className="border px-4 py-3 text-left font-semibold">Ticker</th>
                                    <th className="border px-4 py-3 text-center font-semibold">Quantity</th>
                                    <th className="border px-4 py-3 text-left font-semibold">Purchase Date</th>
                                    <th className="border px-4 py-3 text-right font-semibold">Purchase Price</th>
                                    <th className="border px-4 py-3 text-right font-semibold">Current Price</th>
                                    <th className="border px-4 py-3 text-right font-semibold">Profit/Share</th>
                                    <th className="border px-4 py-3 text-right font-semibold">Total Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.map((item, idx) => {
                                    const profitPerShare = item.profitPerShare ?? 0;
                                    const totalItemProfit = item.totalProfit ?? 0;
                                    const isProfit = totalItemProfit >= 0;
                                    const rowBgColors = [
                                        "bg-blue-50",
                                        "bg-purple-50",
                                        "bg-pink-50",
                                        "bg-green-50",
                                        "bg-yellow-50",
                                        "bg-indigo-50"
                                    ];

                                    return (
                                        <tr key={idx} className={`${rowBgColors[idx % 6]} hover:${rowBgColors[idx % 6].replace("50", "100")} transition duration-150 border-b`}>
                                            <td className="border px-4 py-3 font-semibold text-gray-800">{item.companyName}</td>
                                            <td className="border px-4 py-3 font-bold text-gray-700">{item.companyId}</td>
                                            <td className="border px-4 py-3 text-center font-semibold text-gray-700">{item.quantity}</td>
                                            <td className="border px-4 py-3 text-gray-600">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                            <td className="border px-4 py-3 text-right text-gray-700">${item.purchasePrice?.toFixed(2) ?? "-"}</td>
                                            <td className="border px-4 py-3 text-right font-semibold text-gray-800">${item.currentPrice?.toFixed(2) ?? "-"}</td>
                                            <td className={`border px-4 py-3 text-right font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                                                {profitPerShare >= 0 ? "+" : "-"}${Math.abs(profitPerShare).toFixed(2)}
                                            </td>
                                            <td className={`border px-4 py-3 text-right font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                                                {totalItemProfit >= 0 ? "+" : "-"}${Math.abs(totalItemProfit).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Profit Block */}
                    <div className={`${totalProfit >= 0 ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500" : "bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500"} rounded-lg p-6 shadow-lg mt-6`}>
                        <p className={`${totalProfit >= 0 ? "text-green-600" : "text-red-600"} text-sm font-semibold uppercase tracking-wide mb-2`}>Total Portfolio Profit</p>
                        <p className={`text-4xl font-bold ${totalProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                            {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit).toFixed(2)}
                        </p>
                    </div>

                    <div className="pt-5 space-y-4">
                        {/* Select company for chart */}
                        {portfolio.length > 0 && (
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-300 shadow-md">
                                <label className="font-semibold text-indigo-700 mr-4 block mb-3">Select Company:</label>
                                <select
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                    className="border-2 border-indigo-400 p-3 rounded-lg font-medium text-gray-700 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white"
                                >
                                    {portfolio.map((p) => (
                                        <option key={p.companyId} value={p.companyId}>
                                            {p.companyName} ({p.companyId})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Chart + Stats */}
                        {selectedPortfolioItem && (
                            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6 border-2 border-purple-300 shadow-md">
                                <StockChart company={selectedCompanyId} portfolioItem={selectedPortfolioItem} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-lg">No portfolio items yet.</p>
            )}
        </div>
    );
}