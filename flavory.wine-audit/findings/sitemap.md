# Sitemap Architecture Audit — flavory.wine

Method: `sitemap_discovery.py` run live against production; all 8 child sitemaps fetched live (1 req/sec) and parsed with an XML parser; the 120-URL flat list (`data/sitemap_urls.json`) was cross-checked 1:1 against the live fetch (exact match, no drift). HTTP status/canonical/robots/word-count for every sitemap URL and for the crawl-vs-sitemap gap were taken from `data/crawl.json` (which already contains a status/canonical/robots record for all 120 sitemap URLs, so no redundant live re-fetch was needed for those — per coordinator instruction, no further live checks were run beyond the 8 child sitemaps and the discovery tool). Anything not independently re-verified live in this session is marked **[from crawl.json, not re-fetched live]**.

## Score

**42 / 100**

Rationale: sitemap format itself (XML validity, no priority/changefreq, size well under limits) is clean, but of 120 URLs listed only ~74 (62%) are legitimate, indexable, canonical pages. 46 URLs (38%) are junk (builder test pages, query-string CPT pages, an invalid `#` loc, duplicate "-kopie/-copy" German products, seasonal landing-page variants, an "uncategorised" archive). The entire `/de/` bilingual section is effectively absent from the sitemap because of a canonical misconfiguration, no hreflang exists anywhere on the site, and a real product page and a genuine XML issue (duplicate cross-listing) were found.

## Sitemap inventory table

| Child sitemap | URL count | lastmod range | Issues |
|---|---|---|---|
| post-sitemap.xml | 31 | 2025-03-05 → 2026-05-04 | Plausible, incremental dates. OK. |
| page-sitemap.xml | 46 | 2020-12-06 → 2026-04-21 | Contains 9 builder/test pages (`/home/`, `/home-2/`, `/home-3/`, `/hero-section/`, `/hero-section-2/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/`, `/shop2/`, `/de/shop-2/`); `/de/shop-2/` also appears in product-sitemap.xml (duplicate cross-listing). |
| product-sitemap.xml | 26 | 2024-05-31 → **2026-09-15** | 15 of 26 URLs are German "-kopie/-copy" duplicate products; lastmod of newest entries (2026-09-15, i.e. yesterday) is newer than page-sitemap's newest (2026-04-21) despite pages being the more recently edited content type per the CMS — consistent with WooCommerce silently touching `post_modified` on stock/price sync rather than genuine content edits (unverified without wp-admin access — **flag, not confirmed**). Missing: `/shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/` (real, self-canonical, 200, 1141 words — not in this file). |
| store-sitemap.xml | 5 | 2024-11-17 / 2024-11-29 | All 5 entries are `?store=<slug>` query strings — non-canonical CPT archive params, not real crawlable paths. |
| reviews-sitemap.xml | 6 | 2023-11-23 / 2024-11-29 | All 6 entries are `?reviews=<slug>` query strings, 117-word thin pages. |
| product_cat-sitemap.xml | 5 | 2026-05-19 → 2026-09-15 | Includes `/shop/productcategorie/geen-categorie/` — WooCommerce's default "uncategorised" bucket, no SEO value. |
| product_tag-sitemap.xml | 2 | 2026-07-30 / 2026-09-15 | Only 2 tags total; low value, fine to leave or fold in. |
| author-sitemap.xml | 1 | 2025-02-18 | The single entry's `<loc>` is literally `#` — invalid, not a URL. Single-author site, this sitemap has zero purpose. |
| **Total** | **120** (119 valid `<loc>`, 1 invalid) | | Well under the 50,000 URL / 50 MB per-file cap (largest file, page-sitemap.xml, is 61 KB) — no split needed. |

Note on `/sitemap-index.xml` (hyphen): confirmed via `sitemap_discovery.py` that this returns HTTP 200 but is **not valid sitemap XML** (`DOCTYPE is not allowed in sitemap XML` — it's the homepage HTML served via the site's catch-all soft-404 redirect). Not itself part of the declared sitemap structure, but a trap for any tool or scraper that guesses the hyphenated URL.

## What works

- `sitemap_index.xml` is correctly declared in robots.txt and returns valid `sitemapindex` XML.
- All 8 child sitemaps are well-formed, valid XML (no parse errors).
- No file is remotely close to the 50,000 URL / 50 MB limit (largest is 46 URLs / 61 KB).
- No `priority` or `changefreq` tags present (Yoast omits these by default — nothing to clean up).
- `post-sitemap.xml` has plausible, non-identical, incrementing lastmod dates and 28/31 entries carry `image:image` tags.
- Of the 120 listed URLs, 119 return HTTP 200 (only the malformed `#` entry is a non-URL).
- No sitemap URL carries a `noindex` robots directive — Yoast's exclude-noindexed-URLs behavior is working correctly for the URLs it does include.

## Findings

### 1. Entire `/de/` German section is absent from the sitemap due to canonical self-cannibalization
**Severity: Critical**
**Evidence:** Of 85 crawled `/de/` URLs, 50 (59%) carry a `<link rel="canonical">` pointing to the Dutch-language equivalent (e.g. `/de/faq/` → canonical `https://flavory.wine/faq/`; `/de/partners/` → canonical `https://flavory.wine/partners/`; `/de/blog/balans-in-wijn/` → canonical `https://flavory.wine/blog/balans-in-wijn/`). Yoast correctly excludes canonicalized-away URLs from its XML sitemaps, which is why none of the real `/de/blog/*`, `/de/faq/`, `/de/partners/`, `/de/eindejaars-en-relatiegeschenken/`, `/de/alcoholvrije-wijnen/` etc. pages (28+ German blog posts alone) appear anywhere in the sitemap. Site-wide, **zero pages carry `hreflang` annotations** (`data/crawl.json`, checked across all 209 crawled URLs). This is a canonical-tag/hreflang bug, not strictly a sitemap bug, but it is the direct root cause of the sitemap's missing German coverage and should be fixed before doing any sitemap cleanup for `/de/`, otherwise re-adding these URLs to the sitemap will just submit self-contradicting canonical signals to Google.
**Recommendation:** Fix canonicals on `/de/*` pages to self-reference (or, if these are meant to be thin/duplicate stubs, deliberately noindex them) before touching the sitemap. Once canonicals are correct, add hreflang (`nl-NL` / `de` / `x-default`) either in `<head>` or via sitemap `xhtml:link` alternates, and only then let Yoast auto-include the corrected `/de/` URLs.

### 2. 15 duplicate "-kopie/-copy" German product pages are indexable and in the sitemap
**Severity: High**
**Evidence:** `product-sitemap.xml` contains `de/shop/merlot-oder-cabernet-sauvignon-copy/`, `-copy-2`, `-copy-copy-3`, `-copy-copy-kopie-2`, `-copy-copy-kopie-kopie`, `-copy-copy-kopie`, `-copy-kopie`, `-kopie`, plus `chardonnay-oder-sauvignon-blanc-kopie(-kopie)`, `italien-oder-spanien-kopie/-kopie-2/-copy`, `cava-oder-prosecco-kopie` — 15 URLs total, all HTTP 200, all self-canonical (not pointing to the real product), most with 950–1080 words of near-identical content. These are classic doorway/duplicate-content candidates (matches the "Penalty Risk" pattern in the location-page rubric — same product, city/variant swapped).
**Recommendation:** Trash or noindex the duplicates, 301 each to the single real German product, remove from product-sitemap.xml.

### 3. Query-string CPT pages (`?reviews=`, `?store=`) submitted in dedicated sitemaps
**Severity: High**
**Evidence:** `store-sitemap.xml` (5 URLs) and `reviews-sitemap.xml` (6 URLs) list only `?store=<slug>` / `?reviews=<slug>` query-string URLs — not real paths. All return 200 and are self-canonical, but are 117-word thin archive-style pages with no clean, crawlable URL structure. Google can index query-string URLs, but submitting non-rewritten query params in a sitemap is a known low-value pattern and these two post types add no unique indexable value (they're testimonial/store-locator snippets, not content pages).
**Recommendation:** In Yoast SEO → Search Appearance → Content Types, either give these two custom post types clean permalinks (`/reviews/<slug>/`, `/stores/<slug>/`) or exclude them from the XML sitemap entirely and mark them `noindex` (they read as internal/marketing widgets, not landing pages).

### 4. `author-sitemap.xml` contains an invalid `<loc>#</loc>` entry
**Severity: Medium**
**Evidence:** The sole entry in `author-sitemap.xml` is literally `<loc>#</loc>` — not a valid URL per the sitemap protocol, confirmed by direct fetch and XML parse. This is a single-author WordPress/WooCommerce site, so the author archive has no SEO value regardless.
**Recommendation:** In Yoast SEO → Search Appearance → Content Types, disable "Author archives" (set to noindex or disable entirely) — this both removes the invalid entry and eliminates author-sitemap.xml from the index.

### 5. Nine builder/test pages are live, indexable, and duplicate the homepage
**Severity: High**
**Evidence:** `/home/`, `/home-3/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/` all return 200, `robots: index, follow`, self-canonical, and 1560–1600 words of content nearly identical to the real homepage (title "Flavory - Taste the fun"). `/home-2/` and `/hero-section/` are 117-word stub test pages titled "Home 2 - test" and "hero section." `/shop2/` and `/de/shop-2/` are 1000+ word duplicate shop pages. All 9 are listed in `page-sitemap.xml`, and `/de/shop-2/` is additionally duplicated into `product-sitemap.xml` — an actual XML-listing bug (same URL cross-listed in two different sitemap files). Worse: `/de/shop/` (a real page) canonicalizes to `/de/shop-2/` — i.e. the "real" German shop page currently points its canonical at one of these test duplicates. **[from crawl.json, not re-fetched live this session]**
**Recommendation:** Trash or noindex all 9 test pages, 301 to the real homepage/shop, remove from both sitemaps, and fix `/de/shop/`'s canonical to self-reference once its content is corrected.

### 6. Seven near-duplicate seasonal "5 redenen…kerstcadeau" landing pages
**Severity: Medium**
**Evidence:** `5-redenen-waarom-flavorys-wine-tasting-het-leukste-kerstcadeau-van-2024-is`, `-2`, `-2-2`, and the 2025 variants `-is`, `-is-2`, `-is-3`, `-is-w2` — 7 URLs, word counts ranging 60–476, largely repeating the same "5 reasons" pitch year over year with test-style suffixes (`-w2`, `-2-2`). 5 of these 7 have **zero internal inbound links** (see Finding 8/orphans). A cleaner, already-linked equivalent exists at `/blog/op-zoek-naar-het-leukste-kerstcadeau-van-2025-.../` (2348 words).
**Recommendation:** Keep one canonical, well-linked seasonal landing page per year (or none, folding the message into the linked blog post), 301 the rest, remove from post-sitemap.xml.

### 7. `product-sitemap.xml` lastmod dates run ahead of `page-sitemap.xml` (2026-09-15 vs 2026-04-21) — possible non-substantive touches
**Severity: Medium (unverified)**
**Evidence:** Newest product-sitemap lastmod is 2026-09-15 (i.e. yesterday relative to the audit date), and several product/category/tag entries share that exact same 2026-09-15 timestamp. Pages haven't been touched since 2026-04-21. This pattern (many unrelated products/categories all "modified" on the same day) is typical of WooCommerce stock-sync or price-update cron jobs re-saving `post_modified` without a substantive content change — Yoast's lastmod comes straight from `post_modified`, so it isn't filtered for meaningful edits.
**Recommendation:** Cannot confirm without wp-admin revision history (not available in this audit's data) — flag for the site owner to check whether product lastmod is being driven by inventory/price sync rather than content edits. If so, treat lastmod on the product sitemap as a freshness signal with low reliability; do not rely on it to prioritize crawl budget.

### 8. `/privacybeleid/` is listed in the sitemap but serves the homepage
**Severity: High**
**Evidence:** `https://flavory.wine/privacybeleid/` returns HTTP 200, but `final` and `canonical` both resolve to `https://flavory.wine/` and the returned title/content is identical to the homepage ("Home - Flavory", 1563 words) — i.e. the privacy policy content is gone and the URL now serves duplicate homepage content (soft-404 pattern, consistent with the site's catch-all-to-homepage behavior noted in the brief). This is also a legal/compliance gap (missing privacy policy) as well as an SEO duplicate-content issue.
**Recommendation:** Restore the privacy policy page content (legal requirement for a D2C e-commerce site processing payments/EU customers) or, if intentionally merged elsewhere, 301 `/privacybeleid/` to its new location and remove the old self-canonical duplicate from `page-sitemap.xml`.

### 9. Real product page missing from product-sitemap.xml
**Severity: Medium**
**Evidence:** `/shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/` is HTTP 200, self-canonical, 1141 words, indexable — but is not present in `product-sitemap.xml` (confirmed against the live-fetched 26-URL list). **[from crawl.json, not re-fetched live this session]**
**Recommendation:** Check Yoast's sitemap exclusion settings and the product's own SEO tab for an inadvertent "exclude from sitemap" flag; re-include once confirmed intentional or not.

### 10. `/shop/productcategorie/geen-categorie/` ("uncategorised") indexed and in sitemap
**Severity: Low**
**Evidence:** `product_cat-sitemap.xml` includes `https://flavory.wine/shop/productcategorie/geen-categorie/`, WooCommerce's default fallback category, 200/indexable, 1045 words of auto-generated archive content with no unique value.
**Recommendation:** Assign all products to a real category (eliminate uncategorized), then noindex/exclude this archive.

### 11. 14 orphan sitemap URLs (zero internal inbound links)
**Severity: Medium**
**Evidence:** 13 confirmed orphans in `data/inbound_links.json` cross-referenced against the sitemap: 5 of the 7 kerstcadeau variants (Finding 6), 2 German Valentine's horoscope duplicates (`/de/das-sagt-dein-weinhoroskop-fur-den-valentinstag-voraus/` and `-2`), and 6 of the 15 "-kopie/-copy" German product duplicates (Finding 2). These overlap heavily with the "remove" list above — orphan status is itself corroborating evidence that these are abandoned test/duplicate content rather than intentionally maintained pages.
**Recommendation:** No separate fix needed beyond Findings 2 and 6 — removing those URLs resolves the orphan count as a side effect. Re-check for any remaining orphan after cleanup.

## Keep / Remove / Fix list

**REMOVE from sitemap (46 of 120 URLs, ~38%):**
- 1 × `#` invalid loc (author-sitemap.xml)
- 6 × `?reviews=<slug>` (reviews-sitemap.xml)
- 5 × `?store=<slug>` (store-sitemap.xml)
- 9 × builder/test pages: `/home/`, `/home-2/`, `/home-3/`, `/hero-section/`, `/hero-section-2/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/`, `/shop2/`, `/de/shop-2/` (note: `/de/shop-2/` is double-listed, in both page-sitemap.xml and product-sitemap.xml — remove both occurrences)
- 7 × "5-redenen…kerstcadeau…" seasonal variants
- 15 × German "-kopie/-copy" duplicate products
- 1 × `/shop/productcategorie/geen-categorie/`
- 1 × `/de/shop/producttag/box-de/` — keep only if it has a real, non-duplicate tag archive; verify before removing (not independently confirmed this session, low priority either way)

**FIX (keep the URL, correct the underlying issue):**
- `/privacybeleid/` — restore real content or 301 + drop from sitemap
- `/de/shop/` canonical → currently points to a test page (`/de/shop-2/`); fix once `/de/shop-2/` is retired
- Product-sitemap lastmod reliability — verify stock-sync isn't inflating dates
- Author sitemap — disable entirely in Yoast rather than leave a 1-entry sitemap with an invalid loc

**ADD (missing from sitemap, should be included once canonical/content issues above are fixed):**
- `/shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/`
- The full corrected `/de/` section (28 blog posts, `/de/faq/`, `/de/partners/`, `/de/eindejaars-en-relatiegeschenken/`, `/de/alcoholvrije-wijnen/`, `/de/algemene-voorwaarden/`, etc.) — only after canonicals are fixed to self-reference

**KEEP as-is (~74 URLs):** the 31 blog posts, the bulk of page-sitemap.xml (minus the 9 test pages and privacybeleid), the 11 genuine product-sitemap.xml entries (26 minus 15 kopie/copy), 4 of 5 product_cat entries, and product_tag's real entry.

## Recommended Yoast settings / target structure

1. **Content Types → Reviews (CPT):** exclude from XML sitemap or fix permalink structure; if kept, mark `noindex` given thin 117-word content.
2. **Content Types → Store (CPT):** same treatment as Reviews.
3. **Content Types → Author archives:** disable/noindex (single-author site — eliminates author-sitemap.xml and its invalid `#` entry).
4. **Content Types → Pages:** after trashing the 9 test pages and fixing/removing `/privacybeleid/`, page-sitemap.xml drops from 46 to ~36 URLs.
5. **Content Types → Products:** after removing the 15 kopie/copy duplicates and adding the 1 missing real product, product-sitemap.xml goes from 26 to ~12 URLs.
6. **Product categories/tags:** exclude "uncategorised" from indexing; keep `rode-wijn`, `witte-wijn`, `rotwein`, `weiswein` (4 real category archives).
7. **Target structure for the nl/de bilingual store:**
   - Fix `/de/*` canonicals to self-reference (stop pointing at NL).
   - Add `hreflang` alternates for every nl/de pair — either in-page `<link rel="alternate" hreflang="...">` tags (currently zero site-wide) or via sitemap `xhtml:link` entries in each `<url>` block (WPML/Polylang-style, works well with Yoast if a multilingual plugin is added; otherwise implement in-page tags, which is simpler for a single Yoast install without a multilingual plugin).
   - Once fixed, let Yoast auto-populate `/de/` into post-sitemap.xml and page-sitemap.xml alongside the nl-NL versions (no separate per-language sitemap needed at this URL volume — total site is ~150 real URLs across both languages, well under any file-splitting threshold).
   - Consider adding `x-default` pointing to the nl-NL homepage.

## Quick wins

1. Disable the Author sitemap in Yoast (Content Types → Author archives → off) — removes the invalid `#` loc immediately.
2. Trash/noindex the 9 builder test pages and their sitemap entries — biggest single duplicate-content risk to homepage rankings.
3. Fix or redirect `/privacybeleid/` — legal exposure + duplicate homepage content, one-page fix.
4. Fix the ~50 `/de/*` self-canceling canonicals — unlocks the entire German section for indexing and sitemap inclusion at once.
5. Exclude Reviews and Store CPTs from the sitemap (or fix their URLs) — removes 11 low-value query-string entries in one settings change.
