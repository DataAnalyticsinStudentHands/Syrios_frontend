/**
 * Glossary.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders grouped glossary term listings by alphabet segment.
 *
 * Refactor Summary:
 * 1. Response Compatibility
 *    - Supports BOTH normalized glossary rows and legacy raw Strapi rows
 *    - Accepts:
 *        a) row.term
 *        b) row.attributes.term
 *
 * 2. Correct Alphabet Segment Filtering
 *    - Fixes grouped tab behavior for:
 *        All, ABC, DEF, GHI, JKL, MNO, PQRS, TUV, WXYZ
 *    - Uses full glossary list and filters client-side by first letter
 *
 * 3. Preserved Existing Behavior
 *    - Alphabet grouping, sorting, and link rendering remain unchanged
 *
 * 4. Improved Safety
 *    - Adds try/catch handling
 *    - Uses safer default state values
 *    - Filters invalid or empty glossary terms before grouping
 *
 * Notes:
 * - This file now tolerates partial migration where glossary endpoints
 *   may still return raw Strapi rows
 *
 * Future Improvements:
 * - Add empty-state UI when no glossary terms are returned
 * - Move glossary row normalization into a shared utility
 * - Normalize glossary API responses in `glossary.js`
 */

import React, { useState, useEffect } from 'react';
import glossaryRequest from 'src/api/glossary';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

function getGlossaryTerm(row) {
  return row?.term || row?.attributes?.term || '';
}

function groupByFL(arr) {
  return arr.reduce((store, word) => {
    if (typeof word !== 'string') return store;

    const trimmed = word.trim();
    if (!trimmed) return store;

    const letter = trimmed.charAt(0).toUpperCase();
    (store[letter] ||= []).push(trimmed);
    return store;
  }, {});
}

function getAllowedLetters(group) {
  const groups = {
    ABC: ['A', 'B', 'C'],
    DEF: ['D', 'E', 'F'],
    GHI: ['G', 'H', 'I'],
    JKL: ['J', 'K', 'L'],
    MNO: ['M', 'N', 'O'],
    PQRS: ['P', 'Q', 'R', 'S'],
    TUV: ['T', 'U', 'V'],
    WXYZ: ['W', 'X', 'Y', 'Z'],
  };

  return groups[group] || null;
}

const Glossary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [glossaryData, setGlossaryData] = useState({});

  const { group } = useParams();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const result = await glossaryRequest.glossaryFind();
        const rows = result?.data?.data || [];

        let contentList = rows
          .map((row) => getGlossaryTerm(row))
          .filter((term) => typeof term === 'string' && term.trim() !== '');

        if (group && group !== 'all') {
          const allowedLetters = getAllowedLetters(group);

          if (allowedLetters) {
            contentList = contentList.filter((term) =>
              allowedLetters.includes(term.trim().charAt(0).toUpperCase())
            );
          }
        }

        const grouped = groupByFL(contentList);
        const sorted = Object.keys(grouped)
          .sort()
          .reduce((obj, key) => {
            obj[key] = grouped[key].sort((a, b) => a.localeCompare(b));
            return obj;
          }, {});

        setGlossaryData(sorted);
      } catch (err) {
        console.error('Glossary load failed:', err);
        setGlossaryData({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [group]);

  if (isLoading) {
    return (
      <div id="glossary-loading">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div id="glossary-group">
      <ListGroup as="ul">
        {Object.entries(glossaryData).map(([key, value]) => (
          <div className="li-wrapper" key={key}>
            <ListGroup.Item>
              <Row className="py-4">
                <Col xs={2} className="glossary-alphabet d-flex justify-content-center align-items-center">
                  {key}
                </Col>
                <Col xs={8}>
                  <Row className="glossary-term">
                    {value.map((item) => (
                      <Col xs={3} key={item}>
                        <Link className="glossary-term-a" to={`/Toolbox/Glossary/term/${item}`}>
                          {item}
                        </Link>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </ListGroup.Item>
          </div>
        ))}
      </ListGroup>
    </div>
  );
};

export default Glossary;