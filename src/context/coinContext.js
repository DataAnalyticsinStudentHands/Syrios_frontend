import { createContext, useEffect, useState } from "react";
import coinCollections from "src/api/coin-collections";
export const CoinContext = createContext();

function getDeepFilterOptions(arr, filter){
    let options;
    arr?.forEach((coin)=>{
        if (!options.includes(coin?.attributes[filter]?.data?.attributes[filter]) && 
            coin?.attributes[filter]?.data?.attributes[filter] !== undefined &&
            coin?.attributes[filter]?.data?.attributes[filter] !== 'Uncertain'
            ){
            options.push(coin?.attributes?.[filter]?.data?.attributes[filter])
        }
    })
    return options
}

export const CoinContextProvider = ({ children }) => {
    const [coinsData, setCoinsData] = useState(
        JSON.parse(localStorage.getItem("coins")) || null
    );
    const [coinsKeyTerms, setCoinKeyTerms] = useState(
        JSON.parse(localStorage.getItem("coinskeyTerms")) || null
    );

    const fetchCoinData = async () => {
        const res = await coinCollections.coinCollection();
        setCoinsData(res.data.data);

        let options = {
          material:getDeepFilterOptions(res.data.data, 'material'),
          mint:getDeepFilterOptions(res.data.data,'mint'),
          issuing_authority: getDeepFilterOptions(res.data.data,'issuing_authority'),
          governing_power: getDeepFilterOptions(res.data.data,'governing_power'),
          language: getDeepFilterOptions(res.data.data,'language'),
          ancient_territory: getDeepFilterOptions(res.data.data,'ancient_territory'),
      }
      setCoinKeyTerms(options)
    }

  useEffect(() => {
    localStorage.setItem("coins", JSON.stringify(coinsData));
    localStorage.setItem("coinskeyTerms", JSON.stringify(coinsKeyTerms));
  }, [coinsData, coinsKeyTerms]);

  return (
    <CoinContext.Provider value={{ coinsData, coinsKeyTerms, fetchCoinData }}>
      {children}
    </CoinContext.Provider>
  );
};
