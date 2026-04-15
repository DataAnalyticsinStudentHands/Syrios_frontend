/**
 * GlossarySearchBox.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders glossary live-search input and matching term results.
 *
 * Refactor Summary:
 * 1. Response Compatibility
 *    - Supports BOTH normalized glossary rows and legacy raw Strapi rows
 *    - Accepts:
 *        a) row.term
 *        b) row.attributes.term
 *
 * 2. Preserved Existing Behavior
 *    - Live-search behavior and result list rendering remain unchanged
 *
 * 3. Improved Safety
 *    - Clears results on empty input
 *    - Adds basic error handling
 *    - Removes console logging
 *    - Filters invalid glossary results before rendering
 *
 * Notes:
 * - This file now tolerates partial migration where glossary endpoints
 *   may still return raw Strapi rows
 *
 * Future Improvements:
 * - Add debounce to reduce search requests
 * - Add loading indicator for live-search results
 * - Normalize glossary API responses in `glossary.js`
 */

import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import glossaryRequest from "src/api/glossary";

function getGlossaryTerm(row) {
  return row?.term || row?.attributes?.term || '';
}

function SearchBar() {
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (inputText.length > 0) {
          const result = await glossaryRequest.glossarySearch(inputText);
          const rows = result?.data?.data || [];

          const safeRows = rows.filter((row) => {
            const term = getGlossaryTerm(row);
            return typeof term === 'string' && term.trim() !== '';
          });

          setData(safeRows);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Glossary search failed:', error);
        setData([]);
      }
    }

    fetchData();
  }, [inputText]);

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          className="search-box__input"
          label="Search glossary"
          placeholder="Search glossary"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
        />
      </div>

      {data.length > 0 && (
        <ListGroup className="result-list">
          {data.map((item, index) => {
            const term = getGlossaryTerm(item);

            return (
              <ListGroup.Item
                key={`${term}-${index}`}
                className="result-list-item"
              >
                <Link
                  className="glossary-term-a"
                  to={`/Toolbox/Glossary/term/${term}`}
                  onClick={() => {
                    setInputText("");
                    setData([]);
                  }}
                >
                  {term}
                </Link>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
}

export default SearchBar;