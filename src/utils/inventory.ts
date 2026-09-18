import type { Perfume } from "../types/perfume";

/**
 * Inventory logic is kept out of UI components so every page interprets
 * stock in exactly the same way.
 */
export type StockStatus = "available" | "low" | "out";

export function getStockStatus(product: Perfume): StockStatus {
  if (product.stock <= 0) return "out";
  if (product.stock <= 2) return "low";
  return "available";
}

export function canOrder(product: Perfume) {
  return getStockStatus(product) !== "out";
}
