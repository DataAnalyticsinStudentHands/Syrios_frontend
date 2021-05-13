import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { StyledPageLink } from './componentStyling';

const Explore = () => {
  AOS.init({
    duration: 2500,
  });

  return (
    <div>
      <div className="container-fluid px-6">
        <div className="row">
          <div className="col-md-1 show_line_on_side"></div>
          <div className="col-md-11 pl-5">
            <StyledPageLink
              to="/omeka"
              target="_blank"
              data-aos="fade-right"
              data-aos-duration="2400"
            >
              Let Me View a Catalog
            </StyledPageLink>
          </div>
        </div>
        <div className="row">
          <div className="col-md-1 show_line_on_side"></div>
          <div className="col-md-11 pl-5">
            <StyledPageLink to="/download" data-aos="fade-right" data-aos-duration="3200">
              Download Dataset
            </StyledPageLink>
          </div>
        </div>
        <div className="row top-spacer-3"></div>
      </div>
    </div>
  );
};

export default Explore;
