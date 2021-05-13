import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import styled from "styled-components";
import ReactGA from 'react-ga';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';
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

// setup for Google Analytics
const trackingId = 'G-57WWLR6KCZ';
ReactGA.initialize(trackingId);
ReactGA.set({
  // any data that is relevant to the user session
  // that you would like to track with google analytics
});

// setup for page view tracking
const history = createBrowserHistory();

// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

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
      <Router history={history}>
        {/* !!!!!!!!!!! NAVBAR COMPONENT !!!!!!!!!!!! */}
        <ScrollIntoView>
        <NavbarStyles>
        <Navbar collapseOnSelect
                expand="xl"
        >
        <Link to="/" ><input src={NavBarLogo} type="image" style={{height:'40px', width:'35px', margin:'0px'}} alt="LOGO"/></Link>
          <Navbar.Brand style={{marginLeft:'10px'}} href="/">The SYRIOS Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">HOME</Nav.Link>
              <NavDropdown title="TELL ME A STORY">
                <NavDropdown.Item href="/civic-story">Political Story</NavDropdown.Item>
                <NavDropdown.Item href="/economic-story">Economic Story</NavDropdown.Item>
                <NavDropdown.Item href="/religious-story">Religious Story</NavDropdown.Item>
                <NavDropdown.Item href="/visitors-story">Visitor's Story</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="ACCESS DATA">
                <NavDropdown.Item href="https://sites.lib.uh.edu/kmneuma2/items/browse" target="_blank">View a Catalog</NavDropdown.Item>
                <NavDropdown.Item href="/download">Download Dataset</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/about">ABOUT</Nav.Link>
              <Nav.Link href="/contact-us">CONTACT US</Nav.Link>
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
