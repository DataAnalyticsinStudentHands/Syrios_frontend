import React, { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import "./coinpile.css";
import { motion } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import Materials from "./Filters/material";
import TypeCategory from "./Filters/typeCategory";
import Dates from "./Filters/date";
import Authority from "./Filters/authority";
import GET_COINS from "./Gql-Schemas/coins-schema";
import GET_COIN from "./Gql-Schemas/coin-schema";

const GQL_Client = () => {
  const [show, setShow] = useState(false);

  const { loading, error, data } = useQuery(GET_COINS); // Get data from "coins" query

  // get data from "coin" query
  const [GetCoin, { data: coinData, loading: coinLoading }] = useLazyQuery(
    GET_COIN
  );
  const { coin = {} } = coinData || {};

  const [Materialfilter, setMaterialFilter] = useState("");
  const [Authorityfilter, setAuthorityFilter] = useState("");
  const [Datefilter, setDateFilter] = useState("");
  const [Typefilter, setTypeFilter] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( ${error.message}</p>;

  // HANDLE COINS WITH 4 FILTERS
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

  //Filtered Results from 4 filters
  const filteredResults = data.coins.filter(
    (item) =>
      item.Material.toLowerCase().includes(Materialfilter.toLowerCase()) &&
      item.IssuingAuthority.toLowerCase().includes(
        Authorityfilter.toLowerCase()
      ) &&
      item.Date.toLowerCase().includes(Datefilter.toLowerCase()) &&
      item.TypeCategory.toLowerCase().includes(Typefilter.toLowerCase())
  );

  // Select boxes of 4 filters
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

  // Clear filter
  const clearFilters = () => {
    setMaterialFilter("");
    setAuthorityFilter("");
    setDateFilter("");
    setTypeFilter("");
  };

  // Function to fetch details of each coin passing the parameter id
  function CoinDetails(id) {
    try {
      GetCoin({ variables: { id } });
      setShow(true);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="grid-containter">
      <div className="row top-buffer-1">
        <div className="col-md-9">
          <div className="class-coinpile">
            {filteredResults.map((coin) => (
              <React.Fragment key={coin.id}>
                <motion.input
                  type="image"
                  key={coin.id}
                  alt="Coin"
                  src={coin.obverseFile}
                  whileHover={{ scale: 7 }}
                  style={{
                    height: coin.Diameter * 2,
                    width: coin.Diameter * 2,
                  }}
                  onClick={() => {
                    CoinDetails(coin.id);
                  }}
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
        <div className="col-md-3">
          <h3>Material</h3>
          <select
            className="custom-select"
            value={Materialfilter}
            onChange={handleMaterialFilterChange}
          >
            {uniqMaterial.map(MaterialList)}
          </select>
          <h3>Authority</h3>
          <select
            className="custom-select"
            value={Authorityfilter}
            onChange={handleAuthorityFilterChange}
          >
            {uniqAuthority.map(AuthorityList)}
          </select>
          <h3>Date</h3>
          <select
            className="custom-select"
            value={Datefilter}
            onChange={handleDateFilterChange}
          >
            {uniqDate.map(DateList)}
          </select>
          <h3>Type</h3>
          <select
            className="custom-select"
            value={Typefilter}
            onChange={handleTypeFilterChange}
          >
            {uniqType.map(TypeList)}
          </select>
          <Button
            onClick={clearFilters}
            variant="dark"
            style={{ width: "130px" }}
          >
            CLEAR
          </Button>
        </div>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Coin Information
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {coinLoading ? (
              <p>Loading...</p>
            ) : (
              <React.Fragment>
                <h4 style={{ textAlign: "center" }}>{coin.Title}</h4>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={coin.obverseFile}
                    alt=""
                    className="modal-image"
                  ></img>
                  <img
                    src={coin.reverseFile}
                    alt=""
                    className="modal-image"
                  ></img>
                </div>
                <h5 id="dialogue-text">
                  <strong>Region</strong> - {coin.Region}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Mint</strong> - {coin.Mint}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Material</strong> - {coin.Material}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Diameter</strong> - {coin.Diameter}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Authority</strong> - {coin.IssuingAuthority}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Date</strong> - {coin.Date}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Type</strong> - {coin.TypeCategory}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Obverse Type</strong> - {coin.ObverseType}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Obverse Legend</strong> - {coin.ObverseLegend}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Reverse Type</strong> - {coin.ReverseType}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Reverse Legend</strong> - {coin.ReverseLegend}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Rights Holder</strong> - {coin.RightsHolder}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Source coin</strong> - {coin.SourceImage}
                </h5>
              </React.Fragment>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default GQL_Client;
