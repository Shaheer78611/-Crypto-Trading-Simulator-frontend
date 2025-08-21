export const getPortfolio = async () => {
  // mock backend call
  return { funds: 1000, trades: [] };
};

export const addFundsAPI = async (amount) => {
  console.log("Adding funds:", amount);
};

export const placeTradeAPI = async (trade) => {
  console.log("Placing trade:", trade);
};
