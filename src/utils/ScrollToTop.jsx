/**
 * AutoScrollToTop.jsx
 * Vite migration:
 * - No env changes needed
 * - Ensures scroll resets on route change
 */

import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const AutoScrollToTop = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};

export default AutoScrollToTop;