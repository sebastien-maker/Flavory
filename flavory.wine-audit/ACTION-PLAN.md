# Action Plan — flavory.wine

Priorities: Critical = blocks indexing, revenue or compliance (fix immediately). High = significant ranking impact (within 1 week). Medium = optimisation (within 1 month). Low = backlog.
Effort: S = under 2 hours, M = half a day to 2 days, L = more than 2 days.

## Phase 1 — Critical fixes (Week 1)

| # | Action | Priority | Effort | Owner | Evidence |
|---|---|---|---|---|---|
| 1.1 | Enable full-page caching for anonymous visitors. Exclude the `wp_woocommerce_session_*` cookie from the cache key everywhere except cart, checkout and my-account; move or drop the `__cvg_1p_uid` cookie so it is set client-side; set `Cache-Control: public, max-age=…` and `s-maxage` on HTML. Verify OPcache and PHP 8.x. Target TTFB under 800 ms. | Critical | M | Hosting / dev | findings/performance.md |
| 1.2 | Enable Product structured data: switch on WooCommerce core structured data output or install Yoast WooCommerce SEO. Add Offer (price, priceCurrency EUR, availability, url), brand, sku, `gtin13` 05430004293071, image, and AggregateRating from Trustpilot (4.5 / 31). Paste-ready JSON-LD in findings/schema.md. | Critical | S–M | Dev | findings/schema.md |
| 1.3 | Restore `/privacybeleid/` as a live page (it currently 301s to the homepage while checkout references it). | Critical | S | Site owner | findings/content.md |
| 1.4 | Replace the catch-all 301-to-homepage with real 404s (custom 404 template with search and product links). Locate the rule in the redirect plugin, theme functions or nginx config. | Critical | S | Dev | findings/technical.md |
| 1.5 | Retarget the 26 legacy URLs to their real product/category pages using the redirect map in findings/ecommerce.md (e.g. `/shop/rode-wijn-box/` → `/shop/wijnproeverij-thuis-rood/`, `/shop/cava-prosecco-box/` → `/shop/bubbelbox/`). Then update the 287 internal links (blog related blocks, menus, buttons) to point directly at the live URLs. | Critical | M | Dev / content | findings/ecommerce.md, findings/cluster.md |
| 1.6 | Remove index bloat: trash or 301 the 9 builder test pages (`/home/`, `/home-2/`, `/home-3/`, `/hero-section/`, `/hero-section-2/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/`, `/shop2/`, `/de/shop-2/`), the 14 German `-kopie`/`-copy` products (301 to the original), the `-dupliceren` blog post, and 6 of the 7 "5-redenen…kerstcadeau" pages (301 to the full blog version). | Critical | M | Content | findings/sitemap.md |
| 1.7 | Fix `/de/` → make it serve or 301 to `/de/start/` (not the Dutch homepage); do the same for `/en/` only if an English site is intended, otherwise noindex `/en/blog/` and `/en/shop/`. | Critical | S | Dev | findings/technical.md |

## Phase 2 — High-impact improvements (Weeks 2–3)

| # | Action | Priority | Effort | Evidence |
|---|---|---|---|---|
| 2.1 | Add hreflang (nl-BE/nl-NL, de-DE, x-default) between the real Dutch and German pairs, via the multilingual plugin or Yoast sitemap. Only pair pages that are actually translated. | High | M | findings/technical.md |
| 2.2 | Sitemap hygiene in Yoast: disable author sitemap (removes the invalid `#` loc), exclude Reviews and Store post types (or give them real slugs and noindex), remove `/de/shop-2/` double listing, noindex `geen-categorie` archives. Target about 76 URLs. | High | S | findings/sitemap.md |
| 2.3 | On-page rewrites for commercial pages (titles, meta descriptions, H1). Homepage: "Wijnproeverij thuis: het wijnspel voor vrienden \| Flavory". Products: add "wijnbox" and the grape pairing. B2B page: "Relatiegeschenk wijn: wijnspel als eindejaarsgeschenk" with tier pricing on the page. `/proeverij/`: "Teambuilding wijnproeverij op locatie" with its own description. Full set in findings/sxo.md. | High | M | findings/sxo.md |
| 2.4 | Add H1s to the product template, `/shop/`, `/flavory-gameplay/`, `/wijnkiezer/`; write meta descriptions for the 71 pages missing one, starting with the B2B page and the 30 pages that copy the homepage description. | High | M | findings/content.md |
| 2.5 | Security headers in nginx: HSTS, X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN (or CSP frame-ancestors), Referrer-Policy strict-origin-when-cross-origin, a report-only CSP to start. | High | S | findings/technical.md |
| 2.6 | Defer/delay third-party scripts (Meta Pixel, Clarity, A/B tool) and non-critical builder JS; lazy-load below-fold images (0 of 20 on `/shop/`); add width/height to the 139 images missing them; add alt text to the 1,019 images without it, starting with product galleries. | High | M | findings/performance.md |
| 2.7 | Fix the mobile announcement-bar overlap; add a sticky add-to-cart bar on mobile product pages; reduce mobile header height; debug the `/de/start/` request that never completes. | High | M | findings/visual.md |
| 2.8 | Enrich Organization schema: address (Bazel), VAT, contactPoint (info@flavory.wine), founder, sameAs (Instagram, LinkedIn, Trustpilot). Fix `Person.url` "#" and add an author page for Bart. | High | S | findings/schema.md, findings/geo.md |

## Phase 3 — Content and authority (Month 2)

| # | Action | Priority | Effort | Evidence |
|---|---|---|---|---|
| 3.1 | Build the 6 pillar pages (wijnproeverij thuis organiseren, wijn cadeau geven, wijn leren proeven, welke wijn bij welk gerecht, wijnsoorten en druiven, teambuilding en events) and re-slot the 28 posts as spokes; replace the all-posts related block with 3–4 curated links per cluster. Link matrix in findings/cluster.md. | Medium | L | findings/cluster.md |
| 3.2 | Merge the duplicate post pairs (welke wijn altijd in huis; waarom smaakt elke wijn anders) and the Valentine horoscope variants; one evergreen URL per occasion per locale (kerst, valentijn, moederdag). Rename the Valentine product slug to drop "-10-korting". | Medium | M | findings/ecommerce.md |
| 3.3 | Publish a gift-guide listicle ("15 originele cadeaus voor wijnliefhebbers") and a beginner guide; add a 2-sentence definition block ("Flavory is …, je proeft …, €24,90, verzending BE/NL") to homepage, product pages and FAQ for AI citability (examples in findings/geo.md). | Medium | M | findings/geo.md, findings/sxo.md |
| 3.4 | Reviews on-page: pull Trustpilot reviews into product pages with Review schema; add LocalBusiness schema and real outbound links on partner-store pages. | Medium | M | findings/schema.md |
| 3.5 | Link building: ask the 5 stockists for a "verkooppunten"/brand link, pitch Belgian gift guides and team-building directories, Flemish lifestyle bloggers, press on the wine-game concept, Unizo/chamber listings. Plan in findings/backlinks.md. | Medium | L | findings/backlinks.md |
| 3.6 | German section: either finish translating the missing pages (FAQ, blog, over) or remove them from German navigation so no German URL redirects to Dutch. | Medium | L | findings/technical.md |
| 3.7 | Curate `llms.txt` (remove test pages, add product summaries) and consider `llms-full.txt`; low priority since Google ignores it. | Low | S | findings/geo.md |

## Phase 4 — Monitoring and iteration (Ongoing)

| # | Action | Priority | Effort |
|---|---|---|---|
| 4.1 | Connect Google Search Console, GA4 and a PageSpeed API key to the audit tooling so the next run uses field CWV, index coverage and query data. | Medium | S |
| 4.2 | Capture a drift baseline after Phase 1 (`drift_baseline.py https://flavory.wine/`) and re-run monthly to catch regressions (canonicals, hreflang, schema, titles). | Medium | S |
| 4.3 | Re-measure LCP/TTFB after caching goes live; target LCP under 2.5 s on mobile for homepage, shop and product pages. | Medium | S |
| 4.4 | Track rankings for: wijnproeverij thuis, wijnspel, wijnbox cadeau, blind wijn proeven, relatiegeschenk wijn, teambuilding wijnproeverij, origineel cadeau wijnliefhebber. | Low | S |
| 4.5 | Set up Bing Webmaster Tools and IndexNow (feeds Copilot/ChatGPT search); add a Moz or Ahrefs key for backlink monitoring. | Low | S |
