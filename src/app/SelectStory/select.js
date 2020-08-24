import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {StyledPageLink} from "../componentStyling";

const Select = () => {
    AOS.init({
        duration: 2500,
    });

    return (
        <div>
            <div className="container-fluid px-6">
                <div className="row top-spacer-3">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-8">
                        <StyledPageLink
                            to="/civic-story"
                            data-aos="fade-right"
                            data-aos-duration="1600"
                            id="style-select-items"
                        >
                            Tell me a Political Story
                        </StyledPageLink>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row top-spacer-1">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-8">
                        <StyledPageLink
                            to="/economic-story"
                            data-aos="fade-right"
                            data-aos-duration="1600"
                            id="style-select-items"
                        >
                            Tell me an Economic Story
                        </StyledPageLink>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
                <div className="row top-spacer-1">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-8">
                        <StyledPageLink
                            to="/religious-story"
                            data-aos="fade-right"
                            data-aos-duration="1600"
                            id="style-select-items"
                        >
                            Tell me a Religious Story
                        </StyledPageLink>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row top-spacer-1">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-8">
                        <StyledPageLink
                            to="/visitors-story"
                            data-aos="fade-right"
                            data-aos-duration="1600"
                            id="style-select-items"
                        >
                            Tell me a Visitor's Story
                        </StyledPageLink>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
              <div className="row top-spacer-3"></div>
            </div>
        </div>


    );
};

export default Select;
