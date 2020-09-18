import React from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
    PageTitleCentered,
    ParaTextLeftSmaller,
    SubTextLeft,
    PageSectionTitle,
    StyledLink
} from "./componentStyling";
import sitemap from "./data/site-map/sitemap.png"

const SiteMap = () => {
    AOS.init({
      duration: 1000,
    });

    return (
        <div>
            <div className="container-fluid p-0 px-6">

                {/* Site Map Section */}

                <div className="row top-buffer-1">
                    <div className="col-md-1"></div>
                    <div className="col-md-10" data-aos="fade-up">
                        <PageTitleCentered>
                            Site Map of the SYRIOS Project
                        </PageTitleCentered>
                    </div>
                    <div className="col-md-1"></div>
                </div>

                <div className="row top-buffer-3">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <img className={"img-responsive"}
                             src={sitemap}
                             alt="logo"
                        />
                    </div>
                    <div className="col-md-1"></div>
                </div>



              </div>
        </div>
    );
};

export default SiteMap;
