import React from "react";

export default function Analytics({ trades }) {
  const profit = trades
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.qty * t.price, 0);

  const spent = trades
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.qty * t.price, 0);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">Analytics</h2>
      <p>Total Spent: ${spent}</p>
      <p>Total Profit: ${profit}</p>
      <p>Net: ${profit - spent}</p>
    </div>
  );
}
