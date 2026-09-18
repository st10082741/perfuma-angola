/**
 * ================================================================
 * PERFUMA ANGOLA — BUSINESS CONFIGURATION
 * ================================================================
 *
 * Language: TypeScript
 *
 * PURPOSE:
 * This file is the centralized configuration for business-wide
 * information used throughout the Perfuma Angola application.
 *
 * Instead of repeating values such as the WhatsApp number, currency,
 * owners or delivery day across many components, those values are
 * defined once here and imported wherever they are needed.
 *
 * BENEFIT:
 * If business information changes later, we normally update it here
 * instead of searching through the entire application.
 * ================================================================
 * =========================================================
 * Edit business-wide information here. Components import this object so the
 * WhatsApp number, currency and brand identity are never duplicated in code.
 */
export const storeConfig = {
  businessName: "Perfuma Angola",
  tagline: "Perfumes que deixam a sua marca",

  // WhatsApp wa.me links require country code + number with digits only.
  whatsapp: "244939853871",

  currency: "Kz",
  locale: "pt-AO",

  // Used after deployment to create share links. In development the browser
  // automatically falls back to localhost.
  siteUrl: import.meta.env.VITE_SITE_URL || "",

  // Business facts confirmed by the owners.
  owners: ["Miguel Almeida", "Victor Sumbo"],
  country: "Angola",
  deliveryDayPt: "Domingos",
  deliveryDayEn: "Sundays",
  paymentMethods: ["Multicaixa Express", "IBAN / transferência bancária"],

  // Keep unpublished contact channels blank instead of showing fake details.
  email: "",
  instagram: "",

  logoPath: "/images/perfuma-angola-logo.jpeg",
} as const;
