import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import styled from "styled-components";
import NavBarLogo from "./app/data/intro-images/Logo.png"
import Intro from "./app/IntroPage/intro";
import Syrios from "./app/FetchAPIdata/syrios"; //* uncomment this import to retrieve objects from "https://sites.lib.uh.edu/kmneuma2/api/items" API
import Animate from "./app/CoinAnimate/animate"; //* uncomment this import to retrieve images from 'data/images.json'
import SelectStory from "./app/SelectStory/select";
import Explore from "./app/LetMeExplore/explore";
import Civic from "./app/CivicStory/civic-story";
import Economic from "./app/EconomicStory/economic-story";
import Religious from "./app/ReligiousStory/religious-story";
import Visitors from "./app/VisitorsStory/visitors-story";
import Maps from "./app/MapCoins/map";
import Download from "./app/CoinsDownload/download";
import Gods from "./app/GodsPortal/gods";
import ContactUs from "./app/ContactUs/contact";
import About from "./app/About/about";
import GraphQLClient from "./app/GraphQLClient/gqlclient";
import Footer from "./app/Footer/footer";
import './app/data/fonts/fonts.css';
import './index.css';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect,
} from "react-router-dom";

// styling fro navbar - still need to do active see https://codesandbox.io/s/718p1ovkm1?from-embed
const Styles = styled.div`
  
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
        <Styles>
        <Navbar collapseOnSelect
                expand="xl"
        >
        <Link to="/" ><input src={NavBarLogo} type="image" style={{height:'40px', width:'35px', margin:'0px'}} alt="LOGO"/></Link>
          <Navbar.Brand style={{marginLeft:'10px'}} href="/">The Syrios Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">HOME</Nav.Link>
              <NavDropdown title="TELL ME A STORY">
                <NavDropdown.Item href="/civic-story">Civic Story</NavDropdown.Item>
                <NavDropdown.Item href="/economic-story">Economic Story</NavDropdown.Item>
                <NavDropdown.Item href="/religious-story">Religious Story</NavDropdown.Item>
                <NavDropdown.Item href="/visitors-story">Visitor's Story</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="LET ME EXPLORE">
                <NavDropdown.Item href="/coins">Sort Coins</NavDropdown.Item>
                <NavDropdown.Item href="/maps">Map Coins</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/omeka-database">View a Catalog</NavDropdown.Item>
                <NavDropdown.Item href="/download">Download Dataset</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/about">ABOUT</Nav.Link>
              <Nav.Link href="/contact-us">CONTACT US</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        </Styles>

        <Switch>
          <Route exact path="/" component={Intro} />
          <Route exact path="/coins" component={Animate} />
          <Route exact path="/data-api" component={Syrios} />
          <Route exact path="/select-story" component={SelectStory} />
          <Route exact path="/explore" component={Explore} />
          <Route exact path="/civic-story" component={Civic} />
          <Route exact path="/economic-story" component={Economic} />
          <Route exact path="/religious-story" component={Religious} />
          <Route exact path="/visitors-story" component={Visitors} />
          <Route exact path="/maps" component={Maps} />
          <Route exact path="/download" component={Download}/>
          <Route exact path="/gods-portal" component={Gods} />
          <Route exact path="/contact-us" component={ContactUs} />
          <Route exact path="/about" component={About} />
          <Route exact path="/graphql-client" component={GraphQLClient}/>
          {/* <Route exact path="/" component={Demo}/> */}
          <Route
            exact
            path="/omeka-database"
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

      </Router>
    </div>
  );
};

export default App;
