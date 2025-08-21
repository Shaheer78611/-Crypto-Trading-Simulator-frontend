import React from "react";
import FundsSection from "../../components/FundsSection.jsx";
import TradesTable from "../../components/TradesTable";
import CoinsTable from "../../components/CoinsTable";
import Analytics from "../../components/Analytics";
import PnLChart from "../../components/PnLChart";

import usePortfolio from "../../hooks/usePortfolio.js";
import useCoins from "../../hooks/useCoins.js";

export default function Home() {
  const { funds, trades, addFunds, placeTrade } = usePortfolio();
  const { coins, loading } = useCoins();

  return (
    <div className="p-6 space-y-6">
      <FundsSection funds={funds} onAddFunds={addFunds} />
      <Analytics trades={trades} />
      <PnLChart trades={trades} />
      <CoinsTable coins={coins} loading={loading} onTrade={placeTrade} />
      <TradesTable trades={trades} />
    </div>
  );
}
