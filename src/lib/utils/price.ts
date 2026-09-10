import type { MobilHome } from "@/types/mobilhome";

export function formatPrice(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Returns the price to display along with its VAT suffix key, following admin settings. */
export function getDisplayPrice(mobilHome: MobilHome): {
  amount: number;
  vatLabel: "priceTTC" | "priceHT" | null;
} {
  if (mobilHome.showPriceTTC && mobilHome.priceTTC != null) {
    return { amount: mobilHome.priceTTC, vatLabel: "priceTTC" };
  }
  if (mobilHome.showPriceHT && mobilHome.priceHT != null) {
    return { amount: mobilHome.priceHT, vatLabel: "priceHT" };
  }
  return { amount: mobilHome.price, vatLabel: null };
}
