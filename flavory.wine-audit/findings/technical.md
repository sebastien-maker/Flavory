# Technical SEO Findings — flavory.wine

Source data: `flavory.wine-audit/data/crawl.json` (209 URLs, 208 x status 200), `crawl_summary.csv`, `sitemap_urls.json` (120 URLs), `inbound_links.json`, `homepage_render.json`. All figures below are computed directly from this dataset; no new crawling was performed except what was already supplied. Anything not derivable from the dataset (real-user CWV/CrUX field data, PSI lab scores, live header checks beyond the homepage) is explicitly marked **not verified**.

## Score

**34 / 100** — The site is server-rendered and crawlable at the template level (good foundation), but indexation control is broken in several independent ways at once: ~40% of crawled URLs are test pages, duplicates, or dead legacy redirects; the entire `/de/` section is largely self-cancelling via wrong canonicals; there is no hreflang anywhere; unknown URLs silently 301 to the homepage instead of 404; and no security headers are set. Any one of these would be a high-severity finding — together they indicate indexation/internationalization is currently unmanaged.

## What works

- **Server-side rendering**: `homepage_render.json` shows `is_spa: false` and full text content present in raw HTML (`extracted_text` matches on-page copy). No client-side rendering dependency was found — content is crawlable without JS execution.
- **Domain/protocol canonicalization is correct**: `www.flavory.wine` → 301 → `flavory.wine`, and `http` → `https` → 301 (confirmed in `homepage_render.json` redirect_chain and prior crawl facts).
- **Viewport meta tag present** (`width=device-width, initial-scale=1`) confirmed on the homepage; consistent with the rest of the crawl.
- **robots.txt correctly blocks** `/wp-admin/` and `add-to-cart` query parameters (established fact, not re-verified here).
- **Structured data present sitewide**: every one of the 208 pages carries `BreadcrumbList`, `WebSite`, and `Organization` JSON-LD; blog posts carry `Article`; 7 pages carry `FAQPage`.
- **Only 2 pages use noindex**, both legitimately (NL/DE cart pages) — no accidental noindex found on content pages.
- **No broken-image or missing-dimension issues**: `img_missing_dims` is 0 across the crawl, so images are not a CLS driver.

## Findings

### 1. `/de/` section is largely non-indexable due to cross-language canonical tags
**Severity: Critical**
**Evidence**: Of 97 crawled URLs under `/de/`, 60 (62%) carry a `<link rel="canonical">` pointing to the **Dutch-language equivalent path**, not to themselves — e.g. `/de/blog/wijn-cadeau-pasen/` → canonical `https://flavory.wine/blog/wijn-cadeau-pasen/`; `/de/faq/` → canonical `https://flavory.wine/faq/`; `/de/proeverij/` → canonical `https://flavory.wine/proeverij/`. This pattern covers real, translated content: nearly all `/de/blog/*` posts, `/de/faq/`, `/de/partners/`, `/de/wijnkiezer/`, `/de/algemene-voorwaarden/`, `/de/alcoholvrije-wijnen/`, `/de/mijn-ervaring/`, `/de/nog-niet-gespeeld/`, `/de/eindejaars-en-relatiegeschenken/`. Google is explicitly told "this page is a duplicate, index the Dutch one instead," so the German content cannot rank in Google.de/be-de results regardless of how much unique translation work went into it.
**Recommendation**: Every `/de/*` page must self-canonicalize (`rel=canonical` → its own URL). This is almost certainly a Yoast/page-builder template inheriting the NL canonical from a duplicated post (WordPress "duplicate to translate" workflow). Audit each `/de/` post/page in Yoast's canonical override field and clear any manually-set cross-language canonical. Pair this with hreflang (Finding 3) so Dutch and German versions reference each other as alternates rather than one canonicalizing away the other.

### 2. Sitewide soft-404: unknown and dead URLs resolve 301→200 to the homepage instead of 404
**Severity: Critical**
**Evidence**: Previously confirmed for a nonexistent test slug and a mistyped sitemap path; this crawl reinforces the pattern at scale. 26 legacy product/landing URLs (`/product/rode-wijn-box/`, `/shop/rode-wijn-box/`, `/cava-vs-prosecco`, `/merlot-vs-cabernet-sauvignon`, `/italie-vs-spanje`, `/chardonnay-vs-sauvignon-blanc`, etc.) all return final status 200 with title "Home - Flavory" and canonical `https://flavory.wine/` — i.e., they 301-redirect to the homepage rather than 404ing or 301ing to the replacement product. These 26 dead URLs are still linked internally **287 times from 114 pages** (per `inbound_links.json`/established facts), so real navigational link equity is being funneled into a soft-404 chain. Additionally, `/privacybeleid/` (privacy policy) also 301s to the homepage — a legal/compliance content page has effectively disappeared.
**Recommendation**: (a) Fix the WordPress/nginx catch-all so nonexistent slugs return a true `404` (or `410 Gone` for permanently retired legacy URLs) with a proper "not found" template, not a redirect to `/`. (b) For the 26 legacy product URLs, replace the current catch-all redirect with **specific 301s to the current replacement product/page** (e.g. `/product/rode-wijn-box/` → `/shop/wijnproeverij-thuis-rood/` or whatever the current SKU is), then update the 287 internal links to point directly at the live URLs instead of relying on a redirect. (c) Restore `/privacybeleid/` — republish the page under a stable slug and fix the internal links/menu that point to it; this is a legal requirement for a Belgian/Dutch D2C shop.

### 3. No hreflang anywhere, and `/de/`, `/en/`, `/nl` root paths redirect into the Dutch homepage
**Severity: Critical**
**Evidence**: 0 of 208 crawled pages contain any `hreflang` markup (`d.get('hreflang')` empty for every URL). Separately, `/de`, `/de/`, `/en/`, and `/nl` all 301 to `https://flavory.wine/` (the NL homepage) rather than to their own section homepages — even though a real German homepage exists at `/de/start/` (self-canonical, real content, in sitemap). A German visitor or Googlebot hitting `/de/` never reaches the German homepage.
**Recommendation**: Implement a full hreflang cluster (`nl-NL`, `de-DE` or `de-BE` depending on target market, `en` if the single `/en/blog/` page is to remain, plus `x-default`) via Yoast's premium multilingual add-on or a dedicated plugin (Polylang/WPML), since there's no multilingual plugin currently reconciling these folders. Fix the `/de/` root redirect to land on `/de/start/`, not the NL homepage; likewise route `/en/` to the actual English content if it is meant to be discoverable. Defer to the `seo-hreflang` sub-skill for the full annotation spec once the canonical issue (Finding 1) is fixed — hreflang on top of broken canonicals will not resolve the indexation problem.

### 4. Index bloat: ~40% of crawled URLs are test pages, duplicates, or parameterized pseudo-pages, and many are actively submitted via the XML sitemap
**Severity: High**
**Evidence**: Counting distinct bloat categories in the crawl (self-canonical, `index,follow`, 200 status — i.e., genuinely indexable):
| Category | Count | Examples |
|---|---|---|
| Home/hero test variants | 13 | `/home/`, `/home-2/`, `/home-3/`, `/hero-section/`, `/hero-section-2/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/` (NL + DE) |
| `/shop2/` duplicate shop pages | 3 | `/shop2/`, `/de/shop2/`, `/de/shop-2/` |
| "5 redenen…kerstcadeau" landing variants | 7 | `-2`, `-2-2`, `-3`, `-w2` suffixes |
| German product `-kopie`/`-copy` duplicates | 15 | e.g. 8 variants of `merlot-oder-cabernet-sauvignon-copy...` alone |
| Duplicated blog post | 2 | `...-dupliceren` (NL + DE) |
| `?reviews=` testimonial pseudo-pages | 12 | 6 slugs × NL/DE |
| `?store=` partner pseudo-pages | 10 | 5 slugs × NL/DE |
| **Total distinct bloat URLs** | **62** | all `index, follow`, self-canonical |

Of these 62, **43 are physically present in the 120-URL XML sitemap** — meaning Yoast is actively telling Google to crawl and index test pages and duplicate product clones. Combined with the 26 dead-legacy-redirect URLs and 2 leaked preview links (`?post_type=product&p=7319&preview=true`), **90 of the 208 crawled URLs (43%)** carry no unique indexable value. Netting this against the sitemap: only **~76 of the 120 sitemap URLs (63%)** are genuinely deserving of indexation; the rest is self-inflicted bloat.
**Recommendation**: Trash or draft the home/hero/shop2 test variants and the 7 Christmas-landing duplicates (keep one canonical version, 301 the rest). For the 14 German `-kopie/-copy` product duplicates, either delete them or 301-redirect each to its master product and remove them from the sitemap (Yoast excludes trashed/redirected posts automatically once cleaned up). For `?reviews=` and `?store=` pseudo-pages, set `noindex, follow` via Yoast conditional logic (they're testimonial/partner display variations of the same template, not unique content) and exclude the custom post type from the XML sitemap in Yoast's Search Appearance settings, or convert them to a single indexable page with all testimonials/partners listed together.

### 5. No security response headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
**Severity: High**
**Evidence**: `homepage_render.json` header dump for `https://flavory.wine/` shows only `Server`, `Date`, `Content-Type`, `Link`, `Set-Cookie`, `Cache-Control: max-age=0`, `Expires`, `Vary`, `Content-Encoding`. No `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Referrer-Policy` header is present. Not verified beyond the homepage response captured in this file, but consistent with the previously established fact that this holds sitewide.
**Recommendation**: Add at the nginx server-block level (applies globally, no plugin dependency):
```
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "upgrade-insecure-requests" always; # start permissive, tighten after auditing 3rd-party scripts (analytics, WooCommerce, Elementor)
```
Verify HSTS is safe to enable (site is single-domain HTTPS with a working 301 already) before adding `preload` and submitting to the HSTS preload list.

### 6. No Product/Offer structured data on WooCommerce product pages
**Severity: High**
**Evidence**: Checked `schema_types` for every self-canonical `/shop/*` product URL (e.g. `/shop/wijnproeverij-thuis-rood/`, `/shop/wijnproeverij-thuis-wit/`, `/shop/bubbelbox/`, and all German shop equivalents): all return only `WebPage,ItemPage`, `ImageObject`, `BreadcrumbList`, `WebSite`, `Organization` (plus `FAQPage` on two). No `Product`, `Offer`, `AggregateRating`, or `Review` schema type appears anywhere in the 208-page crawl's `schema_types` totals.
**Recommendation**: WooCommerce ships Product schema by default; something (a Yoast/WooCommerce schema conflict, a custom template, or jet-engine overriding the loop template) is suppressing it. Check Yoast SEO → Settings → the WooCommerce/Schema integration toggle, and confirm the product template isn't a custom jet-engine listing that bypasses `woocommerce_structured_data`. Restoring this unlocks price/availability/rating rich results, which materially affects CTR for a D2C shop.

### 7. Core Web Vitals risk: TTFB alone (established at 3.4–3.9s) exceeds the "Good" LCP threshold before any content paints
**Severity: Medium** (cannot be scored against real CrUX/PSI data — **not verified** with field/lab tools; this is inferred from source-level signals only)
**Evidence**: Per prior measurement, uncontended TTFB is 3.4–3.9s. Since LCP can never be faster than TTFB, every page load's LCP floor already sits inside or beyond the "Needs Improvement" band (2.5–4s) before HTML parsing, image loading, or render begin — and likely tips into "Poor" (>4s) once the additional payload is accounted for. This crawl's own full-response fetch times (`ms` field, i.e., time to download complete HTML, not a proxy for LCP but indicative of backend+payload cost) have a median of 5.4s and range from 2.0s to 12.3s across 208 pages, with avg HTML size ~322 KB (max 515 KB, on `/home-hero-image/` and its DE duplicate) and an average of 60 `<script>` tags and 27 CSS files per page (Elementor + jet-engine confirmed in `product.html`, 5,356 and 42 string occurrences respectively). This volume of render-blocking-candidate assets on top of an already-slow TTFB is a strong risk signal for both LCP and INP, though actual field values (CrUX) could not be checked — Google APIs/PSI were unavailable for this audit.
**Recommendation**: Prioritize backend TTFB first (see Finding 8, caching) since no front-end optimization can compensate for a 3.4s+ time-to-first-byte. Once caching is fixed, audit Elementor/jet-engine for unused CSS/JS per template (Elementor's "Improved Asset Loading" / "Optimized Image Loading" experiments), and defer non-critical scripts. Re-run PageSpeed Insights / CrUX once live to get real LCP/INP/CLS numbers — this section is directional only.

### 8. Cache-Control: max-age=0 + WooCommerce session cookie set on anonymous requests defeats page caching
**Severity: Medium**
**Evidence**: `homepage_render.json` shows `Cache-Control: max-age=0` and a `Set-Cookie: wp_woocommerce_session_...` on a first anonymous request to the homepage — a page with no cart interaction. This forces full page-cache bypass for every visitor sitewide, contributing directly to the slow TTFB in Finding 7.
**Recommendation**: WooCommerce should only start a PHP/session cookie on cart, checkout, and account pages — not globally. Use a snippet or plugin (e.g. disable `wc_load_cart()` / `woocommerce_cart_session_active` outside of shop-interaction endpoints, or use the "WooCommerce Cache Compatibility" pattern of caching everything except `/cart/`, `/checkout/`, `/my-account/`) and add nginx FastCGI or object caching (Redis) with a sane `Cache-Control: max-age` for static/marketing pages once the cookie is scoped down.

### 9. Missing/duplicated on-page basics at scale
**Severity: Medium**
**Evidence**: Of 208 indexable-status pages: **71 (34%) have no meta description**, **86 (41%) have no `<h1>`**, and **41 (20%) have multiple `<h1>` tags**. Homepage itself has 2 H1s ("Speel het wijnspel met vrienden" and "Wat is Flavory?"). 1,019 of 5,207 images sitewide (19.6%) are missing `alt` text.
**Recommendation**: Bulk-audit via Yoast's SEO analysis + a content-type-level template fix: enforce a single semantic `<h1>` per page-builder template (Elementor heading widgets are frequently set to H1 by mistake on repeated modules), backfill meta descriptions with Yoast's fallback template variables at minimum, and run an alt-text pass prioritizing product and category images (SEO + accessibility + legal risk under EU accessibility rules for e-commerce).

### 10. Duplicate content not consolidated: German product page clones live and self-canonical
**Severity: Low** (subset of Finding 4, flagged separately because the fix differs)
**Evidence**: 14 of the 15 `-kopie`/`-copy` German product URLs are self-canonical (not pointing to their master), e.g. 8 separate live variants of `merlot-oder-cabernet-sauvignon` (`-copy`, `-copy-2`, `-copy-copy-3`, `-copy-copy-kopie`, `-copy-copy-kopie-2`, `-copy-copy-kopie-kopie`, `-copy-kopie`, `-kopie`) all indexable simultaneously.
**Recommendation**: These are almost certainly leftover "Duplicate Post" copies from translation work. Pick the correct live version per product, 301-redirect all others to it (do not just delete — they may carry inbound links/rankings), and remove the redirected slugs from the sitemap.

## Quick wins

1. Fix `/de/*` canonical tags to self-reference (Finding 1) — highest ROI, unlocks all German content for indexing.
2. Redirect the 26 dead legacy URLs and `/privacybeleid/` to their correct live equivalents instead of the homepage catch-all, and update the 287 internal links currently pointing at them (Finding 2).
3. Trash/redirect the 62 test, duplicate, and `-kopie/-copy` pages and strip them from the XML sitemap (Finding 4/10) — immediately cuts submitted sitemap bloat from 120 to ~76 URLs.
4. Add the five missing security headers at the nginx level — a one-file config change, no plugin needed (Finding 5).
5. Set `noindex, follow` + sitemap exclusion on `?reviews=` and `?store=` pseudo-pages (Finding 4) — low effort, removes 22 thin/duplicate URLs (avg. 117 words each) from Google's index consideration.
6. Confirm/restore WooCommerce Product schema (Finding 6) — check one settings toggle before assuming a code fix is needed.
7. Scope the WooCommerce session cookie to cart/checkout/account only, to re-enable full-page caching (Finding 8).
