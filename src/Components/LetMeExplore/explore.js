import React from "react";
import "./explore.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const Explore = () => {
  AOS.init({
    duration: 2500,
  });

  return (
    <div className="class-explore">
      <div className="align-select-items">
        <Link
          to="/coins"
          data-aos="fade-right"
          data-aos-duration="800"
          id="style-select-items"
        >
          Interactive Pile of Coins
        </Link>
        <Link
          to="/roman-emperors"
          data-aos="fade-right"
          data-aos-duration="1600"
          id="style-select-items"
        >
          Interactive Timeline of Roman Emperors
        </Link>
        <Link
          to="/gods-portal"
          data-aos="fade-right"
          data-aos-duration="2400"
          id="style-select-items"
        >
          Interactive Gods Portal
        </Link>
        <Link
          to="/omeka-database"
          data-aos="fade-right"
          data-aos-duration="3200"
          id="style-select-items"
        >
          Omeka Database
        </Link>
      </div>
    </div>
  );
};

export default Explore;
