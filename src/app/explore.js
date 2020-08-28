import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {StyledPageLink} from "./componentStyling";

const Explore = () => {
  AOS.init({
    duration: 2500,
  });

  return (

      <div>
        <div className="container-fluid px-6">
          <div className="row top-spacer-1">
            <div className="col-md-1 show_line_on_side"></div>
            <div className="col-md-8"></div>
            <div className="col-md-2"></div>
          </div>
          <div className="row">
            <div className="col-md-1 show_line_on_side">
            </div>
            <div className="col-md-8 pl-5">
              <StyledPageLink
                  to="/coins"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  id="style-select-items"
              >
                Let me Sort Coins
              </StyledPageLink>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row">
            <div className="col-md-1 show_line_on_side"></div>
            <div className="col-md-8 pl-5">
              <StyledPageLink
                  to="/maps"
                  data-aos="fade-right"
                  data-aos-duration="1600"
                  id="style-select-items"
              >
                Let Me Map Coins
              </StyledPageLink>
            </div>
            <div className="col-md-1 "></div>
          </div>
          <div className="row">
            <div className="col-md-1 show_line_on_side">

            </div>
            <div className="col-md-8 pl-5">
              <StyledPageLink
                  to="/omeka-database"
                  data-aos="fade-right"
                  data-aos-duration="2400"
                  id="style-select-items"
              >
                Let Me View a Catalog
              </StyledPageLink>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row">
            <div className="col-md-1 show_line_on_side">

            </div>
            <div className="col-md-8 pl-5">
              <StyledPageLink
                  to="/download"
                  data-aos="fade-right"
                  data-aos-duration="3200"
                  id="style-select-items"
              >
                Download Dataset
              </StyledPageLink>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row top-spacer-3"></div>
        </div>
      </div>
  );
};

export default Explore;
