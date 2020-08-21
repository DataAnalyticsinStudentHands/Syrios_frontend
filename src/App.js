import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
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
import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect,
} from "react-router-dom";

const StyledLink = styled(Link)`
    text-decoration: none;


    &:focus, &:visited, &:link, &:active {
        text-decoration: none;
        color: #2D616A
    }
    &:hover {
      color: #BE9672;
    }
`;

const DropDownLink = styled(Link)`
    text-decoration: none;

    &:focus, &:visited, &:link, &:active {
        text-decoration: none;
        color: #2D616A;

    }
    &:hover {
      color: #E3B287;
    }
`;

const App = () => {
  return (
    <div>
      <Router>

        {/* !!!!!!!!!!! NAVBAR COMPONENT !!!!!!!!!!!! */}
        <div>
        <Navbar className="color-nav" collapseOnSelect expand="xl">
        <Link to="/"><input src={NavBarLogo} type="image" style={{height:'40px', width:'35px', margin:'0px'}} alt="LOGO"/></Link>
          <Navbar.Brand>
            <StyledLink to="/" style={{marginLeft:'10px'}}>The Syrios Project</StyledLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link>
                <StyledLink to="/">HOME</StyledLink>
              </Nav.Link>
              <NavDropdown title="TELL ME A STORY" id="collasible-nav-dropdown">
                <NavDropdown.Item>
                  <DropDownLink to="/civic-story">Civic Story</DropDownLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <DropDownLink to="/economic-story">Economic Story</DropDownLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <DropDownLink to="/religious-story">Religious Story</DropDownLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <DropDownLink to="/visitors-story">Visitor's Story</DropDownLink>
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="LET ME EXPLORE" id="collasible-nav-dropdown">
                <NavDropdown.Item>
                  {" "}
                  <DropDownLink to="/coins">Sort Coins</DropDownLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  {" "}
                  <DropDownLink to="/maps">Map Coins</DropDownLink>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  {" "}
                  <DropDownLink to="/omeka-database">View a Catalog</DropDownLink>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  {" "}
                  <DropDownLink to="/download">Download Dataset</DropDownLink>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav.Link>
              <StyledLink to="about">ABOUT</StyledLink>
            </Nav.Link>
            <Nav.Link>
              <StyledLink to="contact-us">CONTACT US</StyledLink>
            </Nav.Link>
          </Navbar.Collapse>
        </Navbar>
        </div>

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
