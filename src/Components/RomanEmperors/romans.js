import React from "react";
import "./romans.css"
import emperors from "../data/roman-images/emperors.jpg"

const Roman = () => {
  return (
    <div className="class-romans">
      <div
        id="roman-style-select-items"
        data-aos="fade-right"
        data-aos-duration="800"
      >
        Interactive Timeline of Roman emperors
      </div>
      <div className="roman-component-1">
        <img src={emperors} alt="Logo" data-aos="fade-up" />
      </div>
    </div>
    
  );
};

export default Roman;
