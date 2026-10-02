/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** "true" on deploy previews and branch deploys: every page gets noindex. */
  readonly PUBLIC_NOINDEX?: string;
  /** "none" (default) or "woocommerce". */
  readonly PUBLIC_CHECKOUT_PROVIDER?: string;
  /** WooCommerce shop URL (checkout, price and stock). */
  readonly PUBLIC_WOO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: Record<string, unknown>[];
  /** Consent choice, set by ConsentBanner.astro. */
  flavoryConsent?: { analytics: boolean; marketing: boolean };
  /** Events waiting for PostHog to load (only after consent). */
  flavoryAnalyticsQueue?: [string, Record<string, unknown>][];
  posthog?: {
    __loaded?: boolean;
    capture(event: string, properties?: Record<string, unknown>): void;
    get_distinct_id(): string;
    get_session_id?(): string;
  };
}
