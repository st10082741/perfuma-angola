import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { storeConfig } from "../../config/store";
import { useLanguage } from "../../i18n/LanguageContext";

/**
 * =========================================================
 * PERFUMA ANGOLA — MAIN NAVIGATION
 * =========================================================
 *
 * IMPORTANT STRUCTURE NOTE:
 * Shop, Men, Women and Unisex all use the same `/shop` page.
 * The category is stored in the URL query string, for example:
 *
 *   /shop?category=Men
 *
 * React Router's normal NavLink active state mainly compares the pathname.
 * That caused Shop + Men + Women + Unisex to appear active at the same time.
 *
 * We therefore calculate the active state ourselves and compare BOTH:
 *   1. the pathname (`/shop`)
 *   2. the selected category query parameter (`Men`, `Women`, `Unisex`)
 *
 * This keeps the visual navigation accurate and also makes the logic easy to
 * understand if more catalogue categories are added later.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/shop", label: t.nav.shop },
    { to: "/shop?category=Men", label: t.nav.men },
    { to: "/shop?category=Women", label: t.nav.women },
    { to: "/shop?category=Unisex", label: t.nav.unisex },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ];

  /**
   * Returns true only when this exact navigation destination is selected.
   *
   * Examples:
   * - `/shop`                  => only Shop is active
   * - `/shop?category=Men`     => only Men is active
   * - `/shop?category=Women`   => only Women is active
   * - `/shop?category=Unisex`  => only Unisex is active
   */
  function isLinkActive(to: string) {
    const [targetPath, targetSearch = ""] = to.split("?");

    if (location.pathname !== targetPath) return false;

    // Routes such as Home, About and Contact do not use catalogue filters.
    if (targetPath !== "/shop") return true;

    const currentParams = new URLSearchParams(location.search);
    const targetParams = new URLSearchParams(targetSearch);
    const currentCategory = currentParams.get("category");
    const targetCategory = targetParams.get("category");

    // Plain /shop is active only when there is no category selected.
    if (!targetCategory) return !currentCategory;

    // Category links are active only when their exact category is selected.
    return currentCategory === targetCategory;
  }

  function changeLanguage(next: "pt" | "en") {
    setLanguage(next);
    setOpen(false);
  }

  return (
    <header className="nav">
      <Link
        className="brand"
        to="/"
        aria-label={`${storeConfig.businessName} home`}
      >
        <img
          className="brand-logo"
          src={storeConfig.logoPath}
          alt="Perfuma Angola"
        />
        <div>
          {storeConfig.businessName}
          <small>FINE FRAGRANCE · ANGOLA</small>
        </div>
      </Link>

      <nav
        className={open ? "navlinks open" : "navlinks"}
        aria-label="Main navigation"
      >
        {links.map(({ to, label }) => {
          const active = isLinkActive(to);

          return (
            <Link
              key={to}
              to={to}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          );
        })}

        <div className="language-switcher" aria-label="Language selector">
          <button
            className={language === "pt" ? "active" : ""}
            onClick={() => changeLanguage("pt")}
            aria-pressed={language === "pt"}
          >
            PT
          </button>
          <span aria-hidden="true">|</span>
          <button
            className={language === "en" ? "active" : ""}
            onClick={() => changeLanguage("en")}
            aria-pressed={language === "en"}
          >
            EN
          </button>
        </div>
      </nav>

      <button
        className="menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
