/**
 * ================================================================
 * PERFUMA ANGOLA - CENTRALIZED SEO METADATA HOOK
 * ================================================================
 *
 * Language / Technology:
 * TypeScript + React
 * Browser Document Metadata API
 *
 * PURPOSE:
 * This hook centralizes page-level SEO metadata for the Perfuma Angola
 * website.
 *
 * Instead of allowing individual pages to manually manipulate
 * document.head, each page provides only the metadata that is unique
 * to that page, such as its title, description, canonical path and
 * optional social-sharing image.
 *
 * ARCHITECTURE:
 *
 * Page / Product
 *      |
 *      | SEO configuration
 *      v
 *   useSEO()
 *      |
 *      +-- document title
 *      +-- meta description
 *      +-- canonical URL
 *      +-- Open Graph title
 *      +-- Open Graph description
 *      +-- Open Graph URL
 *      +-- Open Graph image
 *      +-- Open Graph locale
 *
 * WHY CENTRALIZE SEO?
 * ---------------------------------------------------------------
 * - prevents duplicated metadata-management logic;
 * - keeps page components focused on page content;
 * - provides consistent canonical URLs;
 * - makes future SEO changes easier to maintain;
 * - allows product metadata to come directly from the catalogue;
 * - keeps the official website URL centralized in storeConfig.
 *
 * IMPORTANT:
 * This hook manages metadata for the current React SPA architecture.
 * It does not replace the sitemap, robots.txt or server-rendered
 * social-preview endpoint used elsewhere in the application.
 * ================================================================
 */

import { useEffect } from "react";
import { storeConfig } from "../config/store";
import type { Language } from "../i18n/translations";

/**
 * Configuration supplied by a page when it needs to publish its
 * page-specific search and social metadata.
 */
interface SEOOptions {
  title: string;
  description: string;
  path: string;
  language: Language;
  image?: string;
}

/**
 * Creates or updates a standard <meta> element.
 *
 * Using one helper prevents the hook from repeatedly implementing
 * the same document.head lookup and creation logic.
 */
function setMetaTag(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

/**
 * Removes metadata that is no longer valid for the current page.
 *
 * This prevents optional metadata from a previous SPA route, such as
 * a product image, from remaining in document.head after navigation.
 */
function removeMetaTag(attribute: "name" | "property", key: string) {
  document.head
    .querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
    ?.remove();
}
/**
 * Creates or updates the canonical <link> element.
 *
 * A canonical URL tells search engines which public URL represents
 * the preferred version of the current page.
 */
function setCanonicalUrl(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = url;
}

/**
 * Converts either an absolute or site-relative image path into the
 * absolute URL expected by social metadata consumers.
 */
function buildAbsoluteUrl(value: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;

  return `${siteUrl}${normalizedPath}`;
}

/**
 * Publishes SEO metadata for the currently rendered page.
 *
 * Pages provide only their own content. This hook owns the browser
 * metadata implementation so that SEO behavior remains centralized.
 */
export function useSEO({
  title,
  description,
  path,
  language,
  image,
}: SEOOptions) {
  useEffect(() => {
    /**
 * storeConfig provides the official public site URL used to build
 * canonical and Open Graph URLs.
 *
 * window.location.origin remains a defensive fallback in case the
 * centralized site URL is ever unavailable.
 */
    const siteUrl = (
      storeConfig.siteUrl || window.location.origin
    ).replace(/\/$/, "");

    const normalizedPath =
      path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;

    const canonicalUrl = `${siteUrl}${normalizedPath}`;

    document.title = title;
    document.documentElement.lang = language;

    setMetaTag("name", "description", description);

    setCanonicalUrl(canonicalUrl);

    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", storeConfig.businessName);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag(
      "property",
      "og:locale",
      language === "pt" ? "pt_AO" : "en_US",
    );

    /**
     * Only publish og:image when the page supplies one.
     *
     * Product pages can therefore use their real catalogue image while
     * ordinary pages are not forced to advertise an unrelated image.
     */
    if (image) {
      setMetaTag(
        "property",
        "og:image",
        buildAbsoluteUrl(image, siteUrl),
      );
    } else {
      removeMetaTag("property", "og:image");
    }
  }, [title, description, path, language, image]);
}
