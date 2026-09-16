# Performance / Core Web Vitals — flavory.wine

Lab-only assessment. PSI API and CrUX were unavailable (no API key / keyless quota exhausted, insufficient CrUX traffic), so all numbers below come from local Playwright instrumentation (PerformanceObserver for LCP/CLS/FCP/paint timing, Navigation Timing for TTFB, Long Tasks API for a TBT/INP proxy) plus a static preload/fetchpriority check and the existing crawl dataset. Each measurement is a single cold run (new anonymous browser context per page, so `wp_woocommerce_session` + `__cvg_1p_uid` are freshly set exactly as a real first-time visitor would experience) — not a CrUX 75th-percentile field distribution. Treat as directional, not authoritative.

## Score

**28 / 100** (lab-based estimate)

Rationale: LCP fails the "Good" threshold on all 4 pages tested (2 "Needs improvement", 3 "Poor" including desktop homepage); TTFB alone consumes most or all of the LCP budget on every page; CLS is essentially solved (0.000–0.002); INP could not be measured directly (Playwright has no interaction-response API) but the Total Blocking Time proxy under 4× CPU throttling (433–683 ms) points to Needs-improvement/Poor INP risk on real mid-tier mobile hardware. The score is dragged down almost entirely by server response time / caching, which is fixable without any front-end rework.

## Measurements table

| Page | Viewport | TTFB | FCP | LCP | LCP status | CLS | CLS status | TBT proxy (4× CPU throttle) | Method |
|---|---|---|---|---|---|---|---|---|---|
| Homepage `/` | Mobile (Pixel 7 emu) | 4653 ms | 4960 ms | 4988 ms | Poor (>4.0s) | 0.000 | Good | 683 ms (22 long tasks, longest 160 ms) | Playwright PerformanceObserver, cold anon session, real network, no throttle except noted |
| Shop `/shop/` | Mobile | 2936 ms | 3088 ms | 3096 ms | Needs improvement | 0.000 | Good | not measured (only measured with throttle on homepage & product to stay in page-load budget) | same |
| Product `/shop/wijnproeverij-thuis-rood/` | Mobile | 3410 ms | 3624 ms | 3624 ms | Needs improvement | 0.000 | Good | 433 ms (13 long tasks, longest 153 ms) | same |
| Blog `/blog/natuurwijn-kopen/` | Mobile | 7299 ms | 7472 ms | 7488 ms | Poor (>4.0s) | 0.000 | Good | not measured | same |
| Homepage `/` | Desktop (1350×940) | 3970 ms | 4132 ms | 4132 ms | Poor (>4.0s) | 0.002 | Good | not measured (1 long task, unthrottled) | same |

TTFB good threshold used: ≤800 ms (all 5 measurements are 2.9–7.3 s, i.e. 4–9× over budget). INP itself (real interaction latency) was **not measured** — no synthetic click/tap was fired; the TBT figures are a lab proxy only, run with Chrome's 4× CPU throttle (approximating a mid-tier mobile CPU) on 2 of the 4 pages to stay within the page-load budget for this audit; shop/blog TBT-under-throttle: **not measured**.

Supporting data (Playwright, per page, unthrottled cold load):

| Page | Total transfer | Requests | Blocking `<script>` (no async/defer) | External stylesheets |
|---|---|---|---|---|
| Homepage (mobile) | 9.42 MB | 158 | 29 / 47 | 31 |
| Shop (mobile) | 1.40 MB | 126 | 28 / 44 | 27 |
| Product (mobile) | 2.42 MB | 169 | 32 / 53 | 35 |
| Blog (mobile) | 9.71 MB | 150 | 28 / 46 | 28 |
| Homepage (desktop) | 10.37 MB | 164 | 29 / 47 | 31 |

Third-party hosts seen on every page: `googletagmanager.com` (GTM), `connect.facebook.net`/`facebook.com` (Meta Pixel, ~196 KB), `region1.analytics.google.com` + `stats.g.doubleclick.net` + `ad.doubleclick.net` (GA4/Ads remarketing), `www.clarity.ms` + a rotating `*.clarity.ms` collector subdomain (Microsoft Clarity), and `static.runconverge.com`/`tr.runconverge.com` (7–11 requests/page — a conversion/AB-testing tag, consistent with the bt-bb-ab plugin noted in the stack).

## What works

- **LCP image preload signals are correctly implemented.** On all 4 pages the LCP element is the hero `<img>` and it already carries `fetchpriority="high"` and `loading="eager"` with explicit `width`/`height` — exactly what Google recommends. This was confirmed both via Playwright (`top_images`) and via `preload_check.py` (`fetchpriority_high: 1`, `preload_lcp_candidate: true`, score 100 on all 4 URLs).
- **CLS is a non-issue.** 0.000 on 3 of 4 pages, 0.002 on desktop homepage — well inside "Good". This matches the crawl data showing `img_missing_dims: 0` on the product page and low/zero counts elsewhere; width/height attributes are being set consistently by the builder.
- **Inline speculation rules (`prefetch`) are present** on every page (from `preload_check.py`), which helps next-navigation speed even though it doesn't affect first load.
- Images are already served as WebP in most cases (hero images, product galleries), and responsive `-WxH-` filename suffixes indicate WordPress's native responsive image generation is active.

## Findings

### 1. Server response time / caching bypass — TTFB 2.9–7.3 s on every page
Severity: **Critical**

Evidence: Lab TTFB measured at 4653 ms (homepage), 2936 ms (shop), 3410 ms (product), 7299 ms (blog), 3970 ms (homepage desktop) — all 4–9× over the 800 ms budget, and in 3/5 cases TTFB alone already exceeds the LCP "Poor" threshold (4.0 s) before a single byte of content has rendered. This corroborates the already-known facts: `Cache-Control: max-age=0`, `Expires: now`, and a `wp_woocommerce_session` + `__cvg_1p_uid` cookie pair set on the very first anonymous GET — the classic WooCommerce full-page-cache killer, since most page caches (and many WP hosting stacks) treat "cookie present" as "personalized, do not cache." Since every fresh visitor gets both cookies immediately, effectively no visitor ever gets a cached response, even on pages with zero personalized content (blog posts, category pages).

Recommendation:
- Deploy a full-page cache (nginx `fastcgi_cache`/`proxy_cache`, or a plugin like WP Rocket/LiteSpeed Cache/Redis full-page cache) configured to **ignore `wp_woocommerce_session` for cache-key purposes** on all pages except `/cart/`, `/checkout/`, `/my-account/`; WooCommerce already exposes this via `woocommerce_items_in_cart` — only bypass cache when that cookie shows a non-empty cart.
- Move whatever sets `__cvg_1p_uid` (looks like a first-party ID cookie for the runconverge tracking/AB tool) to fire from client-side JS after the page has been served, or explicitly exclude it from the cache Vary logic — a tracking cookie should never gate HTML caching.
- Fix response headers: replace `Cache-Control: max-age=0` / `Expires: now` with real TTLs (e.g. `max-age=600, stale-while-revalidate=86400`) for cacheable page types.
- Add/verify an object cache (Redis or Memcached) for WooCommerce and WordPress queries, confirm PHP 8.2+ with OPcache (and OPcache preloading) is active, and consider fronting the origin with an edge CDN (Cloudflare, etc.) for both static assets and cacheable HTML.

Expected gain: cached-hit TTFB of 50–300 ms is realistic on this stack, which would pull LCP down by roughly the same 2.5–7 s currently spent waiting on the server — likely enough on its own to move shop/product into "Good" and homepage/blog into "Needs improvement" or better.

### 2. Heavy render-blocking CSS/JS from the page builder
Severity: **High**

Evidence: 27–35 external stylesheets and 28–32 blocking (`<script src>` without `async`/`defer`) scripts per page, stacked on top of the already-documented 314 KB average / up to 503 KB inline HTML payload from the jet-engine builder.

Recommendation: Enable "unused CSS removal" / conditional asset loading in the builder (Elementor/JetEngine typically expose per-page or per-widget CSS generation settings), or use an asset-management plugin (Perfmatters, Asset CleanUp, WP Rocket's "remove unused CSS") to strip stylesheets/scripts not needed on a given template. Inline critical above-the-fold CSS and load the rest via `media="print"` swap or `rel=preload as=style`. Add `defer` to all non-critical scripts (analytics, sliders, modals).

Expected gain: 0.3–1.0 s off FCP/LCP render delay, plus a meaningful cut in main-thread parse/style-recalc cost that feeds into TBT/INP.

### 3. Third-party tag overload (GTM + Meta Pixel + GA4 + Clarity + AB-test tool)
Severity: **High**

Evidence: Every page loads GTM, Meta Pixel (~196 KB), GA4 + Google Ads remarketing (doubleclick), Microsoft Clarity, and 7–11 requests to `runconverge.com` (AB-testing/conversion tag, consistent with the `bt-bb-ab` plugin). Under 4× CPU throttling (a rough mid-tier-phone simulation), homepage showed 22 long tasks totaling 683 ms of blocking time and product showed 13 long tasks totaling 433 ms — both in Needs-improvement/Poor INP territory (INP poor threshold is >500 ms; TBT is a proxy, not equivalent, but the correlation is well established).

Recommendation: Consolidate overlapping tracking (running GA4 + Clarity + Meta Pixel + a dedicated AB tool simultaneously is redundant instrumentation); move GTM to server-side tagging where feasible; delay non-critical third-party tags (Meta Pixel, Clarity, remarketing pixels) until first user interaction or `requestIdleCallback` using a facade/delay pattern (WP Rocket's "Delay JavaScript Execution" or similar). Audit whether `bt-bb-ab` and `advanced-coupons` are enqueueing scripts site-wide versus only on pages that need them.

Expected gain: 200–500 ms off TBT/INP risk, smaller improvement to LCP where these scripts compete for bandwidth/main-thread during page construction.

### 4. LCP failure is a direct downstream consequence of TTFB, not image delivery
Severity: **Medium**

Evidence: LCP timestamp tracks TTFB + ~300–450 ms consistently across all 4 pages (e.g., blog: TTFB 7299 ms → LCP 7488 ms, a gap of only 189 ms). The hero image itself is already optimally hinted (`fetchpriority=high`, `eager`, sized). This confirms the LCP problem is almost entirely a server/caching problem, not an image-optimization problem.

Recommendation: Prioritize Finding #1. Once TTFB is fixed, revisit image format (AVIF for the hero could shave a further ~50–150 ms of transfer/decode) as a secondary optimization, not a primary one.

### 5. Heavy total page weight and inconsistent lazy-loading
Severity: **Medium**

Evidence: Homepage and blog pages transferred 9.4–9.7 MB / 150–164 requests in a cold load, vs. 1.4 MB for shop. Crawl data shows the shop page has `img_lazy: 0` of 20 images (all eager) despite most being below the fold, while the homepage has only 13 of 36 lazy. Some images are still legacy JPG (`Bubbels_Cava-vs-Prosecco_02-512x512.jpg`, `FLAVORY-Product_Europa.jpg`) rather than WebP/AVIF.

Recommendation: Set `loading="lazy"` on every image except the single LCP candidate (the builder is currently marking most images `eager` regardless of position); convert remaining JPG assets to WebP/AVIF; check whether GTM/GA/Clarity are firing duplicate or oversized beacons contributing to the homepage/blog transfer spike.

Expected gain: Faster time-to-interactive on image-heavy pages; bandwidth savings for mobile users on constrained connections.

### 6. CLS — no action needed
Severity: **Low**

Evidence: 0.000–0.002 across every page tested; images consistently carry explicit width/height. Flag only to ensure this discipline is maintained as new content blocks/ads/embeds are added (reserve space for anything injected asynchronously, e.g. newsletter popups or dynamic reviews widgets).

## Quick wins

1. **Exclude the WooCommerce session cookie from the page-cache key** (except on cart/checkout/account) and fix `Cache-Control`/`Expires` headers — single highest-impact change available, no code deploy required if using a caching plugin/nginx config change.
2. **Move `__cvg_1p_uid` cookie-setting client-side** or exclude it from cache Vary logic — it is currently poisoning cacheability for every anonymous first visit.
3. **Add `async`/`defer` to third-party tag scripts** (GTM snippet already supports async loading; verify Meta Pixel/Clarity/runconverge loaders aren't blocking render).
4. **Force `loading="lazy"` on all non-hero images**, especially on `/shop/` where 0 of 20 images are currently lazy.
5. **Enable OPcache + confirm PHP version** on the nginx/PHP-FPM stack — cheap, no front-end risk, directly reduces TTFB.
6. **Reduce stylesheet count** by consolidating/removing unused builder CSS files (27–35 per page is far above the 2–5 typically needed).
