import React, { useState } from "react";
import "./animate.css";
import Coins from "../data/items.json";
import { motion } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";


const Animate = () => {
  // const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);

  const [Materialfilter, setMaterialFilter] = useState("");
  const [Authorityfilter, setAuthorityFilter] = useState("");
  // const [Mintfilter, setMintFilter] = useState("");
  const [Datefilter, setDateFilter] = useState("");
  const [Typefilter, setTypeFilter] = useState("");

  const handleMaterialFilterChange = (el) => {
    setMaterialFilter(el.target.value);
  };

  const handleAuthorityFilterChange = (el) => {
    setAuthorityFilter(el.target.value);
  };

  // const handleMintFilterChange = (el) => {
  //   setMintFilter(el.target.value);
  // };

  const handleDateFilterChange = (el) => {
    setDateFilter(el.target.value);
  };

  const handleTypeFilterChange = (el) => {
    setTypeFilter(el.target.value);
  };

  const filteredResults = Coins.items.filter(
    (item) =>
      item.material.toLowerCase().includes(Materialfilter.toLowerCase()) &&
      item.authority.toLowerCase().includes(Authorityfilter.toLowerCase()) &&
      // item.mint.toLowerCase().includes(Mintfilter.toLowerCase()) &&
      item.date.toLowerCase().includes(Datefilter.toLowerCase()) &&
      item.type.toLowerCase().includes(Typefilter.toLowerCase())
    // item.type2.toLowerCase().includes(Typefilter.toLowerCase())&&
    // item.type3.toLowerCase().includes(Typefilter.toLowerCase())&&
    // item.type4.toLowerCase().includes(Typefilter.toLowerCase()
    // )
  );

  const uniqMaterial = ["-", "Gold", "Silver", "Bronze"],
    MaterialList = function(X) {
      return <option>{X}</option>;
    };

  const uniqAuthority = [
      "-",
      "Augustus",
      "Philip I",
      "Provincial",
      "Central",
      "Antoninus Pius",
      "Tigranes II",
      "Civic",
      "Alexander II",
    ],
    AuthorityList = function(X) {
      return <option>{X}</option>;
    };

  // const uniqMint = ["-", "Antioch"],
  //   MintList = function (X) {
  //     return <option>{X}</option>;
  //   };

  const uniqType = [
      "-",
      "God",
      "Ruler",
      "Animal",
      "Object",
      "Letter",
      "Nature",
      "Idea",
      "War/Weapon",
      "Building",
    ],
    TypeList = function(X) {
      return <option>{X}</option>;
    };

  const uniqDate = [
      "-",
      "5 BCE - 14 CE",
      "178 - 179",
      "244 CE - 249 CE",
      "249 CE",
      "244 CE - 246 CE",
      "158 CE - 159 CE",
      "c. 83 - 69 BCE",
      "c. 128 BCE-122 BCE",
      "64 BCE - 47 BCE",
      "285 CE - 295 CE",
      "283 CE - 284 CE",
      "282 CE - 283 CE",
      "276 CE - 282 CE",
      "275 CE - 276 CE",
      "270 CE - 275 CE",
      "268 CE - 270 CE",
      "253 CE - 260 CE",
    ],
    DateList = function(X) {
      return <option>{X}</option>;
    };

  const clearFilters = () => {
    setMaterialFilter("");
    setAuthorityFilter("");
    // setMintFilter("");
    setDateFilter("");
    setTypeFilter("");
  };

  return (
    <div className="animate">
      {/* <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
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
          <h3>Authority</h3>
          <select
            className="custom-select"
            value={Authorityfilter}
            onChange={handleAuthorityFilterChange}
          >
            {uniqAuthority.map(AuthorityList)}
          </select>
        </div>
        {/* <div>
          <h3>Mint</h3>
          <select
            className="custom-select"
            value={Mintfilter}
            onChange={handleMintFilterChange}
          >
            {uniqMint.map(MintList)}
          </select>
        </div> */}
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

      <h1 className="class-coins-pile">Let Me Sort the Coins</h1>
      <p className="class-coins-header-para">
        The ancient mint at <strong>Antioch</strong> produced a wealth of
        distinct coins for kings, emperors, governors, and citizens. Explore the
        differences in the coins by sorting through the pile or making
        selections from the drop-down menu about
        <strong> 1) material</strong>,{" "}
        <strong>
          {" "}
          2) the issuing authority guaranteeing a coin’s value as money
        </strong>
        ,<strong> 3) type or design</strong> and/or{" "}
        <strong> 4) date of minting</strong>. At any point, click on an
        individual coin to view a full description and learn more!
      </p>
      <div className="coin-bg">
        {filteredResults.map((image) => (
          <React.Fragment key={image.id}>
            <motion.input
              type="image"
              src={image.obverse}
              style={{
                height: image.diameter * 3,
                width: image.diameter * 3,
              }} //! Scale the images here
              alt={image.id}
              onClick={() => setShow(true)} //TODO- To be used for onClick functionality
              whileHover={{ scale: 3 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: 360,
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              drag
              dragConstraints={{
                top: -650,
                left: -650,
                right: 650,
                bottom: 650,
              }}
            />
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
                <h4 style={{ textAlign: "center" }}>{image.title}</h4>
                <div style={{ textAlign: "center" }}>
                  <img src={image.obverse} alt="" className="modal-image"></img>
                  <img src={image.reverse} alt="" className="modal-image"></img>
                </div>
                <h5 id="dialogue-text">
                  <strong>Region</strong> - {image.Region}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Mint</strong> - {image.mint}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Material</strong> - {image.material}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Diameter</strong> - {image.diameter}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Authority</strong> - {image.authority}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Date</strong> - {image.date}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Type</strong> - {image.type} {image.type2}{" "}
                  {image.type3} {image.type4}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Obverse Type</strong> - {image.obverseType}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Obverse Legend</strong> - {image.obverseLegend}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Reverse Type</strong> - {image.reverseLegend}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Reverse Legend</strong> - {image.reverseLegend}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Rights Holder</strong> - {image.rightsHolder}
                </h5>
                <h5 id="dialogue-text">
                  <strong>Source Image</strong> - {image.sourceImage}
                </h5>
              </Modal.Body>
            </Modal>
          </React.Fragment>
        ))}
      </div>
      <div className="class-coins-footer-para">
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
          Part of The SYRIOS Project: Studying Urban Relationships and Identity
          over Ancient Syria
        </span>
      </div>
    </div>
  );
};

export default Animate;

// TODO- We can use componentDidMount while fetching images from APIs
// componentDidMount() {
// fetch('../data/images.json')
// .then((res) => res.json())
// .then(data => console.log(data));
// .then((json) => {
//     console.log(json);
//     this.setState({
//         images: json
//     })
// })
// { images.map(({id, src, title, description}) => <img key={id} src={src} title={title} alt={description} />)
// }
// const images = this.state;

// TODO: attribute to be used onClick the images
// const imageClick = () => {
// console.log('click');
//     alert('Click');
// }
