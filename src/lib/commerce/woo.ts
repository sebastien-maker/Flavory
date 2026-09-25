// WooCommerce is the source for price and stock, and handles checkout (docs/woocommerce-koppeling.md).
// The shop URL is set in netlify.toml (PUBLIC_WOO_URL). Browsers reach the Store API through the same-origin
// proxy /woo-api/* (netlify.toml), because the shop sends no CORS header for other domains.

export const WOO_URL = (import.meta.env.PUBLIC_WOO_URL ?? '').replace(/\/$/, '');
export const WOO_API_PROXY = '/woo-api';

export interface WooStock {
  price: number;
  buyable: boolean;
}

interface StoreApiProduct {
  id: number;
  is_purchasable: boolean;
  is_in_stock: boolean;
  prices: { price: string; currency_minor_unit: number };
}

// Store API list -> price and stock per WooCommerce product ID.
export function parseStoreProducts(json: unknown): Map<number, WooStock> {
  const result = new Map<number, WooStock>();
  if (!Array.isArray(json)) return result;
  for (const p of json as StoreApiProduct[]) {
    const price = Number(p.prices?.price) / 10 ** (p.prices?.currency_minor_unit ?? 2);
    if (!Number.isFinite(price)) continue;
    result.set(p.id, { price, buyable: Boolean(p.is_purchasable && p.is_in_stock) });
  }
  return result;
}

export const storeProductsPath = (ids: number[]) => `/products?include=${ids.join(',')}&per_page=100`;
