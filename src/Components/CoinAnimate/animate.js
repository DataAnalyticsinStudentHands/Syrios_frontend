import React, { useState } from "react";
import "./animate.css";
import Coins from "../data/items.json";
import { motion } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

function MyVerticallyCenteredModal(props) {
  return (
    <div>
      {Coins.items.map((image) => (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          key={image}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Coin Information
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{image.title}</h4>
            <img src={image.obverse}></img>
            <img src={image.reverse}></img>
            <h5>Mint - {image.mint}</h5>
            <h5>Type - {image.material}</h5>
            <h5>Diameter - {image.diameter}</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      ))}
    </div>
  );
}

const Animate = () => {
  const [modalShow, setModalShow] = useState(false);

  const [Materialfilter, setMaterialFilter] = useState("");
  const [Authorityfilter, setAuthorityFilter] = useState("");
  const [Mintfilter, setMintFilter] = useState("");
  const [Datefilter, setDateFilter] = useState("");

  const handleMaterialFilterChange = (el) => {
    setMaterialFilter(el.target.value);
  };
  
  const handleAuthorityFilterChange = (el) => {
    setAuthorityFilter(el.target.value);
  };
  
  const handleMintFilterChange = (el) => {
    setMintFilter(el.target.value);
  };


  const handleDateFilterChange = (el) => {
    setDateFilter(el.target.value);
  };
  

  // const MaterialfilteredResults = Coins.items.filter((song) =>
  //   song.material.toLowerCase().includes(Materialfilter.toLowerCase())
  // );
  
  // const AuthorityfilteredResults = Coins.items.filter((song) =>
  //   song.authority.toLowerCase().includes(Authorityfilter.toLowerCase())
  // );
  
  // const MintfilteredResults = Coins.items.filter((song) =>
  //   song.mint.toLowerCase().includes(Mintfilter.toLowerCase())
  // );

  // const DatefilteredResults = Coins.items.filter((song) =>
  //   song.date.toLowerCase().includes(Datefilter.toLowerCase())
  // );

  const filteredResults = Coins.items.filter((song) =>
    song.material.toLowerCase().includes(Materialfilter.toLowerCase()) && song.authority.toLowerCase().includes(Authorityfilter.toLowerCase()) 
      && song.mint.toLowerCase().includes(Mintfilter.toLowerCase()) && song.date.toLowerCase().includes(Datefilter.toLowerCase())
  );

  const uniqMaterial = ['-', 'Gold', 'Silver', 'Bronze'],
  MaterialList = function(X) {
  return <option>{X}</option>
  };
  
  const uniqAuthority = ['-', 'Augustus', 'Philip I', 'Provincial', 'Central', 'Antoninus Pius', 'Tigranes II', 'Civic', ],
  AuthorityList = function(X) {
  return <option>{X}</option>
  };
  
  const uniqMint = ['-', 'Antioch'],
  MintList = function(X) {
  return <option>{X}</option>
  };
  
  const uniqDate = ['-', '5 BCE - 14 CE', '178 - 179', '244 CE - 249 CE', '249 CE', '244 CE - 246 CE', '158 CE - 159 CE', 'c. 83 - 69 BCE', '64 BCE - 47 BCE', 
                    '285 CE - 295 CE', '283 CE - 284 CE', '282 CE - 283 CE', '276 CE - 282 CE', '275 CE - 276 CE', '270 CE - 275 CE', '268 CE - 270 CE', '253 CE - 260 CE'],
  DateList = function(X) {
  return <option>{X}</option>
  };

  // const FinalFilter = Coins.items.filter(el => el.MaterialfilteredResults && el.AuthorityfilteredResults && el.MintfilteredResults && el.DatefilteredResults)

  return (

    <div className="animate">
      

      <p id="coins-style-select-items">Choose a coin from the pile!</p>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {/* <label>
        Input:{" "}
        <input type="text" value={filter} onChange={handleFilterChange} />
      </label> */}
      <div>
        <h3>Material</h3>
        <select value={Materialfilter} onChange={handleMaterialFilterChange}>{uniqMaterial.map(MaterialList)}</select>
      </div>
      <div>
        <h3>Authority</h3>
        <select value={Authorityfilter} onChange={handleAuthorityFilterChange}>{uniqAuthority.map(AuthorityList)}</select>
      </div>
      <div>
        <h3>Mint</h3>
        <select value={Mintfilter} onChange={handleMintFilterChange}>{uniqMint.map(MintList)}</select>
      </div>
      <div>
        <h3>Date</h3>
        <select value={Datefilter} onChange={handleDateFilterChange}>{uniqDate.map(DateList)}</select>
      </div>
      

      <div className="coin-bg">
        {filteredResults.map((image) => (
          <React.Fragment key={image.id}>
            <motion.input
              type="image"
              src={image.obverse}
              style={{
                height: image.diameter * 2.5,
                width: image.diameter * 2.5,
              }} //! Scale the images here
              alt={image.id}
              onClick={() => setModalShow(true)} //TODO- To be used for onClick functionality
              whileHover={{ scale: 2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: 360,
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              drag
              dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
            />
          </React.Fragment>
        ))}
      </div>
      {/* <div className="coin-bg">
        {AuthorityfilteredResults.map((image) => (
          <React.Fragment key={image.id}>
            <motion.input
              type="image"
              src={image.obverse}
              style={{
                height: image.diameter * 2.5,
                width: image.diameter * 2.5,
              }} //! Scale the images here
              alt={image.id}
              onClick={() => setModalShow(true)} //TODO- To be used for onClick functionality
              whileHover={{ scale: 2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: 360,
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              drag
              dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
            />
          </React.Fragment>
        ))}
      </div>
      <div className="coin-bg">
        {MintfilteredResults.map((image) => (
          <React.Fragment key={image.id}>
            <motion.input
              type="image"
              src={image.obverse}
              style={{
                height: image.diameter * 2.5,
                width: image.diameter * 2.5,
              }} //! Scale the images here
              alt={image.id}
              onClick={() => setModalShow(true)} //TODO- To be used for onClick functionality
              whileHover={{ scale: 2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: 360,
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              drag
              dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
            />
          </React.Fragment>
        ))}
      </div>
      <div className="coin-bg">
        {DatefilteredResults.map((image) => (
          <React.Fragment key={image.id}>
            <motion.input
              type="image"
              src={image.obverse}
              style={{
                height: image.diameter * 2.5,
                width: image.diameter * 2.5,
              }} //! Scale the images here
              alt={image.id}
              onClick={() => setModalShow(true)} //TODO- To be used for onClick functionality
              whileHover={{ scale: 2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: 360,
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              drag
              dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
            />
          </React.Fragment>
        ))}
      </div> */}
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
