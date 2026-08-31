/**
 * Camada de acesso a dados. Hoje devolve mocks de forma síncrona; ao ligar o
 * Lovable Cloud basta trocar o corpo destas funções por consultas reais.
 */
import type { Merchant, Product, SearchFilter } from "@/types";
import {
  categories,
  cities,
  merchants,
  orders,
  paymentMethods,
  products,
  savedAddresses,
} from "./mock";

export { categories, cities, orders, paymentMethods, savedAddresses };

export function listMerchants(): Merchant[] {
  return merchants;
}

export function listOffers(): Merchant[] {
  return merchants.filter((m) => m.discountLabel);
}

export function listPopular(): Merchant[] {
  return [...merchants].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
}

export function getMerchantBySlug(slug: string): Merchant | undefined {
  return merchants.find((m) => m.slug === slug);
}

export function getMerchantById(id: string): Merchant | undefined {
  return merchants.find((m) => m.id === id);
}

export function listProductsByMerchant(merchantId: string): Product[] {
  return products.filter((p) => p.merchantId === merchantId);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function listPopularProducts(): Product[] {
  return products.filter((p) => p.popular);
}

export function getCityById(id: string | undefined) {
  return cities.find((c) => c.id === id);
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function searchMerchants(
  term: string,
  filter: SearchFilter | null,
  categoryId: string | null,
): Merchant[] {
  const q = term.trim().toLowerCase();
  let result = merchants.filter((m) => {
    const matchesCategory = !categoryId || m.categoryId === categoryId;
    if (!matchesCategory) return false;
    if (!q) return true;
    const inMerchant =
      m.name.toLowerCase().includes(q) ||
      m.categoryName.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q));
    const inProducts = products.some(
      (p) => p.merchantId === m.id && p.name.toLowerCase().includes(q),
    );
    return inMerchant || inProducts;
  });

  switch (filter) {
    case "proximos":
      result = [...result].sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    case "avaliados":
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    case "rapidos":
      result = [...result].sort((a, b) => a.etaMin - b.etaMin);
      break;
    case "taxa":
      result = [...result].sort((a, b) => a.deliveryFee - b.deliveryFee);
      break;
    case "ofertas":
      result = result.filter((m) => m.discountLabel);
      break;
    default:
      break;
  }
  return result;
}

export function searchProducts(term: string): Product[] {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}
