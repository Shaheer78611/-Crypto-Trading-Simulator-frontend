// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const { user } = useUser();
  const clerkId = user?.id;

  const [funds, setFunds] = useState(0);
  const [fundsToAdd, setFundsToAdd] = useState("");
  const [trades, setTrades] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [pnlData, setPnlData] = useState([]); // chart data
  const [stats, setStats] = useState({}); // trade stats

  // Fetch portfolio (balance + trades)
  const fetchPortfolio = async () => {
    if (!clerkId) return;
    try {
      const res = await fetch(`http://localhost:5000/portfolio/${clerkId}`);
      const data = await res.json();
      setFunds(Number(data.balance || 0));
      setTrades(data.trades || []);
      calculateStats(data.trades || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    }
  };

  // Fetch coins
  const fetchCoins = async () => {
    try {
      const res = await fetch("https://api.coinpaprika.com/v1/tickers?limit=10");
      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.error("Error fetching coins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!clerkId) return;

  fetchPortfolio();
  fetchCoins();

  const interval = setInterval(() => {
    fetchCoins(); // refresh coin data
  }, 30000); // refresh every 30 sec

  return () => clearInterval(interval); // cleanup on unmount
}, [clerkId]);

  // Add funds
  const handleAddFunds = async () => {
    if (!fundsToAdd || !clerkId) return;
    try {
      const res = await fetch("http://localhost:5000/funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: clerkId,
          amount: Number(fundsToAdd),
        }),
      });
      const data = await res.json();
      setFunds(Number(data.balance || 0));
      setFundsToAdd("");
    } catch (err) {
      console.error("Error adding funds:", err);
    }
  };

  // Place trade
  const handleTrade = async (coin, type) => {
    const quantity = Number(quantities[coin.id] || 1);
    if (quantity <= 0) return alert("Quantity must be greater than 0");
    try {
      const res = await fetch("http://localhost:5000/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: clerkId,
          coin_id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.quotes.USD.price,
          quantity,
          type,
        }),
      });
      const data = await res.json();
      console.log("Trade response:", data);
      fetchPortfolio();
    } catch (err) {
      console.error("Error executing trade:", err);
    }
  };

  // Calculate stats & PnL data
  const calculateStats = (trades) => {
    if (!trades.length) {
      setStats({});
      setPnlData([]);
      return;
    }

    const now = new Date();
    const daily = trades.filter((t) => new Date(t.created_at).toDateString() === now.toDateString());
    const monthly = trades.filter(
      (t) => new Date(t.created_at).getMonth() === now.getMonth() && new Date(t.created_at).getFullYear() === now.getFullYear()
    );
    const yearly = trades.filter((t) => new Date(t.created_at).getFullYear() === now.getFullYear());

    let profitTrades = 0;
    let lossTrades = 0;
    let pnlHistory = [];

    trades.forEach((t, i) => {
      // Example PnL calc: random profit/loss placeholder until backend gives actual realized PnL
      const pnl = (t.type === "sell" ? 1 : -1) * (Math.random() * 50 - 25); 
      if (pnl >= 0) profitTrades++;
      else lossTrades++;

      pnlHistory.push({
        name: `Trade ${i + 1}`,
        pnl,
      });
    });

    setStats({
      today: daily.length,
      month: monthly.length,
      year: yearly.length,
      profitTrades,
      lossTrades,
    });
    setPnlData(pnlHistory);
  };

  useEffect(() => {
    if (clerkId) {
      fetchPortfolio();
      fetchCoins();
    }
  }, [clerkId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crypto Trading Dashboard</h1>
        <SignOutButton>
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
            Sign Out
          </button>
        </SignOutButton>
      </div>

      {/* Funds Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Funds</h2>
        <p className="mb-2">
          Balance: <span className="font-bold">${Number(funds).toFixed(2)}</span>
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter amount"
            value={fundsToAdd}
            onChange={(e) => setFundsToAdd(e.target.value)}
            className="p-2 rounded bg-gray-700 flex-1"
          />
          <button
            onClick={handleAddFunds}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            Add Funds
          </button>
        </div>
      </div>

      {/* Trades Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">My Trades</h2>
        {trades.length === 0 ? (
          <p>No trades yet</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Coin</th>
                <th className="p-2">Type</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td className="p-2">{trade.name}</td>
                  <td className="p-2 capitalize">{trade.type}</td>
                  <td className="p-2">{trade.quantity}</td>
                  <td className="p-2">${Number(trade.price).toFixed(2)}</td>
                  <td className="p-2">{trade.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Coins Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Available Coins</h2>
        {loading ? (
          <p>Loading coins...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Coin</th>
                <th className="p-2">Price (USD)</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id}>
                  <td className="p-2">
                    {coin.name} ({coin.symbol})
                  </td>
                  <td className="p-2">${coin.quotes.USD.price.toFixed(2)}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="1"
                      value={quantities[coin.id] || ""}
                      onChange={(e) =>
                        setQuantities({ ...quantities, [coin.id]: e.target.value })
                      }
                      placeholder="Qty"
                      className="w-20 p-1 rounded bg-gray-700"
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleTrade(coin, "buy")}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleTrade(coin, "sell")}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Analytics Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        {trades.length === 0 ? (
          <p>No trade data to analyze</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">Trades Today</p>
                <p className="text-xl font-bold">{stats.today}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">Trades This Month</p>
                <p className="text-xl font-bold">{stats.month}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">Trades This Year</p>
                <p className="text-xl font-bold">{stats.year}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">Profitable Trades</p>
                <p className="text-xl font-bold text-green-400">{stats.profitTrades}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">Losing Trades</p>
                <p className="text-xl font-bold text-red-400">{stats.lossTrades}</p>
              </div>
            </div>

            {/* PnL Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={pnlData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pnl" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
