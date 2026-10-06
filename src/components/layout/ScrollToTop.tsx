/**
 * ================================================================
 * TypeScript + React (TSX)
 * ScrollToTop.tsx
 *
 * Provides consistent scroll restoration for internal route changes.
 * When the customer navigates to a different page, the new page starts
 * at the top instead of inheriting the previous page's scroll position.
 * ================================================================
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Watches the current pathname and resets the browser scroll position
 * whenever React Router navigates to a different page.
 *
 * This component renders no visible interface.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}