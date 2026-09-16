# Content Quality & On-Page SEO — flavory.wine

Methodology note: this assessment is based entirely on the pre-collected crawl data (`data/crawl.json`, `data/crawl_summary.csv`, `data/inbound_links.json`, `data/product.html`). Per a mid-task instruction from the audit coordinator, data gathering was cut short to prioritize writing this report — **none of the 12 permitted live page fetches were used**. All findings below are derived from the static crawl fields (`text_sample` — first ~600 chars only — `title`, `meta_description`, `h1`, `word_count`, `schema_types`, `jsonld_raw`, `lang`, `canonical`, `hreflang`, inbound link counts). Anything that would require full body text (e.g., a precise Dutch readability score, full FAQ list, complete author bio content, exact list/table formatting for AI-citation purposes) is marked **UNVERIFIED — needs live fetch** rather than estimated.

---

## Content Quality Score (0-100)

**38 / 100**

Rationale: real editorial content that exists (the ~29 NL blog posts, over-flavory, faq) is reasonably substantive (800–2,600 words) and carries Article/Person schema with a named author ("Bart"). But the site is structurally undermined by: (a) dozens of soft-404 pages silently serving homepage content under real, indexable URLs; (b) an entire German section that is largely un-translated Dutch content self-canonicalizing away from itself; (c) 15 near-duplicate German product-page clones; (d) a duplicated blog post; (e) a legally-required privacy policy page that renders the homepage instead of its own content; (f) zero H1 on every real shop/product page. These are exactly the "large-scale low-value/duplicate content" patterns the Sept 2025 QRG treats as harshly as thin AI content, even though the underlying prose isn't AI-generated spam — it's a WordPress/page-builder hygiene failure that produces the same rater-visible symptoms (confusing, duplicative, untrustworthy site structure).

## On-Page SEO Score (0-100)

**33 / 100**

Rationale: 71/208 pages (34%) have no meta description, 86/208 (41%) have no H1, 41/208 (20%) have multiple H1s, 66 title strings are duplicated across 2+ URLs (28 pages alone share the literal title "Home - Flavory"), and there is no hreflang implementation anywhere despite running NL/DE/EN sections. Titles that do exist are reasonably keyword-relevant ("wijnspel" appears in 9 titles / 31 H1s) but the template is inconsistent and several key money pages (all product pages) lack an H1 entirely.

---

## What works

- **Blog has real structured authorship**: NL blog posts (e.g. `/blog/natuurwijn-kopen/`) carry `Article` + `Person` schema with `author.name: "Bart"`, `datePublished`/`dateModified`, and word counts of 800–2,600 — well above the 1,500-word blog minimum, with topically specific titles ("Is dure wijn beter dan goedkope wijn?", "Natuurwijn kopen: hype of eerlijk glas?").
- **Legal/trust footer data exists**: `/algemene-voorwaarden/` correctly lists a registered entity (FLAVORY BV, Broedersstraat 15, 9150 Bazel, BE 0757.810.421) and a real support email (info@flavory.wine) plus a contact form — solid baseline Trustworthiness signal (E-E-A-T "T") once found.
- **Some German pages are genuinely localized**: `/de/ueber-flavory/` and `/de/kontakt/` correctly render `lang="de-DE"` with self-referencing canonicals — proving the CMS *can* do this correctly, making the un-translated pages a fixable configuration issue rather than a missing-content problem.
- **Keyword targeting on core term is present**: "wijnspel" appears in 9 page titles and 31 H1s, aligning with the core product category language used in the game-box concept (Merlot vs Cabernet Sauvignon, Cava vs Prosecco, etc.).
- **Homepage sets scene reasonably well**: 1,563 words, states the core mechanic ("Je proeft blind twee heerlijke wijnen tegenover elkaar... Wat je níét nodig hebt: voorkennis van wijn") in clear, specific, non-generic language — a positive Experience/Expertise signal versus generic AI boilerplate.

---

## Findings

### 1. Soft-404 pages serve homepage content under 26 real, indexable URLs
**Severity: Critical**
**Evidence:** 26 URLs return HTTP 200 with `title = "Home - Flavory"` and near-identical `word_count ≈ 1563`, including revenue-relevant slugs: `/product/rode-wijn-box/`, `/product/witte-wijn-box/`, `/shop/rode-wijn-box/`, `/shop/witte-wijn-box/`, `/shop/merlot-of-cabernet-sauvignon/`, `/shop/cava-prosecco-box/`, `/shop/rose-wijn-box/`, `/merlot-vs-cabernet-sauvignon`, `/cava-vs-prosecco`, `/italie-vs-spanje`, `/chardonnay-vs-sauvignon-blanc`, plus `/de`, `/de/`, `/en/`, `/nl`, and `/privacybeleid/`. These are not 301 redirects (crawl `chain: []`, `final` = same URL) — they render full duplicate homepage HTML with `canonical` pointing back to `https://flavory.wine/`.
**Recommendation:** Identify why WordPress is falling back to the front page for deleted/renamed product and language-root URLs (likely a broken 404 template or leftover Elementor page). Either restore real content, 301-redirect to the correct live equivalent (e.g. `/shop/rode-wijn-box/` → `/shop/wijnproeverij-thuis-rood/`), or serve a true 404. Fix `/privacybeleid/` as a priority — a GDPR-relevant legal page currently has no real content, which is also a Trustworthiness/compliance risk, not just an SEO one.

### 2. `/de/` German section is largely un-translated Dutch content, self-canonicalized away
**Severity: Critical**
**Evidence:** `/de/` and `/de/faq/` both report `lang="nl-NL"` (not `de-DE`) with `canonical` pointing to the Dutch equivalent (`https://flavory.wine/` and `https://flavory.wine/faq/` respectively) — i.e., the pages tell Google not to index the German version at all. Blog posts under `/de/blog/*` are byte-for-byte identical word counts and `lang="nl-NL"` to their `/blog/*` originals (checked: `natuurwijn-kopen`, `is-dure-wijn-beter`, `balans-in-wijn` — all match exactly). No `hreflang` annotations exist anywhere on the site (`hreflang: []` on every page checked). By contrast, `/de/ueber-flavory/` and `/de/kontakt/` are correctly localized (`lang="de-DE"`, self-canonical) proving this is inconsistent, not a platform limitation.
**Recommendation:** Either fully translate the `/de/` section (product pages, FAQ, homepage, all 29 blog posts) or remove it from the sitemap/nav and stop generating indexable URLs for it. Add `hreflang="nl-NL"`/`hreflang="de-DE"`/`hreflang="en"`/`x-default` cluster tags once content is properly separated. This is currently pure duplicate content with no ranking upside for German queries and dilutes crawl budget.

### 3. 15 near-duplicate German product page clones ("-kopie"/"-copy")
**Severity: High**
**Evidence:** `/de/shop/merlot-oder-cabernet-sauvignon/` has **10** variants (`-kopie`, `-copy`, `-copy-2`, `-copy-copy-3`, `-copy-copy-kopie`, `-copy-copy-kopie-2`, `-copy-copy-kopie-kopie`, `-copy-kopie`, `-premium-edition`, `-premium-edition-kopie`), all 200 OK, all 1,044–1,076 words, all with H1 count = 0. `/de/shop/italien-oder-spanien/` has 3 copy variants, `/de/shop/chardonnay-oder-sauvignon-blanc/` has 2, `/de/shop/cava-oder-prosecco/` has 1. Total: 15 duplicate URLs across 4 product families, all indexable (no noindex/canonical-to-original observed for most of these in the sample).
**Recommendation:** Delete or 301 all "-kopie"/"-copy" duplicates to their canonical German product page (once that page is actually translated per Finding 2). These are almost certainly leftover Elementor "duplicate page" artifacts from editing and provide zero value while multiplying crawl waste and duplicate-content risk.

### 4. Every real product/shop page is missing an H1 (h1_count = 0)
**Severity: High**
**Evidence:** `/shop/`, `/shop/wijnproeverij-thuis-rood/`, `/shop/wijnproeverij-thuis-wit/`, `/shop/bubbelbox/`, `/shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/`, and all `/de/shop/*` product pages report `h1_count = 0`. This affects the core commercial pages of the business — the €24.90 wine-game boxes. Sitewide, 86/208 pages have no H1 at all; 41/208 have 2+ H1s (e.g. homepage has two: "Speel het wijnspel met vrienden" and "Wat is Flavory?").
**Recommendation:** Add a single, keyword-relevant H1 to every product template (e.g. "Rode Wijnspel — Merlot vs Cabernet Sauvignon") and every shop/category page. Fix the WooCommerce/Elementor product template so the H1 output isn't being suppressed.

### 5. Duplicate blog post ("-dupliceren")
**Severity: Medium**
**Evidence:** `/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie-dupliceren/` (2,573 words, title "Datenight met wijn: slimmer dan samen een wijncursus volgen") is a near-clone of `/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie/` (2,374 words, title "Waarom een wijnavond met vriendinnen beter werkt dan therapie") — same slug root, "-dupliceren" (Dutch for "duplicate") left in the URL, mirrored under `/de/blog/` too. Looks like an unfinished title-A/B-test draft that got published and indexed.
**Recommendation:** Decide which title/version is final, 301 the loser to the winner, and remove "-dupliceren" from the URL structure.

### 6. Meta description and title gaps/duplication at scale
**Severity: High**
**Evidence:** 71/208 pages (34%) have no meta description at all, including the B2B page `/eindejaars-en-relatiegeschenken/` (desc_len = 0) which is a key revenue page (151 internal inbound links). 66 title strings are duplicated across multiple URLs; 28 pages literally share "Home - Flavory" as the title (mostly the soft-404 clones in Finding 1, but also legitimately-live URLs like `/de` and `/en/`). 30 pages share the exact homepage meta description verbatim, including `/proeverij/` (the on-location tasting page), which should have its own unique description targeting that service rather than the generic homepage copy.
**Recommendation:** Write unique title + meta description pairs for every indexable template, prioritizing `/eindejaars-en-relatiegeschenken/`, `/proeverij/`, and all real product pages. Purge titles/descriptions on pages slated for removal per Findings 1–3 rather than leaving them duplicated.

### 7. Shallow E-E-A-T signal on author byline
**Severity: Medium**
**Evidence:** Blog `Person` schema for author "Bart" contains only `name` and an internal `@id` hash — no `url`, `sameAs`, `jobTitle`, `description`, or link to an author bio/about page in the structured data. `text_sample` for `/over-flavory/` (352 words) does not surface founder credentials, years of experience, or sommelier/industry qualifications in the first 600 characters retrieved. **UNVERIFIED — needs live fetch**: whether a fuller founder bio, credentials, or "as featured in" trust badges exist further down the page or on a dedicated author page — this could not be confirmed from the crawl sample alone.
**Recommendation:** Add a dedicated author/founder bio page (or expand `/over-flavory/`) with concrete first-hand experience signals (how the tasting boxes are curated, any wine credentials, years running blind tastings) and reference it via `Person.url`/`sameAs` in the schema. This directly targets the Sept 2025 QRG's emphasis on demonstrable first-hand expertise, not just a first name.

### 8. B2B page `/eindejaars-en-relatiegeschenken/` is thin and effectively orphaned in body content
**Severity: Medium**
**Evidence:** 183 words, no meta description (see Finding 6), yet it is the second-most internally linked page on the whole site (151 inbound links per `inbound_links.json` — almost certainly all site-wide nav/footer links, not contextual in-body links). By contrast `/proeverij/` (on-location tastings) has only 2 inbound links sitewide — effectively orphaned outside primary navigation.
**Recommendation:** Expand the corporate-gifting page to service-page depth (800+ words per the minimums table) covering volume pricing, customization options, delivery lead times, and past client logos/testimonials — this is a distinct high-value B2B offering that currently reads as a stub. Add contextual in-body links from relevant blog posts (e.g. `/blog/relatiegeschenken-slimme-investering-of-weggegooid-budget/`, `/blog/luxe-wijnpakket-als-geschenk/`) into this page and into `/proeverij/`, rather than relying solely on nav placement.

### 9. Seven near-identical "5 redenen...kerstcadeau" landing pages
**Severity: Medium**
**Evidence:** `/5-redenen-waarom-flavorys-wine-tasting-het-leukste-kerstcadeau-van-2024-is/`, `-2/`, `-2-2/`, and the 2025 equivalents `-is/`, `-2/`, `-3/`, `-w2/` — 7 URLs, word counts ranging 60–476, several sharing the identical title "5 Redenen Waarom Flavory's Wine Tasting Het Leukste Kerstcadeau Van 2025 Is". Two of the seven (`-2024-is-2/`, `-2025-is-w2/`) are only 60 words — essentially stub/test pages.
**Recommendation:** Consolidate into one evergreen, annually-updated "kerstcadeau" landing page (update the year each season rather than cloning a new page) and 301 the other six to it. This is a textbook large-scale near-duplicate pattern the Sept 2025 QRG flags regardless of whether it was built manually or via a page builder.

### 10. Stray formatting artifact in AI-citation-critical meta description
**Severity: Low**
**Evidence:** `/blog/natuurwijn-kopen/` meta description begins with a stray `)`: `")Wil je natuurwijn kopen maar weet je niet wat je krijgt?..."`. Minor, but this description is a likely AI Overview/snippet source and the typo undermines the quotable, clean-fact impression Google's systems look for.
**Recommendation:** Proofread all meta descriptions before publish; this is a one-line WordPress SEO plugin fix.

---

## On-Page SEO — additional specific items (scored above, itemized here per orchestrator's request to separate on-page from content quality)

- **Titles:** 105/208 pages (50%) have titles under 30 characters (many are the generic "Home - Flavory" clones), 28 have >60 characters. Template pattern is `{Page Name} - Flavory`, fairly consistent but not keyword-optimized for most non-product pages (e.g. "FAQ - Flavory", "Contact - Flavory" carry no core keyword).
- **Meta descriptions:** 71/208 missing entirely (34%); 30 pages duplicate the homepage description verbatim.
- **Headings:** 86/208 (41%) no H1; 41/208 (20%) multiple H1s — including the homepage itself (2 H1s: "Speel het wijnspel met vrienden" / "Wat is Flavory?"). H2 usage looks reasonable on real content pages (5+ H2s on homepage, shop, FAQ).
- **Internal linking:** Nav-level linking is heavy and consistent (100+ internal links from most templates via header/footer), but this appears to be almost entirely boilerplate navigation rather than contextual in-body linking — `/proeverij/` (2 inbound links) versus `/eindejaars-en-relatiegeschenken/` (151 inbound links, likely nav-driven) shows an inconsistency that in-body content isn't correcting. **UNVERIFIED — needs live fetch**: could not confirm from `text_sample` alone whether blog posts contain contextual in-body links to specific product pages (e.g. does `/blog/welke-wijn-bij-welk-gerecht-spiekbriefje/` link to `/shop/wijnproeverij-thuis-rood/`?) — this needs a full-body fetch to verify link placement, not just count.
- **Keyword focus:** "wijnspel" is used consistently (9 titles, 31 H1s); "wijnproeverij" less so (6 titles, 4 H1s); "wijnbox" and "wijncadeau"/"wijngeschenk" are barely used (0–2 occurrences each) despite being named as target terms in the brief — there is room to add these terms more deliberately to product and gifting-page titles/H1s without stuffing.
- **hreflang:** Not implemented anywhere (empty on every page checked) despite NL/DE/EN sections existing — see Finding 2.

---

## Thin / duplicate page list (confirmed from crawl data, real pages only — excludes 28 already-redirecting "Home - Flavory" URLs noted as out of scope by the brief, but includes soft-404 pages since those are live indexable duplicates, not redirects)

**Soft-404 / homepage-clone pages (Critical — Finding 1):**
`/product/rode-wijn-box/`, `/product/witte-wijn-box/`, `/product/spanje-vs-italie-wijnspel/`, `/shop/rode-wijn-box/`, `/shop/witte-wijn-box/`, `/shop/rose-wijn-box/`, `/shop/merlot-of-cabernet-sauvignon/`, `/shop/merlot-of-cabernet-sauvignon-premium/`, `/shop/cava-prosecco-box/`, `/shop/legendarische-druiven-wit/`, `/shop/legendarische-wijnlanden-rood/`, `/shop/rode-wijnspel-merlot-vs-cabernet-sauvignon-premium-editie/`, `/shop/wijnspel-italie-vs-spanje-proef-jij-het-verschil/`, `/shop/bubbelspel-cava-vs-prosecco-proef-jij-het-verschil/`, `/shop/witte-wijnspel-chardonnay-vs-sauvignon-blanc-proef-jij-het-verschil/`, `/merlot-vs-cabernet-sauvignon`, `/cava-vs-prosecco`, `/italie-vs-spanje`, `/chardonnay-vs-sauvignon-blanc`, `/de`, `/de/`, `/en/`, `/nl`, `/privacybeleid/`.

**German duplicate product pages (High — Finding 3), 15 total:**
`/de/shop/merlot-oder-cabernet-sauvignon-kopie/`, `-copy/`, `-copy-2/`, `-copy-kopie/`, `-copy-copy/`, `-copy-copy-3/`, `-copy-copy-kopie/`, `-copy-copy-kopie-2/`, `-copy-copy-kopie-kopie/`, `-premium-edition-kopie/`; `/de/shop/italien-oder-spanien-copy/`, `-kopie/`, `-kopie-2/`; `/de/shop/chardonnay-oder-sauvignon-blanc-kopie/`, `-kopie-kopie/`; `/de/shop/cava-oder-prosecco-kopie/`.

**Duplicate blog post (Medium — Finding 5):**
`/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie-dupliceren/` and its `/de/blog/` mirror.

**Near-duplicate landing pages (Medium — Finding 9), 7 total:**
`/5-redenen-waarom-flavorys-wine-tasting-het-leukste-kerstcadeau-van-2024-is/`, `-2/`, `-2-2/`, `/5-redenen-waarom-flavorys-wine-tasting-het-leukste-kerstcadeau-van-2025-is/`, `-2/`, `-3/`, `-w2/`.

**Un-translated /de/ content (Critical — Finding 2), sampled: `/de/`, `/de/faq/`, all 29 `/de/blog/*` posts (checked 3, all identical to NL originals)** — full scope of un-translated vs. translated `/de/` pages not fully enumerated; recommend a dedicated `hreflang`/i18n technical pass to confirm the complete list.

**Genuinely thin real pages (<300 words, not test/soft-404):**
`/eindejaars-en-relatiegeschenken/` (183w, both NL and would-be DE version), `/win/` (236w), `/mijn-ervaring/` (206w), `/partners/` (172w), `/partnership/` (288w), `/het-was-een-cadeau/` (219w), `/wijnkiezer/` (284w), `/shop/winkelwagen/` (125w — cart page, expected thin), `/blog/` index (66w on `/de/blog/`, 121w on `/en/blog/`).

**Builder/test pages still live (not scored in Content Quality but bloat crawl budget):** `/home-2/`, `/home-3/`, `/hero-section/`, `/hero-section-2/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/`, `/flavory-landingpage/`, `/flavory-gameplay/`, `/shop2/`, `/nog-niet-gespeeld/`, and their `/de/` equivalents.

---

## Quick wins

1. Fix `/privacybeleid/` immediately — a live site currently has no real privacy policy content, which is both a compliance and trust issue (5-minute WordPress fix once the cause is found).
2. Add unique meta description to `/eindejaars-en-relatiegeschenken/` (currently blank) — it's the site's most internally-linked B2B page.
3. Delete the 15 German "-kopie"/"-copy" product duplicates and the "-dupliceren" blog post — pure cleanup, no content creation needed.
4. Add an H1 to the product page template (affects every `/shop/*` product page at once — one template fix).
5. Consolidate the 7 "5-redenen...kerstcadeau" pages into one evergreen page with 301s from the other six.
6. Set `lang`/canonical correctly on `/de/` and `/de/faq/` (currently `nl-NL` content self-canonicalizing to the NL page) — either translate or remove from the German nav/sitemap.
7. Proofread the stray `)` in the `/blog/natuurwijn-kopen/` meta description.
