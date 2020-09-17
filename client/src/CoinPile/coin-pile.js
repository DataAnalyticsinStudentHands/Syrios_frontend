import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import LoadingMask from "react-loadingmask";
import { createHttpLink } from "apollo-link-http";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { motion } from "framer-motion";
import Materials from "./Filters/material";
import TypeCategory from "./Filters/typeCategory";
import Dates from "./Filters/date";
import Authority from "./Filters/authority";
import {
  ParaText,
  PageTitleCentered,
  PageSubTitle,
  FormContainer,
  FormButton,
  FormStyles,
  ParaTextLeft,
} from "../componentStyling";

const { gql } = require("apollo-boost");

const CoinPile = () => {
  const client = new ApolloClient({
    link: createHttpLink({ uri: "/graphql" }),
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

    const { loading, error, data = {} } = useQuery(GET_COINS); // Get data from "coins" query

    // get data from "coin" query
    const [GetCoin, { data: coinData, loading: coinLoading }] = useLazyQuery(
      GET_COIN
    );
    const { coin = {} } = coinData || {};

    const [Materialfilter, setMaterialFilter] = useState("");
    const [Authorityfilter, setAuthorityFilter] = useState("");
    const [Datefilter, setDateFilter] = useState("-");
    const [Typefilter, setTypeFilter] = useState("");

    if (loading)
      return (
        <LoadingMask
          loading={true}
          text={"loading..."}
          style={{ backgroundColor: "#2d616a" }}
        >
          <div style={{ width: 500, height: 1000, color: "white" }}>
            Loading your coins ...
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
      setDateFilter(returnArrayByDateType(el.target.value));
    };

    const dateTypes = {
      "-": "-",
      "300 BCE to 130 BCE": [-300, -130],
      "129 BCE to 32 BCE": [-129, -32],
      "31 BCE to 192 CE": [-31, 192],
      "193 CE to 283 CE": [193, 283],
      "284 CE to 450 CE": [284, 450],
    };

    const returnArrayByDateType = (value) => {
      return dateTypes[value];
    };

    const handleTypeFilterChange = (el) => {
      setTypeFilter(el.target.value);
    };

    // Filtered Results from 4 filters
    const filteredResults = data.coins.filter(
      (item) =>
        item.Material.toLowerCase().includes(Materialfilter.toLowerCase()) &&
        item.IssuingAuthority.toLowerCase().includes(
          Authorityfilter.toLowerCase()
        ) &&
        (Datefilter !== "-"
          ? item.FromDate > Datefilter[0] && item.ToDate < Datefilter[1]
          : true) &&
        item.TypeCategory.toLowerCase().includes(Typefilter.toLowerCase())
    );

    // Select boxes of 4 filters
    const uniqMaterial = Materials;
    const MaterialList = function(X) {
      return <option>{X}</option>;
    };

    const uniqAuthority = Authority;
    const AuthorityList = function(X) {
      return <option>{X}</option>;
    };

    const uniqType = TypeCategory;
    const TypeList = function(X) {
      return <option>{X}</option>;
    };

    const uniqDate = Dates;
    const DateList = function(X) {
      return <option>{X}</option>;
    };

    // Clear filter
    const clearFilters = () => {
      setMaterialFilter("");
      setAuthorityFilter("");
      setDateFilter("-");
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
    const returnFilteredData = () => {
      if (
        !Typefilter &&
        !Authorityfilter &&
        Datefilter === "-" &&
        !Materialfilter
      ) {
        return data.coins;
      } else {
        return filteredResults;
      }
    };

    return (
      <div className="container-fluid">
        {/* Coin Sort Section */}
        <div className="row top-buffer-1">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <PageTitleCentered>Sort Coins</PageTitleCentered>
            <ParaText>
              The ancient mint at Antioch produced a wealth of distinct coins
              for kings, emperors, governors, and citizens. Explore the
              differences in the coins by sorting through the pile or making
              selections from the drop-down menu about 1) material, 2) the
              issuing authority guaranteeing a coin’s value as money, 3) type or
              design and/or 4) date of minting. At any point, click on an
              individual coin to view a full description and learn more!
            </ParaText>
            <ol>
              <li>Hover on a coin to scale it</li>
              <li>Click on a coin to know it's corresponding information</li>
              <li>Select filters on the right to narrow down your search</li>
              <li>Click and hold the coin to move it around the page</li>
            </ol>
          </div>
          <div className="col-md-2"></div>
        </div>
        <FormContainer>
          <FormStyles>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-2">
                <Form.Group controlId="select1">
                  <Form.Label>Material</Form.Label>
                  <Form.Control
                    as="select"
                    value={Materialfilter}
                    onChange={handleMaterialFilterChange}
                  >
                    {uniqMaterial.map(MaterialList)}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Group controlId="select2">
                  <Form.Label>Authority</Form.Label>
                  <Form.Control
                    as="select"
                    value={Authorityfilter}
                    onChange={handleAuthorityFilterChange}
                  >
                    {uniqAuthority.map(AuthorityList)}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Group controlId="select3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    as="select"
                    value={Object.keys(dateTypes).find(
                      (key) => dateTypes[key] === Datefilter
                    )}
                    onChange={handleDateFilterChange}
                  >
                    {[
                      "-",
                      "300 BCE to 130 BCE",
                      "129 BCE to 32 BCE",
                      "31 BCE to 192 CE",
                      "193 CE to 283 CE",
                      "284 CE to 450 CE",
                    ].map(DateList)}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Group controlId="select4">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={Typefilter}
                    onChange={handleTypeFilterChange}
                  >
                    {uniqType.map(TypeList)}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-2 mb-auto">
                <FormButton onClick={clearFilters}>Clear selections</FormButton>
              </div>
            </div>
          </FormStyles>
        </FormContainer>
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div>
              {returnFilteredData().map((coin) => (
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
                  <PageSubTitle>{coin.Title}</PageSubTitle>
                  <div>
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
                  <ParaTextLeft>Region: {coin.Region}</ParaTextLeft>
                  <ParaTextLeft>Mint: {coin.Mint}</ParaTextLeft>
                  <ParaTextLeft>Material: {coin.Material}</ParaTextLeft>
                  <ParaTextLeft>Diameter: {coin.Diameter}</ParaTextLeft>
                  <ParaTextLeft>
                    Authority: {coin.IssuingAuthority}
                  </ParaTextLeft>
                  <ParaTextLeft>Date: {coin.Date}</ParaTextLeft>
                  <ParaTextLeft>Type: {coin.TypeCategory}</ParaTextLeft>
                  <ParaTextLeft>Obverse Type: {coin.ObverseType}</ParaTextLeft>
                  <ParaTextLeft>
                    Obverse Legend: {coin.ObverseLegend}
                  </ParaTextLeft>
                  <ParaTextLeft>Reverse Type: {coin.ReverseType}</ParaTextLeft>
                  <ParaTextLeft>
                    Reverse Legend: {coin.ReverseLegend}
                  </ParaTextLeft>
                  <ParaTextLeft>
                    Rights Holder: {coin.RightsHolder}
                  </ParaTextLeft>
                  <ParaTextLeft>Source coin: {coin.SourceImage}</ParaTextLeft>
                </React.Fragment>
              )}
            </Modal.Body>
          </Modal>
        </div>
        <div className="row top-buffer-1"></div>
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
