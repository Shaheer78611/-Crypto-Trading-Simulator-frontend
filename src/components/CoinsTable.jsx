import React from "react";

export default function CoinsTable({ coins, loading, onTrade }) {
  if (loading) return <p>Loading coins...</p>;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Coins</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Coin</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">${c.price}</td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => onTrade(c, "BUY")}
                >
                  Buy
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => onTrade(c, "SELL")}
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
