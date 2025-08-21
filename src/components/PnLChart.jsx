import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function PnLChart({ trades }) {
  const data = trades.map((t, i) => ({
    name: `Trade ${i + 1}`,
    pnl: t.type === "SELL" ? t.qty * t.price : -t.qty * t.price,
  }));

  return (
    <div className="p-4 border rounded h-72">
      <h2 className="text-xl font-bold mb-2">Profit & Loss</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pnl" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
