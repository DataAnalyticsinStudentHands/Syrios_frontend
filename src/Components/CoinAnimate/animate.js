import React from "react";
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
          key={image.id}
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
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div className="animate">
      <p id="coins-style-select-items">Choose a coin from the pile!</p>
      <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
      <div className="coin-bg">
        {Coins.items.map((image) => (
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
