import { createContext, useEffect, useState } from "react";
import coinCollections from "src/api/coin-collections";

export const CoinContext = createContext();

function getDeepFilterOptions(arr, filter) {
  let options = [];
  arr?.forEach((coin) => {
    if (
      !options.includes(coin?.attributes?.[filter]?.data?.attributes?.[filter]) &&
      coin?.attributes?.[filter]?.data?.attributes?.[filter] !== undefined &&
      coin?.attributes?.[filter]?.data?.attributes?.[filter] !== "Uncertain"
    ) {
      options.push(coin?.attributes?.[filter]?.data?.attributes?.[filter]);
    }
  });
  return options;
}

export const CoinContextProvider = ({ children }) => {
  const [coinsData, setCoinsData] = useState(
    JSON.parse(sessionStorage.getItem("coins")) || null
  );
  const [coinsKeyTerms, setCoinKeyTerms] = useState(
    JSON.parse(sessionStorage.getItem("coinskeyTerms")) || null
  );

  const fetchCoinData = async () => {
    const res = await coinCollections.coinCollection();
    setCoinsData(res?.data?.data || []);

    const rows = res?.data?.data || [];

    let options = {
      material: getDeepFilterOptions(rows, "material"),
      mint: getDeepFilterOptions(rows, "mint"),
      issuing_authority: getDeepFilterOptions(rows, "issuing_authority"),
      governing_power: getDeepFilterOptions(rows, "governing_power"),
      language: getDeepFilterOptions(rows, "language"),
      ancient_territory: getDeepFilterOptions(rows, "ancient_territory"),
    };

    setCoinKeyTerms(options);
  };

  useEffect(() => {
    sessionStorage.setItem("coins", JSON.stringify(coinsData));
    sessionStorage.setItem("coinskeyTerms", JSON.stringify(coinsKeyTerms));
  }, [coinsData, coinsKeyTerms]);

  return (
    <CoinContext.Provider value={{ coinsData, coinsKeyTerms, fetchCoinData }}>
      {children}
    </CoinContext.Provider>
  );
};