# Content Architecture & Semantic Clustering — flavory.wine blog

Scope: 28 live Dutch blog posts under `/blog/` (mirrored 1:1 under `/de/blog/`), plus 7 orphaned root-level "5 redenen…kerstcadeau" landing-page duplicates found in the crawl. Data sources: `data/crawl.json` (title/H1/H2/word_count/meta/out_links/text_sample), `data/inbound_links.json` (internal inbound link counts), plus live spot-checks of legacy `/shop/*` URLs via WebFetch and 10 Dutch WebSearch SERP samples for intent/gap validation.

**Methodology note:** Intent classification and SERP-overlap scoring for the keyword table below is **expert judgement** informed by 10 live Dutch SERP samples (not a full pairwise SERP-overlap matrix per keyword pair — that step was skipped on coordinator instruction to finish quickly). Search volumes are not from a real keyword-volume data source and are labelled as estimates.

## Score: 30/100

The blog has real strengths (consistent 2,200–2,900-word posts, a distinct brand voice, and several posts already ranking on relevant long-tail Dutch SERPs). But there is effectively **no intentional hub-and-spoke architecture**: every one of the 28 posts links to the same undifferentiated list of all other 28 posts ("Gerelateerde berichten") plus a generic `/shop/`, `/faq/`, `/eindejaars-en-relatiegeschenken/` and `/shop/winkelwagen/` (cart!) block — this is a flat mesh, not a designed silo. Combined with three confirmed duplicate-content post pairs, 7 thin orphaned landing-page stubs on the same "kerstcadeau" theme, and near-total reliance on legacy product URLs that now 301-redirect to the homepage, the architecture is actively leaking link equity and diluting rankings on the site's most important commercial terms.

## Seed keywords & intent table

| # | Keyword (NL) | Intent | Notes (expert judgement, volumes = estimates) |
|---|---|---|---|
| 1 | wijnspel | Commercial | Core brand-category term; homepage should own it |
| 2 | wijnspel cadeau | Transactional | Flavory already surfaces in live SERP sample |
| 3 | wijnproeverij thuis | Commercial | High-intent category term; PLP + pillar should target |
| 4 | wijnproeverij thuis organiseren | Informational→Commercial | How-to; converts well to product CTA |
| 5 | wijn cadeau | Transactional | Broad; competitive vs. Gall&Gall, Henri Bloem |
| 6 | wijnbox cadeau | Transactional | Competitive; large NL players dominate SERP |
| 7 | wijncadeau kerst / kerstcadeau wijn | Transactional (seasonal) | Est. high seasonal volume Nov–Dec |
| 8 | origineel kerstcadeau wijnliefhebber | Commercial | Flavory absent from sampled SERP — gap |
| 9 | blind wijn proeven | Informational/Commercial | Flavory ranks (2 of its own posts show) |
| 10 | blind wijnproeven spel vrienden | Transactional | Flavory ranks alongside Sommify/SommelYeah |
| 11 | wijnquiz | Informational/Commercial | No dedicated Flavory content — gap |
| 12 | wijn leren proeven | Informational | Flavory absent from sampled SERP — content gap |
| 13 | wijn proeven voor beginners | Informational | Dominated by wine-course sites — gap |
| 14 | teambuilding wijnproeverij bedrijf | Commercial (B2B) | Flavory absent — gap despite offering on-location tastings |
| 15 | relatiegeschenk wijn bedrijf | Commercial (B2B) | Only 1 Flavory post targets this |
| 16 | zakelijk kerstpakket wijn | Transactional (B2B) | No dedicated content — gap |
| 17 | wijn spelletjes | Informational/Commercial | Adjacent to "wijnspel" |
| 18 | cadeau wijnliefhebber | Commercial | Competitive gift-guide space |
| 19 | welke wijn bij welk gerecht | Informational | Flavory ranks position ~4 in sample — strength |
| 20 | verdwaald in de wijnrayon | Informational | Own-brand long tail, low competition |
| 21 | welke wijn altijd in huis | Informational | Two duplicate Flavory posts compete with each other |
| 22 | natuurwijn kopen | Informational | Niche, own content exists |
| 23 | italiaanse rode wijnen | Informational | Own content exists |
| 24 | rosé wijn soorten | Informational | Own content ("de-ene-rose-is-de-andere-niet") |
| 25 | date night thuis wijn | Commercial | 3 Flavory posts overlap here |
| 26 | wijnproeverij vriendinnenavond | Commercial | 1 post, mismatched URL (see cannibalisation) |
| 27 | vrijgezellenfeest wijnproeverij | Commercial | Flavory absent — gap |
| 28 | vriendenweekend activiteit | Commercial | Own content exists |
| 29 | moederdag cadeau wijn | Transactional (seasonal) | Own content exists |
| 30 | valentijn cadeau wijn / wijnhoroscoop | Transactional (seasonal) | Own content, novel horoscope angle |
| 31 | paascadeau wijn | Transactional (seasonal) | Own content exists |
| 32 | is dure wijn beter | Informational | Own content exists |
| 33 | waarom smaakt wijn anders | Informational | Two near-duplicate Flavory posts |
| 34 | balans in wijn | Informational | Own content, niche/branded angle |
| 35 | alcoholvrije wijn | Informational/Commercial | Product page exists, near-zero blog support — gap |
| 36 | wijnkiezer / welke wijn past bij mij | Commercial | Tool page exists, almost no internal links (2) — gap |
| 37 | flavory wijnspel review | Navigational | Excluded from clustering (navigational) |
| 38 | flavory.wine | Navigational | Excluded from clustering (navigational) |

Navigational terms (37–38 and brand-name variants) removed from cluster planning per methodology.

## Current clusters (as they actually exist today) — with cannibalisation notes

The blog is not organised into real clusters; it is a flat list where every post links to every other post. Grouping the 28 posts by actual topical overlap reveals the following natural groups and duplication problems:

**1. "Kerstcadeau / geschenk" group — SEVERE cannibalisation (8-way overlap)**
- `/blog/wijnspel-als-kerstcadeau-black-friday/` (2,520 words)
- `/blog/op-zoek-naar-het-leukste-kerstcadeau-van-2025-ontdek-waarom-de-flavory-wijnproeverij-het-perfecte-geschenk-is/` (2,348 words)
- `/blog/luxe-wijnpakket-als-geschenk/` (2,459 words, meta explicitly says "Kies dit jaar een origineel **kerstcadeau**")
- Plus 7 **orphaned, non-blog, thin duplicate landing pages** discovered in the crawl, all near-identical titles, none properly integrated into the blog: `/5-redenen-waarom-flavorys-wine-tasting-het-leukste-kerstcadeau-van-2024-is/`, `-2/`, `-2-2/`, and the 2025 variants `-w2`, `-2`, `-3`, and the base URL — word counts range from **60 to 476 words** (thin/near-duplicate content, likely abandoned page-builder drafts). These currently sit outside `/blog/` entirely and are pure cannibalisation/crawl-budget waste.
- Despite 3 live blog posts targeting essentially the same "kerstcadeau" intent, Flavory does **not** appear in a sampled SERP for "origineel kerstcadeau wijnliefhebber" — classic symptom of split link equity/relevance signals across duplicates rather than one consolidated, strong page.
- `/blog/5-redenen-waarom-flavory-het-leukste-wijngeschenk-is/` and `/blog/vijf-cadeaus-die-iedereen-geeft-en-een-dat-bijblijft/` are near-duplicate **generic** (non-seasonal) gift positioning of each other (both "waarom Flavory het beste cadeau is", no seasonal hook) — a second, smaller cannibalisation pair inside this group.

**2. "Welke wijn moet je altijd in huis hebben" — CONFIRMED duplicate (exact-match opening paragraph)**
- `/blog/start-to-wijnkelder-welke-types-wijn-moet-je-altijd-in-huis-hebben/` (published 18 Feb 2025, 2,415 words, blank meta description)
- `/blog/welke-wijn-moet-je-altijd-in-huis-hebben-ontdek-de-beste-keuzes-voor-elke-gelegenheid/` (published 09 Sept 2025, 2,509 words, has a proper meta description)
- Verified via `text_sample`: both open with the identical sentence "Noem één ding dat angstaanjagender is dan de wijnrayon van de supermarkt inwandelen…" and share identical H2 structure (Wijn 1 t/m 4). This is a republish of the same article seven months apart under a new URL, not a new post.

**3. "Waarom smaakt elke wijn anders" — CONFIRMED duplicate**
- `/blog/drie-redenen-waarom-geen-twee-wijnen-ooit-helemaal-hetzelfde-smaken/` (14 Apr 2025, 2,413 words)
- `/blog/waarom-smaakt-elke-wijn-anders/` (10 July 2025, 2,197 words)
- Verified: both open with "Elke wijn is uniek. En dat is geen toeval…" and cover the same three reasons (druif, terroir, wijnbouwer). Same republish pattern as above, 3 months apart.

**4. "Wijnavond met vriendinnen" — URL/content mismatch (not a true duplicate, but confusing)**
- `/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie/` — genuinely about a girls'-night wine evening.
- `/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie-dupliceren/` — despite the URL literally saying "vriendinnen…therapie", the actual title/H1/content ("Datenight met wijn", "Wijnproeven op date night", "Flavory Date Night: wijncadeau voor jullie twee") is about a **romantic couple's date night**, not a girls' night. This looks like a page-builder "duplicate" of the original that was then repurposed for a different topic without updating the slug — it competes for date-night terms under a URL that signals the wrong topic to both users and search engines.

**5. "Date night" group — mild overlap, needs consolidation, not merging**
- `/blog/originele-date-night-thuis/`, `/blog/wijnproeverij-date-night-chardonnay-of-sauvignon-blanc/`, and the mis-slugged `…-dupliceren` post above all target couples' date-night occasions with distinct angles (general date night; a specific grape match-up; relationship storytelling). Recommend keeping all three as spokes once the third is correctly re-slugged, rather than merging — each is differentiated enough to avoid true cannibalisation.

**6. Coherent, non-duplicated existing groups**
- Wine knowledge/basics: `balans-in-wijn`, `is-dure-wijn-beter`, `blind-wijn-proeven`, `natuurwijn-kopen`, `het-prille-begin-van-flavory-anno-2017`
- Wine choice/style guides: `verdwaald-in-de-wijnrayon`, `welke-wijn-bij-welk-gerecht-spiekbriefje`, `italiaanse-rode-wijnen`, `de-ene-rose-is-de-andere-niet`
- Occasion gifting (non-Christmas): `wijn-cadeau-pasen`, `slow-wine-moederdag-het-verhaal-achter-de-slak`, `valentijn-wijn-horoscoop-2026`
- B2B: `relatiegeschenken-slimme-investering-of-weggegooid-budget` (only one post — under-resourced cluster)
- Wijnavond-met-vrienden(inn)en: `wat-te-doen-op-een-vriendenweekend-organiseer-een-wijnproeverij-spel`, `waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie`

## Merge / redirect plan

| Action | From | To | Rationale |
|---|---|---|---|
| 301 redirect (x7) | All 7 root-level `5-redenen-waarom-flavorys-wine-tasting-het-leukste-kerstcadeau-van-202{4,5}-is*` stubs | New evergreen kerstcadeau spoke (see below) | Thin (60–476 words), orphaned duplicates, pure crawl/index waste |
| Rewrite + rename, then 301 | `/blog/wijnspel-als-kerstcadeau-black-friday/` | `/blog/wijnspel-als-kerstcadeau/` (drop year/event lock) | Becomes the single evergreen Christmas-gift spoke; update yearly instead of republishing |
| Merge content, then 301 | `/blog/op-zoek-naar-het-leukste-kerstcadeau-van-2025-.../` | → into `/blog/wijnspel-als-kerstcadeau/` | Same intent, same season, splitting equity |
| Merge content, then 301 | `/blog/luxe-wijnpakket-als-geschenk/` | → into `/blog/wijnspel-als-kerstcadeau/` | Meta explicitly frames it as a Christmas post; redundant with above two |
| 301 redirect | `/blog/vijf-cadeaus-die-iedereen-geeft-en-een-dat-bijblijft/` | `/blog/5-redenen-waarom-flavory-het-leukste-wijngeschenk-is/` | Same generic (non-seasonal) gift positioning |
| 301 redirect | `/blog/start-to-wijnkelder-welke-types-wijn-moet-je-altijd-in-huis-hebben/` | `/blog/welke-wijn-moet-je-altijd-in-huis-hebben-ontdek-de-beste-keuzes-voor-elke-gelegenheid/` | Confirmed duplicate; target has the proper meta description |
| 301 redirect | `/blog/drie-redenen-waarom-geen-twee-wijnen-ooit-helemaal-hetzelfde-smaken/` | `/blog/waarom-smaakt-elke-wijn-anders/` | Confirmed duplicate; target has cleaner, query-matching URL |
| Re-slug (301 from old URL) | `/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie-dupliceren/` | New URL e.g. `/blog/datenight-wijnproeven-koppels/` | Content is about couple's date night, not "vriendinnen" — fix URL/topic mismatch, keep as distinct Date Night spoke (do not merge with the real vriendinnen post) |

Net effect: 28 live blog posts + 7 orphan stubs → **~21 consolidated blog posts**, each mapped to exactly one cluster, no duplicate primary keywords.

## Proposed hub-and-spoke architecture

Given the site has 21+ posts (not a single new 30–50 keyword expansion), 6 topic pillars are proposed rather than the usual 2–5 — this is a full-site restatement, and each pillar individually stays within a 3–5 spoke range.

### Pillar 1 (NEW) — "Wijn cadeau geven: de complete gids voor elke gelegenheid"
Intent: Commercial. Links to `/eindejaars-en-relatiegeschenken/` and the three live product boxes.
- Spoke: `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` (generic year-round gift; template: listicle)
- Spoke: `wijnspel-als-kerstcadeau` (evergreen, renamed; template: seasonal buying guide, "last updated" block)
- Spoke: `wijn-cadeau-pasen` (template: seasonal buying guide)
- Spoke: `slow-wine-moederdag-het-verhaal-achter-de-slak` (template: storytelling + gift angle)
- Spoke: `valentijn-wijn-horoscoop-2026` (template: interactive/quiz-style content)

### Pillar 2 — "Relatiegeschenken & teambuilding wijnproeverij voor bedrijven" (promote existing post to pillar)
Intent: Commercial (B2B). Links to `/eindejaars-en-relatiegeschenken/` and `/proeverij/`.
- Pillar/spoke: `relatiegeschenken-slimme-investering-of-weggegooid-budget` (expand to pillar depth, 2,500+ words)
- Spoke (gap — new): "Teambuilding wijnproeverij: origineel bedrijfsuitje zonder gedoe"
- Spoke (gap — new): "Zakelijk kerstpakket 2.0: wijnspel in plaats van standaard kerstpakket"

### Pillar 3 — "Wijnproeverij thuis organiseren: complete gids" (promote `wijnproeverij-thuis-flavory`)
Intent: Commercial/Informational. Links to `/shop/wijnproeverij-thuis-rood/`, `/shop/wijnproeverij-thuis-wit/`, `/proeverij/`.
- Pillar/spoke: `wijnproeverij-thuis-flavory` (expand)
- Spoke: `wat-te-doen-op-een-vriendenweekend-organiseer-een-wijnproeverij-spel`
- Spoke: `waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie`

### Pillar 4 — "Date night & romantische wijnproeverij voor koppels" (promote `originele-date-night-thuis`)
Intent: Commercial. Links to `/shop/bubbelbox/`, `/shop/wijnproeverij-thuis-rood/`.
- Pillar/spoke: `originele-date-night-thuis` (expand)
- Spoke: `wijnproeverij-date-night-chardonnay-of-sauvignon-blanc`
- Spoke: `datenight-wijnproeven-koppels` (re-slugged, see merge plan)

### Pillar 5 (NEW) — "Wijn leren proeven: de basis in 15 minuten"
Intent: Informational (top-of-funnel). Links to `/flavory-gameplay/`, `/faq/`.
- Spoke: `blind-wijn-proeven`
- Spoke: `balans-in-wijn`
- Spoke: `is-dure-wijn-beter`
- Spoke: `waarom-smaakt-elke-wijn-anders` (post-merge)
- Spoke: `natuurwijn-kopen`
- Spoke (loosely tied in): `het-prille-begin-van-flavory-anno-2017` (brand story, links to `/over-flavory/`)

### Pillar 6 (NEW) — "Welke wijn kies je? De ultieme wijnkiezer-gids"
Intent: Informational→Commercial. Links to `/wijnkiezer/` (currently only 2 internal links site-wide — biggest orphan-adjacent opportunity).
- Spoke: `verdwaald-in-de-wijnrayon`
- Spoke: `welke-wijn-bij-welk-gerecht-spiekbriefje`
- Spoke: `welke-wijn-moet-je-altijd-in-huis-hebben-ontdek-de-beste-keuzes-voor-elke-gelegenheid` (post-merge)
- Spoke: `italiaanse-rode-wijnen`
- Spoke: `de-ene-rose-is-de-andere-niet`

## Internal link matrix (source → target, suggested Dutch anchor text)

Priority given to fixing blog → product links, which today mostly point at legacy `/shop/*-box/` URLs that 301-redirect to the homepage (verified live for `/shop/rode-wijn-box/`, `/shop/witte-wijn-box/`, `/shop/cava-prosecco-box/`).

| # | Source | Target | Anchor text (NL) | Type |
|---|---|---|---|---|
| 1 | `wijnproeverij-thuis-flavory` (pillar 3) | `/shop/wijnproeverij-thuis-rood/` | "rode wijnproeverij thuis" | Mandatory |
| 2 | `wijnproeverij-thuis-flavory` (pillar 3) | `/shop/wijnproeverij-thuis-wit/` | "witte wijnproeverij thuis" | Mandatory |
| 3 | `wijnproeverij-thuis-flavory` (pillar 3) | `/proeverij/` | "een proeverij op locatie boeken" | Recommended |
| 4 | `wat-te-doen-op-een-vriendenweekend...` | `wijnproeverij-thuis-flavory` | "wijnproeverij thuis organiseren" | Mandatory (spoke→pillar) |
| 5 | `waarom-een-wijnavond-met-vriendinnen...therapie` | `wijnproeverij-thuis-flavory` | "organiseer zelf een wijnproeverij thuis" | Mandatory (spoke→pillar) |
| 6 | `wijnproeverij-thuis-flavory` (pillar) | `wat-te-doen-op-een-vriendenweekend...` | "wijnproeverij spel voor je vriendenweekend" | Mandatory (pillar→spoke) |
| 7 | `wijnproeverij-thuis-flavory` (pillar) | `waarom-een-wijnavond-met-vriendinnen...therapie` | "wijnavond met je vriendinnen" | Mandatory (pillar→spoke) |
| 8 | `originele-date-night-thuis` (pillar 4) | `/shop/bubbelbox/` | "bubbelbox voor twee" | Mandatory |
| 9 | `originele-date-night-thuis` (pillar 4) | `/shop/wijnproeverij-thuis-rood/` | "rode wijnproeverij voor koppels" | Recommended |
| 10 | `wijnproeverij-date-night-chardonnay-of-sauvignon-blanc` | `originele-date-night-thuis` | "meer date night wijninspiratie" | Mandatory (spoke→pillar) |
| 11 | `datenight-wijnproeven-koppels` (re-slugged) | `originele-date-night-thuis` | "originele date night thuis" | Mandatory (spoke→pillar) |
| 12 | `originele-date-night-thuis` (pillar) | `wijnproeverij-date-night-chardonnay-of-sauvignon-blanc` | "Chardonnay of Sauvignon Blanc: welke wint?" | Mandatory (pillar→spoke) |
| 13 | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` (pillar 1) | `/eindejaars-en-relatiegeschenken/` | "bekijk alle wijngeschenken" | Mandatory |
| 14 | `wijnspel-als-kerstcadeau` (pillar 1 spoke, renamed) | `/shop/wijnproeverij-thuis-rood/` | "rode wijnproeverij als kerstcadeau" | Mandatory |
| 15 | `wijnspel-als-kerstcadeau` (spoke) | `/shop/wijnproeverij-thuis-wit/` | "witte wijnproeverij als kerstcadeau" | Recommended |
| 16 | `wijn-cadeau-pasen` | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` | "waarom Flavory het leukste wijngeschenk is" | Mandatory (spoke→pillar) |
| 17 | `slow-wine-moederdag-het-verhaal-achter-de-slak` | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` | "ontdek het leukste wijngeschenk" | Mandatory (spoke→pillar) |
| 18 | `valentijn-wijn-horoscoop-2026` | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` | "waarom een wijnspel het perfecte cadeau is" | Mandatory (spoke→pillar) |
| 19 | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` (pillar) | `wijnspel-als-kerstcadeau` | "wijnspel als kerstcadeau" | Mandatory (pillar→spoke) |
| 20 | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` (pillar) | `wijn-cadeau-pasen` | "wijn cadeau met Pasen" | Mandatory (pillar→spoke) |
| 21 | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` (pillar) | `slow-wine-moederdag-het-verhaal-achter-de-slak` | "Slow Wine cadeau voor Moederdag" | Mandatory (pillar→spoke) |
| 22 | `5-redenen-waarom-flavory-het-leukste-wijngeschenk-is` (pillar) | `valentijn-wijn-horoscoop-2026` | "wijnhoroscoop voor Valentijn" | Mandatory (pillar→spoke) |
| 23 | `relatiegeschenken-slimme-investering-of-weggegooid-budget` (pillar 2) | `/eindejaars-en-relatiegeschenken/` | "zakelijke wijngeschenken bekijken" | Mandatory |
| 24 | `relatiegeschenken-slimme-investering-of-weggegooid-budget` (pillar 2) | `/proeverij/` | "een teambuilding wijnproeverij boeken" | Recommended |
| 25 | `blind-wijn-proeven` (pillar 5) | `/flavory-gameplay/` | "hoe het Flavory wijnspel werkt" | Mandatory |
| 26 | `balans-in-wijn` | `blind-wijn-proeven` | "test het zelf met blind proeven" | Recommended (spoke↔spoke) |
| 27 | `is-dure-wijn-beter` | `blind-wijn-proeven` | "blind proeven ontmaskert prijsvooroordeel" | Recommended (spoke↔spoke) |
| 28 | `waarom-smaakt-elke-wijn-anders` (post-merge) | `blind-wijn-proeven` (pillar) | "leer blind wijn proeven" | Mandatory (spoke→pillar) |
| 29 | `natuurwijn-kopen` | `blind-wijn-proeven` (pillar) | "wat heeft dit met blind proeven te maken" | Mandatory (spoke→pillar) |
| 30 | `blind-wijn-proeven` (pillar) | `natuurwijn-kopen` | "is natuurwijn de moeite waard" | Mandatory (pillar→spoke) |
| 31 | `verdwaald-in-de-wijnrayon` (pillar 6) | `/wijnkiezer/` | "gebruik de Flavory wijnkiezer" | Mandatory |
| 32 | `welke-wijn-bij-welk-gerecht-spiekbriefje` (pillar 6) | `/wijnkiezer/` | "vind snel jouw wijn met de wijnkiezer" | Mandatory |
| 33 | `welke-wijn-moet-je-altijd-in-huis-hebben-...` (post-merge) | `/wijnkiezer/` | "twijfel je nog? Doe de wijnkiezer-test" | Mandatory |
| 34 | `italiaanse-rode-wijnen` | `verdwaald-in-de-wijnrayon` (pillar) | "verdwaald in de wijnrayon? lees dit eerst" | Mandatory (spoke→pillar) |
| 35 | `de-ene-rose-is-de-andere-niet` | `verdwaald-in-de-wijnrayon` (pillar) | "hoe kies je in de supermarkt" | Mandatory (spoke→pillar) |
| 36 | `verdwaald-in-de-wijnrayon` (pillar) | `italiaanse-rode-wijnen` | "5 Italiaanse klassiekers om te proeven" | Mandatory (pillar→spoke) |
| 37 | `verdwaald-in-de-wijnrayon` (pillar) | `de-ene-rose-is-de-andere-niet` | "niet elke rosé is hetzelfde" | Mandatory (pillar→spoke) |
| 38 | Any wine-knowledge spoke (pillar 5) | `/alcoholvrije-wijnen/` | "ontdek ook onze alcoholvrije wijnen" | Optional (cross-cluster; currently 0 blog links to this page) |
| 39 | `wijnproeverij-thuis-flavory` (pillar 3) | Pillar 6 (`welke-wijn-bij-welk-gerecht-spiekbriefje`) | "niet zeker welke wijn je moet kiezen?" | Optional (cross-cluster) |
| 40 | Homepage / `/blog/` index | Each of the 6 pillar posts | pillar-specific anchor per topic | Mandatory (hub discovery) |

All 28 posts should **stop** linking to `/shop/winkelwagen/` (cart) as a "related" link — replace with the specific live product page relevant to that post's cluster.

## Content gaps (10–15 new post/pillar ideas)

| # | Working title (NL) | Intent | Cluster |
|---|---|---|---|
| 1 | "Teambuilding wijnproeverij: het origineelste bedrijfsuitje van het jaar" | Commercial (B2B) | Pillar 2 |
| 2 | "Zakelijk kerstpakket 2.0: waarom een wijnspel je personeel meer bijblijft" | Transactional (B2B, seasonal) | Pillar 2 |
| 3 | "Wijn leren proeven in 5 stappen: de Flavory-methode voor beginners" | Informational | Pillar 5 (fills confirmed SERP gap) |
| 4 | "Wijnquiz: test je wijnkennis (met antwoorden)" | Informational/Commercial | Pillar 5 |
| 5 | "Vrijgezellenfeest wijnproeverij: origineel alternatief voor de kroeg" | Commercial | Pillar 3/4 (fills confirmed SERP gap) |
| 6 | "Alcoholvrije wijn proeven: kan dat blind ook?" | Informational/Commercial | Pillar 5, ties to `/alcoholvrije-wijnen/` |
| 7 | "Wijnkiezer: welke wijn past bij jouw smaak? (interactieve gids)" | Commercial | Pillar 6, ties to `/wijnkiezer/` tool |
| 8 | "Franse wijnen voor beginners: 5 klassiekers naast de Italiaanse" | Informational | Pillar 6 (parallels `italiaanse-rode-wijnen`) |
| 9 | "Spaanse wijnen: de nummer 2 in ons wijnspel Italië vs. Spanje" | Informational/Commercial | Pillar 6, ties to `/shop/wijnspel-italie-vs-spanje-...` |
| 10 | "Verjaardagscadeau wijn: 7 ideeën die niet saai zijn" | Transactional | Pillar 1 (fills always-on occasion beyond seasonal) |
| 11 | "Housewarming cadeau: waarom een wijnspel beter is dan een plant" | Transactional | Pillar 1 |
| 12 | "Wijn en eten thuis combineren: het complete Flavory-menu" | Informational | Pillar 6, expands `welke-wijn-bij-welk-gerecht` |
| 13 | "Wijnproeverij voor een groep: hoeveel wijn en glazen heb je nodig?" | Informational→Commercial | Pillar 3 |
| 14 | "Duurzame/biologische wijn: wat is het verschil met natuurwijn?" | Informational | Pillar 5, parallels `natuurwijn-kopen` |
| 15 | "FAQ-gids: alles wat je wilt weten voordat je een Flavory wijnspel koopt" | Informational→Transactional | Ties directly into `/faq/` (159 inbound links already, high authority page — a blog spoke feeding it both ways) |

## Quick wins

1. **Fix the "related posts" block.** Replace the current all-28-posts mega-link block with a curated 3–4 link "related in this cluster" module per pillar assignment above. Immediate crawl-efficiency and topical-relevance signal improvement, no new content needed.
2. **Repoint every blog→product link** from legacy `/shop/rode-wijn-box/`, `/shop/witte-wijn-box/`, `/shop/rose-wijn-box/`, `/shop/cava-prosecco-box/`, `/shop/merlot-of-cabernet-sauvignon*`, `/shop/legendarische-*` (confirmed 301→homepage for several of these) to the live product URLs: `/shop/wijnproeverij-thuis-rood/`, `/shop/wijnproeverij-thuis-wit/`, `/shop/bubbelbox/`. Currently these live URLs get **zero** blog inbound links despite being the actual sellable SKUs.
3. **Stop linking every blog post to `/shop/winkelwagen/` (cart page)** as a "related" link — this wastes a link slot and is poor UX; replace with a relevant product page.
4. **301-redirect the 7 orphaned thin "5-redenen…kerstcadeau" stub pages** (60–476 words each) into one evergreen kerstcadeau post — immediate content-quality and crawl-budget cleanup.
5. **Merge the two confirmed duplicate pairs** (`start-to-wijnkelder...` / `welke-wijn-moet-je-altijd-in-huis...` and `drie-redenen-waarom-geen-twee-wijnen...` / `waarom-smaakt-elke-wijn-anders`) via 301s — stop two pairs of posts from competing with each other in the same SERP.
6. **Add 1–2 internal links from relevant blog posts to `/wijnkiezer/`, `/proeverij/`, `/flavory-gameplay/`, and `/alcoholvrije-wijnen/`** — these commercial/tool pages currently sit at 1–2 internal links site-wide despite being core parts of the funnel.
7. **Re-slug the `-dupliceren` post** so its URL matches its actual (date-night) content instead of the unrelated "vriendinnen...therapie" phrase it currently carries.
