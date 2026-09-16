# E-commerce SEO Findings — flavory.wine

Data sources: On-page analysis (static) from `data/crawl.json` (209 crawled URLs), `data/product.html` (raw HTML of `/shop/wijnproeverij-thuis-rood/`), `data/inbound_links.json`, `data/sitemap_urls.json`, plus 3 live spot-checks (render_page.py on the rood product with `--mode always`, curl on `/de/shop/merlot-oder-cabernet-sauvignon/` and its `-kopie` twin). DataForSEO Merchant API was not used (no credentials / out of scope for this pass — marketplace/competitor pricing data is not available in this report).

## Score

**34/100**

Rationale: on-page fundamentals on the handful of live NL product pages are reasonable (server-rendered price, decent unique copy, breadcrumbs, mostly-present alt text on hero images), but the site has zero Product/Offer/AggregateRating structured data (blocking Google Merchant Center and rich results entirely), a large duplicate-content problem in the German shop (14 of 19 product URLs are literal copies), 26 legacy product URLs still linked 287 times internally that 301 to the homepage instead of the replacement product, an indexable "uncategorised" archive, thin parameterised review/store pages, and a fragmented, cannibalised set of seasonal landing pages.

## Product inventory table

| URL | Title | Price (on-page) | Schema | Words | Inbound links |
|---|---|---|---|---|---|
| `/shop/wijnproeverij-thuis-rood/` | Rode Wijnspel - Het ultieme duel | €24,90 (og:price + visible `<bdi>`) | WebPage+ItemPage, BreadcrumbList, WebSite, Organization, ImageObject — **no Product** | 1,128 | 46 |
| `/shop/wijnproeverij-thuis-wit/` | Witte Wijnspel - legendarische druiven | €24,90 (text sample) | same set + FAQPage — **no Product** | 1,132 | 41 |
| `/shop/bubbelbox/` | Bubbelspel - Cava of Prosecco? | €64,90 (text sample; likely a larger/bundle SKU, not verified) | same set + FAQPage — **no Product** | 1,024 | 46 |
| `/shop/valentijn-wine-tasting-game-italie-of-spanje-10-korting/` | Rode Wijnspel - Italiaanse vs. Spaanse wijn | €49,90 (text sample; slug implies a 10%-off variant, not verified) | WebPage+ItemPage, BreadcrumbList — **no Product** | 1,106 | 48 |
| `/de/shop/merlot-oder-cabernet-sauvignon/` | Merlot oder Cabernet Sauvignon? | (price present in HTML, not extracted) | WebPage+ItemPage — **no Product** | 1,044 | 22 |
| `/de/shop/merlot-oder-cabernet-sauvignon-premium-edition/` | …Premium-Edition | n/a | same — **no Product** | 974 | 8 |
| `/de/shop/chardonnay-oder-sauvignon-blanc/` | Chardonnay oder Sauvignon Blanc? | n/a | same | 1,014 | 22 |
| `/de/shop/cava-oder-prosecco/` | Cava oder Prosecco? | n/a | same | 962 | ~23 (shared w/ kopie) |
| `/de/shop/italien-oder-spanien/` | Italien oder Spanien? | n/a | same | 1,030 | 28 |
| 14× `/de/shop/*-kopie*` / `*-copy*` | duplicates of the 5 DE products above, title suffixed "(kopie)"/"(Copy)" | identical | identical schema set | 962–1,076 (99.4% text-match to original, confirmed by diff) | 1–29 each |
| `/shop/productcategorie/rode-wijn/`, `/witte-wijn/`, `/geen-categorie/` (+ DE equivalents) | "X Archives - Flavory" | n/a | CollectionPage | 1,045–1,076 (mostly template boilerplate) | 1–3 |

Note: prices for bubbelbox/valentijn were read from crawled `text_sample`, not og:price meta (only confirmed via meta tag on the rood product); treat as indicative, not verified line items — no stock/price figures were fabricated beyond what the HTML/crawl text shows.

## What works

- **Price and add-to-cart are server-rendered**, not JS-injected: `€24,90` appears in raw HTML (`woocommerce-Price-amount`) and the page is confirmed non-SPA via live render (`is_spa: false`), so Google sees pricing without executing JS.
- **Unique, non-boilerplate product copy**: the 4 live NL products each carry 1,000+ words of distinct descriptive/FAQ content, not manufacturer copy-paste (there is no manufacturer copy to paste — this is an own-brand game/gift product).
- **Breadcrumbs and Organization/WebSite schema present sitewide** via Yoast, giving baseline entity signals even without Product markup.
- **FAQPage schema** is implemented on 3 of 4 live NL products (wit, bubbelbox, and the alternate chardonnay URL), a genuine rich-result opportunity already captured.
- **Cart is correctly noindexed** (`/shop/winkelwagen/` → `noindex, follow`) and `?add-to-cart=` is blocked in robots.txt — standard WooCommerce hygiene done right.
- Images on the flagship product mostly carry descriptive alt text on the primary/hero image (e.g. "Flavory rode wijnproeverij spel aan tafel - Merlot en Cabernet Sauvignon blend voor thuis").

## Findings

### 1. No Product/Offer/AggregateRating structured data anywhere — Merchant Center and rich results are unreachable
**Severity: Critical**
**Evidence:** The only JSON-LD on `/shop/wijnproeverij-thuis-rood/` (and confirmed live via rendered JSON-LD extraction) is Yoast's `WebPage/ItemPage + BreadcrumbList + WebSite + Organization + ImageObject` graph. No `@type":"Product"`, no `Offer`, no `AggregateRating`/`Review`, on any of the 48 shop URLs in the crawl (`schema_types` column never contains "Product"). Meanwhile the homepage displays a 4.5-star widget and "+5000 tevreden klanten," and the product page itself renders an Elementor "e-rating" `itemtype="https://schema.org/Rating"` micro-widget that is **not nested inside a Product/AggregateRating graph**, so it produces no valid rich-result markup.
**Recommendation:** Add `Product` JSON-LD (name, image, description, sku, brand, `Offer` with price/priceCurrency/availability/url, and `AggregateRating`/`Review` sourced from the real Trustpilot rating) to all live product templates. This is the single highest-leverage fix: it is a prerequisite for Google Merchant Center / free listings, Shopping rich results, and star ratings in organic search.

### 2. German shop is ~74% duplicate content (14 of 19 product URLs are literal copies)
**Severity: Critical**
**Evidence:** `/de/shop/merlot-oder-cabernet-sauvignon/` vs `/de/shop/merlot-oder-cabernet-sauvignon-kopie/` are 99.4% identical by text diff (confirmed live); only the `<title>` differs (adds "(kopie)"). The pattern repeats for `cava-oder-prosecco[-kopie]`, `chardonnay-oder-sauvignon-blanc[-kopie][-kopie-kopie]`, `italien-oder-spanien[-copy][-kopie][-kopie-2]`, and `merlot-oder-cabernet-sauvignon[-copy][-copy-2][-copy-copy-3][-copy-copy-kopie...]` (7 variants of this one product alone). All 14 kopie/copy URLs are self-canonicalized (not canonicalized to the original), `index, follow`, and **confirmed to be included in the sitemap**, and each carries real internal link equity (1–29 inbound links per crawl).
**Recommendation:** Pick one canonical URL per product, 301-redirect the 14 duplicates to it, remove them from the sitemap, and delete/re-point every internal link currently pointing at a "-kopie"/"-copy" slug. This is almost certainly leftover Elementor/JetEngine "duplicate page" clutter from content editing, not intentional variants — treat as a straightforward cleanup, not a content decision.

### 3. 26 legacy product/shop URLs 301 to the homepage instead of the matching live product, still linked 287 times from 114 pages
**Severity: High**
**Evidence:** `crawl.json`'s `final` field shows 26 non-homepage URLs redirecting to `https://flavory.wine/` (title "Home - Flavory"); `inbound_links.json` confirms these 26 URLs collectively receive exactly 287 internal links from across the site (matches known figure). Every visitor or crawler following an old `/product/rode-wijn-box/`, `/shop/merlot-of-cabernet-sauvignon/`, `/cava-vs-prosecco`, etc. link lands on the homepage, not the product — link equity and user intent are both lost, and it looks like a generic "soft 404 via homepage" pattern to Google.
**Recommendation:** See the full 26-URL redirect map below; retarget each 301 to its correct live product/category, then fix the internal links themselves (don't rely on the redirect chain for 287 internal occurrences).

### 4. Seasonal content is fragmented into near-duplicate, cannibalising URLs instead of one evergreen page per occasion
**Severity: High**
**Evidence:**
- **Kerstcadeau ("leukste kerstcadeau") cluster**: 7 separate indexable, non-blog URLs targeting the same theme — `/5-redenen-...-kerstcadeau-van-2024-is/`, `-2024-is-2/` (60 words — a stub), `-2024-is-2-2/`, `-2025-is/`, `-2025-is-2/`, `-2025-is-3/`, `-2025-is-w2/` (60 words — a stub) — plus a properly developed 2,348-word version living at `/blog/op-zoek-naar-het-leukste-kerstcadeau-van-2025-.../`. Titles and slugs are near-identical; two of the seven are 60-word skeleton/draft duplicates that were left published.
- **Valentijn horoscope cluster**: `/dit-voorspelt-jouw-wijnhoroscoop-voor-valentijn/` (1,250 words) and `/blog/valentijn-wijn-horoscoop-2026/` (2,832 words) both live in NL; in DE, `/de/das-sagt-dein-weinhoroskop-fuer-den-valentinstag-voraus/` (1,566 words) has two near-duplicate siblings, `-fur-den-valentinstag-voraus/` and `-fur-den-valentinstag-voraus-2/` (both 448 words, umlaut-typo slug variant).
- The DE blog versions of both clusters **canonicalize to the NL blog URL**, meaning the German-language content effectively can't rank under its own URL even where it exists.
**Recommendation:** Consolidate each occasion (Kerst/Christmas, Valentijn) into a single evergreen URL per locale (e.g. `/kerstcadeau-wijnspel/`, `/valentijn-wijnspel/`) that is updated year over year rather than re-published under a new slug; 301 all the yearly/duplicate variants into it; delete the two 60-word stubs outright; fix the DE canonical so German content is self-canonical, not pointed at the Dutch page.

### 5. GTIN exists but is buried in an SKU string and analytics payload, never exposed to schema or Merchant Center
**Severity: High**
**Evidence:** On `/shop/wijnproeverij-thuis-rood/`, `og:retailer_item_id` = `"B001L Merlot/CS (05430004293071)-2"` — a 14-digit GTIN-like number is concatenated inside a free-text SKU, and the same raw string reappears only in a client-side analytics `track()` call (`"sku":"B001L Merlot\/CS (05430004293071)-2"`). There is no `gtin`/`gtin13`/`gtin14`/`mpn` field anywhere in the page (schema search returned no GTIN/MPN hits), and no visible SKU on the page for the shopper either.
**Recommendation:** Split the identifier into a clean `sku` and a validated `gtin13`/`gtin14`, surface both in the future Product schema (see Finding 1) — this is required for Google Merchant Center product feeds and Shopping eligibility.

### 6. Uncategorised WooCommerce archive ("geen-categorie") is indexable in both languages
**Severity: Medium**
**Evidence:** `/shop/productcategorie/geen-categorie/` and `/de/shop/productcategorie/geen-categorie/` both return `index, follow`, self-canonical, title "Geen categorie Archives - Flavory" / "Geen categorie Archives" — a default WooCommerce fallback archive with no topical value, competing for crawl budget against the real `rode-wijn`/`witte-wijn` category pages.
**Recommendation:** Assign every product to a real category so nothing falls into "Uncategorised," then `noindex` (or 404) the archive itself as a safety net.

### 7. Category/tag pages are template-boilerplate thin content with only 1–2 SKUs each
**Severity: Medium**
**Evidence:** `/shop/productcategorie/rode-wijn/`, `/witte-wijn/`, and `/shop/producttag/box/` all report ~1,045 words, but that figure is dominated by sitewide header/nav/footer text (the same 1,045–1,076 word count recurs across every category, including "geen-categorie" and the DE tag page) rather than unique listing copy — there are only 1–2 live SKUs behind `rode-wijn`/`witte-wijn` today.
**Recommendation:** Add a short unique intro paragraph per category (what "rode wijn"/red-wine games are, who they're for) so the page isn't indistinguishable boilerplate, and hold off indexing new category/tag pages until they carry ≥4–6 products.

### 8. 22 JetEngine query-string pages (`?reviews=`, `?store=`) are indexable, thin, self-canonical
**Severity: Medium**
**Evidence:** 11 NL + 11 DE URLs such as `https://flavory.wine/?reviews=karolien` and `https://flavory.wine/?store=winkel-1` return `200`, `index, follow`, a unique `<title>` (person/store name), self-canonical, and ~117–150 words — these are individual testimonial/store-locator popup fragments exposed as separate crawlable URLs off the query string of the homepage.
**Recommendation:** Either canonicalize these parameter URLs back to the parent page (homepage or store-locator page) or add `noindex`; they add index bloat without standalone search value and dilute homepage authority via self-canonicalization.

### 9. B2B/relatiegeschenken landing page is thin and has no meta description
**Severity: Medium**
**Evidence:** `/eindejaars-en-relatiegeschenken/` — the dedicated end-of-year/corporate-gifting page — has `meta_description: ""` (empty), a generic H1 "Vraag een vrijblijvende offerte aan" ("Request a no-obligation quote") that drops the "eindejaars"/"relatiegeschenken" keywords entirely, only 183 words of body copy, no H2s (8 H3s, likely form-field labels marked up as headings rather than real subheadings), yet it receives 151 internal links — strong internal authority pointed at a page with almost nothing for Google (or a B2B buyer) to read.
**Recommendation:** Write a real meta description and an H1 that includes "relatiegeschenken"/"eindejaars", add 300–500 words of B2B-relevant copy above the form (volume pricing tiers, personalisation options, delivery timelines, past corporate clients/logos), and demote the form-field H3s to non-heading labels.

### 10. Legal/privacy page has been retired to a redirect instead of being maintained
**Severity: High**
**Evidence:** `/privacybeleid/` (Privacy Policy) now `final`s to the homepage (301→`/`), yet it's still linked 4 times internally and referenced by name in the B2B quote form ("Ik ga akkoord met het privacybeleid"), while `/algemene-voorwaarden/` (Terms) is alive and well-linked (199 inbound). A GDPR-relevant EU webshop collecting names/emails/payment data with no live, dedicated privacy policy is a compliance gap, not just an SEO one.
**Recommendation:** Restore `/privacybeleid/` as a real, current privacy-policy page (or fold its content into `/algemene-voorwaarden/` and repoint the checkout-form link and all 4 internal references there) — treat this as urgent regardless of SEO impact.

### 11. No reviews rendered on product pages themselves (Trustpilot only, off-site)
**Severity: Low**
**Evidence:** `/shop/wijnproeverij-thuis-rood/` contains no `woocommerce-Reviews`/`woocommerce-tabs`/review form markup; the only review-adjacent element is a link out to Trustpilot ("Bekijk recente reviews") and the disconnected `e-rating` micro-widget noted in Finding 1.
**Recommendation:** Pull Trustpilot (or native WooCommerce) reviews on-page and wire them into the future `AggregateRating`/`Review` schema so the 4.5★ / "+5000 klanten" social proof actually reaches search results, not just the homepage widget.

### 12. ~40% of product images have missing/empty alt text
**Severity: Low**
**Evidence:** On the rood product page, 19 of 48 `<img>` tags have empty `alt=""` (both full-size and 100×100 thumbnail variants of the same images — e.g. `Flavory-PDP-2`, `vergelijk`, `ChatGPT-Image-22-okt-2025...`), while a few (hero image, "Rodebox" legacy images) do carry descriptive/keyword alt text.
**Recommendation:** Fill in descriptive, product-specific alt text (wine names, "wine tasting game", packaging shot, etc.) for every gallery/comparison image, not just the primary one.

## Legacy URL redirect map

All 26 rows below currently 301 to the homepage (`https://flavory.wine/`) and are not in the sitemap, but remain internally linked (287 total occurrences across 114 pages, confirmed via `inbound_links.json`).

| Legacy URL | Inbound links | Proposed 301 target | Note |
|---|---|---|---|
| `/product/rode-wijn-box/` | 2 | `/shop/wijnproeverij-thuis-rood/` | old `/product/` URL structure |
| `/product/witte-wijn-box/` | 2 | `/shop/wijnproeverij-thuis-wit/` | old `/product/` URL structure |
| `/product/spanje-vs-italie-wijnspel/` | 2 | `/shop/valentijn-wine-tasting-game-italie-of-spanje-10-korting/` | old `/product/` URL structure |
| `/shop/rode-wijn-box/` | 6 | `/shop/wijnproeverij-thuis-rood/` | |
| `/shop/witte-wijn-box/` | 6 | `/shop/wijnproeverij-thuis-wit/` | |
| `/shop/rose-wijn-box/` | 4 | `/shop/` (or `/shop/productcategorie/rode-wijn/`) | no live rosé SKU exists — do not force-map to red/white, redirect to the shop root or category, and decide whether to relaunch the rosé line |
| `/shop/cava-prosecco-box/` | 6 | `/shop/bubbelbox/` | |
| `/shop/legendarische-druiven-wit/` | 17 | `/shop/wijnproeverij-thuis-wit/` | "legendarische druiven" phrase is now the live product's subtitle |
| `/shop/legendarische-wijnlanden-rood/` | 23 | `/shop/wijnproeverij-thuis-rood/` | |
| `/shop/merlot-of-cabernet-sauvignon/` | 15 | `/shop/wijnproeverij-thuis-rood/` | same wine pairing as current red product |
| `/shop/merlot-of-cabernet-sauvignon-premium/` | 6 | `/shop/wijnproeverij-thuis-rood/` | no live NL premium edition today (DE has one: `/de/shop/merlot-oder-cabernet-sauvignon-premium-edition/`) — consider relaunching an NL premium product page instead of flattening to base |
| `/shop/rode-wijnspel-merlot-vs-cabernet-sauvignon-premium-editie/` | 2 | `/shop/wijnproeverij-thuis-rood/` | same premium-edition gap as above |
| `/shop/bubbelspel-cava-vs-prosecco-proef-jij-het-verschil/` | 2 | `/shop/bubbelbox/` | |
| `/shop/wijnspel-italie-vs-spanje-proef-jij-het-verschil/` | 2 | `/shop/valentijn-wine-tasting-game-italie-of-spanje-10-korting/` | |
| `/shop/witte-wijnspel-chardonnay-vs-sauvignon-blanc-proef-jij-het-verschil/` | 2 | `/shop/wijnproeverij-thuis-wit/` | |
| `/cava-vs-prosecco` | 4 | `/shop/bubbelbox/` | top-level (no `/shop/`) legacy slug |
| `/chardonnay-vs-sauvignon-blanc` | 4 | `/shop/wijnproeverij-thuis-wit/` | top-level legacy slug |
| `/italie-vs-spanje` | 4 | `/shop/valentijn-wine-tasting-game-italie-of-spanje-10-korting/` | top-level legacy slug |
| `/merlot-vs-cabernet-sauvignon` | 4 | `/shop/wijnproeverij-thuis-rood/` | top-level legacy slug |
| `/de` | 46 | `/de/` (DE homepage) | currently redirects to the **NL** homepage — locale-detection bug, not just a missing trailing slash |
| `/de/` | 74 | `/de/` (DE homepage) | same locale bug — highest-linked offender, fix first |
| `/nl` | 46 | `/` (NL homepage) | already correct in effect (NL is default locale); no action needed beyond confirming intent |
| `/en/` | 1 | `/` (or build an EN site) | no English site exists; low priority given 1 inbound link |
| `/privacybeleid/` | 4 | recreate as its own page (see Finding 10) | do not simply redirect — legal/compliance page |
| `/?post_type=product&p=7319&preview=true` | 2 | n/a — remove the stale internal link | WP preview URL, not a redirect candidate |
| `/?post_type=product&p=7361` | 1 | n/a — remove the stale internal link | WP preview URL, not a redirect candidate |

## Quick wins

1. **Fix `/de` and `/de/` redirecting to the NL homepage instead of `/de/`** — 120 combined inbound links currently sending German-locale link equity and users to the wrong language; a one-line redirect-rule fix.
2. **301 the two 60-word "kerstcadeau" stub duplicates** (`-2024-is-2/`, `-2025-is-w2/`) to the full 2,348-word blog version — no content work required, just cleanup.
3. **Noindex the `geen-categorie` archive** (NL + DE) — a `robots` meta change on the WooCommerce uncategorised template, no redesign needed.
4. **Add a meta description and rewrite the H1 on `/eindejaars-en-relatiegeschenken/`** — currently has zero meta description despite 151 internal links pointing at it; a 10-minute copy fix with outsized authority-to-effort ratio.
5. **Restore `/privacybeleid/` as a live page** — currently redirects to the homepage while the checkout/quote form still asks shoppers to agree to it; both a quick win and a compliance fix.
6. **301 the 14 German "-kopie"/"-copy" product duplicates to their originals and drop them from the sitemap** — mechanical cleanup that immediately removes the site's largest block of duplicate content.
