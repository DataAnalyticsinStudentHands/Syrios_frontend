import React from 'react';
import {
  FooterMain,
  FooterHead,
  FooterLink,
} from './componentStyling';
import logo from './data/intro-images/Logo.png';

function Footer() {
  return (
    <div className="container-fluid p-0">
      <FooterMain>
        <div className="row p-6">
          <div className="col-md-2">
            <img className={'img-responsive'} src={logo} alt="logo" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3 pt-5">
            <FooterHead>The SYRIOS Project</FooterHead>
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-12 pt-5"></div>
            </div>
            <div className="row">
              <div className="col-6">
                <FooterLink href="/" target="_self">
                  Home
                </FooterLink>
                <br />
                <FooterLink href="/select-story" target="_self">
                  Tell Me a Story
                </FooterLink>
                <br />
                <FooterLink href="/explore" target="_self">
                  Let Me Explore
                </FooterLink>
              </div>
              <div className="col-6">
                <FooterLink href="/about" target="_self">
                  About Us
                </FooterLink>
                <br />
                {/*<FooterLink href="/resources" target="_self">
                  Resources
                </FooterLink>
                <br />*/}
                <FooterLink href="/contact-us" target="_self">
                  Contact Us
                </FooterLink>
              </div>
            </div>
          </div>
        </div>
      </FooterMain>
    </div>
  );
}

export default Footer;
