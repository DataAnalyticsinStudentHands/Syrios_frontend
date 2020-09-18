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
  StyledLink,
  ParaTextLeftSmaller,
  StyledLinkTerm
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
        item.FromDate > Datefilter[0] &&
        item.ToDate < Datefilter[1] &&
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
    const returnFilteredData = () => {
      if (filteredResults.length) {
        return filteredResults;
      } else {
        return data.coins;
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
              issuing {' '}
                <StyledLinkTerm
                  href="http://nomisma.org/id/authority"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  authority
                </StyledLinkTerm>
                {' '} guaranteeing a coin’s value as money, 3) type or
              design and/or 4) date of minting. At any point, click on an
              individual coin to view a full description and learn more.
            </ParaText>
            <ol>
              <li>Hover on a coin to scale it</li>
              <li>Click on a coin to know its corresponding information</li>
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

        <div className="row top-spacer-1">
            <div className="col-md-1"></div>
            <div className="col-md-5">
                <ParaTextLeftSmaller>
                    Coin Images Courtesy of
                    <br></br>
                    <br></br>
                    <a href="http://numismatics.org/" target="_blank" rel="noopener noreferrer">American
                        Numismatic
                        Society</a>
                    <br></br>
                    <a href="https://library.princeton.edu/special-collections/divisions/numismatic-collection"
                       target="_blank" rel="noopener noreferrer">Princeton University Library Numismatic
                        Collection</a>
                    <br></br>
                    <a href="https://www.bnf.fr/en/bibliotheque-nationale-de-france-catalogue-general"
                       target="_blank" rel="noopener noreferrer">The Bibliothèque nationale de France</a>
                    <br></br>
                    <a href="https://www.smb.museum/en/museums-institutions/muenzkabinett/home/" target="_blank"
                       rel="noopener noreferrer">Münzkabinett at the Staatliche Museen in Berlin</a>
                    <br></br>
                    <a href="https://rpc.ashmus.ox.ac.uk/" target="_blank" rel="noopener noreferrer">Roman
                        Provincial Coinage Online</a>
                    <br></br>
                </ParaTextLeftSmaller>
            </div>
            <div className="col-md-5 ">
                <ParaTextLeftSmaller>
                    To Read More:
                    <br />
                    <br />
                    <StyledLink
                      href="https://www.worldcat.org/title/roman-provincial-coinage-vol-1-from-the-death-of-caesar-to-the-death-of-vitellius-44bc-ad69/oclc/864754386&referer=brief_results"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Burnett, A.M., Amandry, M., and Ripollès, P.P., eds. 1992-. <em>Roman Provincial Coinage</em>. London: British Museum Press.
                    </StyledLink>
                    <br />
                    <StyledLink
                      href="https://www.worldcat.org/title/coinage-in-roman-syria-northern-syria-64-bc-ad-253/oclc/928519613&referer=brief_results"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Butcher, K. 2004. <em>Coinage in Roman Syria: Northern Syria, 64 BC-AD 253</em>. London: Royal Numismatic Society.
                    </StyledLink>
                    <br />
                    <StyledLink
                      href="https://www.worldcat.org/title/seleucid-coins-pt-1-seleucus-i-through-antiochus-iii-1-introduction-maps-and-catalogue/oclc/314359863&referer=brief_results"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Houghton, A. and Lorber, C. 2002. <em>Seleucid Coins: A Comprehensive Catalogue. Part I: Seleucus I through Antiochus III</em>. Two Volumes. New York: American Numismatic Society.
                    </StyledLink>
                    <br />
                    <StyledLink
                      href="https://www.worldcat.org/title/seleucid-coins-a-comprehensive-catalogue/oclc/1170238292&referer=brief_results"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Houghton, A., Hoover, O., and Lorber, C. 2008. <em>Seleucid Coins: A Comprehensive Catalogue. Part II: Seleucus IV through Antiochus XIII</em>. Two Volumes. New York: The American Numismatic Society.
                    </StyledLink>
                    <br />
                    <StyledLink
                      href="https://www.worldcat.org/title/coins-of-roman-antioch/oclc/837721004&referer=brief_results"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      McAlee, R. 2007. <em>The Coins of Roman Antioch</em>. Lancaster, PA: Classical Numismatic Group.
                    </StyledLink>
                    <br />
                    <StyledLink
                      href="https://www.worldcat.org/title/roman-imperial-coinage-volume-i-from-31-bc-to-ad-69-by-chv-sutherland-with-introductions-to-the-mints-and-32-plates/oclc/1110627289&referer=brief_results"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sutherland, C.H.V. and Carson, R.A.G., eds. 1984-. <em>The Roman Imperial Coinage</em>. Revised edition. London: Spink.
                    </StyledLink>
                </ParaTextLeftSmaller>
            </div>
            <div className="col-md-1"></div>
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