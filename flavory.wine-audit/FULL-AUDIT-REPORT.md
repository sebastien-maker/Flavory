# Full SEO Audit — flavory.wine

Audit date: 16 September 2026
Scope: 209 URLs crawled (homepage + all 120 sitemap URLs + internal links, robots.txt respected, 5 concurrent, 1 s delay). Eleven specialist passes: technical, content/on-page, schema, sitemap, performance, visual, GEO (AI search), backlinks, e-commerce, topic clusters, SXO.
Detailed evidence per category: `findings/*.md`. Raw data: `data/`. Screenshots: `screenshots/`.

Data limitations: Google Search Console, GA4, CrUX and PageSpeed Insights were not available (no credentials; PSI keyless quota exhausted), so performance is lab-measured with Playwright. Moz and Bing backlink APIs were not configured; Common Crawl was used. No drift baseline existed for this URL.

---

## 1. Executive summary

### SEO Health Score: **37 / 100**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 34 | 7.5 |
| Content Quality | 23% | 38 | 8.7 |
| On-Page SEO | 20% | 33 | 6.6 |
| Schema / Structured Data | 10% | 42 | 4.2 |
| Performance (CWV, lab) | 10% | 28 | 2.8 |
| AI Search Readiness (GEO) | 10% | 51 | 5.1 |
| Images | 5% | 45 | 2.3 |
| **Total** | | | **37** |

Supplementary scores (not in the weighted total): Sitemap 42, Visual/mobile UX 63, E-commerce 34, Content architecture (clusters) 30, SXO gap 35, Backlinks: insufficient data.

### Business type detected
Direct-to-consumer e-commerce (WordPress + WooCommerce + Yoast SEO 28.4 + JetEngine/Elementor builder on nginx). Product: "wine tasting game" boxes (two wines blind-tasted head to head, €24.90 to €64.90), plus B2B end-of-year gifts and on-location tastings. Market: Flanders/Netherlands (nl-NL), with a partial German section under `/de/`. Trustpilot rating 4.5 from 31 reviews; company address in Bazel (BE) per LinkedIn.

### What works
- Server-rendered HTML; nothing depends on JavaScript to be crawled.
- Correct host and protocol canonicalisation (www and http both 301 to `https://flavory.wine`).
- Valid robots.txt and a valid, well-formed sitemap index with 8 child sitemaps.
- Clean Yoast schema foundation (WebSite, Organization, BreadcrumbList, Article + Person on blog posts, FAQPage on 7 pages).
- Product pages have 1,000+ words of unique copy, server-rendered price and add-to-cart, cart correctly noindexed.
- Homepage above the fold on mobile shows H1, rating widget and CTA; CLS is effectively zero on every page tested.
- The blog post on blind wine tasting already ranks for "blind wijn proeven" and is the right page type for that query.

### Top 5 critical issues
1. **Server response time of 3 to 7 seconds on every page.** Lab LCP is 5.0 s on the mobile homepage and 7.5 s on a blog post. `Cache-Control: max-age=0` plus a WooCommerce session cookie and a `__cvg_1p_uid` cookie set on every anonymous first request defeat full-page caching site-wide.
2. **No Product, Offer, AggregateRating or Review schema on any product page** (25 ItemPage URLs). Merchant listings, Shopping rich results and star ratings are unreachable despite a visible 4.5-star widget and "+5000 tevreden klanten".
3. **Every unknown URL 301-redirects to the homepage** instead of returning 404. 26 legacy product and landing URLs (e.g. `/product/rode-wijn-box/`, `/shop/rode-wijn-box/`, `/cava-vs-prosecco`) are still linked 287 times from 114 pages and all land on the homepage. The privacy policy URL `/privacybeleid/` is swallowed the same way, so the site currently has no reachable privacy policy while checkout still references it.
4. **Internationalisation is broken.** Zero hreflang tags on 208 pages. `/de/`, `/en/` and `/nl` all redirect to the Dutch homepage (the German home actually lives at `/de/start/`). 60 of 96 crawled German URLs resolve to a Dutch page (via 301 redirect for untranslated pages such as `/de/faq/` and `/de/blog/*`, or via canonical for `/de/?reviews=` and `/de/?store=`). `/en/shop/` declares `lang="en-US"` but serves Dutch content.
5. **Index bloat: roughly 40% of crawled URLs should not be indexable.** 9 builder test pages duplicating the homepage (`/home/`, `/home-2/`, `/home-3/`, `/hero-section/`, `/home-hero-image/`, `/shop2/`, `/de/shop-2/`…), 14 German product clones ending in `-kopie`/`-copy` (99.4% identical text), 7 near-identical "5 redenen … kerstcadeau" landing pages (two are 60-word stubs), a duplicated blog post (`-dupliceren`), two republished-as-new post pairs, 22 thin `?reviews=` / `?store=` pseudo-pages, and an indexable "geen-categorie" archive. 46 of the 120 sitemap URLs fall in this group; the author sitemap contains an invalid `<loc>#</loc>`.

### Top 5 quick wins
1. Enable full-page caching with the WooCommerce session cookie excluded from the cache key except on cart/checkout/account, and fix the `Cache-Control`/`Expires` headers. Expected: TTFB from 3–7 s to under 0.8 s for anonymous visitors; LCP into the "good" range on most pages.
2. Turn on WooCommerce/Yoast product structured data (one settings toggle or the Yoast WooCommerce SEO add-on) and wire the Trustpilot rating into AggregateRating. Ready-to-paste JSON-LD is in `findings/schema.md`.
3. Restore `/privacybeleid/` as a live page and retarget the 26 legacy URLs to their real product equivalents (redirect map in `findings/ecommerce.md`), then fix the 287 internal links.
4. Trash or 301 the 9 test pages, 14 German clones and 6 of the 7 kerstcadeau variants; noindex `?reviews=`/`?store=` and `geen-categorie`; disable the author sitemap. Sitemap drops from 120 to about 76 URLs.
5. Write meta descriptions and H1s for the commercial pages that lack them: `/shop/`, both product pages, `/shop/bubbelbox/`, `/flavory-gameplay/`, `/wijnkiezer/` (no H1), `/eindejaars-en-relatiegeschenken/` (no meta description), `/proeverij/` (meta description copied from the homepage). Add "wijnbox" and "wijnproeverij thuis" to titles where relevant.

---

## 2. Technical SEO (34/100)

Details: `findings/technical.md`, `findings/sitemap.md`.

### Crawlability
- 209 URLs crawled, 208 returned 200 (1 invalid `#` sitemap entry). No robots-blocked pages in scope. No JavaScript rendering dependency.
- Internal linking is a flat mesh: every blog post links to every other post plus `/shop/`, `/faq/` and the cart page. 14 sitemap URLs have zero inbound internal links.
- Average HTML document is 314 KB (max 503 KB), with 27–35 external stylesheets and 28–32 render-blocking scripts per page.

### Indexability
- Only 2 pages are noindexed (the two cart pages). Everything else is `index, follow`, including test pages, clones and parameterised CPT pages.
- Estimated pages that deserve indexing: about 76 of the 120 sitemap URLs and roughly 120 of the 209 crawled URLs.
- Sitemap: 8 valid child sitemaps; 46 junk entries; invalid `#` loc in `author-sitemap.xml`; `/de/shop-2/` listed in two child sitemaps; `product-sitemap.xml` lastmod of 2026-09-15 likely reflects stock-sync touches rather than edits (not verifiable without admin access).

### Redirects and 404 handling
- Catch-all 301 to homepage for any unknown path (soft-404 pattern). Confirmed on `/this-page-does-not-exist-xyz123`, `/sitemap-index.xml`, `/privacybeleid/`, and the 26 legacy URLs.
- Untranslated German URLs 301 to their Dutch equivalents (e.g. `/de/faq/` → `/faq/`, `/de/blog/natuurwijn-kopen/` → the Dutch post).

### Internationalisation
- No hreflang on any page, in HTML or sitemap.
- `/de/` → 301 → Dutch homepage; German home is `/de/start/`. `/en/` → Dutch homepage; `/en/blog/` and `/en/shop/` exist with `lang="en-US"` but Dutch content, canonicalised to the Dutch URLs.
- German section: 34 sitemap URLs, of which 14 are product clones; the remaining real German pages (`/de/start/`, `/de/kontakt/`, `/de/ueber-flavory/`, `/de/so-geht-das-flavory-spiel/`, 5 products, 2 categories, blog index) have no hreflang link to their Dutch counterparts.

### Security
- No HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options or Referrer-Policy headers. HTTPS itself is fine.
- `/wp-json/` exposed via Link header (normal for WordPress, low risk).

### Core Web Vitals status
Lab only (see section 6): LCP poor or needs-improvement on all pages; CLS good; INP not measured, TBT proxy 433–683 ms under 4x CPU throttle.

---

## 3. Content Quality (38/100)

Details: `findings/content.md`, `findings/cluster.md`, `findings/sxo.md`.

### E-E-A-T
- Author schema exists (Person "Bart") but `Person.url` is the placeholder `#` on all 56 instances; no author bio page, credentials or profile links.
- Organization schema carries name, logo and one Instagram link only. Address (Bazel, BE), VAT number, email, LinkedIn and Trustpilot are not linked from schema and the address/VAT are not visible in the crawl text.
- Trust signals on page (money-back guarantee, "+5000 tevreden klanten", Trustpilot quotes) are visible but not marked up.
- Privacy policy currently unreachable (redirects to homepage).

### Thin content
50 pages under 300 words. Real (non-redirect) thin pages include the two 60-word kerstcadeau stubs, 22 `?reviews=`/`?store=` pages (avg 117 words), the B2B page `/eindejaars-en-relatiegeschenken/` (183 words, a bare quote form despite 151 inbound links), category archives (mostly template boilerplate) and the builder test pages.

### Duplicate content
- 9 homepage clones (test pages), 14 German product clones, 7 kerstcadeau landing variants, `/blog/...-dupliceren/` copy, two republished blog pairs ("welke wijn altijd in huis" Feb/Sept 2025; "waarom smaakt elke wijn anders" Apr/Jul 2025), 3 Valentine horoscope variants in DE and 2 in NL.
- 30 pages reuse the homepage meta description verbatim, including `/proeverij/`.

### Readability and depth
Blog and product copy are well written, conversational Dutch with good depth (product pages 1,000+ words, top blog posts 2,000+ words). The gap is architecture, not prose: no pillar pages, no curated related-post logic, and blog posts link to legacy product URLs that redirect to the homepage, while the live products receive zero blog links.

### Keyword targeting (SXO)
- Flavory's own vocabulary ("wijnspel", "het ultieme duel") does not match how buyers search ("wijnproeverij thuis", "wijnbox cadeau", "relatiegeschenk wijn", "teambuilding wijnproeverij"). Of 8 target queries checked, Flavory is absent from 6, present via bol.com and a mislabelled `/en/shop/` URL for "wijnspel", and well aligned only for "blind wijn proeven".
- The word "wijnbox" does not appear in any title on the site.
- Persona fit: host planning a wine evening scores 81/100 on the homepage; gift buyer 58; B2B buyer and wine-curious beginner score lower because the B2B page hides pricing behind a form and no beginner guide/pillar exists.

---

## 4. On-Page SEO (33/100)

| Check | Result (208 HTML pages) |
|---|---|
| Missing title | 0 |
| Title pattern | "X - Flavory" everywhere; homepage title is "Home - Flavory" (no keyword) |
| Missing meta description | 71 (34%), incl. the B2B page |
| Duplicate meta description | 30 pages copy the homepage's |
| Missing H1 | 86 (41%), incl. `/shop/`, both product pages, `/shop/bubbelbox/`, `/flavory-gameplay/`, `/wijnkiezer/` |
| Multiple H1 | 41 |
| hreflang | 0 |
| Images without alt | 1,019 of 5,207 (20%) |

Recommended rewrites (full set in `findings/sxo.md`):
- Homepage title: "Wijnproeverij thuis: het wijnspel voor vrienden | Flavory" instead of "Home - Flavory".
- Red box: "Rode wijnbox: Merlot of Cabernet Sauvignon? Wijnspel voor thuis | Flavory".
- White box: "Witte wijnbox: Chardonnay of Sauvignon Blanc? Wijnspel voor thuis | Flavory".
- B2B: "Relatiegeschenk wijn: wijnspel als eindejaarsgeschenk (vanaf 10 stuks) | Flavory" with visible tier pricing.
- `/proeverij/`: "Teambuilding wijnproeverij op locatie (8–60 personen) | Flavory" with its own meta description.

Internal linking: replace the all-posts related block with 3–4 curated links per cluster; repoint every blog → product link to the live URLs (`/shop/wijnproeverij-thuis-rood/`, `/shop/wijnproeverij-thuis-wit/`, `/shop/bubbelbox/`); stop linking the cart page from posts; add links to `/wijnkiezer/`, `/proeverij/`, `/flavory-gameplay/`, `/alcoholvrije-wijnen/` (1–2 inbound links each today). A 40-row link matrix is in `findings/cluster.md`.

---

## 5. Schema and structured data (42/100)

Details and ready-to-paste JSON-LD: `findings/schema.md`.

Current implementation (valid, no syntax errors): WebSite + SearchAction, Organization (name, logo, Instagram), WebPage/ItemPage/CollectionPage, BreadcrumbList, ImageObject, Article/BlogPosting + Person on 56 posts, FAQPage on 7 pages (content matches on-page Q&A).

Validation issues:
- No Product / Offer / AggregateRating / Review anywhere (Critical). Elementor's rating widget emits an orphan `schema.org/Rating` microdata node that produces nothing.
- `Person.url` = `#` on 56 pages (Medium).
- Blog posts inconsistently typed (54 Article, 2 BlogPosting) (Low).
- Organization lacks address, contactPoint, VAT, founder and additional sameAs (High for entity/GEO).
- No LocalBusiness/Store schema on the 10 partner-store pages; no Review schema on the 12 customer-review pages.
- GTIN `05430004293071` is buried in the SKU string rather than a `gtin13` property.
- FAQPage no longer yields rich results for most sites; keep it, do not expand it.

---

## 6. Performance (28/100, lab)

Details: `findings/performance.md`. Single cold runs, Playwright, Pixel 7 emulation, real network.

| Page | Viewport | TTFB | LCP | LCP status | CLS | TBT proxy (4x CPU) |
|---|---|---|---|---|---|---|
| Homepage | Mobile | 4,653 ms | 4,988 ms | Poor | 0.000 | 683 ms |
| Homepage | Desktop | 3,970 ms | 4,132 ms | Poor | 0.002 | n/m |
| /shop/ | Mobile | 2,936 ms | 3,096 ms | Needs improvement | 0.000 | n/m |
| Product (rood) | Mobile | 3,410 ms | 3,624 ms | Needs improvement | 0.000 | 433 ms |
| Blog post | Mobile | 7,299 ms | 7,488 ms | Poor | 0.000 | n/m |

Root causes, in order:
1. Server response and caching: TTFB is 4–9x the 800 ms budget on every page and accounts for almost all of LCP. `Cache-Control: max-age=0`, `Expires: now`, and two cookies set on first anonymous hit bypass page caching.
2. Render-blocking builder assets: 27–35 stylesheets and 28–32 blocking scripts per page; HTML itself averages 314 KB.
3. Third-party tags: GTM, Meta Pixel, GA4, Microsoft Clarity and an A/B-test/conversion tool (7–11 requests) run together; 433–683 ms blocking time under throttling.
4. Page weight: homepage and blog post transfer 9.4–9.7 MB on a cold load; `/shop/` lazy-loads 0 of 20 images.
5. The LCP hero already has `fetchpriority=high`, eager loading and dimensions; images are not the LCP bottleneck.

Fix sequence: page cache with cookie exclusions and correct headers, OPcache/PHP version check, object cache, CDN; then defer/delay third-party scripts; then remove unused builder CSS and lazy-load below-fold images.

---

## 7. Images (45/100)

- 5,207 image tags across the crawl; 1,019 (20%) lack alt text, about 40% on product images.
- 139 images lack width/height attributes.
- WebP is in use for the hero and OG image; hero has correct priority hints.
- Lazy loading is inconsistent (0 of 20 on `/shop/`), and cold-load transfer of 9.4 MB on the homepage indicates oversized media.
- Product images should carry descriptive alt text with the product name and grape pairing; add `gtin13` and image to Product schema once enabled.

---

## 8. AI Search Readiness / GEO (51/100)

Details: `findings/geo.md`.

- AI crawler access: robots.txt has no rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot or Bytespider, so all are allowed. For a commerce site this is the right default; optionally block CCBot/Bytespider only.
- `llms.txt` exists but is auto-generated and lists test pages ("Home-3", "Flavory - Landingpage") and untitled entries; no `llms-full.txt`. Google ignores llms.txt; treat as hygiene.
- Citability: main-content extraction of the homepage yields only 503 characters of blog teasers; the "Wat is Flavory?", "Hoe werkt het?" and price passages are not picked up as main content. Add a crisp 2-sentence definition block near the top of the homepage, product pages and FAQ (three Dutch example passages are in `findings/geo.md`).
- Entity signals: no Wikidata entry; Organization schema is minimal; Trustpilot (4.5, 31 reviews) and LinkedIn (Bazel BE address) exist but are not linked as sameAs. Brand name "Flavory" collides with unrelated brands, so disambiguation via schema and consistent descriptions matters.
- Brand-mention checks on Google AI Overviews, Bing and DuckDuckGo could not be performed (consent walls/CAPTCHA); marked not checked.

---

## 9. Visual and mobile UX (63/100)

Details and 20 screenshots: `findings/visual.md`, `screenshots/`.

- Announcement-bar carousel occasionally renders two messages on top of each other on mobile (`blogpost_mobile.png`, `flavory_wine_mobile.png` from the first capture).
- Product page on mobile: price and add-to-cart are below the first viewport; a full extra scroll past the gallery is needed (`product_mobile_full.png`).
- Mobile logo/header consumes about 30% of the first viewport on homepage, shop and product pages.
- `/de/start/` never reached network-idle in three Playwright attempts (45 s timeout) even though curl returns 200 in about 4 s; a stuck request or script on the German template.
- FAQ template uses a different mobile header than the rest of the site.
- No cookie-consent banner was observed in any capture; verify consent-mode behaviour for BE/NL visitors given GTM, Meta Pixel and Clarity are loaded.

---

## 10. E-commerce (34/100)

Details, product inventory and the 26-URL redirect map: `findings/ecommerce.md`.

- Live NL products: `/shop/wijnproeverij-thuis-rood/` (€24.90), `/shop/wijnproeverij-thuis-wit/` (€24.90), `/shop/bubbelbox/` (€64.90, indicative), `/shop/valentijn-wine-tasting-game-italie-of-spanje-10-korting/` (€49.90, indicative; slug still carries a Valentine discount).
- German shop: 5 real products plus 14 clones.
- Category pages are template boilerplate; `/shop/productcategorie/geen-categorie/` is indexable.
- No Product schema, no GTIN field, no shipping/returns policy markup; Merchant Center free listings not possible today.
- Seasonal pages fragmented (kerstcadeau x7 + 3 blog posts; valentijn x2 NL, x3 DE). Consolidate to one evergreen URL per occasion per locale and update the slug of the Valentine product.
- B2B page hides pricing behind a form; competitors show "vanaf 10 stuks" tier pricing.

---

## 11. Backlinks (insufficient data)

Details: `findings/backlinks.md`.

- flavory.wine is absent from the Common Crawl web graph while comparable Belgian wine retailers (wijnbeurs.be, wijnvoordeel.be) are present. Directional signal of a very thin link profile.
- None of the four partner-store homepages that could be checked (huismanendonckx.be, mondovino.be, entrepotduvin.be, drankenhinderdael.be) link to flavory.wine; wijnhuisbollaert.be is JS-rendered and unconfirmed. Flavory's own `?store=` and `/partners/` pages have no crawlable outbound links to the partners either.
- Referring domains, anchor text and toxicity could not be assessed without Moz/Ahrefs/Bing credentials. A tailored link-building plan (stockist links, Belgian gift guides, team-building directories, Flemish lifestyle bloggers, press on the wine-game concept, Unizo/chamber listings) is in the findings file.

---

## 12. Content architecture and clusters (30/100)

Details: `findings/cluster.md` (seed keywords, 6 proposed pillars, 40-row link matrix, 15 content gaps).

Proposed pillars: "Wijnproeverij thuis organiseren" (hub for the host persona), "Wijn cadeau geven" (gift guides incl. kerst, valentijn, moederdag, relatiegeschenken), "Wijn leren proeven" (blind proeven, balans, waarom smaakt elke wijn anders), "Welke wijn bij welk gerecht", "Wijnsoorten en druiven" (merlot vs cabernet, chardonnay vs sauvignon, cava vs prosecco), and "Teambuilding en events".

---

## 13. Scoring notes and corrections
- Two specialist reports describe untranslated German URLs as "self-canonicalising to Dutch". Live verification shows these URLs 301-redirect to the Dutch page (the crawler followed redirects silently); the `/de/?reviews=` and `/de/?store=` pages do use canonical tags. The impact (German section incomplete, no hreflang) is unchanged.
- One report cites "~180 product pages"; the crawl contains 25 ItemPage URLs (4 NL, 5 DE, 14 DE clones, 2 legacy). Recommendations apply to the product template regardless.
- Performance figures are single cold lab runs, not field data. Expect real-user 75th-percentile values to differ; the TTFB diagnosis is robust because it reproduces with curl.
