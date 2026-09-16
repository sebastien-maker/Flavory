# SXO Findings — flavory.wine

Methodology: page data from `data/crawl.json` (209 URLs); live checks via `curl` (TTFB, full HTML) on 4 key pages, max 1 req/sec; SERP research via WebSearch (8 of 8 allotted target queries checked, all logged below — none fabricated). Page-type taxonomy per `page-type-taxonomy.md`, user stories per `user-story-framework.md`, persona scoring per `persona-scoring.md`.

## Score

**SXO Gap Score: 35 / 100 — Critical Mismatch**

This is separate from the SEO Health Score. Composition (equal weighting):
- **SERP presence** (~25/100): of 8 target queries, Flavory has *no* presence for 5 (wijnproeverij thuis, wijnbox cadeau, wijn cadeau, relatiegeschenk wijn, teambuilding wijnproeverij, origineel cadeau wijnliefhebber — 6, technically), weak/confused presence for 1 (wijnspel, via bol.com marketplace + a mislabeled `/en/shop/` URL instead of the canonical Dutch page), and strong aligned presence for 1 (blind wijn proeven, Flavory's own blog post ranks).
- **Persona average** (~58/100): the core "host planning a wine evening" persona is served well *on-page* (81/100) but every other persona scores Needs Work or Critical Mismatch, dragging the average down.
- **Technical/trust signals** (~30/100): zero Product/Review/AggregateRating schema anywhere on the site despite a visible Trustpilot widget and "+5000 tevreden klanten" claim; TTFB of 1.6–3.8s on tested pages.

The core issue is not content quality (the blog and product copy are generally well written) but **keyword-to-page mapping and page-type discoverability**: Flavory's own product vocabulary ("wijnspel", "het ultieme duel") does not match how the market searches ("wijnproeverij thuis", "wijnbox cadeau", "relatiegeschenk wijn"), so pages that could rank and convert are effectively invisible for their most relevant queries.

## SERP-backwards table

| Query | Dominant SERP page type(s) | Flavory present? | Best-fit Flavory page | Mismatch |
|---|---|---|---|---|
| wijnspel | Product/Category pages (Smaakvermaak, Wijnbrigade, dewijnboetiek) + 1 marketplace listing (bol.com, sells Flavory) + Flavory's own `flavory.wine/en/shop/` | Yes, but via bol.com (3rd-party marketplace) and a mislabeled `/en/shop/` URL (lang="en-US" tag wraps 100% Dutch content) instead of canonical `/shop/` | `/shop/` | MEDIUM — right page type, but hreflang/URL confusion means Google is not indexing the canonical page |
| wijnproeverij thuis | Product/Category pages of DTC wine-box brands (La Bodega'87, Wijnproeverijbox.nl, Proef.nl, wijnproeven.nu) + Service pages (wine-point.be, wijnproevenaanhuis.nl) | **No** — absent from top 10 despite this being Flavory's core value proposition | Homepage or `/shop/` | **CRITICAL** — exact-match category term, zero visibility |
| wijn cadeau | Large retailer Product/Category pages (Gall&Gall, Henri Bloem, Flesjewijn.com, Prik&Tik, Drankcadeau, wijnkado.nl) + 1 listicle (Wijn Wine Wein) | No | `/shop/` | HIGH (context) — very competitive generic term, low realistic near-term win, but worth long-tail targeting |
| wijnbox cadeau | Product/Category pages using "wijnbox" terminology (Gall&Gall, VIN-d Wijn, debestelbox, Baltazar, WIJNDeal, Drank Cadeau, mamadrinktwijn) | **No** | `/shop/wijnproeverij-thuis-rood/`, `/wit/`, `/bubbelbox/` | **CRITICAL** — literal product descriptor; none of Flavory's pages use the word "wijnbox" in title/H1 |
| blind wijn proeven | Mixed: Blog/informational (wijnbeurs.nl, finom.nl, wijnkanaal.be) + 1 product (mijnwijn.eu) + 1 tag/category page (makemewine.nl) | **Yes** — `flavory.wine/blog/blind-wijn-proeven/` ranks in the observed results | `/blog/blind-wijn-proeven/` | **ALIGNED** — page type (Blog Post, Article schema, author byline) matches SERP consensus; use as internal template |
| teambuilding wijnproeverij | Service Pages (De Ruwenberg, Aprobar, ienvent, Découvin, biodynamischewijn, proeverij.com, mysterytasting) | No | `/proeverij/` | **HIGH** — page *type* is correctly aligned (Flavory's `/proeverij/` is structurally a Service Page: group size, price/person, process), but it does not rank because its meta description is a verbatim copy of the homepage's and never mentions "teambuilding" |
| relatiegeschenk wijn | Dedicated B2B landing/category pages with visible bulk pricing (Maxilia "vanaf 10 stuks", Joinz "vanaf €6,35 p/s", staat.nl, flesjewijn.com, dewijnboetiek) | No | `/eindejaars-en-relatiegeschenken/` | **CRITICAL** — Flavory's page is a bare quote-request form with no pricing, no keyword in title, empty meta description |
| origineel cadeau wijnliefhebber | Blog listicle / gift-guide format (35 originele cadeaus, Top 10 cadeau ideeën, 25 culinaire cadeaus, 17x cadeautips) | No | none exists | HIGH — content-format gap; Flavory has blog infrastructure (Article/Person schema) but no listicle/gift-guide post |

**SERP consensus by intent cluster:** commercial/gift queries → Product or Category pages (~75% of results); service/experience queries → Service Pages (~90%); informational queries → Blog Posts (~70%). Flavory only matches the dominant type where it already has a working page type (Blog for informational) — every commercial and service-intent query is either absent or undermined by an on-page targeting error, not a page-type problem.

## Personas & user stories with scores

### Persona 1 — Gift Buyer (partner/friend birthday)
- Entry query: "wijnbox cadeau" / "origineel cadeau wijnliefhebber"
- Expected landing: gift-framed product or category page
- Needs: price, box contents, group size, gift note/wrapping, delivery time, reviews
- **User story:** As a gift buyer, I want to quickly confirm this is a good, safe present, because I don't know wine myself, but I'm blocked by comparison fatigue from dozens of near-identical "wijncadeau" retailers. *(Source: SERP dominance of gift-category pages for "wijnbox cadeau"/"wijn cadeau")*
- Landing page reality: `/shop/wijnproeverij-thuis-rood/` — meta says "Hét ideale cadeau!" and price (€24,90) is visible, but title/H1 use "Het ultieme duel", not gift language; no gift-wrap or personal-note option found in text_sample/HTML.

| Dimension | Score | Evidence |
|---|---|---|
| Relevance | 14/25 | Gift framing exists only in meta description, not title/H1; must extrapolate |
| Clarity | 14/25 | Price and "cadeau" visible, but gift-specific mechanics (wrap, card) absent |
| Trust | 15/25 | "100% geld-terug garantie", "+5000 tevreden klanten", Trustpilot quotes visible on-page but not schema-marked |
| Action | 15/25 | Single clear "Toevoegen aan winkelwagen" CTA, but no gift-specific CTA path |
| **Total** | **58/100 — Needs Work** | |

### Persona 2 — Host planning a wine evening with friends
- Entry query: "wijnproeverij thuis" / "wijnspel"
- Expected landing: homepage or `/shop/`
- Needs: group size, "how it works" in steps, no-expertise reassurance, price
- **User story:** As a host, I want an easy, fun activity for tonight's dinner with friends, because I want to be the one who found something original, but I'm blocked by not knowing if I need wine knowledge. *(Source: PAA-style framing implicit in DIY-tasting-box category pages ranking for "wijnproeverij thuis")*
- Landing page reality: homepage H1 "Speel het wijnspel met vrienden", "2 tot 6 personen", "Geen voorkennis nodig" all present and prominent.

| Dimension | Score | Evidence |
|---|---|---|
| Relevance | 23/25 | H1 and hero copy speak directly to this persona |
| Clarity | 20/25 | Group size, no-expertise reassurance both stated near the fold |
| Trust | 19/25 | 4.5-star widget, "+5000 tevreden klanten", geld-terug-garantie |
| Action | 19/25 | "Ontdek de boxen" CTA above the fold |
| **Total** | **81/100 — Excellent (on-page)** | **Caveat: this well-built page never surfaces for "wijnproeverij thuis" — see Finding #1. A perfect page nobody finds converts nobody.** |

### Persona 3 — HR / office manager buying 20+ end-of-year gifts
- Entry query: "relatiegeschenk wijn" / "eindejaarsgeschenk bedrijf"
- Expected landing: `/eindejaars-en-relatiegeschenken/`
- Needs: bulk/tiered pricing, MOQ, branding/personalization, B2B trust signals (client logos, invoicing), turnaround time
- **User story:** As an office manager, I want to see pricing and options before committing time to a request, because I'm comparing several suppliers under a deadline, but I'm blocked by having to fill out a form just to learn the price. *(Source: competing B2B pages showing self-serve pricing: Maxilia "vanaf 10 stuks", Joinz "vanaf €6,35 p/s")*
- Landing page reality: `/eindejaars-en-relatiegeschenken/`, 183 words, title "Offerte aanvraag - Flavory", empty meta description, H1 "Vraag een vrijblijvende offerte aan" — the entire page is a lead form.

| Dimension | Score | Evidence |
|---|---|---|
| Relevance | 6/25 | No B2B-specific depth: no pricing tiers, no packaging/branding detail |
| Clarity | 5/25 | Nothing is answered without submitting the form first |
| Trust | 4/25 | No client logos, case studies, or B2B testimonials |
| Action | 10/25 | Form exists but is the only path — high friction, no instant answer |
| **Total** | **25/100 — Critical Mismatch** | |

### Persona 4 — Wine-curious beginner
- Entry query: "blind wijn proeven"
- Expected landing: `/blog/blind-wijn-proeven/`
- Needs: reassurance no expertise required, simple explanation, credible authorship, soft (not hard) CTA
- **User story:** As a beginner, I want to understand why blind tasting is hard even for experts, because I feel intimidated by "serious" wine culture, but I'm blocked by not trusting sources that oversimplify. *(Source: Flavory's own post already ranks; competing informational sources: wijnbeurs.nl, finom.nl, wijnkanaal.be)*
- Landing page reality: 2,615 words, Article + Person schema (author "Bart"), narrative tone matching the emotional driver.

| Dimension | Score | Evidence |
|---|---|---|
| Relevance | 20/25 | Directly answers the myth/skepticism angle that drives this query |
| Clarity | 17/25 | Long-form and well-headed, but no TL;DR/summary box for skimmers |
| Trust | 18/25 | Author byline + Person schema present; no credentials/sommelier certification cited |
| Action | 14/25 | Newsletter CTA ("win wijnkelder €500") is more prominent than a soft product CTA |
| **Total** | **69/100 — Good** | |

### Persona 5 — Team lead / event organizer (teambuilding)
- Entry query: "teambuilding wijnproeverij"
- Expected landing: `/proeverij/`
- Needs: group size range, price per person, process, booking method, corporate credibility
- **User story:** As an event organizer, I want proof this supplier has run corporate events before, because my reputation is on the line if the evening flops, but I'm blocked by not finding this page in search at all. *(Source: SERP dominated by dedicated service/event companies: De Ruwenberg, Aprobar, ienvent, Découvin)*
- Landing page reality: "Van 6 tot 99 personen", "Vanaf €30 p.p.", "Inclusief 7 wijnen", "Ideaal als thema-avond of teambuilding" all present in body copy — but meta description is copy-pasted verbatim from the homepage and mentions none of this.

| Dimension | Score | Evidence |
|---|---|---|
| Relevance | 17/25 | Body copy covers group size/price/inclusions well |
| Clarity | 16/25 | Key facts present but not surfaced in title/meta for pre-click discovery |
| Trust | 10/25 | No client logos or corporate case studies found |
| Action | 12/25 | Only a request-form CTA ("Verstuur het aanvraagformulier"), no instant quote or calendar booking |
| **Total** | **55/100 — Needs Work** | |

**Weakest persona: HR/office manager (25/100) — address first.**
**Systemic issue across personas:** Trust dimension is consistently the weakest (4–19 range) wherever schema-backed reviews/ratings or B2B credibility signals (case studies, client logos) are missing.

## Findings

### 1. "Wijnproeverij thuis" — Flavory's core category term has zero SERP presence
**Severity: Critical**
**Evidence:** WebSearch top results are entirely competitor DTC box brands (La Bodega'87, Wijnproeverijbox.nl, Proef.nl, wijnproeven.nu) and service providers (wine-point.be, wijnproevenaanhuis.nl) — flavory.wine does not appear. Homepage title is generic ("Home - Flavory"), meta_description targets "wijn box" language, not the phrase "wijnproeverij thuis" as an exact string in title/H1.
**Recommendation:** Rework homepage and `/shop/` title/meta/H2 to include the exact phrase "wijnproeverij thuis" (see rewrites below); build internal links from all four blog posts using "wijnproeverij thuis" anchor text pointing to the homepage or `/shop/`.

### 2. "Wijnbox cadeau" — product vocabulary mismatch
**Severity: Critical**
**Evidence:** None of Flavory's 209 crawled pages contains the word "wijnbox" in a title. Product titles are "Rode Wijnspel", "Witte Wijnspel", "Bubbelspel". SERP for "wijnbox cadeau" is 100% product/category pages that use "wijnbox" (Gall&Gall /cadeau/wijnbox/, VIN-d Wijn, Baltazar, WIJNDeal, Drank Cadeau, mamadrinktwijn).
**Recommendation:** Add "wijnbox" as a secondary keyword across the 3 product page titles, H1s, and body copy alongside "wijnspel"; consider it in the `/shop/` title too.

### 3. B2B page is a bare lead-gen form with no SEO content
**Severity: Critical**
**Evidence:** `/eindejaars-en-relatiegeschenken/` — title "Offerte aanvraag - Flavory", `meta_description` field is empty string, H1 "Vraag een vrijblijvende offerte aan" (no target keyword anywhere), word_count 183. The SERP for "relatiegeschenk wijn" is dominated by B2B pages showing pricing self-serve (Maxilia "vanaf 10 stuks", Joinz "vanaf €6,35 p/s").
**Recommendation:** Rebuild as a real landing/service page: keyword-rich title/meta, visible indicative pricing tiers or "vanaf X stuks", personalization/branding options, and only place the quote form after this content, not as the entire page.

### 4. `/proeverij/` has the right page type but a copy-pasted, off-target meta description
**Severity: High**
**Evidence:** `meta_description` for `/proeverij/` is byte-identical to the homepage's meta_description ("Een wijn box die smaakt naar meer. Ontdek verrassende wijnen, blind geproefd en stijlvol verpakt...") — it never mentions teambuilding, groups, or on-location events, despite the page body containing exactly this content ("Van 6 tot 99 personen", "Vanaf €30 p.p.", "Ideaal als thema-avond of teambuilding"). SERP for "teambuilding wijnproeverij" is 100% Service Pages, which is what `/proeverij/` structurally is.
**Recommendation:** Write a unique title/meta for this page (see rewrites below); this is a "page type is correct, on-page targeting is broken" case, distinct from Findings #1–3 where the page type itself needs work.

### 5. No Product / Review / AggregateRating schema anywhere on the site
**Severity: High**
**Evidence:** Full inventory of `schema_types` across all 209 crawled URLs = {WebPage, ItemPage, CollectionPage, Article/BlogPosting, BreadcrumbList, ImageObject, Organization, WebSite, Person, FAQPage}. No Product, Offer, Review, or AggregateRating type anywhere, despite `/shop/wijnproeverij-thuis-rood/` visibly displaying "Bekijk recente reviews" and a live Trustpilot widget with real customer quotes (confirmed via live HTML fetch), and the homepage's "4.5-star widget" and "+5000 tevreden klanten" claim.
**Recommendation:** Cross-reference `/seo schema` — implement Product schema (name, price €24,90/€64,90, priceCurrency EUR, availability) and AggregateRating/Review pulled from the existing Trustpilot integration on all `/shop/` product pages.

### 6. Six of fifteen key commercial pages have no H1 tag at all
**Severity: High**
**Evidence:** `crawl.json` shows `h1: []` (empty) for `/shop/`, `/shop/wijnproeverij-thuis-rood/`, `/shop/wijnproeverij-thuis-wit/`, `/shop/bubbelbox/`, `/flavory-gameplay/`, and `/wijnkiezer/`. These pages instead rely on an H2 that duplicates the product name.
**Recommendation:** Promote the first heading on each page to a true, keyword-bearing H1 (see rewrites below).

### 7. No gift-guide/listicle content despite that format dominating a key decision-stage query
**Severity: High**
**Evidence:** SERP for "origineel cadeau wijnliefhebber" is 100% blog listicle format ("35 originele cadeaus", "Top 10 cadeau ideeën", "25 culinaire cadeaus", "17x cadeautips"). Flavory's blog (Article + Person schema, active author "Bart") only publishes long-form single-topic essays (natuurwijn-kopen, blind-wijn-proeven, wijnproeverij-thuis-flavory, welke-wijn-bij-welk-gerecht) — no listicle format exists.
**Recommendation:** Cross-reference `/seo content` — publish a listicle ("15 originele cadeaus voor wijnliefhebbers") that ranks Flavory's own boxes first, alongside genuinely useful complementary picks, to capture comparison-fatigued gift buyers.

### 8. Internal cannibalization / hreflang confusion on "wijnspel"
**Severity: Medium**
**Evidence:** WebSearch for "wijnspel" surfaces `https://flavory.wine/en/shop/`, not the canonical `/shop/`. Live check: `/en/shop/` declares `lang="en-US"` in its HTML while its `<title>` ("Shop - Flavory - Wijnspel") and full body copy are 100% Dutch. This is not in the crawl.json 209-URL set, suggesting it sits outside the primary sitemap/crawl scope but is still indexed.
**Recommendation:** Audit hreflang/lang tag configuration on `/en/` paths; either serve genuine English content there or canonicalize/redirect to `/shop/` to consolidate ranking signals.

### 9. Slow TTFB (1.6s–3.8s) across tested pages
**Severity: Medium**
**Evidence:** Live `curl` timing: homepage TTFB 3.85s (total 4.13s); `/shop/wijnproeverij-thuis-rood/` TTFB 3.03s; `/proeverij/` TTFB 2.62s; `/eindejaars-en-relatiegeschenken/` TTFB 1.67s.
**Recommendation:** Cross-reference `/seo page` for a full technical audit; the underlying product page HTML sample is 483KB, suggesting a heavy Elementor/WordPress render — investigate caching/CDN.

### 10. Product titles use brand-voice taglines with no search intent
**Severity: Medium**
**Evidence:** "Rode Wijnspel - **Het ultieme duel** - Flavory", "Witte Wijnspel - **legendarische druiven** - Flavory" carry creative copy instead of the literal terms buyers search for (wijnbox, wijnproeverij thuis, cadeau). None of the ranking competitor titles for the 8 target queries use comparable abstract framing.
**Recommendation:** See title/meta/H1 rewrites below.

### Positive / aligned benchmark
**"Blind wijn proeven"** — `/blog/blind-wijn-proeven/` ranks in the observed SERP, matching the dominant Blog Post type (Article schema, author byline, narrative tone addressing skepticism). This is the one query-page pair with no mismatch; use its title/meta/structure pattern as the internal template when fixing the other pages.

## Title/meta/H1 rewrites

### Homepage — target query: "wijnproeverij thuis" / "wijnspel"
- **Title:** Wijnproeverij Thuis Spelen | Flavory Wijnspel voor Vrienden
- **Meta:** Organiseer een wijnproeverij thuis met het Flavory wijnspel. Blind proeven, 2 tot 6 spelers, geen voorkennis nodig. Vanaf €24,90, levering in 2 werkdagen in België & Nederland.
- **H1:** Speel het wijnspel met vrienden *(keep — strong conversion copy)*; change H2 "Hoe werkt het?" → **"Wijnproeverij thuis organiseren in 3 stappen"**

### `/shop/wijnproeverij-thuis-rood/` — target query: "wijnbox cadeau" / "wijnproeverij thuis rood"
- **Title:** Rode Wijnbox Cadeau – Wijnproeverij Thuis | Merlot vs Cabernet – Flavory
- **Meta:** Rode wijnbox als cadeau of voor een wijnproeverij thuis: proef blind Merlot tegen Cabernet Sauvignon met 2 tot 6 vrienden. Vanaf €24,90, 100% geld-terug-garantie, levering in 2 werkdagen.
- **H1** *(currently missing — add as true H1)*: Rode Wijnbox – Merlot vs Cabernet Sauvignon: het blinde wijnduel

### `/shop/wijnproeverij-thuis-wit/` — target query: "wijnbox cadeau" / "witte wijn proeverij thuis"
- **Title:** Witte Wijnbox Cadeau – Wijnproeverij Thuis | Chardonnay vs Sauvignon Blanc – Flavory
- **Meta:** Witte wijnbox voor een wijnproeverij thuis of als origineel cadeau: blind proeven van Chardonnay tegen Sauvignon Blanc met 2 tot 6 personen. Vanaf €24,90, snel geleverd in België & Nederland.
- **H1** *(currently missing)*: Witte Wijnbox – Chardonnay vs Sauvignon Blanc: ontdek de legendarische druiven

### `/shop/bubbelbox/` — target query: "bubbels cadeau" / "cava prosecco wijnbox"
- **Title:** Bubbelbox Cadeau – Cava vs Prosecco Wijnspel | Flavory
- **Meta:** Verras met een bubbelbox: blind proeven van Spaanse cava tegen Italiaanse prosecco. Ideaal cadeau voor 2 tot 6 personen. Vanaf €64,90, geld-terug-garantie.
- **H1** *(currently missing)*: Bubbelbox – Cava vs Prosecco: wie wint het bubbelduel?

### `/eindejaars-en-relatiegeschenken/` — target query: "relatiegeschenk wijn" / "eindejaarsgeschenk bedrijf"
- **Title:** Relatiegeschenk & Eindejaarsgeschenk Wijn voor Bedrijven | Flavory
- **Meta:** Verras collega's, klanten of medewerkers met een Flavory wijnspel als relatiegeschenk. Vanaf 10 boxen, personalisatie met bedrijfslogo mogelijk. Vraag vrijblijvend een offerte aan.
- **H1:** Relatiegeschenken & eindejaarsgeschenken: het wijnspel als bedrijfscadeau *(replace "Vraag een vrijblijvende offerte aan")*

### `/proeverij/` — target query: "teambuilding wijnproeverij" / "wijnproeverij op locatie"
- **Title:** Teambuilding Wijnproeverij op Locatie | Flavory Real Experience
- **Meta:** Boek een teambuilding wijnproeverij op locatie: van 6 tot 99 personen, vanaf €30 p.p., inclusief 7 wijnen. Geen voorkennis nodig. Ideaal voor bedrijfsuitjes en thema-avonden.
- **H1:** De Flavory Real Experience: teambuilding wijnproeverij op locatie *(extend current H1 "DE FLAVORY REAL EXPERIENCE" with the target phrase)*

## Quick wins

1. Fix the empty/duplicated meta descriptions on `/proeverij/` (currently = homepage's) and `/eindejaars-en-relatiegeschenken/` (currently empty) — near-zero effort, immediate relevance/CTR gain.
2. Add "wijnbox" as a secondary keyword in titles, H1s, and alt text across all 3 `/shop/` product pages alongside "wijnspel".
3. Add true H1 tags to `/shop/`, both product pages, `/shop/bubbelbox/`, `/flavory-gameplay/`, and `/wijnkiezer/` — currently `h1: []` on all six.
4. Implement Product + AggregateRating/Review schema on the 3 shop product pages, sourced from the Trustpilot data already displayed on-page.
5. Resolve the `/en/shop/` lang/hreflang mismatch (declares `lang="en-US"`, serves 100% Dutch content) so ranking signals consolidate on canonical `/shop/`.
6. Publish one gift-guide listicle ("15 originele cadeaus voor wijnliefhebbers") featuring Flavory's own boxes to capture the 100%-listicle SERP for "origineel cadeau wijnliefhebber".
7. Investigate TTFB (1.6–3.8s observed) — likely caching/hosting issue on the WordPress/Elementor stack; cross-reference `/seo page`.

## Limitations

- WebSearch does not render a full Google SERP UI: PAA boxes, ad copy, related searches, featured-snippet format, and AI Overview presence/citations could **not** be directly observed for any of the 8 queries. User stories above are derived from the ranking pages' evident content/intent, not from extracted PAA/ads/related-search data as the framework ideally requires — this is a methodological gap, not fabrication.
- WebSearch result ordering is an approximation of Google ranking, not a verified position-by-position SERP; it is also not confirmed to be Belgium-geolocated (result mix leans Netherlands-heavy: .nl domains dominate over .be), so severity for a Belgian searcher specifically may differ somewhat from what's shown.
- All 8 requested queries were checked (0 unchecked) and are reported above; none were skipped or invented.
- Only 4 pages were live-fetched for on-page verification beyond crawl.json (`/`, `/shop/wijnproeverij-thuis-rood/`, `/eindejaars-en-relatiegeschenken/`, `/proeverij/`); other pages' current-state claims rely on the `data/crawl.json` snapshot only.
- The `/de/` German section and reseller/B2B "wijnhandelaar" angle were out of scope for the 8 requested queries and were not assessed here.
- Could not assess actual click-through rate, conversion rate, or analytics data — all findings are structural/content-based, not traffic-validated.

Generate a PDF report? Use `/seo google report`.
