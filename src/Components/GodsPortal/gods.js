import React from "react";
import "./gods.css"
import romanGods from "../data/gods-images/roman-gods.jpg"

const Roman = () => {
  return (
    <div className="class-romans">
      <div
        id="gods-style-select-items"
        data-aos="fade-right"
        data-aos-duration="800"
      >
        Interactive Gods Portal
      </div>
      <div className="gods-component-1">
        <img src={romanGods} alt="Logo" data-aos="fade-up" />
      </div>
    </div>
    
  );
};

export default Roman;
