import React, { useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import "./coinpile.css";
import { motion } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import Materials from "./Filters/material";
import TypeCategory from "./Filters/typeCategory";
import Dates from "./Filters/date";
import Authority from "./Filters/authority";
// import { ApolloProvider, useQuery } from "@apollo/react-hooks";

const GQL_Client = () => {
  const [Materialfilter, setMaterialFilter] = useState("");
  const [Authorityfilter, setAuthorityFilter] = useState("");
  const [Datefilter, setDateFilter] = useState("");
  const [Typefilter, setTypeFilter] = useState("");
  const GET_COINS = gql`
    {
      coins {
        id
        Title
        Bibliography
        ReverseType
        Image
        Region
        Mint
        State
        Date
        FromDate
        ToDate
        Material
        Denomination
        ObverseLegend
        ReverseLegend
        SourceImage
        RightsHolder
        ObverseType
        TypeCategory
        IssuingAuthority
        Diameter
        Era
        Diameter
        obverseFile
        reverseFile
      }
    }
  `;

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
              onClick={() => ReturnCoinByID(coin._id)}
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
