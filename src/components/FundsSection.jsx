import React, { useState } from "react";

export default function FundsSection({ funds, onAddFunds }) {
  const [amount, setAmount] = useState("");

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">Funds: ${funds}</h2>
      <div className="mt-2 flex gap-2">
        <input
          type="number"
          placeholder="Add Funds"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            onAddFunds(Number(amount));
            setAmount("");
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
