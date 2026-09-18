/**
 * ================================================================
 * PERFUMA ANGOLA — WHATSAPP UTILITIES
 * ================================================================
 *
 * Language: TypeScript
 *
 * PURPOSE:
 * This file centralizes all WhatsApp-related URL and message creation
 * used throughout the Perfuma Angola website.
 *
 * WHY CENTRALIZE THIS LOGIC?
 * ---------------------------------------------------------------
 * Instead of manually creating WhatsApp links in multiple components,
 * every part of the website uses the functions in this file.
 *
 * This gives us:
 * - one official WhatsApp number;
 * - consistent customer messages;
 * - safer URL generation;
 * - product-specific ordering messages;
 * - support for Portuguese and English;
 * - easier maintenance in the future.
 *
 * IMPORTANT ARCHITECTURE RULE:
 * The AI does NOT create WhatsApp URLs itself.
 *
 * The AI recommends and communicates.
 * This TypeScript utility creates the actual trusted WhatsApp URL.
 * ================================================================
 */

import type { Perfume } from "../types/perfume";
import type { Language } from "../i18n/translations";
import { storeConfig } from "../config/store";

/**
 * ================================================================
 * PUBLIC WEBSITE BASE URL
 * ================================================================
 *
 * Returns the public URL used when sharing a Perfuma Angola product.
 *
 * PRODUCTION:
 * VITE_SITE_URL should contain the official public website address.
 *
 * DEVELOPMENT:
 * If VITE_SITE_URL is empty, window.location.origin allows the
 * application to work with the current local development address.
 */
function getBaseUrl(): string {
  /**
   * Remove a trailing slash if one exists.
   *
   * Example:
   * https://perfuma-angola.com/
   *
   * becomes:
   * https://perfuma-angola.com
   *
   * This prevents URLs containing accidental double slashes.
   */
  if (storeConfig.siteUrl) {
    return storeConfig.siteUrl.replace(/\/$/, "");
  }

  /**
   * `window` exists only inside a browser.
   *
   * Checking for it prevents errors if this utility is ever evaluated
   * in a server-side environment.
   */
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

/**
 * ================================================================
 * PRODUCT SHARE URL
 * ================================================================
 *
 * Creates the special product URL placed inside WhatsApp messages.
 *
 * We intentionally use `/api/share` instead of sending WhatsApp
 * directly to the React product page.
 *
 * WHY?
 * WhatsApp link-preview crawlers work more reliably when Open Graph
 * metadata exists directly in server-generated HTML.
 *
 * `/api/share` supplies:
 * - product title;
 * - description;
 * - product image;
 * - canonical product URL.
 *
 * It then redirects a human visitor to the real product page.
 */
export function productShareUrl(product: Perfume, language: Language): string {
  const base = getBaseUrl();

  return `${base}/api/share?slug=${encodeURIComponent(
    product.slug,
  )}&lang=${language}`;
}

/**
 * ================================================================
 * GENERAL WHATSAPP MESSAGE
 * ================================================================
 *
 * Used when the customer wants to contact Perfuma Angola without
 * selecting a particular perfume.
 */
function generalWhatsAppMessage(language: Language): string {
  if (language === "en") {
    return [
      "Hello Perfuma Angola 👋",
      "",
      "I would like to know more about your fragrances.",
    ].join("\n");
  }

  return [
    "Olá Perfuma Angola 👋",
    "",
    "Gostaria de saber mais sobre os vossos perfumes.",
  ].join("\n");
}

/**
 * ================================================================
 * PRODUCT ORDER MESSAGE
 * ================================================================
 *
 * Creates a structured WhatsApp message using REAL catalogue data.
 *
 * Notice that product name, brand, size and price are not manually
 * typed into this function. They come from the Perfume object.
 *
 * This means adding a new product to perfumes.ts automatically makes
 * it compatible with this WhatsApp ordering system.
 */
function productOrderMessage(product: Perfume, language: Language): string {
  const shareUrl = productShareUrl(product, language);

  /**
   * Format the numeric catalogue price according to the store locale.
   *
   * Example:
   * 60000 -> "60 000 Kz" depending on the browser's locale formatting.
   */
  const price = `${product.price.toLocaleString(
    storeConfig.locale,
  )} ${storeConfig.currency}`;

  if (language === "en") {
    return [
      "Hello Perfuma Angola 👋",
      "",
      "I would like to order:",
      "",
      `✨ ${product.name}`,
      `🏷️ ${product.brand}`,
      `📦 ${product.size}`,
      `💰 ${price}`,
      "",
      "Product:",
      shareUrl,
      "",
      "Could you please confirm availability and help me continue with the order?",
    ].join("\n");
  }

  return [
    "Olá Perfuma Angola 👋",
    "",
    "Gostaria de encomendar:",
    "",
    `✨ ${product.name}`,
    `🏷️ ${product.brand}`,
    `📦 ${product.size}`,
    `💰 ${price}`,
    "",
    "Produto:",
    shareUrl,
    "",
    "Podem confirmar a disponibilidade e ajudar-me a continuar com a encomenda?",
  ].join("\n");
}

/**
 * ================================================================
 * AI CHAT → WHATSAPP CONTINUATION MESSAGE
 * ================================================================
 *
 * This message is specifically designed for customers who have been
 * speaking with the Perfuma Angola AI assistant and are now ready to
 * continue with a human through WhatsApp.
 *
 * Keeping this separate from the normal product-order message allows
 * us to provide a more natural customer journey.
 */
function aiContinuationMessage(language: Language, product?: Perfume): string {
  /**
   * If the AI conversation identified a specific product, include its
   * official catalogue information in the WhatsApp message.
   */
  if (product) {
    const shareUrl = productShareUrl(product, language);

    const price = `${product.price.toLocaleString(
      storeConfig.locale,
    )} ${storeConfig.currency}`;

    if (language === "en") {
      return [
        "Hello Perfuma Angola 👋",
        "",
        "I was speaking with your virtual assistant and I am interested in:",
        "",
        `✨ ${product.name}`,
        `🏷️ ${product.brand}`,
        `📦 ${product.size}`,
        `💰 ${price}`,
        "",
        "Product:",
        shareUrl,
        "",
        "I would like to confirm availability and continue with the order.",
      ].join("\n");
    }

    return [
      "Olá Perfuma Angola 👋",
      "",
      "Estive a falar com o vosso assistente virtual e tenho interesse em:",
      "",
      `✨ ${product.name}`,
      `🏷️ ${product.brand}`,
      `📦 ${product.size}`,
      `💰 ${price}`,
      "",
      "Produto:",
      shareUrl,
      "",
      "Gostaria de confirmar a disponibilidade e continuar com a encomenda.",
    ].join("\n");
  }

  /**
   * A product may not always be identifiable from the latest message.
   *
   * Example:
   * Customer: "Sim, quero comprar."
   *
   * The customer clearly has purchase intent, but the latest message
   * itself may not contain the product name.
   *
   * In that situation we still provide a useful general continuation
   * message instead of inventing a product.
   */
  if (language === "en") {
    return [
      "Hello Perfuma Angola 👋",
      "",
      "I was speaking with your virtual assistant and would like to continue with my purchase.",
      "",
      "Could you please help me confirm the product availability and order details?",
    ].join("\n");
  }

  return [
    "Olá Perfuma Angola 👋",
    "",
    "Estive a falar com o vosso assistente virtual e gostaria de continuar com a minha compra.",
    "",
    "Podem ajudar-me a confirmar a disponibilidade do produto e os detalhes da encomenda?",
  ].join("\n");
}

/**
 * ================================================================
 * SAFE WA.ME URL BUILDER
 * ================================================================
 *
 * This is the ONLY function responsible for creating the final
 * clickable WhatsApp URL.
 *
 * `encodeURIComponent()` safely converts spaces, accents, emojis,
 * line breaks and other characters into URL-compatible text.
 */
function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(
    message,
  )}`;
}

/**
 * ================================================================
 * STANDARD WEBSITE WHATSAPP URL
 * ================================================================
 *
 * Existing product cards/details can continue using this function.
 *
 * Without a product:
 * Creates a general enquiry.
 *
 * With a product:
 * Creates a product-specific order enquiry.
 */
export function whatsappUrl(
  product?: Perfume,
  language: Language = "pt",
): string {
  const message = product
    ? productOrderMessage(product, language)
    : generalWhatsAppMessage(language);

  return buildWhatsAppUrl(message);
}

/**
 * ================================================================
 * CHATBOT WHATSAPP URL
 * ================================================================
 *
 * Chatbot.tsx will use this function when `/api/chat` returns:
 *
 * action: {
 *   type: "whatsapp",
 *   productSlug: "example-product"
 * }
 *
 * The function accepts the matching Perfume object when available.
 *
 * IMPORTANT:
 * Product lookup itself remains outside this utility. This keeps this
 * file focused only on WhatsApp responsibilities.
 */
export function chatbotWhatsAppUrl(
  language: Language = "pt",
  product?: Perfume,
): string {
  return buildWhatsAppUrl(aiContinuationMessage(language, product));
}
