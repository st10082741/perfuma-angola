import type { Perfume } from "../types/perfume";
import type { Language } from "../i18n/translations";
import { storeConfig } from "../config/store";

/**
 * Returns the public base URL used for WhatsApp product links.
 * VITE_SITE_URL is recommended in production; window.location.origin keeps
 * local development convenient without hardcoding a fake domain.
 */
function getBaseUrl() {
  if (storeConfig.siteUrl) return storeConfig.siteUrl.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/**
 * We send WhatsApp to a tiny `/api/share` page instead of directly to the SPA
 * product route. That endpoint contains Open Graph metadata, allowing WhatsApp
 * to generate a product image/title preview after the website is deployed.
 */
export function productShareUrl(product: Perfume, language: Language) {
  const base = getBaseUrl();
  return `${base}/api/share?slug=${encodeURIComponent(product.slug)}&lang=${language}`;
}

/** Builds every WhatsApp order URL from catalogue data — no product hardcoding. */
export function whatsappUrl(product?: Perfume, language: Language = "pt") {
  const general =
    language === "pt"
      ? "Olá Perfuma Angola 👋\n\nGostaria de saber mais sobre os vossos perfumes."
      : "Hello Perfuma Angola 👋\n\nI would like to know more about your fragrances.";

  if (!product) {
    return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(general)}`;
  }

  const shareUrl = productShareUrl(product, language);
  const price = `${product.price.toLocaleString(storeConfig.locale)} ${storeConfig.currency}`;

  const message =
    language === "pt"
      ? `Olá Perfuma Angola 👋\n\nGostaria de encomendar:\n\n✨ ${product.name}\n🏷️ ${product.brand}\n📦 ${product.size}\n💰 ${price}\n\nProduto:\n${shareUrl}\n\nPodem confirmar a disponibilidade?`
      : `Hello Perfuma Angola 👋\n\nI would like to order:\n\n✨ ${product.name}\n🏷️ ${product.brand}\n📦 ${product.size}\n💰 ${price}\n\nProduct:\n${shareUrl}\n\nCould you please confirm availability?`;

  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
