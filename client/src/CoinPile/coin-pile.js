import React, { useState } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { motion } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import Materials from "./Filters/material";
import TypeCategory from "./Filters/typeCategory";
import Dates from "./Filters/date";
import Authority from "./Filters/authority";
import LoadingMask from "react-loadingmask";
import "react-loadingmask/dist/react-loadingmask.css";
import "bootstrap/dist/css/bootstrap.css";
const { gql } = require("apollo-boost");

const CoinPile = () => {
  const client = new ApolloClient({
    uri: "http://localhost:3000/graphql",
  });

  const GqlClient = () => {
    const GET_COIN = gql`
      query Coin($id: String!) {
        coin(id: $id) {
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

    if (loading)
      return (
        <LoadingMask
          loading={true}
          text={"loading..."}
          style={{ backgroundColor: "#2d616a" }}
        >
          <div style={{ width: 500, height: 1000, color: "white" }}>
            LOADING YOUR COINS
          </div>
        </LoadingMask>
      );
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
          <div className="col-md-3">
            <p>
              The ancient mint at <strong>Antioch</strong> produced a wealth of
              distinct coins for kings, emperors, governors, and citizens.
              Explore the differences in the coins by sorting through the pile
              or making selections from the drop-down menu about
              <strong> 1) material</strong>,{" "}
              <strong>
                {" "}
                2) the issuing authority guaranteeing a coin’s value as money
              </strong>
              ,<strong> 3) type or design</strong> and/or{" "}
              <strong> 4) date of minting</strong>. At any point, click on an
              individual coin to view a full description and learn more!
            </p>
            <h4 className="align-center">How to play with Coin pile</h4>
            <p>
              <ol>
                <li>Hover on a coin to scale it</li>
                <li>Click on a coin to know it's corresponding information</li>
                <li>Select filters on the right to narrow down your search</li>
                <li>Click and hold the coin to move it around the page</li>
              </ol>
            </p>
          </div>
          <div className="col-md-6">
            <div>
              {filteredResults.map((coin) => (
                <React.Fragment key={coin.id}>
                  <motion.input
                    type="image"
                    key={coin.id}
                    alt=""
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
          <div className="col-md-3" style={{ textAlign: "center" }}>
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
            <div style={{ padding: "1em" }}>
              <Button
                onClick={clearFilters}
                variant="dark"
                style={{ width: "8em" }}
              >
                CLEAR
              </Button>
            </div>
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
                <LoadingMask
                  loading={true}
                  text={"loading..."}
                  style={{ backgroundColor: "#2d616a" }}
                >
                  <div style={{ width: 500, height: 600 }}>
                    Loading Coin Details
                  </div>
                </LoadingMask>
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
          <div>
            <span>
              Acknowledgements: Created by Rahul Raj Mogili in React.js, CSS,
              Bootstrap, Node.js{" "}
            </span>
            <br></br>
            <span>
              For more information about design, contact Dr. Peggy Lindner
              (plindner@central.uh.edu)
            </span>
            <br></br>
            <span>
              For more information about content, contact Dr. Kristina Neumann
              (kmneuma2@central.uh.edu)
            </span>
            <br></br>
            <span>
              Part of The SYRIOS Project: Studying Urban Relationships and
              Identity over Ancient Syria
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ApolloProvider client={client}>
        <div>
          <GqlClient />
        </div>
      </ApolloProvider>
    </div>
  );
};

export default CoinPile;
