# Visual / Mobile UX Findings — flavory.wine

## Score: 63/100

Solid, on-brand visual design with clear above-the-fold value proposition on the homepage, shop, and product pages, plus visible trust signals (Trustpilot stars, payment icons). Score is held down by a real (intermittently reproducible) rendering bug in the announcement bar, a mobile product page where the Add-to-cart button sits below the fold, an oversized mobile header/logo, inconsistent header templates, and a German homepage that could not be reliably rendered at all during this audit.

## Screenshots captured

| Page | Viewport | File | Notes |
|---|---|---|---|
| Homepage (NL) | Desktop, above-fold | `flavory_wine_desktop.png` | re-captured to restore original asset |
| Homepage (NL) | Mobile, above-fold | `flavory_wine_mobile.png` | re-captured to restore original asset |
| Homepage (NL) | Laptop / Tablet | `flavory_wine_laptop.png`, `flavory_wine_tablet.png` | pre-existing, reused |
| Shop (/shop/) | Desktop, above-fold | `shop_desktop.png` | OK |
| Shop (/shop/) | Mobile, above-fold | `shop_mobile.png` | OK |
| Shop (/shop/) | Mobile, full page | `shop_mobile_full.png` | OK |
| Product (/shop/wijnproeverij-thuis-rood/) | Desktop, above-fold | `product_desktop.png` | OK |
| Product | Desktop, full page | `product_desktop_full.png` | OK |
| Product | Mobile, above-fold | `product_mobile.png` | OK |
| Product | Mobile, full page | `product_mobile_full.png` | OK |
| Blog index (/blog/) | Desktop, above-fold | `blogindex_desktop.png` | OK |
| Blog index | Mobile, above-fold | `blogindex_mobile.png` | OK |
| Blog index | Mobile, full page | `blogindex_mobile_full.png` | OK |
| Blog post (/blog/natuurwijn-kopen/) | Desktop, above-fold | `blogpost_desktop.png` | OK |
| Blog post | Mobile, above-fold | `blogpost_mobile.png` | OK — captured the announcement-bar overlap bug |
| Blog post | Mobile, full page | `blogpost_mobile_full.png` | OK |
| FAQ (/faq/) | Desktop, above-fold | `faq_desktop.png` | OK |
| FAQ | Mobile, above-fold | `faq_mobile.png` | OK |
| FAQ | Mobile, full page | `faq_mobile_full.png` | OK |
| German home (/de/start/) | Desktop, above-fold | — | **FAILED** — Playwright timed out (45s) waiting for network-idle |
| German home | Mobile, above-fold | — | **FAILED** — same timeout |
| German home | Mobile, full page | — | **FAILED** — same timeout |

Note: a plain `curl` request to `/de/start/` returned `HTTP 200` in ~4s, so the page itself responds — Playwright's `networkidle` wait never resolves, implying some script/request on that page keeps the network busy indefinitely. See Finding 4.

## What works

- **Above-the-fold value prop is clear on mobile**: H1 "Speel het wijnspel met vrienden", supporting line "Ontdek je eigen smaak en word de kenner aan tafel!", a 4.5-star rating widget, and the red "ONTDEK DE BOXEN" CTA are all visible without scrolling on the homepage (`flavory_wine_mobile.png`).
- **Product page shows price above the fold on mobile**: title "Rode Wijnspel – Het ultieme duel", price "€24,90", Trustpilot mini-widget ("Bekijk recente reviews"), and product gallery all fit in the first viewport (`product_mobile.png`).
- **Trust signals present**: Trustpilot star ratings on homepage, shop, and product; payment method icons (iDEAL, Bancontact, PayPal, Klarna, etc.) and a money-back guarantee bullet ("100% Tevredenheid, Gegarandeerd!") appear just below the Add-to-cart button (`product_mobile_full.png`).
- **Blog readability is good**: title, author avatar/byline, and body copy use a comfortable line length (roughly 35-45 characters/line at 375px width) and legible font size with generous line-height (`blogpost_mobile.png`).
- **No horizontal scroll or broken images** observed in any of the 19 successfully captured screenshots; illustrations and product photography scale cleanly across viewports.
- **Consistent red/cream brand palette** with good contrast for headings and CTA buttons (white bold text on red button, dark heading text on cream background).

## Findings

### 1. Announcement bar renders two overlapping messages (visual bug)
- **Severity:** High
- **Evidence:** `blogpost_mobile.png` shows the red top bar with "Gratis verzending vanaf 2 boxen" rendered on top of a ghosted, partially visible "…000 tevreden klanten!" message underneath it. The same bar renders cleanly (single message) in `flavory_wine_mobile.png` and `faq_mobile.png`, confirming this is an intermittent rendering/transition bug in what is presumably a rotating-message carousel, not a permanently broken bar.
- **Recommendation:** Rework the carousel to crossfade with opacity/visibility transitions rather than stacking absolutely-positioned text without hiding the outgoing message; QA the transition specifically on slower mobile connections/CPUs where the animation is more likely to be caught mid-state by real users.

### 2. Add-to-cart button is not visible above the fold on mobile product pages
- **Severity:** High
- **Evidence:** `product_mobile.png` (viewport-only) ends mid-way through the short product description with no button visible. `product_mobile_full.png` shows the "TOEVOEGEN AAN WINKELWAGEN" button appears only after the product image, thumbnail gallery, Trustpilot widget, title, price, and a 4-line benefit list — well past one full mobile screen.
- **Recommendation:** Add a sticky/floating "Add to cart" bar that appears on scroll on mobile PDPs, or compress the header/gallery so the button appears within the first viewport.

### 3. Oversized mobile logo consumes ~30% of the first viewport
- **Severity:** Medium
- **Evidence:** `flavory_wine_mobile.png`, `shop_mobile.png`, and `product_mobile.png` all show the "flavory / TASTE THE FUN" wordmark plus surrounding whitespace occupying roughly the top quarter to third of the 812px-tall viewport before any page content begins.
- **Recommendation:** Shrink the logo lockup on mobile (especially in a scrolled/sticky state) and drop the "TASTE THE FUN" tagline on small screens to reclaim vertical space for content and CTAs.

### 4. German homepage (/de/start/) failed to fully render in three separate attempts
- **Severity:** Medium
- **Evidence:** Desktop above-fold, mobile above-fold, and mobile full-page captures of `https://flavory.wine/de/start/` all timed out after 45 seconds waiting for network-idle, despite `curl` confirming the page responds with `HTTP 200` in ~4 seconds. This suggests a script (analytics, chat widget, consent tooling, or a polling/long-lived request) keeps the network active indefinitely on this specific template.
- **Recommendation:** Inspect `/de/start/` in Chrome DevTools Network tab for a stuck/looping request; check that GTM/consent-mode and any chat widget don't retry-loop on the DE locale. Because of this failure, NL vs. DE homepage visual consistency could not be verified in this audit and should be re-checked once the underlying issue is fixed.

### 5. Header/navigation layout is inconsistent across templates
- **Severity:** Low-Medium
- **Evidence:** On the homepage/shop/product templates the logo is centered with hamburger and cart icons flanking it, and a "TASTE THE FUN" tagline underneath (`flavory_wine_mobile.png`, `product_mobile.png`). On `faq_mobile.png` the logo is left-aligned, the hamburger and cart icons are stacked vertically in the top-right, and the tagline is absent — a visibly different header component.
- **Recommendation:** Standardize the header across all templates (page-builder pages vs. WooCommerce/blog templates) for brand consistency and to avoid re-teaching returning visitors the navigation each time they land on a different page type.

### 6. No cookie/consent banner observed on any of the 19 successfully captured pages
- **Severity:** Medium
- **Evidence:** None of the fresh-context Playwright captures (homepage, shop, product, blog index, blog post, FAQ) show a cookie-consent banner, even after the scripts' built-in 1s post-load wait.
- **Recommendation:** Confirm the CMP actually fires for first-time NL/EU visitors (test in an incognito browser) — if it's absent this is a compliance risk; if it's just delayed beyond our capture window, verify it doesn't create a layout shift or block the CTA when it does appear.

### 7. Secondary/italic red text on cream may be borderline on contrast
- **Severity:** Low
- **Evidence:** `product_mobile_full.png` shows body copy such as "Leer hoe je Merlot en Cabernet Sauvignon herkennen…" and "Ontdek wat zelf gaat drinken…" in a mid-weight red on the cream background at body-text size, thinner/smaller than the red H1/CTA elements that clearly pass contrast.
- **Recommendation:** Run these paragraph-level red text styles through a contrast checker (WCAG AA requires 4.5:1 for normal text) and darken the red or increase weight/size if it falls short.

## Quick wins

1. Fix the announcement-bar carousel so outgoing/incoming messages never overlap (opacity crossfade + `aria-hidden` on the hidden slide).
2. Add a sticky mobile "Add to cart" bar on product pages so price + CTA are reachable without scrolling.
3. Reduce the mobile logo/header height (drop tagline on small screens) to surface more content above the fold.
4. Debug and fix whatever is preventing `/de/start/` from reaching network-idle — this is very likely also hurting real-user perceived load time and Core Web Vitals on the DE market, not just automated capture.
5. Unify the mobile header component between the FAQ template and the shop/product/homepage templates.
6. Verify the cookie-consent banner fires correctly for first-time NL visitors.
