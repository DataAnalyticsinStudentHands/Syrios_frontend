import React from "react";
import "./footer.css";
import {
    FooterHead,
    FooterLinks
} from "../componentStyling";
import logo from "../data/intro-images/Logo.png"

function Footer() {
    return (
        <div className="row main-footer">
          <div className="col-md-2">
            <img
              className={"size-images-md"}
              src={logo}
              alt="logo"
            />
          </div>
          <div className="col-md-2">
            <FooterHead>
              The Syrios Project
            </FooterHead>
          </div>
          <div className="col-md-4">
          </div>
          <div className="col-md-2">
            <FooterLinks>
              <a href="/" target="_self">Home</a>
                <br></br>
              <a href="/select-story" target="_self">Tell Me a Story</a>
                <br></br>
              <a href="/explore" target="_self">Let Me Explore</a>
            </FooterLinks>
          </div>
          <div className="col-md-2">
            <FooterLinks>
              <a href="/about" target="_self">About Us</a>
                <br></br>
              <a href="/resources" target="_self">Resources</a>
                <br></br>
              <a href="/contact-us" target="_self">Contact Us</a>
            </FooterLinks>
          </div>
        </div>
    );
}

export default Footer;
