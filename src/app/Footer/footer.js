import React from "react";
import "./footer.css"
import {
    FooterHead,
    FooterLinks
} from "../componentStyling";
import logo from "../data/intro-images/Logo.png"

function Footer() {
    return (
        <div className="main-footer">
          <div className="first">
            <img
              className={"logo"}
              src={logo}
              alt="logo"
            />
          </div>
          <div className="second">
            <FooterHead>
              The Syrios Project
            </FooterHead>
          </div>
          <div className="third">
          </div>
          <div className="fourth">
            <FooterLinks>
              <a href="/" target="_self">Home</a>
                <br></br>
              <a href="/select-story" target="_self">Tell Me a Story</a>
                <br></br>
              <a href="/explore" target="_self">Let Me Explore</a>
            </FooterLinks>
          </div>
          <div className="fifth">
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
