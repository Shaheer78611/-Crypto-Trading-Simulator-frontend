import { useState } from "react";
import { getPortfolio, addFundsAPI, placeTradeAPI } from "../services/portfolioService";

export default function usePortfolio() {
  const [funds, setFunds] = useState(1000); // initial mock
  const [trades, setTrades] = useState([]);

  const addFunds = (amount) => {
    setFunds((f) => f + amount);
    addFundsAPI(amount); // backend call
  };

  const placeTrade = (coin, type) => {
    const trade = { coin: coin.name, type, qty: 1, price: coin.price };
    setTrades((t) => [...t, trade]);
    placeTradeAPI(trade); // backend call
  };

  return { funds, trades, addFunds, placeTrade };
}
