/**
 * App.jsx — Vite Migration + Router Basename Refactor (2026)
 *
 * This file was refactored during the migration from Create React App (CRA) to Vite,
 * and later updated to fix routing behavior across dev and preview/build modes.
 *
 * Key Changes:
 * 1. Removed `.js` extensions from imports where appropriate
 *    - Vite requires correct extension handling and does not auto-resolve mismatches like CRA.
 *
 * 2. Converted environment variable usage
 *    - Replaced old CRA-style env access with Vite-compatible `import.meta.env.*`.
 *
 * 3. Preserved routing structure while splitting responsibilities
 *    - `AppRoutes` contains route definitions
 *    - `AppShell` contains shared layout, background, navbar, and router wrapper
 *
 * 4. Fixed Router basename behavior by environment
 *    - Dev mode uses `/dev` so local development matches the intended route prefix
 *    - Preview/build mode uses the root path `/`
 *
 * Why:
 * - The app worked in `npm run dev` but rendered a blank page in `npm run preview`
 *   because the router was still using `/dev` as a basename while preview was served from `/`.
 *
 * Outcome:
 * - `npm run dev` opens correctly at `/dev`
 * - `npm run build` / `npm run preview` open correctly at `/`
 *
 * Notes:
 * - Any file containing JSX must use `.jsx`
 * - If aliasing like `src/...` is used, it must be configured in `vite.config.js`
 * - Sass deprecation warnings are expected and are separate from this refactor
 *
 * This refactor is intentionally minimal-behavior-change and focused on compatibility.
 */

import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/styles.scss";

import background from "./assets/background.jpg";
import logo from "./assets/logoWhiteText.svg";

import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import Stories from "./pages/Stories/Stories";
import StoryReader from "./pages/Stories/StoryReader";
import HowToReadACoin from "./pages/Stories/HowToReadACoin";

import ExploreTheEvidence from "./pages/Evidence/ExploreTheEvidence";
import CoinSort from "./pages/Evidence/CoinSort/CoinSort";
import MapCoins from "./pages/Evidence/MapCoins/MapCoins";
import CoinCatalog from "./pages/Evidence/CoinCatalogy/CoinCatalog";
import Coins from "./pages/Evidence/CoinCatalogy/CoinList/Coins";
import CoinInfoPage from "./pages/Evidence/CoinCatalogy/coin-info/CoinInfoPage";
import Download from "./pages/Evidence/Download/Download";

import Toolbox from "./pages/Toolbox/Toolbox";
import VideoLibrary from "./pages/Toolbox/VideoLibrary/VideoLibrary";
import Timeline from "./pages/Toolbox/Timeline/Timeline";
import Glossary from "./pages/Toolbox/Glossary/Glossary";
import Coin3D from "./pages/Toolbox/Coin3D/Coin3D";
import Research from "./pages/Toolbox/Research/Research";
import GlossaryWrapper from "./pages/Toolbox/Glossary/glossary-wrapper";
import GlossaryTerm from "./pages/Toolbox/Glossary/GlossaryTerm";

import ErrorPage from "./components/error/404";
import FooterWrapper from "./components/footerv2/Footer2Wrapper";
import AutoScrollToTop from "./utils/ScrollToTop";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<FooterWrapper />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Stories" element={<Stories />} />
        <Route path="/Evidence" element={<ExploreTheEvidence />} />
        <Route path="/Toolbox" element={<Toolbox />} />
        <Route path="/Evidence/CoinSort" element={<CoinSort />} />
        <Route path="/Evidence/MapCoins" element={<MapCoins />} />
        <Route path="/Evidence/Timeline" element={<Timeline />} />
        <Route path="/Evidence/CoinCatalog" element={<CoinCatalog />} />
        <Route path="/Coins/:params" element={<Coins />} />
        <Route path="/Coin/:id" element={<CoinInfoPage />} />
        <Route path="/Evidence/Download" element={<Download />} />
        <Route path="/Toolbox/VideoLibrary" element={<VideoLibrary />} />
        <Route path="/Toolbox/Research" element={<Research />} />
        <Route path="/Toolbox/Coin3D" element={<Coin3D />} />
        <Route element={<GlossaryWrapper />}>
          <Route path="/Toolbox/Glossary/:group" element={<Glossary />} />
          <Route path="/Toolbox/Glossary/term/:term" element={<GlossaryTerm />} />
        </Route>
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/About" element={<AboutUs />} />
        <Route path="/*" element={<ErrorPage />} />
      </Route>

      <Route path="/HowToReadACoin" element={<HowToReadACoin />} />
      <Route path="/StoryReader" element={<StoryReader />} />
    </Routes>
  );
}

function AppShell({ basename }) {
  return (
    <div id="App" style={{ backgroundImage: `url(${background})` }}>
      <BrowserRouter basename={basename}>
        <AutoScrollToTop>
          <Navbar id="navbar" collapseOnSelect expand="md" sticky="top" className="navbar-dark">
            <Nav.Link as={Link} to="/">
              <img src={logo} alt="SyriosLogoLight" style={{ width: "50%" }} />
            </Nav.Link>

            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto" style={{ marginRight: "5.2vmax" }}>
                <Nav.Link as={Link} to="/" className="navbar-text d-flex align-items-center">
                  HOME
                </Nav.Link>
                <Nav.Link as={Link} to="/Stories" className="navbar-text d-flex align-items-center">
                  STORIES
                </Nav.Link>

                <NavDropdown title="EVIDENCE" className="navbar-text">
                  <NavDropdown.Item as={Link} to="/Evidence" className="navbar-text">
                    Overview
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/Evidence/CoinSort" className="navbar-text">
                    Coins in a Pile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Evidence/MapCoins" className="navbar-text">
                    Coins on a Map
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Evidence/Timeline" className="navbar-text">
                    Coins in Time
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Evidence/CoinCatalog" className="navbar-text">
                    Coins in a Catalog
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Evidence/Download" className="navbar-text">
                    Coins as Data
                  </NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="TOOL BOX" className="navbar-text">
                  <NavDropdown.Item as={Link} to="/Toolbox" className="navbar-text">
                    Overview
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/HowToReadACoin" className="navbar-text">
                    How to Read a Coin
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Toolbox/Coin3D" className="navbar-text">
                    Coin in 3D
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Toolbox/Glossary/all" className="navbar-text">
                    Glossary
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Evidence/Download" className="navbar-text">
                    Download Data
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Toolbox/Research" className="navbar-text">
                    Research
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Toolbox/VideoLibrary" className="navbar-text">
                    Video Library
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <AppRoutes />
        </AutoScrollToTop>
      </BrowserRouter>
    </div>
  );
}

function App() {
  const basename = import.meta.env.DEV ? "/dev" : undefined;
  return <AppShell basename={basename} />;
}

export default App;