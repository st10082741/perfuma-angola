/**
 * =========================================================
 * PERFUMA ANGOLA — BUSINESS CONFIGURATION
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
