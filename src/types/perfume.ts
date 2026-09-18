/**
 * Central catalogue types for Perfuma Angola.
 *
 * WHY THIS FILE EXISTS:
 * Every product card, detail page, stock badge, WhatsApp message and chatbot
 * reads the same product shape. If we add a field here, TypeScript warns us
 * everywhere that needs to understand the new field.
 */
export type Category = "Men" | "Women" | "Unisex";

export interface LocalizedText {
  pt: string;
  en: string;
}

export interface Perfume {
  id: number;
  slug: string;
  name: string;
  brand: string;

  /** Price is stored as a plain number; the UI adds the Kz currency label. */
  price: number;
  oldPrice?: number;

  /** Keep packaging information exactly as sold by Perfuma Angola. */
  size: string;
  concentration: string;
  category: Category;

  fragranceFamily: LocalizedText;

  /** Short copy is used on the desktop hover card. */
  shortDescription: LocalizedText;

  /** Full copy appears on the product-details page and can be used by the AI. */
  description: LocalizedText;

  image: string;

  /**
   * INVENTORY SOURCE OF TRUTH
   * -------------------------
   * Change only this number when stock changes:
   *   stock: 8  -> available
   *   stock: 2  -> low stock
   *   stock: 0  -> automatically sold out
   *
   * This avoids maintaining a separate `available: true/false` value that
   * could accidentally disagree with the stock quantity.
   */
  stock: number;

  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  notes: LocalizedText[];
}
