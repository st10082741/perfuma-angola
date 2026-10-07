/**
 * ================================================================
 * PERFUMA ANGOLA - ROUTE-AWARE SEO MANAGER
 * ================================================================
 *
 * Language / Technology:
 * TypeScript + React (TSX)
 * React Router
 *
 * PURPOSE:
 * This component is the centralized SEO orchestration layer for the
 * Perfuma Angola website.
 *
 * Individual page components should remain responsible for displaying
 * their content. SEOManager observes the current route and language,
 * determines the appropriate metadata and delegates the actual browser
 * metadata updates to the reusable useSEO hook.
 *
 * ARCHITECTURE:
 *
 * React Router + Language Context + Catalogue
 *                  |
 *                  v
 *             SEOManager
 *                  |
 *          determines page metadata
 *                  |
 *                  v
 *               useSEO()
 *                  |
 *                  v
 *        Browser document metadata
 *
 * PRODUCT SEO:
 * Product metadata is generated from perfumes.ts rather than being
 * duplicated in a separate SEO catalogue. Adding a product to the
 * catalogue therefore automatically makes its core metadata available
 * to this manager.
 *
 * MAINTENANCE:
 * Add route-level metadata here when a new public page is introduced.
 * Product routes normally require no manual SEO entry because their
 * information comes directly from the perfume catalogue.
 * ================================================================
 */

import { useLocation } from "react-router-dom";
import { storeConfig } from "../../config/store";
import { perfumes } from "../../data/perfumes";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSEO } from "../../hooks/useSEO";

/**
 * Static route metadata is intentionally centralized here rather than
 * distributed throughout individual page components.
 */
const pageMetadata = {
  "/": {
    pt: {
      title: "Perfuma Angola | Perfumes que deixam a sua marca",
      description:
        "Descubra fragrâncias selecionadas pela Perfuma Angola, com atendimento personalizado e encomendas pelo WhatsApp.",
    },
    en: {
      title: "Perfuma Angola | Perfumes that leave your mark",
      description:
        "Discover fragrances selected by Perfuma Angola, with personalized service and orders through WhatsApp.",
    },
  },
  "/shop": {
    pt: {
      title: "Catálogo de Perfumes | Perfuma Angola",
      description:
        "Explore o catálogo da Perfuma Angola e encontre fragrâncias masculinas, femininas e unissexo.",
    },
    en: {
      title: "Perfume Catalogue | Perfuma Angola",
      description:
        "Explore the Perfuma Angola catalogue and discover men's, women's and unisex fragrances.",
    },
  },
  "/about": {
    pt: {
      title: "Sobre Nós | Perfuma Angola",
      description:
        "Conheça a Perfuma Angola, uma marca angolana dedicada a fragrâncias selecionadas e atendimento personalizado.",
    },
    en: {
      title: "About Us | Perfuma Angola",
      description:
        "Discover Perfuma Angola, an Angolan brand dedicated to selected fragrances and personalized service.",
    },
  },
  "/contact": {
    pt: {
      title: "Contacto | Perfuma Angola",
      description:
        "Entre em contacto com a Perfuma Angola para informações sobre perfumes, disponibilidade e encomendas.",
    },
    en: {
      title: "Contact | Perfuma Angola",
      description:
        "Contact Perfuma Angola for information about perfumes, availability and orders.",
    },
  },
} as const;

/**
 * Resolves the metadata for the current route.
 *
 * Product routes are detected separately because their title,
 * description and image come dynamically from the catalogue.
 */
export function SEOManager() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  const productSlug = pathname.startsWith("/perfume/")
    ? pathname.replace("/perfume/", "")
    : null;

  const product = productSlug
    ? perfumes.find((item) => item.slug === productSlug)
    : undefined;

  const staticMetadata =
    pageMetadata[pathname as keyof typeof pageMetadata]?.[language];

  const title = product
    ? `${product.name} | ${storeConfig.businessName}`
    : staticMetadata?.title ??
      `${storeConfig.businessName} | ${storeConfig.tagline}`;

  const description = product
    ? product.shortDescription[language]
    : staticMetadata?.description ??
      (language === "pt"
        ? "Fragrâncias selecionadas, atendimento personalizado e encomendas pelo WhatsApp."
        : "Selected fragrances, personalized service and orders through WhatsApp.");

  useSEO({
    title,
    description,
    path: pathname,
    language,
    image: product?.image,
  });

  /**
   * SEOManager has no visual interface. Its only responsibility is
   * coordinating metadata for the current route.
   */
  return null;
}