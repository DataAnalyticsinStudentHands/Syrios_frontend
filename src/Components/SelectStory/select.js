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
          The CIVIC story
        </Link>
        <Link
          to="/economic-story"
          data-aos="fade-right"
          data-aos-duration="1600"
          id="style-select-items"
        >
          The ECONOMIC story
        </Link>
        <Link
        //   to="/economic-story"
          data-aos="fade-right"
          data-aos-duration="2400"
          id="style-select-items"
        >
          The ZEUS story
        </Link>
        <Link
        //   to="/economic-story"
          data-aos="fade-right"
          data-aos-duration="3200"
          id="style-select-items"
        >
          The Visitor's story
        </Link>
      </div>
    </div>
  );
};

export default Select;
