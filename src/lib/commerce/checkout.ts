// Checkout provider. Shopify (Storefront Cart API -> checkoutUrl) is planned but not connected yet.
// Until PUBLIC_CHECKOUT_PROVIDER is set, the cart shows a "coming soon" notice instead of a checkout button.
import type { CartLine } from './cart';

export type CheckoutProvider = 'none' | 'shopify';

export const checkoutProvider: CheckoutProvider =
  (import.meta.env.PUBLIC_CHECKOUT_PROVIDER as CheckoutProvider | undefined) ?? 'none';

export async function createCheckoutUrl(lines: CartLine[]): Promise<string | null> {
  if (lines.length === 0) return null;
  switch (checkoutProvider) {
    case 'shopify':
      // TODO(shopify): POST cartCreate to the Storefront API with the variant IDs and return cart.checkoutUrl.
      throw new Error('Shopify checkout is not implemented yet');
    default:
      return null;
  }
}
