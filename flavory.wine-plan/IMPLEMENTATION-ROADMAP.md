# Implementatieroadmap — flavory.wine

Vier fasen over 12 maanden, gestart in oktober 2026. Fase 1 moet vóór half november af zijn omdat november en december samen 46% van het jaarverkeer leveren (2.462 van 5.335 klikken). Grote structuurwijzigingen (URL-hernoemingen, migraties) gebeuren niet tussen 15 november en 5 januari.

Inspanning: S = minder dan 2 uur, M = halve dag tot 2 dagen, L = meer dan 2 dagen. Rol: Dev (WordPress/hosting), Content (Bart of copywriter), Eigenaar (beslissingen, accounts).

## Fase 1 — Fundament (weken 1–4, oktober 2026)

Doel: verkeerslekken dichten, snelheid en schema fixen, meetinstrumenten aansluiten. Afhankelijkheden: hostingtoegang, Yoast/WooCommerce-beheer, Trustpilot-koppeling.

| # | Actie | Rol | Inspanning | Meetpunt |
|---|---|---|---|---|
| 1.1 | Full-page caching inschakelen; WooCommerce-sessiecookie en `__cvg_1p_uid` uit de cache-key behalve winkelmand/afrekenen/account; `Cache-Control`/`Expires` corrigeren; OPcache en PHP 8.x controleren; CDN overwegen. | Dev | M | TTFB < 0,8 s (nu 3,4–7,3 s); LCP mobiel < 2,5 s op home, shop, product |
| 1.2 | Product-schema activeren (WooCommerce core of Yoast WooCommerce SEO): Offer, availability, gtin13 05430004293071, AggregateRating uit Trustpilot (4,5 / 31). JSON-LD staat in de audit (`findings/schema.md`). | Dev | S–M | Rich Results Test groen op 4 producten; "Productfragmenten" in GSC stijgt (nu 89 klikken / 6.646 vert.) |
| 1.3 | Catch-all 301 naar homepage vervangen door echte 404 met zoekveld en productlinks. | Dev | S | Onbekende URL geeft 404 |
| 1.4 | Redirect-map uit SITE-STRUCTURE.md §3 implementeren: 26 legacy-URL's naar het juiste product; `/privacybeleid/` herstellen; `/de/` naar `/de/start/`. | Dev | M | 442 klikken/jaar behouden; legendarische-wijnlanden-rood (7.268 vert.) landt op Italië-of-Spanje-box |
| 1.5 | 287 interne links naar legacy-URL's vervangen door directe links (blog related-blok, knoppen, menu's). | Content/Dev | M | 0 interne links naar redirects (hercrawl) |
| 1.6 | Opschonen: 9 testpagina's, 14 Duitse kopieën, `-dupliceren`, 6 kerstcadeau-varianten, `?reviews=`/`?store=` (noindex of samenvoegen), geen-categorie noindex, auteur-sitemap uit. | Content/Dev | M | Sitemap van 120 naar ±76 URL's; GSC "Geïndexeerd" daalt zonder verlies van klikken |
| 1.7 | Beveiligingsheaders in nginx (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP report-only). | Dev | S | securityheaders.com A |
| 1.8 | Meting: GSC en GA4 gekoppeld aan de audit-tooling (API-sleutel), Bing Webmaster Tools + IndexNow, drift-baseline vastleggen na 1.1–1.6. | Eigenaar/Dev | S | Baseline-rapport opgeslagen |
| 1.9 | Beslissing Duitse sectie: optie A (bevriezen) of B (uitbouwen). | Eigenaar | S | Vastgelegd in SEO-STRATEGY.md |

Risico's: caching breekt winkelmand of A/B-testplugin (test op staging met cookie-uitzonderingen); redirect-wijzigingen tijdens de piek (daarom vóór 15 november); Yoast-instellingen die het sitemapformaat wijzigen (daarna sitemap opnieuw indienen).

## Fase 2 — Uitbreiding (weken 5–12, november 2026 – december 2026)

Doel: commerciële pagina's laten ranken op de zoektermen die klanten gebruiken, en de kerstpiek benutten. Contentwerk volgens CONTENT-CALENDAR.md.

| # | Actie | Rol | Inspanning | Meetpunt |
|---|---|---|---|---|
| 2.1 | Titels, meta descriptions en H1's herschrijven voor home, 4 producten, /shop/, B2B, proeverij, hoe-werkt-het, wijnkiezer (rewrites in audit `findings/sxo.md`); 71 ontbrekende meta descriptions aanvullen. | Content | M | CTR /shop/ > 10% (nu 8,3%); home-CTR op niet-merk stijgt |
| 2.2 | hreflang NL/DE voor bestaande paren; `/en/`-pagina's noindex. | Dev | M | Geen hreflang-fouten in GSC |
| 2.3 | Cadeau-hub: /cadeau/wijncadeau/, /cadeau/kerstcadeau/ live vóór 10 november; business-pagina met staffelprijzen. | Content | M | Rankings top 10 voor "origineel wijncadeau", "cadeau voor wijnkenner" |
| 2.4 | Eerste 3 vergelijkingsartikelen (merlot/cabernet, chardonnay/sauvignon, cava/prosecco) met tabel, FAQ en link naar product. | Content | M | Top 5 voor "verschil merlot en cabernet sauvignon" e.d. (nu pos 10–27) |
| 2.5 | Organization-schema verrijken (adres, BTW, contactPoint, founder, sameAs LinkedIn/Trustpilot); auteurspagina Bart; Person.url fixen. | Dev/Content | S | Kennispaneel-signalen, Rich Results zonder waarschuwingen |
| 2.6 | Mobiel: sticky add-to-cart op productpagina's, aankondigingsbalk-overlap fixen, header kleiner, `/de/start/`-hang oplossen, cookie-consent verifiëren. | Dev | M | Mobiele conversie stijgt (GA4); LCP stabiel |
| 2.7 | Third-party scripts uitstellen (Meta Pixel, Clarity, A/B-tool), lazy loading, 139 afbeeldingen dimensies, alt-teksten productgalerij. | Dev | M | TBT < 200 ms (nu 433–683 ms) |
| 2.8 | Reviews-pagina met Trustpilot-import en Review-schema; verkooppuntenpagina met echte links. | Content/Dev | M | Sterren in SERP op producten |

## Fase 3 — Schalen (weken 13–24, januari – maart 2027)

Doel: pijlerstructuur, resterende vergelijkingen, autoriteit en AI-vindbaarheid.

| # | Actie | Rol | Inspanning | Meetpunt |
|---|---|---|---|---|
| 3.1 | Pijlers 1–3 publiceren (wijnproeverij thuis organiseren, wijn leren proeven, druiven en stijlen); bestaande posts als spokes herlinken; related-blok vervangen door 3–4 gecureerde links. | Content | L | Elke commerciële pagina ≥ 10 interne links |
| 3.2 | Duplicaatposts samenvoegen (2 paren), valentijn-varianten samenvoegen, moederdag/vaderdag-pagina's. | Content | M | Geen kannibalisatie in GSC (1 URL per query) |
| 3.3 | Linkbuilding ronde 1: 5 verkooppunten om een link vragen, 10 Belgische en Nederlandse cadeaugidsen, 5 teambuilding-directories, 5 Vlaamse lifestyle-blogs (productreview), persbericht over het spelconcept. | Eigenaar/Content | L | ≥ 15 nieuwe verwijzende domeinen (nu: niet meetbaar, Moz-sleutel nodig) |
| 3.4 | Merchant Center: productfeed, verzending-en-retourpagina, shippingDetails en returnPolicy in schema; gratis vermeldingen aanzetten. | Dev/Eigenaar | M | "Verkopersvermeldingen" in GSC > 0 (nu 6 vert.) |
| 3.5 | GEO: definitieblokken van 2 zinnen op home, producten en FAQ; llms.txt opschonen; consistente merkomschrijving; Wikidata-item overwegen. | Content | S–M | Citaties in AI-overzichten voor "wijnspel" (handmatig checken) |
| 3.6 | Duits (alleen optie B): 4 vergelijkingsartikelen, cadeaupagina, hreflang uitbreiden. | Content | L | DE-klikken > 200/jaar (nu 47) |
| 3.7 | Tweede performance-ronde: ongebruikte builder-CSS/JS verwijderen, mediagewicht (home 9,4 MB) halveren. | Dev | L | Paginagewicht < 3 MB; LCP < 2,0 s |

## Fase 4 — Autoriteit (maanden 7–12, april – september 2027)

| # | Actie | Rol | Inspanning | Meetpunt |
|---|---|---|---|---|
| 4.1 | Thought leadership: oprichtersverhaal, "hoe wij wijnen selecteren", jaarlijkse "wijnspel-trends", gastbijdragen in Vlaamse media. | Content/Eigenaar | L | ≥ 5 persvermeldingen |
| 4.2 | Pijlers 4–5 en seizoenspagina's compleet; wijnkiezer met resultaatpagina's. | Content | M | Pijlers in top 10 voor hun hoofdterm |
| 4.3 | Geavanceerd schema: ProductGroup voor edities/varianten, ItemList op cadeaugidsen, Event-schema voor proeverijen op locatie. | Dev | M | Rich results zonder fouten |
| 4.4 | Kerstvoorbereiding 2027: alle cadeau- en zakelijke pagina's bijgewerkt vóór 1 oktober; kerst-landingspagina blijft dezelfde URL. | Content | M | Kerstpiek ≥ +40% klikken t.o.v. december 2025 |
| 4.5 | Maandelijkse cyclus: GSC-review (striking distance pos 4–20), drift-vergelijking, CWV-check, 3 contentstukken per maand. | Eigenaar | S/maand | KPI-tabel in SEO-STRATEGY.md gehaald |

## Afhankelijkheden en middelen

- **Toegang:** hosting/nginx, WordPress-admin, Yoast, WooCommerce, Trustpilot, GSC/GA4-eigenaar, Merchant Center.
- **Mensen:** 1 developer (±8 dagen in fase 1–2, daarna 2 dagen/maand), 1 contentmaker (±4 dagen/maand), eigenaar voor beslissingen en outreach (±1 dag/maand).
- **Tools (gratis):** GSC, GA4, Bing Webmaster Tools, Rich Results Test, PageSpeed API-sleutel; optioneel Moz-sleutel (gratis tier) voor backlinks.
- **Volgorde:** 1.1 en 1.2 kunnen parallel; 1.4 vóór 1.5; 1.6 vóór 2.2; 2.3 vóór 10 november; 3.1 na 2.4.

## Risicobeheersing

| Risico | Mitigatie |
|---|---|
| Rankingverlies door URL-hernoemingen | Slugs behouden waar ze ranken; alleen titels/H1 wijzigen; 301's testen op staging; niet tijdens de piek |
| Caching breekt winkelmand/A/B-test | Cookie-uitzonderingen; staging-test; A/B-tool tijdelijk uit tijdens meting |
| Duitse sectie kost tijd zonder omzet | Optie A tenzij verzending/klantenservice DE geregeld is |
| Contentcapaciteit te laag | Prioriteit strikt volgens kalender: cadeau en vergelijkingen eerst, pijlers later |
| Merkverkeer verhult stagnatie | KPI's splitsen in merk/niet-merk; niet-merk is de stuurvariabele |
