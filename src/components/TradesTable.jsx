import React from "react";

export default function TradesTable({ trades }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Trades</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Coin</th>
            <th className="p-2">Type</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{t.coin}</td>
              <td className="p-2">{t.type}</td>
              <td className="p-2">{t.qty}</td>
              <td className="p-2">${t.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
