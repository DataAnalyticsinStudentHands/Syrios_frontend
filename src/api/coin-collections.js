import axios from "axios";
import qs from "qs";

const coinCollectionsRequest = {
  // Equivalent of “all coins used by CoinSort”
  fetchAllForCoinSort: () => {
    const query = qs.stringify(
      {
        filters: {
          appear_catalog_pile: true, // same idea as your earlier filter
        },
        populate: {
          obverse_image: true,
          reverse_image: true,
          mint: true,
          material: true,
          denomination: true,
          issuing_authority: true,
          governing_power: true,
          ancient_territory: true,
          type_categories: true,
          language: true,
        },
        pagination: { page: 1, pageSize: 2147483647 },
      },
      { encodeValuesOnly: true }
    );

    return axios.get(`${process.env.REACT_APP_strapiURL}/api/coin-collections?${query}`);
  },

  fetchCoinSortConfig: () => {
    // keep using what you already have, unless you want a new config entry
    return axios.get(`${process.env.REACT_APP_strapiURL}/api/coin-sort?populate=*`);
  },
};

export default coinCollectionsRequest;
