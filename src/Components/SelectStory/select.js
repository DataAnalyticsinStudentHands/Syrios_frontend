import React from "react";
import "./select.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const Select = () => {
  AOS.init({
    duration: 2500,
  });

  return (
    <div className="select-class">
      <div className="align-select-items">
        <Link
          to="/civic-story"
          data-aos="fade-right"
          data-aos-duration="800"
          id="style-select-items"
        >
          Tell me a Political Story
        </Link>
        <Link
          to="/economic-story"
          data-aos="fade-right"
          data-aos-duration="1600"
          id="style-select-items"
        >
          Tell me an Economic Story
        </Link>
      </div>
    </div>
  );
};

export default Select;
