/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** "true" on deploy previews and branch deploys: every page gets noindex. */
  readonly PUBLIC_NOINDEX?: string;
  /** "none" (default) or "shopify". */
  readonly PUBLIC_CHECKOUT_PROVIDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: Record<string, unknown>[];
}
