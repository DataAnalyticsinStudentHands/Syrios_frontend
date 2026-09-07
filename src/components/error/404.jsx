/**
 * ErrorPage.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Displays a fallback 404 page when a route is not found.
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this component returns JSX
 *
 * 2. Preserved behavior
 *    - Layout and messaging remain unchanged
 *
 * Notes:
 * - No environment variables used
 * - Pure presentational component
 *
 * Future Improvements:
 * - Replace `<center>` (deprecated) with CSS flexbox
 * - Add navigation link back to home
 * - Style for full-screen centering
 */

import React from "react";

const ErrorPage = () => {
  return (
    <div id="error-page">
      <center>
        <h1>404</h1>
        <h2>Sorry, the page you visited does not exist.</h2>
      </center>
    </div>
  );
};

export default ErrorPage;