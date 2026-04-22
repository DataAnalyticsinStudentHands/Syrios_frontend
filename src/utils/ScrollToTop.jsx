/**
 * AutoScrollToTop.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Automatically scrolls the page to the top on route change.
 *
 * Improvements:
 * 1. Uses `window.scrollTo` for better cross-browser behavior
 * 2. Supports optional smooth scrolling
 * 3. Handles hash anchors (e.g., /page#section)
 * 4. Uses `useEffect` to avoid blocking layout
 *
 * Props:
 * - smooth (boolean): enables smooth scrolling (default: false)
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AutoScrollToTop = ({ children, smooth = false }) => {
  const location = useLocation();

  useEffect(() => {
    // If navigating to a hash, let browser handle it
    if (location.hash) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [location.pathname]);

  return children;
};

export default AutoScrollToTop;