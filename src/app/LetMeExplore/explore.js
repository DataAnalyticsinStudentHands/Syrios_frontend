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
          Let me Sort Coins
        </Link>
        <Link
          to="/maps"
          data-aos="fade-right"
          data-aos-duration="1600"
          id="style-select-items"
        >
          Let Me Map Coins
        </Link>
        <Link
          to="/omeka-database"
          data-aos="fade-right"
          data-aos-duration="3200"
          id="style-select-items"
        >
          Let Me View a Catalog
        </Link>
      </div>
    </div>
  );
};

export default Explore;
