# Backlink Profile — flavory.wine

## Score

**INSUFFICIENT DATA — no numeric score assigned.**

Under the confidence-weighted scoring model, a 0–100 Backlink Health Score requires
data on at least 4 of 7 factors (referring domain count, domain quality distribution,
anchor text naturalness, toxic link ratio, link velocity, follow/nofollow ratio,
geographic relevance). At Tier 0 (Common Crawl + local verification crawler only,
no Moz/Bing/DataForSEO), **only 1 factor has any real data** (a partial, indirect
signal on domain-level graph presence — and even that returned null for flavory.wine
itself). Producing a numeric score here would be fabricated precision. This was
confirmed by the automated validator (`validate_backlink_report.py`), which flags any
numeric score attempted with fewer than 4/7 factors populated as an error.

**Directional read (not a score):** the visible evidence — flavory.wine absent from
Common Crawl's host graph, and zero confirmed reciprocal links from its 5 named
retail partners' homepages — points to a **thin-to-nonexistent off-site link
profile**. Confidence in that directional read: **0.50** (Common Crawl domain-level)
blended with **0.95** (direct HTTP verification of specific pages, which is high
confidence for what it checked, but checked only 1 page per partner).

## Data sources used

| Source | Confidence | Coverage |
|---|---|---|
| Common Crawl Web Graph (`commoncrawl_graph.py`, release `cc-main-2026-jan-feb-mar`) | 0.50 | Domain-level PageRank / harmonic centrality lookup for flavory.wine + 5 candidate Belgian competitor domains |
| Backlink verification crawler (`verify_backlinks.py`) | 0.95 (per-page, HTTP-observed) | Homepage of 5 named partner stores, checked for an outbound link to flavory.wine |
| Internal crawl data (`data/crawl.json`) | 0.95 (parsed, first-party) | flavory.wine's own `?store=`, `/partners/`, `/partnership/` pages — checked for outbound links to partner domains (reciprocal-link check) |
| Moz API | N/A | Not configured (Tier 0) — DA/PA, referring domains, anchor text, spam score unavailable |
| Bing Webmaster API | N/A | Not configured — inbound link console data unavailable |
| DataForSEO | N/A | Extension not installed — referring-domain counts, link velocity, toxicity, geo distribution unavailable |

Common Crawl web graphs are released quarterly; this analysis used the current
`cc-main-2026-jan-feb-mar` release (source: https://commoncrawl.org/web-graphs).
Freshness for the verification crawler checks is real-time (2026-09-16).

## Metrics table

| Metric | flavory.wine | wijnbeurs.be | wijnvoordeel.be | vinum.be | mevius.be | cavavin.be | Source (confidence) |
|---|---|---|---|---|---|---|---|
| In Common Crawl host graph | **No** | Yes | Yes | No | No | No | CC (0.50) |
| In CC ranking tables | **No** | Yes | Yes | No | No | No | CC (0.50) |
| PageRank (CC internal scale) | null | 2.39e-08 | 1.28e-08 | null | null | null | CC (0.50) |
| PageRank rank (lower = better, ~ millions of domains ranked) | null | 1,799,001 | 3,966,489 | null | null | null | CC (0.50) |
| Harmonic centrality rank | null | 11,549,349 | 12,876,549 | null | null | null | CC (0.50) |
| n_hosts (subdomains seen in graph) | null | 3 | 5 | null | null | null | CC (0.50) |

Note: "not found in Common Crawl" is **not** the same as "low authority" — per the
report validator, it means CC's crawler has not indexed a site with enough inbound
graph edges to appear, which is common for newer, smaller, or niche D2C sites. Two
of five competitor domains I could name/guess (wijnbeurs.be, wijnvoordeel.be — both
established Belgian wine retailers) do appear, giving a rough reference point: even
modestly sized Belgian wine e-commerce sites can surface in CC's graph, so flavory.wine's
absence is a real (if imprecise) signal of a comparatively thin external link graph,
not a data artifact. vinum.be, mevius.be, and cavavin.be also returned "not found,"
so absence from CC is common in this niche and should be weighted lightly.

| Partner store (from flavory.wine `?store=` pages) | Domain checked | HTTP status | Links to flavory.wine on homepage? | Source (confidence) |
|---|---|---|---|---|
| Huis Manendonckx | huismanendonckx.be | 200 | No | Verify crawler (0.95) |
| Wijnhuis Bollaert | wijnhuisbollaert.be | 200 | **Unconfirmed — JS-rendered page** | Verify crawler (n/a — inconclusive) |
| Mondovino (listed as "winkel-2") | mondovino.be | 200 | No | Verify crawler (0.95) |
| Entrepot du Vin (listed as "winkel-1") | entrepotduvin.be | 200 | No | Verify crawler (0.95) |
| Dranken Hinderdael (listed as "winkel-3") | drankenhinderdael.be | 200 | No | Verify crawler (0.95) |

Domain names for the 5 partners were not present anywhere in flavory.wine's own
crawled HTML (see "What works" / reciprocal-link check below) — they were inferred
from the store names given in the task and confirmed live by requesting the most
likely `.be` domain for each; all 5 resolved with HTTP 200, which corroborates the
domain guesses were correct, but only the **homepage** of each was checked (1 page
per site, within the 8-live-request budget). A link could still exist on a
"merken"/brands or "cadeaubonnen" subpage not checked here.

## What works

- flavory.wine's own site returns clean 200s and has valid Organization/WebSite
  JSON-LD with a `sameAs` link to its Instagram profile (parsed, 0.95 confidence) —
  a legitimate, low-effort entity signal that helps but does not substitute for
  third-party backlinks.
- The 5 named stockists are real, live, indexable Belgian wine retailers (all
  returned HTTP 200 on direct request) — a plausible outreach list already exists
  and the relationships apparently already exist commercially, which lowers the
  cost of link acquisition versus cold outreach.
- No reciprocal/scheme-like link pattern was detected: flavory.wine's own
  `/partners/`, `/partnership/`, and `?store=` pages contain **zero outbound links
  to external domains** (checked via `data/crawl.json` `out_links`/`external_links`
  fields — all 14 "external_links" counted on those pages are in fact internal
  flavory.wine URLs, e.g. `/blog/`, `/de/partners/`, `/shop/`). This rules out a
  reciprocal-link risk flag for now, but see Finding 3 below — it also means
  flavory.wine isn't linking out to its partners either.

## Findings

### 1. Zero confirmed inbound links from any of the 5 named retail partners
- **Severity: High**
- **Evidence:** `verify_backlinks.py` checked the live homepage of huismanendonckx.be,
  mondovino.be, entrepotduvin.be, and drankenhinderdael.be (all HTTP 200) — none
  contain an outbound link to flavory.wine (`status: link_removed` — crawler's
  status name for "target link not found," not a claim a link previously existed).
  wijnhuisbollaert.be is JS-rendered so its homepage could not be confirmed either
  way (`status: unverifiable_js`).
- **Recommendation:** This is the single highest-leverage, lowest-cost link
  opportunity in this audit — these are existing commercial relationships, not
  cold outreach. Request a simple "Also available at [store]" or "Beschikbaar bij"
  mention with a link on each partner's homepage or dedicated brands/stockist page.
  For Wijnhuis Bollaert specifically, ask them directly rather than relying on
  re-crawling, since their site's link may be hidden behind JavaScript.

### 2. flavory.wine not present in Common Crawl's web graph at all
- **Severity: Medium**
- **Evidence:** `commoncrawl_graph.py flavory.wine` returned `in_crawl: false,
  in_rankings: false` for the current release (cc-main-2026-jan-feb-mar). Two
  comparable Belgian wine retailers (wijnbeurs.be, wijnvoordeel.be) do appear in
  the same graph release.
- **Recommendation:** Not a technical defect by itself (many small/niche sites are
  absent from CC), but consistent with a thin external link graph. Prioritize
  acquiring a handful of links from mid-authority Belgian domains (press, blogs,
  directories — see plan below); re-check in the next CC quarterly release
  (~cc-main-2026-apr-may-jun) for a presence change as a rough progress indicator.
  Do not use CC presence/absence alone as a KPI — it is a lagging, coarse signal.

### 3. flavory.wine's own store-locator pages don't link out to partner sites either
- **Severity: Low**
- **Evidence:** Parsed `data/crawl.json` for `?store=huis-manendonckx`,
  `?store=wijnhuis-bollaert`, `?store=winkel-1/2/3`, `/partners/`, and
  `/partnership/` — all `out_links` values are internal flavory.wine URLs only; no
  external domain hrefs are present in the raw HTML for any of these pages. The
  store locator/map is very likely rendered client-side (JS), so the actual
  retailer name/address may be present visually but the retailer's own website URL
  is not in a crawlable `<a href>`.
- **Recommendation:** Not itself a ranking risk, but a missed reciprocal-goodwill
  gesture: adding a real, server-rendered outbound link to each partner's site on
  their respective `?store=` page (with `rel="nofollow"` is fine, it's still a
  courtesy and a conversion signal) makes it easier to ask them for a link back,
  and improves partner-page UX/trust for shoppers researching before visiting a
  physical store.

### 4. No visibility into referring-domain count, anchor text, or toxic-link ratio
- **Severity: Medium**
- **Evidence:** Moz API and Bing Webmaster are not configured (confirmed via
  `backlinks_auth.py --check`); DataForSEO extension not installed. Common Crawl's
  web graph exposes only domain-level PageRank/harmonic-centrality and does not
  expose a referring-domains list (per `commoncrawl_graph.py --help`, "referring
  domains are not extracted").
- **Recommendation:** See "Not assessable without paid APIs" below. At minimum,
  set up the free Moz API tier (2,500 rows/month, no cost) to unlock DA/PA,
  referring-domain counts, and Spam Score — this alone would move this audit from
  Tier 0 to Tier 1 and allow a real numeric score.

### 5. Reliance on unverified partner-domain guesses
- **Severity: Low**
- **Evidence:** The 5 partner domains were not sourced from any flavory.wine page
  or database (none contain outbound hrefs, see Finding 3) — they were inferred
  from the store names given and confirmed only by getting an HTTP 200 on the
  guessed `.be` domain. This is a reasonable but not certain identification (e.g.
  "Mondovino" is a common wine-shop name; the mondovino.be checked here may or may
  not be the exact stockist flavory.wine has a relationship with).
- **Recommendation:** Confirm the exact partner URLs with flavory.wine's team (or
  by rendering the JS-based store locator with a browser) before running outreach
  or before treating "no link found" as certain for these five specific
  businesses.

## Link-building plan

1. **Stockist backlinks (highest priority, near-zero cost).** Ask all 5 named
   partners (and any others in the store locator) for a homepage or brands-page
   link to flavory.wine, ideally with descriptive Dutch anchor text ("Flavory
   wijnproeverij box" / "wijnspel cadeau"). Offer a reciprocal link from
   flavory.wine's own `?store=` pages (currently missing, Finding 3) as an
   incentive and to make the ask a two-way trade rather than a one-way request.

2. **Belgian gift guides (seasonal, high relevance).** Target "origineel cadeau
   wijnliefhebber," "leukste cadeau kerst 2026," "cadeau voor koppels," and
   "teambuilding cadeau" listicles on Flemish lifestyle/media sites (e.g. Libelle,
   Nina, HLN Shopping, Metrotime, VTM-affiliated content, Cosmopolitan BE) and
   Belgian gift-box aggregator/comparison sites. Flavory's existing on-site
   Christmas-gift blog content (`5-redenen-...-kerstcadeau-2025/2024`, seen in
   `crawl.json`) is exactly the kind of asset editors want to link to instead of
   just the homepage — pitch specific blog URLs, not just the domain.

3. **Team-building / corporate-event listings.** flavory.wine already has a
   `/eindejaars-en-relatiegeschenken/` (year-end/relationship gifts) and a
   B2B/wijnhandelaar page in its nav — get listed on Belgian teambuilding
   marketplaces and "originele bedrijfsuitjes" / "leuke teambuilding activiteit"
   directories, and on corporate-gifting comparison sites, which typically allow a
   profile link.

4. **Press coverage of the "wine tasting game" concept.** Pitch Belgian/Flemish
   business and lifestyle press (De Tijd, Trends, Bloovi, StarterStory-type BE
   outlets, regional papers) on the founder story and the gamified-wine-tasting
   category angle — a genuinely newsworthy hook distinct from "we sell wine,"
   which is easier to earn unlinked-brand-mention-to-backlink conversions from.

5. **Flemish lifestyle blogger reviews.** Send review boxes to mid-tier Flemish
   lifestyle/food/relationship bloggers and YouTubers/TikTokers who cover date
   nights, home activities, or wine content — request a do-follow link in the
   review post, not just a tagged Instagram story (socials don't pass link equity
   and can't be verified by a crawler — see the `unverifiable_js` result for
   Wijnhuis Bollaert as an analogous limitation).

6. **HARO-style / Belgian journalist-request platforms.** Register as an expert
   source for wine-tasting, date-night, and gifting story angles on services like
   Qwoted, JournoRequests, or Belgian PR platforms (e.g. Belga's press-request
   tools) to earn contextual links in relevant articles.

7. **Local chamber of commerce / Unizo / Voka listings.** Claim a business profile
   with Unizo (Belgian entrepreneurs' association) and local chamber-of-commerce
   directories — low-authority individually, but easy, free, and part of a
   healthy natural-link mix (also useful for local/business legitimacy signals
   beyond SEO).

8. **Reciprocal-link risk to manage going forward.** No reciprocal-linking pattern
   exists today (Finding 3/"What works"), but if flavory.wine does add outbound
   links to partner stores as recommended in item 1, keep the exchange asymmetric
   in intent (courtesy/commercial mention, not a manufactured "link to us and
   we'll link to you" scheme across many domains) and avoid exact-match anchor
   text stuffing on both sides, which would be flagged by tools like Moz Spam
   Score or DataForSEO's toxic-link detection once those are available.

## Not assessable without paid APIs

The following require Moz (Tier 1), Bing Webmaster (Tier 2), or DataForSEO
(Tier 3) and were **not** assessed in this report — do not infer values for these:

- Domain Authority (DA) / Page Authority (PA)
- Total referring domains / total inbound links count
- Moz Spam Score / toxic-link ratio
- Anchor text distribution and over-optimization risk
- Follow vs. nofollow link ratio
- Link velocity / acquisition trend over time
- Geographic distribution of referring domains
- Top linking pages / top-linked pages on flavory.wine
- Any numeric Backlink Health Score (0–100) — blocked by the validator because
  fewer than 4 of 7 scoring factors have data at Tier 0

**Next step to unlock scoring:** configure the free Moz API tier (moz.com/products/api,
2,500 rows/month at no cost) to move to Tier 1, which would supply DA/PA, referring
domains, anchor text, and Spam Score and allow a real confidence-weighted numeric
score in a follow-up run of `/seo backlinks`.
