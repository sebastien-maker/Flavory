// WooCommerce is the source for price and stock, and handles checkout (docs/woocommerce-koppeling.md).
// The shop URL is set in netlify.toml (PUBLIC_WOO_URL). Browsers reach the Store API through the same-origin
// proxy /woo-api/* (netlify.toml), because the shop sends no CORS header for other domains.

export const WOO_URL = (import.meta.env.PUBLIC_WOO_URL ?? '').replace(/\/$/, '');
export const WOO_API_PROXY = '/woo-api';

export interface WooStock {
  /** What the customer pays now: the sale price during a promotion. */
  price: number;
  /** Only set during a promotion: the price before the discount. */
  regularPrice?: number | undefined;
  /** Last day of the promotion (YYYY-MM-DD), when WooCommerce has one. */
  saleEnd?: string | undefined;
  buyable: boolean;
}

interface StoreApiProduct {
  id: number;
  is_purchasable: boolean;
  is_in_stock: boolean;
  prices: { price: string; regular_price?: string; sale_price?: string; currency_minor_unit: number };
  // Added by the cart bridge plugin (integrations/wordpress/flavory-cart-bridge.php).
  extensions?: { flavory?: { sale_end?: string | null } };
}

// Store API list -> price and stock per WooCommerce product ID.
export function parseStoreProducts(json: unknown): Map<number, WooStock> {
  const result = new Map<number, WooStock>();
  if (!Array.isArray(json)) return result;
  for (const p of json as StoreApiProduct[]) {
    const minor = 10 ** (p.prices?.currency_minor_unit ?? 2);
    const price = Number(p.prices?.price) / minor;
    if (!Number.isFinite(price)) continue;
    // Outside a promotion WooCommerce repeats the price in regular_price and sale_price.
    const regular = Number(p.prices?.regular_price) / minor;
    const onSale = regular > price;
    const saleEnd = p.extensions?.flavory?.sale_end;
    result.set(p.id, {
      price,
      regularPrice: onSale ? regular : undefined,
      saleEnd: onSale && saleEnd && /^\d{4}-\d{2}-\d{2}$/.test(saleEnd) ? saleEnd : undefined,
      buyable: Boolean(p.is_purchasable && p.is_in_stock),
    });
  }
  return result;
}

export const storeProductsPath = (ids: number[]) => `/products?include=${ids.join(',')}&per_page=100`;
