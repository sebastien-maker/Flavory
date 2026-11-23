// Checkout provider, set with PUBLIC_CHECKOUT_PROVIDER (netlify.toml).
// Without a provider the cart shows a "coming soon" notice instead of sending the visitor on.
import type { CartLine } from './cart';
import { WOO_URL } from './woo';

export type CheckoutProvider = 'none' | 'woocommerce';

export const checkoutProvider: CheckoutProvider =
  (import.meta.env.PUBLIC_CHECKOUT_PROVIDER as CheckoutProvider | undefined) ?? 'none';

// The WooCommerce checkout page. The link goes straight there: from version 1.5.0 the "Flavory cart bridge"
// plugin (integrations/wordpress/flavory-cart-bridge.php) fills the WooCommerce cart from
// ?flavory_cart=<id>:<qty>,… and shows the checkout in the same request. Older versions of the plugin fill the
// cart and redirect to the checkout, so this link works with both; the direct way saves one full WordPress load.
const WOO_CHECKOUT_PATH = '/shop/afrekenen/';

// Returns null when a line cannot be bought online (no WooCommerce ID).
export function createCheckoutUrl(lines: CartLine[]): string | null {
  if (lines.length === 0 || checkoutProvider !== 'woocommerce' || !WOO_URL) return null;
  if (lines.some((l) => !l.wooId)) return null;
  const items = lines.map((l) => `${l.wooId}:${l.quantity}`).join(',');
  return `${WOO_URL}${WOO_CHECKOUT_PATH}?flavory_cart=${encodeURIComponent(items)}`;
}
