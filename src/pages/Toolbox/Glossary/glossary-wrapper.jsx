/**
 * glossary-wrapper.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the glossary page shell, including:
 * - glossary homepage content
 * - search box
 * - tab navigation
 * - nested glossary routes
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated glossary home access from:
 *        result.data.data.attributes
 *      → to:
 *        result.data.data
 *
 * 2. Preserved Existing Behavior
 *    - Tab navigation and nested route rendering remain unchanged
 *
 * 3. Improved Safety
 *    - Adds basic error handling and safer default state values
 *
 * Notes:
 * - Assumes `glossaryHomeFind()` returns a normalized singleton response
 *
 * Future Improvements:
 * - Extract tab rendering into helper
 * - Add empty/error state UI for missing glossary home content
 */

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { Container, Nav } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import SearchBar from "./GlossarySearchBox";
import glossaryRequest from "src/api/glossary";
import LoadingPage from "src/components/loadingPage/LoadingPage";
import PageTitleComponent from "src/components/constant/pageTitleText";

function GlossaryWrapper() {
  const alphabetGroup = [
    "ABC",
    "DEF",
    "GHI",
    "JKL",
    "MNO",
    "PQRS",
    "TUV",
    "WXYZ",
  ];

  const { group, term } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [glossary, setGlossary] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await glossaryRequest.glossaryHomeFind();
        setGlossary(result?.data?.data || {});
      } catch (error) {
        console.error('Failed to load glossary home:', error);
        setGlossary({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <div id="glossary-page">
      <Container>
        <PageTitleComponent
          title={glossary.title}
          text={glossary.text}
          subtext={glossary.subtext}
          icon={<sup className="story-icon">&#xe817;</sup>}
        />

        <SearchBar />

        <Nav
          variant="tabs"
          defaultActiveKey="/All"
          className="d-flex justify-content-center"
          style={{ marginTop: "3.5vmax" }}
        >
          <Nav.Item>
            <Link
              to="/Toolbox/Glossary/all"
              eventkey="All"
              style={{
                backgroundColor: group === "all" ? "white" : "",
              }}
            >
              All
            </Link>
          </Nav.Item>

          {group ? (
            <>
              {alphabetGroup.map((alphabet) => (
                <Nav.Item key={alphabet}>
                  <Link
                    to={`/Toolbox/Glossary/${alphabet}`}
                    style={{
                      backgroundColor: group === alphabet ? "white" : "",
                    }}
                    eventkey={alphabet}
                  >
                    {alphabet}
                  </Link>
                </Nav.Item>
              ))}
            </>
          ) : null}

          {term ? (
            <>
              {alphabetGroup.map((alphabet) => (
                <Nav.Item key={alphabet}>
                  <Link
                    to={`/Toolbox/Glossary/${alphabet}`}
                    style={{
                      backgroundColor:
                        alphabet.indexOf(term.charAt(0).toUpperCase()) !== -1
                          ? "white"
                          : "",
                    }}
                    eventkey={alphabet}
                  >
                    {alphabet}
                  </Link>
                </Nav.Item>
              ))}
            </>
          ) : null}
        </Nav>

        <Outlet />
      </Container>
    </div>
  );
}

export default GlossaryWrapper;