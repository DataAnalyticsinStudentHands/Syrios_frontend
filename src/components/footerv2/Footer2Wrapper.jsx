/**
 * FooterWrapper.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Layout wrapper that renders routed content (`Outlet`)
 * followed by the global `Footer2` component.
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this component returns JSX
 *
 * 2. Preserved behavior
 *    - Maintains layout structure: page content → footer
 *
 * Notes:
 * - Uses React Router `Outlet` for nested routing
 * - No environment variables used
 *
 * Future Improvements:
 * - Expand into full layout wrapper (header/nav/footer)
 * - Add scroll restoration or layout-level state if needed
 */

import { Outlet } from "react-router-dom";
import Footer2 from "./Footer2";

function FooterWrapper() {
  return (
    <>
      <Outlet />
      <Footer2 />
    </>
  );
}

export default FooterWrapper;