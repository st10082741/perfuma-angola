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
 * Resets the browser scroll position whenever the route changes.
 *
 * PROBLEM:
 * Originally, this component only watched the pathname:
 *
 *   const { pathname } = useLocation();
 *   ...
 *   }, [pathname]);
 *
 * This worked when navigating between different pages such as:
 *   /about -> /shop
 *   /contact -> /shop
 *   /home -> /shop
 *
 * However, Shop, Men, Women and Unisex all use the same `/shop`
 * pathname and change the catalogue category through URL search
 * parameters instead:
 *
 *   /shop
 *   /shop?category=Men
 *   /shop?category=Women
 *   /shop?category=Unisex
 *
 * Because the pathname remained `/shop`, React did not rerun the
 * scroll effect when navigating between these catalogue categories.
 * This caused the customer to remain near the bottom of the page.
 *
 * SOLUTION:
 * We changed:
 *
 *   const { pathname } = useLocation();
 *
 * to:
 *
 *   const { pathname, search } = useLocation();
 *
 * and changed the effect dependency from:
 *
 *   [pathname]
 *
 * to:
 *
 *   [pathname, search]
 *
 * The component now detects both normal page navigation and changes
 * to catalogue query parameters, ensuring Shop, Men, Women and Unisex
 * all return to the top when navigating between them.
 *
 * This component renders no visible interface.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, search]);

  return null;
}
