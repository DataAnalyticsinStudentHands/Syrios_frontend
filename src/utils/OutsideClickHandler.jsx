/**
 * OutsideClickHandler.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Detects clicks outside of a wrapped element and triggers a callback.
 *
 * Improvements:
 * 1. Uses `pointerdown` instead of `click`
 *    - More responsive (fires earlier than click)
 *
 * 2. Supports conditional activation via `show`
 *    - Prevents unnecessary event listeners when not needed
 *
 * 3. Safer event handling
 *    - Guards against null refs
 *    - Prevents stale callback issues
 *
 * Notes:
 * - Commonly used for dropdowns, modals, tooltips
 * - Should wrap only the interactive region
 */

import { useEffect, useRef } from 'react';

const OutsideClickHandler = ({ children, onOutsideClick, show = true }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!show) return;

    const handlePointerDown = (event) => {
      if (!ref.current) return;

      if (!ref.current.contains(event.target)) {
        onOutsideClick?.();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [show, onOutsideClick]);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
};

export default OutsideClickHandler;