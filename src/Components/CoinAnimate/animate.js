import React from "react";
import "./animate.css";
import Coins from "../data/images.json";
import { motion } from "framer-motion";

const Animate = () => {
  return (
    <div className="animate">
      <h1
        style={{ textAlign: "center", fontFamily: "Fantasy", color: "goldenrod" }}
      >
        Choose a coin from the pile!
      </h1>
      <div className="coin-bg">
        {Coins.coins.map((image) => (
          <motion.input
            type="image"
            src={require("../data/images" + image.src)}
            className={image.className}
            alt={image.alt}
            // onClick={imageClick}  //TODO- To be used for onClick functionality
            whileHover={{ scale: 1.5 }}
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
