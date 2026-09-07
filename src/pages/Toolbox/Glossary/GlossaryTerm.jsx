/**
 * GlossaryTerm.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders a single glossary term detail page.
 *
 * Refactor Summary:
 * 1. Response Compatibility
 *    - Supports BOTH normalized glossary rows and legacy raw Strapi rows
 *    - Accepts:
 *        a) results.data.data[0]
 *        b) results.data.data[0].attributes
 *
 * 2. Preserved Existing Behavior
 *    - Definition, related words, and context rendering remain unchanged
 *
 * 3. Improved Safety
 *    - Adds try/catch handling
 *    - Uses safer default state values
 *    - Guards against missing term results
 *    - Safely reads related glossary terms across partial migration states
 *
 * Notes:
 * - This file now tolerates partial migration where glossary endpoints
 *   may still return raw Strapi rows
 *
 * Future Improvements:
 * - Add "term not found" UI
 * - Normalize related glossary words more explicitly
 * - Normalize glossary API responses in `glossary.js`
 */

import React, { useState, useEffect } from "react";
import glossaryRequest from "src/api/glossary";
import createMarkup from "src/utils/Markup";
import { Link, useParams } from "react-router-dom";

function normalizeGlossaryRow(row) {
  if (!row) return {};

  if (row?.attributes && typeof row.attributes === 'object') {
    return {
      ...row.attributes,
      id: row.id,
    };
  }

  return row;
}

function getGlossaryTerm(row) {
  return row?.term || row?.attributes?.term || '';
}

const GlossaryTerm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [termData, setTermData] = useState({});
  const { term } = useParams();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        if (term) {
          const results = await glossaryRequest.glossaryFindByTerm(term);
          const rawRow = results?.data?.data?.[0] || {};
          setTermData(normalizeGlossaryRow(rawRow));
        } else {
          setTermData({});
        }
      } catch (error) {
        console.error('Failed to load glossary term:', error);
        setTermData({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [term]);

  if (isLoading) {
    return (
      <div id="glossary-loading">
        <div className="loader" />
      </div>
    );
  }

  const relatedWords = Array.isArray(termData.glossaries) ? termData.glossaries : [];

  return (
    <div id="glossary-term">
      <div className="glossary-item">
        <div className="glossary-term">{termData.term}</div>
        <p className="glossary-basic">
          <span> {termData.type} </span>

          {termData.syllabication && (
            <>
              <span>&nbsp;|&nbsp;</span>
              <span> {termData.syllabication} </span>
            </>
          )}

          {termData.sounds_like && (
            <>
              <span>&nbsp;|&nbsp;</span>
              <span> {termData.sounds_like} </span>
            </>
          )}
        </p>
      </div>

      {(termData.definition || '').length > 0 && (
        <div className="glossary-item">
          <div className="glossary-title">DEFINITION</div>
          <div
            className="glossary-body"
            dangerouslySetInnerHTML={createMarkup(termData.definition)}
          />
        </div>
      )}

      {relatedWords.length > 0 && (
        <div className="glossary-item">
          <div className="glossary-title">Related Words</div>
          <div className="glossary-related-word">
            {relatedWords.map((word, index) => {
              const relatedTerm = getGlossaryTerm(word);

              if (!relatedTerm) return null;

              return (
                <span key={`${relatedTerm}-${index}`}>
                  <Link to={`/Toolbox/Glossary/term/${relatedTerm}`}>
                    {relatedTerm}
                  </Link>
                  &nbsp;&nbsp;
                </span>
              );
            })}
          </div>
        </div>
      )}

      {termData.context && (
        <div className="glossary-item">
          <div className="glossary-title">See Word in Context</div>
          <div
            className="glossary-body"
            style={{ fontSize: "5em" }}
            dangerouslySetInnerHTML={createMarkup(termData.context)}
          />
        </div>
      )}
    </div>
  );
};

export default GlossaryTerm;