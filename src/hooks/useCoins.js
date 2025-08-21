import { useEffect, useState } from "react";
import { fetchCoins } from "../services/tradeService";

export default function useCoins() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchCoins();
      setCoins(data);
      setLoading(false);
    };

    load();
    const interval = setInterval(load, 30000); // refresh 30s
    return () => clearInterval(interval);
  }, []);

  return { coins, loading };
}
