/**
 * App.jsx — Vite Migration + Router Basename Refactor (2026)
 *
 * PURPOSE:
 * Root application component responsible for:
 * - Global application layout
 * - BrowserRouter setup
 * - Navbar rendering
 * - Route definitions
 * - Shared footer-wrapped layout routes
 *
 * ----------------------------------------
 * 🔧 ROUTING STRATEGY
 * ----------------------------------------
 *
 * This app intentionally uses different router basenames by environment:
 *
 * - Development (`npm run dev`)
 *   → basename = "/dev"
 *   → local routes resolve under `/dev/...`
 *
 * - Preview / Production
 *   → basename = undefined
 *   → routes resolve from `/`
 *
 * WHY:
 * - Local development is intentionally served under `/dev`
 * - Preview/build is served from root `/`
 * - This preserves the historical route structure used by the app
 *
 * IMPORTANT:
 * - Do NOT replace this basename logic with `import.meta.env.BASE_URL`
 *   unless deployment strategy changes
 * - Doing so would remove the custom `/dev` local route prefix
 *
 * ----------------------------------------
 * 📦 NOTES
 * ----------------------------------------
 *
 * - Any file containing JSX must use `.jsx`
 * - Alias imports like `src/...` require Vite alias configuration
 * - This file keeps behavior intentionally stable
 *
 * ----------------------------------------
 * 🚀 FUTURE IMPROVEMENTS
 * ----------------------------------------
 *
 * - Add route-level lazy loading
 * - Add Error Boundary
 * - Add auth guards if protected routes are introduced
 */

import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/styles.scss";

import background from "./assets/background.jpg";
import logo from "./assets/logoWhiteText.svg";
import LoadingPage from "./components/loadingPage/LoadingPage";

import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import Stories from "./pages/Stories/Stories";
import StoryReader from "./pages/Stories/StoryReader";
import HowToReadACoin from "./pages/Stories/HowToReadACoin";

import ExploreTheEvidence from "./pages/Evidence/ExploreTheEvidence";
import CoinSort from "./pages/Evidence/CoinSort/CoinSort";
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

const MapCoins = React.lazy(() => import("./pages/Evidence/MapCoins/MapCoins"));
const CoinDetective = React.lazy(() => import("./pages/Toolbox/CoinDetective/CoinDetective"));
const CoinCurator = React.lazy(() => import("./pages/Toolbox/CoinCurator/CoinCurator"));
const ArchiveLab = React.lazy(() => import("./pages/Toolbox/ArchiveLab/ArchiveLab"));

/**
 * ----------------------------------------
 * 📍 APP ROUTES
 * ----------------------------------------
 *
 * Route tree for the application.
 *
 * Most routes are wrapped in `FooterWrapper`
 * so they inherit the shared footer layout.
 *
 * A couple of routes intentionally sit outside
 * that wrapper for standalone rendering behavior.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route element={<FooterWrapper />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Stories" element={<Stories />} />
        <Route path="/Evidence" element={<ExploreTheEvidence />} />
        <Route path="/Toolbox" element={<Toolbox />} />

        {/* Evidence routes */}
        <Route path="/Evidence/CoinSort" element={<CoinSort />} />
        <Route
          path="/Evidence/MapCoins"
          element={(
            <React.Suspense fallback={null}>
              <MapCoins />
            </React.Suspense>
          )}
        />
        <Route path="/Evidence/Timeline" element={<Timeline />} />
        <Route path="/Evidence/CoinCatalog" element={<CoinCatalog />} />
        <Route path="/Coins/:params" element={<Coins />} />
        <Route path="/Coin/:id" element={<CoinInfoPage />} />
        <Route path="/Evidence/Download" element={<Download />} />

        {/* Toolbox routes */}
        <Route
          path="/Toolbox/CoinDetective"
          element={(
            <React.Suspense fallback={null}>
              <CoinDetective />
            </React.Suspense>
          )}
        />
        <Route
          path="/Toolbox/CoinCurator"
          element={(
            <React.Suspense fallback={<LoadingPage variant='coin-curator' />}>
              <CoinCurator />
            </React.Suspense>
          )}
        />
        <Route
          path="/Toolbox/ArchiveLab"
          element={(
            <React.Suspense fallback={null}>
              <ArchiveLab />
            </React.Suspense>
          )}
        />
        <Route path="/Toolbox/VideoLibrary" element={<VideoLibrary />} />
        <Route path="/Toolbox/Research" element={<Research />} />
        <Route path="/Toolbox/Coin3D" element={<Coin3D />} />

        {/* Nested glossary routes */}
        <Route element={<GlossaryWrapper />}>
          <Route path="/Toolbox/Glossary/:group" element={<Glossary />} />
          <Route path="/Toolbox/Glossary/term/:term" element={<GlossaryTerm />} />
        </Route>

        {/* Static/info pages */}
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/About" element={<AboutUs />} />

        {/* Catch-all */}
        <Route path="/*" element={<ErrorPage />} />
      </Route>

      {/* Standalone routes outside FooterWrapper */}
      <Route path="/HowToReadACoin" element={<HowToReadACoin />} />
      <Route path="/StoryReader" element={<StoryReader />} />
    </Routes>
  );
}

/**
 * ----------------------------------------
 * 🧱 APP SHELL
 * ----------------------------------------
 *
 * Shared global application shell:
 * - background image
 * - BrowserRouter
 * - navbar
 * - scroll reset
 * - route rendering
 */
function AppShell({ basename }) {
  return (
    <div id="App" style={{ backgroundImage: `url(${background})` }}>
      <BrowserRouter basename={basename}>
        <AutoScrollToTop>
          <Navbar
            id="navbar"
            collapseOnSelect
            expand="lg"
            sticky="top"
            className="navbar-dark"
          >
            {/* Logo / home link */}
            <Navbar.Brand as={Link} to="/" className="syrios-navbar__brand">
              <img src={logo} alt="Syrios home" />
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              aria-label="Toggle site navigation"
            />

            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto syrios-navbar__links">
                <Nav.Link as={Link} to="/" className="navbar-text d-flex align-items-center">
                  HOME
                </Nav.Link>

                <Nav.Link as={Link} to="/Stories" className="navbar-text d-flex align-items-center">
                  STORIES
                </Nav.Link>

                {/* Evidence dropdown */}
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

                {/* Toolbox dropdown */}
                <NavDropdown title="TOOL BOX" className="navbar-text">
                  <NavDropdown.Item as={Link} to="/Toolbox" className="navbar-text">
                    Overview
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/HowToReadACoin" className="navbar-text">
                    How to Read a Coin
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Toolbox/CoinDetective" className="navbar-text">
                    Coin Detective
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Toolbox/CoinCurator" className="navbar-text">
                    Coin Curator
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Toolbox/ArchiveLab" className="navbar-text">
                    Archive Lab
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

/**
 * ----------------------------------------
 * 🚀 ROOT APP
 * ----------------------------------------
 *
 * Keeps the historical `/dev` basename behavior for local development.
 *
 * Development:
 *   /dev
 *
 * Preview / build / production:
 *   /
 */
function App() {
  // Detect if we're running under /dev
  const isDevPath = window.location.pathname.startsWith("/dev");

  const basename = isDevPath ? "/dev" : undefined;

  return <AppShell basename={basename} />;
}

export default App;
