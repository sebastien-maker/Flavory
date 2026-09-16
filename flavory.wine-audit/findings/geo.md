# GEO / AI-Search Readiness — flavory.wine

## Score

**GEO Readiness Score: 51 / 100**

| Dimension | Weight | Score (0-100) | Weighted |
|---|---|---|---|
| Citability | 25% | 55 | 13.8 |
| Structural Readability | 20% | 55 | 11.0 |
| Multi-Modal Content | 15% | 35 | 5.3 |
| Authority & Brand Signals | 20% | 35 | 7.0 |
| Technical Accessibility | 20% | 65 | 13.0 |
| **Total** | 100% | | **~51** |

Rationale: the FAQ content and product-page copy are genuinely well-written for AI extraction (short, self-contained, direct), and the site is server-rendered with no crawler blocks — but the homepage's actual value proposition is invisible to boilerplate-stripping extraction, there is no Product schema anywhere, the Organization entity is nearly empty, the German (`/de/`) section is largely unlocalized/duplicate, and off-site brand-authority signals (Wikipedia, YouTube, Reddit) are absent or unverifiable.

## AI Crawler Access Table

robots.txt contains only a wildcard `User-agent: *` block (disallow `/wp-admin/`, WooCommerce cart/log paths) plus the Yoast default block (`Disallow:` = allow everything). **No bot-specific rules exist for any crawler**, so every crawler below falls through to the default allow.

| Crawler | Purpose | Explicit rule in robots.txt | Effective status |
|---|---|---|---|
| GPTBot | ChatGPT training/browsing | None | Allowed (default) |
| OAI-SearchBot | ChatGPT Search index | None | Allowed (default) |
| ClaudeBot | Claude / Anthropic search | None | Allowed (default) |
| PerplexityBot | Perplexity search | None | Allowed (default) |
| Google-Extended | Gemini / AI Overviews training | None | Allowed (default) |
| Bingbot | Bing / Copilot index | None | Allowed (default) |
| Applebot-Extended | Apple Intelligence | None | Allowed (default) |
| CCBot | Common Crawl (feeds many third-party LLMs) | None | Allowed (default, not opted out) |
| anthropic-ai / Bytespider | Legacy training crawlers | None | Allowed (default, not opted out) |

**Assessment:** correct posture for a D2C commerce site that wants AI-search visibility — nothing search-relevant is blocked. However, the "no explicit rules" approach is unmanaged rather than deliberate: Flavory has not made a decision about the training-only crawlers (CCBot, anthropic-ai, Bytespider); it just happens to allow them by default via the Yoast block. This is a low-severity gap, not a blocker.

## llms.txt Status: Present, but low quality / auto-generated

`https://flavory.wine/llms.txt` exists (Yoast SEO v28.4 auto-output). `/llms-full.txt` returns a 301 (does not exist).

Issues found in the live file:
- Lists internal test/staging pages as if they were real site sections: **"Home‑3"**, **"Flavory ‑ Landingpage"**.
- "Code Snippets" section exposes developer-only WordPress code-snippet posts (e.g. "Auto-check WooCommerce terms & conditions checkbox", "Run the HPOS migration manually", and one entry with an **empty title**) — irrelevant and unprofessional for an LLM-facing file.
- "Producten" section dumps raw HTML tags (`<h4>`, `<p data-start=...>`, an HTML comment `<!-- notionvc: ... -->`) instead of clean text — a copy-paste artifact from an AI writing tool, left unstripped.
- "Forms" section links to a raw admin form endpoint (`?post_type=jet-form-builder&p=5442`).
- No curated brand summary, no consolidated pricing, no explicit shipping/return policy — an LLM reading this file gets a directory listing, not a citable brand explainer.
- Duplicate/near-duplicate product URLs are not deduplicated (e.g. bubbelbox appears once in Dutch and once in German under the same "Producten" heading, with no language label).

**Important caveat:** Google has stated it does not use `llms.txt` for Search or AI Overviews, and there is no public confirmation that OpenAI or Anthropic's production crawlers consume it either. Treat llms.txt as a low-cost hygiene/experimentation file, not a ranking or citation lever — cleaning it up is cheap and can't hurt, but it should not be prioritized over fixing the underlying HTML/schema issues below.

## What Works

- **No AI crawler is blocked.** robots.txt default-allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot — correct for a commerce site chasing AI-search referral traffic.
- **Genuinely server-rendered.** Live fetch (`render_page.py`, `mode_used: raw`, `is_spa: false`) confirms the full HTML — including body copy — is present without executing JavaScript. No CSR barrier for any crawler.
- **FAQ answers are excellent raw material for citation.** All 16 answers on `/faq/` are self-contained, direct, and mostly in the 13–150 word range (e.g. "Wat is de levertijd?" → 26 words, fully answerable out of context). `FAQPage` schema is correctly implemented on 7 pages (`/faq/`, `/de/faq/`, `/contact/`, `/de/kontakt/`, and 3 product pages).
- **Product-page copy opens with a direct definition**, not marketing fluff — e.g. bubbelbox PDP starts: "Twee bruisende klassiekers uit Zuid-Europa. Cava uit Spanje en Prosecco uit Italië... In deze Flavory box proef je ze blind." — a near-ideal citable passage already.
- **Meta robots are consistent and permissive** across sampled pages: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` — maximizes eligibility for large snippets/previews in both classic and AI search surfaces.
- **Real off-site brand signals exist** (confirmed live): a Trustpilot profile (4.5/5, 31 reviews, 10 in the last 12 months, categorized "Wine Club / Board Game Club / Wine Store") and a LinkedIn company page (134 followers, "Bazel, Flemish Region, Belgium," 2–10 employees) — but neither is referenced from the site's own Organization schema (see Findings).

## Findings

### 1. Homepage's core definition is invisible to boilerplate-content extraction
**Severity: Critical**
**Evidence:** Live fetch of `https://flavory.wine/` via the render pipeline's trafilatura-based `extracted_text` field returns only **503 characters** total, consisting entirely of three blog-teaser snippets ("Natuurwijn kopen roept vragen op...", "Waarom chocolade-eieren geven...", "Sta je in de supermarkt..."). The actual hero content — "Wat is Flavory?" ("Flavory brengt de leukste wijnproeverij bij je thuis..."), the "Hoe werkt het?" 6-step explainer, and pricing — is present in the raw HTML (confirmed via `crawl.json`, `word_count: 1563`) but is entirely absent from the boilerplate-stripped text used for citability scoring. This means any pipeline that does main-content extraction similarly to trafilatura/readability (a common approach for RAG ingestion and some AI answer engines) is likely to conclude the Flavory homepage is "about" three unrelated blog snippets, not about the product itself.
**Recommendation:** Restructure the homepage DOM so the "Wat is Flavory?" and "Hoe werkt het?" sections sit in a plain, semantically-marked content block (avoid nesting the core definition inside carousel/slider/widget wrappers that boilerplate detectors discount). Re-test with trafilatura or Mozilla Readability after each template change until the extracted text includes the product definition.

### 2. No Product schema anywhere on the site (0 / 209 crawled URLs)
**Severity: High**
**Evidence:** `crawl.json` schema_types across all pages never includes `Product` or `Offer`. The 4 core PDPs (Merlot/Cabernet, Chardonnay/Sauvignon Blanc, Cava/Prosecco, Italië/Spanje) and their many duplicate slugs carry only WebPage/Organization/BreadcrumbList markup.
**Recommendation:** Add `Product`/`Offer` schema (price in EUR, `priceCurrency`, `availability`, `aggregateRating` sourced from the confirmed Trustpilot 4.5/31 rating) to all shop pages. This is the primary structured signal AI shopping surfaces (Google AI Overviews shopping panels, Perplexity Shopping, ChatGPT product cards) use to cite price/availability directly.

### 3. Organization entity is minimal — one sameAs link, no founder/address/legal data
**Severity: High**
**Evidence:** `jsonld_raw` Organization node site-wide contains only `name`, `url`, `logo`, and a single `sameAs` entry (`instagram.com/flavory.wine`). No `address`, `founder`, `foundingDate`, `legalName`/VAT, or `contactPoint`. Live checks confirm a Trustpilot profile and a LinkedIn company page (with a physical Bazel, Belgium address) exist but are not linked anywhere in the schema. No Wikipedia article (checked nl.wikipedia.org search — zero results) and no Wikidata item (checked — zero relevant results) exist for the brand, which matters given the "Flavory" name collision with unrelated tea/flavour-chemistry and food entities in search indexes.
**Recommendation:** Expand `sameAs` to include the LinkedIn and Trustpilot URLs at minimum; add address, founder, and foundingDate to the Organization node; consider a Wikidata item (even a minimal one) to seed disambiguation and knowledge-panel eligibility, since "Flavory" alone is not a unique string in general search/LLM training data.

### 4. `/de/` (German) section is a mix of unlocalized duplicates and properly translated pages
**Severity: High**
**Evidence:** `https://flavory.wine/de/`, `/de/faq/`, and `/de/blog/*` all serve **Dutch text** with `lang="nl-NL"` and a `canonical` pointing to the *non-`/de/`* NL URL (e.g. `/de/faq/` canonicalizes to `/faq/`) — i.e., these `/de/` URLs tell crawlers "I am a duplicate of the Dutch page," not "I am the German page." Meanwhile some product pages, e.g. `/de/shop/cava-oder-prosecco/`, ARE correctly localized (`lang="de-DE"`, self-referencing canonical, genuine German copy "Nicht zufrieden? 100% Geld-zurück-Garantie..."). Additionally, **0 of 209 crawled pages carry any `hreflang` annotation**, so there is no explicit language/region signal anywhere on the site.
**Recommendation:** Either finish the German translation of FAQ/blog content and give those pages self-referencing canonicals + `lang="de-DE"`, or intentionally noindex the untranslated `/de/` stubs until translated. Add a proper `hreflang` cluster (`nl-NL`, `de-DE`, `x-default`) across equivalent URL pairs so AI/search crawlers can correctly attribute German-market content instead of seeing it as thin duplication.

### 5. llms.txt is auto-generated junk, not a curated brand reference
**Severity: Medium**
**Evidence:** See "llms.txt Status" above — test pages, empty-titled code-snippet posts, unstripped HTML/markdown artifacts, and an admin form URL are listed as if they were citable content.
**Recommendation:** Hand-edit `llms.txt` (or override the Yoast auto-output) with a curated ~100-word brand summary, the 4 real product boxes with one-line specs and price, and links to `/faq/` and `/over-flavory/`. Remove Code Snippets, Forms, Stores (unless intentionally exposing retail partners), and Reviews sections. Treat as hygiene, not a ranking lever (see caveat above).

### 6. Duplicate/test pages are indexable and pollute the crawlable surface
**Severity: Medium**
**Evidence:** `/home-2/`, `/home-3/`, `/hero-section/`, `/hero-section-2/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/`, `/shop2/`, `/flavory-landingpage/`, `/nog-niet-gespeeld/`, `/mijn-ervaring/`, `/het-was-een-cadeau/`, `/win/` all return `200` with `index, follow` robots. Three of these (`/home-3/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/`) are near-duplicates of the homepage (word counts 1576–1592, identical title "Flavory - Taste the fun"). Two of them (`Home-3`, `Flavory - Landingpage`) are literally listed in `llms.txt` as if they were real site pages.
**Recommendation:** `noindex` or delete these WooCommerce/page-builder test pages so AI crawlers and llms.txt consumers converge on one canonical homepage/landing narrative instead of 3–4 competing near-duplicates.

### 7. Heavy HTML weight for a text-extraction-first environment
**Severity: Low**
**Evidence:** Average HTML weight 314 KB across the crawl; homepage alone is ~478–490 KB with 60 `<script>` and 31 CSS references. Content is present in raw HTML (not a blocker), but the signal-to-noise ratio for any extraction pipeline is poor, and larger pages carry higher risk of partial/truncated fetches by crawlers with byte limits.
**Recommendation:** Trim template/script bloat; defer non-critical JS; this also helps Core Web Vitals independent of GEO.

### 8. Image alt-text gaps on key visual content
**Severity: Low**
**Evidence:** Homepage: 9 of 36 images missing `alt` text, including the 6 numbered "Hoe werkt het" step icons (`stappenplan_Stap-1.svg` … `Stap-6.svg`) — exactly the visual sequence that best explains the game mechanic.
**Recommendation:** Add descriptive Dutch alt text to the step icons (e.g. "Stap 1: kies je Flavory wijnbox") and remaining images; supports multi-modal citability and basic accessibility.

## Brand Mention Analysis

Live checks were attempted via WebFetch; several search engines actively block automated fetch (CAPTCHA/consent walls), so those are marked "not checked" rather than fabricated.

| Signal | Result |
|---|---|
| Wikipedia (nl) | **Checked — no article exists** for "Flavory" (nl.wikipedia.org search returned zero results). |
| Wikidata | **Checked — no entity exists.** Only unrelated match: a 1973 tea-chemistry paper using the word "flavory." |
| Trustpilot | **Checked — profile exists.** 4.5 / 5 stars, 31 reviews total (10 in the last 12 months), listed under "Wine Club / Board Game Club / Wine Store." Not referenced in on-site schema. |
| LinkedIn | **Checked — company page exists.** 134 followers, "Bazel, Flemish Region, Belgium" address, 2–10 employees, B2B-focused description. Not referenced in on-site schema. |
| YouTube | **Not reliably checked** — YouTube's search results page is JS-rendered and did not return usable content via automated fetch. Combined with the absence of any video sameAs/embed on-site, a channel is unlikely to exist, but this is not confirmed. |
| Reddit | **Not checked.** |
| Google organic / AI Overviews for "Flavory wijnspel," "wijnspel cadeau," "wijnproeverij thuis," "blind wijn proeven spel" | **Not checked** — Google redirected all automated requests to a consent wall that could not be completed via the fetch tool. |
| Bing indexation (`site:flavory.wine`) | **Not reliably checked** — the automated fetch returned unrelated cryptocurrency-site results, indicating the request was likely blocked or served a generic/cached page rather than genuine Bing SERP data. Requires manual verification (e.g. via Bing Webmaster Tools) rather than a live search fetch. |
| DuckDuckGo | **Not checked** — served a CAPTCHA page to the automated fetch. |
| Brand name collision ("Flavory" vs. unrelated flavour/food/tea entities) | Indirectly confirmed: the only Wikidata match for "Flavory" is an unrelated 1973 tea-aroma chemistry paper, supporting the stated concern that the bare brand name is not unique in general knowledge bases — reinforcing the need for stronger entity signals (Finding 3) so LLMs disambiguate correctly. |

**Recommendation for the audit owner:** verify Google AI Overview presence and Bing indexation manually (Search Console + Bing Webmaster Tools, and a manual browser search for the four target Dutch queries) since automated tools could not retrieve reliable data for these platforms in this session.

## Suggested Citable Passages (Dutch, ~130–160 words each)

**1. "Wat is Flavory?" — brand/product definition (for homepage and /over-flavory/)**

> Flavory is een wijnproeverij in boxvorm: een blind wijnspel waarmee je thuis, met vrienden of familie, twee wijnen tegen elkaar proeft zonder te weten welke wijn welke is. Elke Flavory-box (vanaf €24,90) bevat twee anoniem verpakte flessen wijn, proefformulieren, een spelhandleiding en een mini foodpairing-gids. Spelers proeven, ruiken en noteren hun bevindingen, ontmaskeren daarna de wijnen en verzamelen punten met een korte wijnquiz. Er zijn vier klassieke duels: Merlot tegen Cabernet Sauvignon, Chardonnay tegen Sauvignon Blanc, Cava tegen Prosecco, en Italië tegen Spanje. Een spel duurt 60 tot 90 minuten en is geschikt voor 2 tot 6 spelers, zonder enige wijnkennis vooraf. Flavory verzendt vanuit België naar België en Nederland, met levering binnen 1 tot 3 werkdagen en gratis verzending vanaf twee boxen. Naast de boxen voor thuis biedt Flavory ook proeverijen op locatie en zakelijke geschenkpakketten aan.

**2. "Hoe werkt het Flavory wijnspel?" — mechanics explainer**

> Het Flavory wijnspel werkt in vier stappen. Eerst schenk je elke speler twee glazen wijn uit de anoniem verpakte flessen, zodat niemand weet welke wijn welke is. Daarna ruik en proef je samen, en noteer je op het proefformulier wat je herkent: fruit, kruiden, hout of bloemen. In de derde stap beantwoord je een reeks wijnvragen die punten opleveren, ook als je de wijnen zelf niet herkent. Tot slot onthul je de etiketten, tel je de punten samen en wordt de speler met de meeste juiste antwoorden gekroond tot "Grootste Wijnkenner" van de avond. Er is geen voorkennis nodig: de bijgevoegde handleiding en infobrochure leggen alles stap voor stap uit. Een volledige speelronde duurt gemiddeld 60 tot 90 minuten en is geschikt voor groepen van 2 tot 6 personen, met de mogelijkheid om meerdere boxen te combineren voor grotere gezelschappen.

**3. "Proeverij op locatie" — B2B/events summary (for /proeverij/)**

> Naast de wijnboxen voor thuisgebruik organiseert Flavory ook interactieve wijnproeverijen op locatie, ideaal als teambuilding, personeelsfeest of klantenevent. Vanaf €30 per persoon regisseert Flavory een volledige wijnavond voor 6 tot 99 deelnemers, inclusief 7 wijnen, proefmateriaal en een spelleider die het gezelschap doorheen het wijnspel begeleidt. Deelnemers hoeven geen wijnkennis te hebben: net als bij de boxen draait alles om blind proeven, herkennen en punten verzamelen, met aan het eind een winnaar die zich "Grootste Wijnkenner" mag noemen. Bedrijven kunnen ook kiezen voor Flavory-boxen als relatiegeschenk of eindejaarscadeau, met de mogelijkheid tot bulkbestellingen en een offerte op maat. Flavory is gevestigd in België (Bazel) en levert aan bedrijven en particulieren in België en Nederland.

## Quick Wins

| Action | Effort | Impact |
|---|---|---|
| Noindex/delete the 12 test & duplicate pages (home-2, home-3, hero-section(-2), home-hero-image(-duplicate-2), shop2, flavory-landingpage, nog-niet-gespeeld, mijn-ervaring, het-was-een-cadeau, win) | Low (hours) | Medium — removes competing near-duplicate "brand narratives" |
| Hand-curate `llms.txt`: remove Code Snippets/Forms/junk, add one brand paragraph + 4 product summaries + FAQ/About links | Low (1-2 hrs) | Medium (hygiene; Google won't read it, but ChatGPT/other agents might) |
| Add LinkedIn + Trustpilot URLs to Organization `sameAs`; add address/founder/foundingDate | Low (schema edit) | Medium-High for entity disambiguation |
| Add descriptive alt text to the 6 "Hoe werkt het" step icons + remaining missing-alt images | Low | Low-Medium |
| Add `Product`/`Offer` schema (price, currency, availability, Trustpilot-sourced `aggregateRating`) to the 4 core PDPs | Medium | High — enables AI shopping/price citations |
| Fix `/de/` canonical + `lang` mismatches and add an `hreflang` cluster (nl-NL / de-DE / x-default) | Medium | High for German-market AI visibility |
| Restructure homepage DOM so "Wat is Flavory?"/"Hoe werkt het?" is not classified as boilerplate by content extractors (re-test with trafilatura/Readability after each change) | Medium-High (dev) | Critical — currently the single biggest citability blocker found |
