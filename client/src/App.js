import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import NavBarLogo from "./data/intro-images/Logo.png"
import Intro from "./intro";
import SelectStory from "./select_story";
import Explore from "./explore";
import Political from "./civic-story";
import Economic from "./economic-story";
import Religious from "./religious-story";
import Visitors from "./visitors-story";
import Maps from "./map";
import Download from "./download";
import ContactUs from "./contact-us";
import About from "./about";
import CoinPile from "./CoinPile/coin-pile";
import Footer from "./footer";
import SiteMap from "./site-map";
import ScrollIntoView from "./ScrollIntoView";
import './data/fonts/fonts.css';
import {LinkContainer} from 'react-router-bootstrap'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect,
} from "react-router-dom";
import styled from "styled-components";

// Styles for navbar - still need to do active see https://codesandbox.io/s/718p1ovkm1?from-embed
const NavbarStyles = styled.div`
  font-family: "CormorantGaramond-Regular";
  letter-spacing: 0.03em;

    .dropdown-item {
    color: #17434A;

      &:hover {
        color: #E3B287;
      }
    }

    .navbar-light .navbar-nav .nav-link {
      font-size: larger;
      color: #17434A;

      &:hover {
        color: #E3B287;
      }
    }
    .navbar-brand, .navbar-nav .nav-item nav-link {
      font-size: larger;
      color: #17434A;
      &:focus, &:visited {
        color: #17434A
      }

      &:hover {
        text-decoration: none;
        color: #E3B287;
      }
    }
`;

const App = () => {
  return (
    <div>
      <Router>
        {/* !!!!!!!!!!! NAVBAR COMPONENT !!!!!!!!!!!! */}
        <ScrollIntoView>
        <NavbarStyles>
        <Navbar collapseOnSelect
                expand="xl"
        >
        <Link to="/" ><input src={NavBarLogo} type="image" style={{height:'40px', width:'35px', margin:'0px'}} alt="LOGO"/></Link>
          <Navbar.Brand style={{position: "relative", top: "-5px", marginLeft:'10px'}} href="/">SYRIOS</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <LinkContainer to="/">
                <Nav.Link>HOME</Nav.Link>
              </LinkContainer>
              <NavDropdown title="TELL ME A STORY">
                <LinkContainer to="/civic-story">
                  <NavDropdown.Item>Political Story</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/economic-story">
                  <NavDropdown.Item>Economic Story</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/religious-story">
                  <NavDropdown.Item>Religious Story</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/visitors-story">
                  <NavDropdown.Item>Visitor's Story</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown title="LET ME EXPLORE">
                <LinkContainer to="/coin-pile">
                  <NavDropdown.Item>Sort Coins</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/maps">
                  <NavDropdown.Item>Map Coins</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item href="https://sites.lib.uh.edu/kmneuma2/items/browse" target="_blank">View a Catalog</NavDropdown.Item>
                <LinkContainer to="/download">
                  <NavDropdown.Item>Download Dataset</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to="/about">
                  <Nav.Link>ABOUT</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contact-us">
                  <Nav.Link>CONTACT US</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        </NavbarStyles>

        <Switch>
          <Route exact path="/" component={Intro} />
          <Route exact path="/select-story" component={SelectStory} />
          <Route exact path="/explore" component={Explore} />
          <Route exact path="/civic-story" component={Political} />
          <Route exact path="/economic-story" component={Economic} />
          <Route exact path="/religious-story" component={Religious} />
          <Route exact path="/visitors-story" component={Visitors} />
          <Route exact path="/maps" component={Maps} />
          <Route exact path="/download" component={Download} />
          <Route exact path="/contact-us" component={ContactUs} />
          <Route exact path="/about" component={About} />
          <Route exact path="/coin-pile" component={CoinPile} />
          <Route exact path="/site-map" component={SiteMap} />
          <Route
              exact
              path="/omeka"
              component={() => {
                window.location.href =
                    "https://sites.lib.uh.edu/kmneuma2/items/browse";
                return null;
              }}
          />
          {/* <Redirect to="/404" /> */}
        </Switch>

        <div>
          <Footer />
        </div>
        </ScrollIntoView>
      </Router>
    </div>
  );
};

export default App;
