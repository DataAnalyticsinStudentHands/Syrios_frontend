/**
 * LoadingPage.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Displays a loading spinner while content is being fetched or initialized.
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this component returns JSX
 *
 * 2. Preserved behavior
 *    - Layout and loader animation remain unchanged
 *
 * Notes:
 * - No environment variables used
 * - Pure presentational component
 *
 * Future Improvements:
 * - Add accessibility (aria-busy / aria-live)
 * - Allow size or variant props
 */

import React from "react";

const LoadingPage = () => {
  return (
    <div className="loading_big_div">
      <div className="loader" />
    </div>
  );
};

export default LoadingPage;