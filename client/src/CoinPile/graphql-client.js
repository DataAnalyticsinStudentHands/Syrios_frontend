import React, { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import "./coinpile.css";
import { motion } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import Materials from "./Filters/material";
import TypeCategory from "./Filters/typeCategory";
import Dates from "./Filters/date";
import Authority from "./Filters/authority";
import GQL_COINS from "./Gql-Schemas/coins-schema";
import GQL_COIN from "./Gql-Schemas/coin-schema";

const GQL_Client = () => {
  const [Materialfilter, setMaterialFilter] = useState("");
  const [Authorityfilter, setAuthorityFilter] = useState("");
  const [Datefilter, setDateFilter] = useState("");
  const [Typefilter, setTypeFilter] = useState("");

  const [show, setShow] = useState();

  const GET_COINS = GQL_COINS;    // imported, returns all 850 coins
  const GET_COIN = GQL_COIN;  // imported, returns detailed info of 1 coin

  const { loading, error, data } = useQuery(GET_COINS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( ${error.message}</p>;

  // const ReturnCoins = () => {
  //   return data.coins.map(({ _id, obverseFile, Diameter }) => <div></div>);
  // };

  function ReturnCoinByID(id) {
    return console.log(id);
  }

  const handleMaterialFilterChange = (el) => {
    setMaterialFilter(el.target.value);
  };

  const handleAuthorityFilterChange = (el) => {
    setAuthorityFilter(el.target.value);
  };

  const handleDateFilterChange = (el) => {
    setDateFilter(el.target.value);
  };

  const handleTypeFilterChange = (el) => {
    setTypeFilter(el.target.value);
  };

  const filteredResults = data.coins.filter(
    (item) =>
      item.Material.toLowerCase().includes(Materialfilter.toLowerCase()) &&
      item.IssuingAuthority.toLowerCase().includes(
        Authorityfilter.toLowerCase()
      ) &&
      item.Date.toLowerCase().includes(Datefilter.toLowerCase()) &&
      item.TypeCategory.toLowerCase().includes(Typefilter.toLowerCase())
  );

  const uniqMaterial = Materials,
    MaterialList = function(X) {
      return <option>{X}</option>;
    };

  const uniqAuthority = Authority,
    AuthorityList = function(X) {
      return <option>{X}</option>;
    };

  const uniqType = TypeCategory,
    TypeList = function(X) {
      return <option>{X}</option>;
    };

  const uniqDate = Dates,
    DateList = function(X) {
      return <option>{X}</option>;
    };

  const clearFilters = () => {
    setMaterialFilter("");
    setAuthorityFilter("");
    setDateFilter("");
    setTypeFilter("");
  };

  function CoinDetails({ id }) {
    // const [getDog, { loading, data }] = useLazyQuery(GET_DOG_PHOTO);
    const { loading, error, data } = useQuery(GET_COIN, {
      variables: { id },
    });
  
    if (loading) return null;
    if (error) return `Error! ${error}`;
  
    return (
      console.log(data.coin.id)
      // <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
    );
  } 

  return (
    <div className="grid-containter">
      <div className="align-select-boxes">
        <div>
          <h3>Material</h3>
          <select
            className="custom-select"
            value={Materialfilter}
            onChange={handleMaterialFilterChange}
          >
            {uniqMaterial.map(MaterialList)}
          </select>
        </div>
        <div>
          <div>
            <h3>Authority</h3>
            <select
              className="custom-select"
              value={Authorityfilter}
              onChange={handleAuthorityFilterChange}
            >
              {uniqAuthority.map(AuthorityList)}
            </select>
          </div>
        </div>
        <div>
          <h3>Date</h3>
          <select
            className="custom-select"
            value={Datefilter}
            onChange={handleDateFilterChange}
          >
            {uniqDate.map(DateList)}
          </select>
        </div>
        <div>
          <h3>Type</h3>
          <select
            className="custom-select"
            value={Typefilter}
            onChange={handleTypeFilterChange}
          >
            {uniqType.map(TypeList)}
          </select>
        </div>
        <div>
          <Button
            onClick={clearFilters}
            variant="dark"
            style={{ width: "130px" }}
          >
            CLEAR
          </Button>
        </div>
      </div>
      <div className="class-coinpile">
        {filteredResults.map((coin) => (
          <React.Fragment key={coin._id}>
            <motion.input
              type="image"
              key={coin._id}
              alt="Coin"
              src={coin.obverseFile}
              whileHover={{ scale: 7 }}
              style={{
                height: coin.Diameter * 2,
                width: coin.Diameter * 2,
              }}
              onClick={() => CoinDetails({ variables: { id: coin._id } })}
              whileTap={{ scale: 4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              drag
              dragConstraints={{
                top: -650,
                left: -650,
                right: 650,
                bottom: 650,
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GQL_Client;
