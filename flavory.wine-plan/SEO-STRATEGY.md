# SEO-strategie flavory.wine (oktober 2026 – september 2027)

Bronnen: SEO-audit van 16 september 2026 (`../flavory.wine-audit/`), Search Console-export van 12 maanden (`data/gsc-export/`, analyse in `data/gsc-analysis.md`), concurrentieanalyse (`COMPETITOR-ANALYSIS.md`). Bijlagen: `SITE-STRUCTURE.md`, `CONTENT-CALENDAR.md`, `IMPLEMENTATION-ROADMAP.md`.

---

## 1. Discovery

### Bedrijf en doelgroep
Flavory is een Belgisch D2C-merk dat "wijnspellen" verkoopt: boxen met twee wijnen die je blind tegen elkaar proeft (Merlot of Cabernet Sauvignon, Chardonnay of Sauvignon Blanc, Cava of Prosecco, Italië of Spanje), €24,90 tot €64,90, met een premium-editie en een business pack. Daarnaast B2B-relatiegeschenken en proeverijen op locatie. Verkoop via de eigen webshop, bol.com en vijf fysieke verkooppunten. Trustpilot 4,5 op 31 reviews, "+5000 tevreden klanten".

Doelgroepen (persona's uit de audit): de gastheer/gastvrouw die een wijnavond met vrienden plant (best bediend vandaag, 81/100 op de homepage), de cadeaukoper (58/100), de HR- of officemanager die 20+ eindejaarsgeschenken zoekt (zwak: prijs verborgen achter een formulier) en de nieuwsgierige beginner die wijn wil leren proeven (geen instappagina).

### Huidige situatie in cijfers (Search Console, 14 sep 2025 – 16 sep 2026)

| Meting | Waarde |
|---|---|
| Klikken / vertoningen | 5.335 / 55.402 |
| Merk vs niet-merk (query-export) | 3.029 merkklikken (88%) vs 428 niet-merkklikken op 20.411 vertoningen |
| Apparaten | Mobiel 3.994 klikken (positie 8,6), desktop 1.300 (positie 23,6) |
| Landen | België 2.873 klikken (54%), Nederland 2.279 (43%), Duitsland 47 op 4.208 vertoningen |
| Seizoen | December 1.747 klikken (33% van het jaar), november 715; zomer ±160 per maand |
| Pagina's | Home 3.188 + /shop/ 1.466 = 84% van de klikken |
| Verkeer op URL's die nu naar de homepage doorsturen | 442 klikken, 38.717 vertoningen |
| Rich results | Productfragmenten 89 klikken / 6.646 vertoningen; verkopersvermeldingen 6 vertoningen |
| Technisch (audit) | Health score 37/100; TTFB 3,4–7,3 s; LCP mobiel home 5,0 s; geen Product-schema; geen hreflang; ±40% van de URL's test/duplicaat |

Trend: klikken per maand in juni–augustus 2026 (157–174) liggen op of onder het niveau van september 2025 (159). Buiten de kerstpiek groeit het organische verkeer niet.

### De kern van het probleem
Flavory rankt uitstekend op zijn merknaam en op "wijnspel" (positie 2,5, 178 klikken) maar is onzichtbaar voor de termen waarmee de markt zoekt:

| Thema | Zoekopdrachten | Vertoningen | Klikken | Typische positie |
|---|---|---|---|---|
| wijnspel / spel | 67 | 3.765 | 365 | 1–5 |
| wijnproeverij thuis / pakket / box | 176 | 6.241 | 104 | 20–60 |
| druivenvergelijking (merlot vs cabernet, chardonnay vs sauvignon, cava vs prosecco) | 235 | 5.863 | 11 | 9–27 |
| cadeau (wijncadeau, cadeau voor wijnkenner) | 58 | 1.925 | 7 | 13–19 |
| online wijnproeverij | 10 | 1.549 | 0 | 47–76 |
| teambuilding / zakelijk | 9 | 18 | 0 | — |

De vergelijkingsvragen landen op productpagina's (verkeerd paginatype voor een informatieve vraag), de proeverij-thuis-termen op de homepage die "wijnspel" als hoofdterm voert, en de cadeautermen op een blogpost op positie 22.

### Doelen
1. Niet-merkverkeer verviervoudigen binnen 12 maanden (van ±430 naar ±1.700 klikken per jaar) zonder merkverkeer te verliezen.
2. Kerstpiek 2026 minstens 20% boven december 2025, kerstpiek 2027 minstens 40%.
3. Productpagina's met sterren en prijs in de zoekresultaten en zichtbaar in Google Shopping (gratis vermeldingen).
4. B2B-aanvragen via organisch zoekverkeer meetbaar maken (nu 0 klikken op zakelijke termen).

### Budget en tijdlijn
Aanname: geen extern SEO-bureau; 1 developer (±8 dagen in fase 1–2, daarna 2 dagen/maand), 1 contentmaker (±4 dagen/maand), eigenaar ±1 dag/maand. Alle tools gratis (GSC, GA4, Bing Webmaster Tools, Rich Results Test, PageSpeed-API-sleutel); optioneel een Moz-sleutel voor backlinks.

---

## 2. Concurrentiepositie (samenvatting van COMPETITOR-ANALYSIS.md)

| Concurrent | Land | Aanbod | Wat ze beter doen | Zwakte |
|---|---|---|---|---|
| Wijnproeverijbox.nl | NL | Boxen €79,50–€299, 309 URL's, stadspagina's | Volledig Product/Offer/AggregateRating-schema, Kiyoh 9,7, lange gidsen | Duur, geen spelconcept, NL-gericht |
| Wine Point | BE | Sommelier aan huis + geschenkboxen | Rankt in BE voor "wijnproeverij thuis", 17 blogs, Google 4,9 | Dienst, geen product voor thuis zonder sommelier |
| Wine & Dice | NL | "Het Wijnproefspel" €19,95, 1 fles + app | Conceptueel het dichtst bij Flavory, lagere prijs | Dunne site, weinig content |
| Wijnbrigade | BE | Kennisspel "Verwijn Jezelf" €30, geen wijn | Belgisch, spelformaat | Uitverkocht, geen wijn in de box |
| Proef.nl | NL | 4 geblindeerde flessen, vanaf 20 kisten | Blind proeven als concept | Geen prijzen, schema of reviews online |

Marktobservaties: mysterytasting.com (Belgische online teambuilding) is verlopen, wat ruimte laat voor "teambuilding wijnproeverij" in België. Concurrenten laden in 0,2–1,5 s tegenover 3,4–7,3 s bij Flavory. Niemand combineert spel + twee wijnen in duel + Belgisch merk + instapprijs van €24,90.

### Positionering
"Het wijnspel voor thuis: twee wijnen, blind geproefd, wie raadt het juist?" Flavory positioneert zich als de speelse, betaalbare instap in wijnproeven voor vrienden en als origineel cadeau, met drie bewijsankers: Belgisch merk, geen voorkennis nodig, 100% geld-terug-garantie. In zoektermen: "wijnproeverij thuis" als categorieterm, "wijnspel" als merkterm, "wijnbox cadeau" als cadeauterm, "X of Y: wat is het verschil?" als kennisterm.

---

## 3. Architectuur (samenvatting van SITE-STRUCTURE.md)

- Van 209 gecrawlde URL's naar ±75 Nederlandstalige en ±20 Duitstalige pagina's, elk met één intentie.
- Navigatie: Shop · Hoe werkt het · Cadeau · Zakelijk · Blog.
- Nieuwe hubs: `/cadeau/` (wijncadeau, kerst, valentijn, moederdag, vaderdag als evergreen URL's), `/zakelijk/` (relatiegeschenken met staffelprijzen, eindejaarsgeschenken, teambuilding-wijnproeverij), `/reviews/`, `/verkooppunten/`, `/verzending-en-retour/`.
- Blog met vijf pijlers: wijnproeverij thuis organiseren, wijn leren proeven, druiven en stijlen, welke wijn bij welk gerecht, wijn cadeau geven.
- Redirect-map voor de 26 legacy-URL's die 442 klikken per jaar naar de homepage laten weglekken; de belangrijkste (`/shop/legendarische-wijnlanden-rood/`, 7.268 vertoningen op positie 4,3) gaat naar de Italië-of-Spanje-box.
- Duitse sectie: optie A (bevriezen en opschonen) tenzij verzending en klantenservice voor DE/AT/CH geregeld zijn; Engelse pagina's noindex.

---

## 4. Contentstrategie (samenvatting van CONTENT-CALENDAR.md)

Volgorde van prioriteit, afgeleid van vertoningen zonder klikken:

1. **Vergelijkingsartikelen** (oktober–januari): "Merlot of Cabernet Sauvignon: wat is het verschil?", "Chardonnay of Sauvignon Blanc", "Cava of Prosecco", "Italiaanse of Spaanse rode wijn". Samen 5.863 vertoningen per jaar op posities 9–27 met 11 klikken. Formaat: antwoord in 2 zinnen, vergelijkingstabel, proeftips, link naar de box. Duitse varianten alleen bij optie B (1.848 vertoningen).
2. **Productpagina's herschrijven** (oktober): titels en H1's met "wijnproeverij thuis" en "wijnbox", inhoud van de box, aantal personen, verzending BE/NL, levertijd, reviews op de pagina.
3. **Cadeau-hub vóór 10 november**: /cadeau/wijncadeau/ (wijncadeau 333 vertoningen, cadeau voor wijnkenner 286, origineel wijncadeau 158), evergreen kerstpagina die 10 kannibaliserende varianten vervangt, cadeaugids in listicle-formaat (SERP voor "origineel cadeau wijnliefhebber" bestaat volledig uit listicles).
4. **Zakelijk**: relatiegeschenkenpagina met staffelprijzen (concurrenten tonen "vanaf 10 stuks"), teambuilding-pagina met groepsgrootte en prijs per persoon.
5. **Pijlers** (januari–april): wijnproeverij thuis organiseren (wijnproeverij pakket 508 vertoningen, online wijnproeverij 525, wijn proeven 411), wijn leren proeven, druiven en stijlen.
6. **Ontdubbelen**: twee herpubliceerde postparen samenvoegen, valentijn-horoscopen samenvoegen, `-dupliceren` verwijderen.

Cadans: 2 stukken per maand tot januari, daarna 3. Publicatievenster voor structuurwijzigingen sluit op 15 november en opent op 5 januari.

### E-E-A-T
- Auteurspagina voor oprichter Bart met foto, bio, selectiemethode van de wijnen; Person-schema met echte URL (nu "#").
- Over-pagina met adres (Bazel), BTW-nummer, oprichtingsjaar 2017, verkooppunten, pers.
- Reviews van Trustpilot op de site met Review-schema; Organization met AggregateRating.
- Privacybeleid herstellen (nu redirect naar de homepage terwijl de checkout ernaar verwijst).

---

## 5. Technische basis

| Onderwerp | Nu | Doel | Actie |
|---|---|---|---|
| TTFB | 3,4–7,3 s | < 0,8 s | Full-page cache met cookie-uitzonderingen alleen op winkelmand/afrekenen/account; `Cache-Control`/`Expires` corrigeren; OPcache; CDN |
| LCP mobiel (home) | 5,0 s | < 2,5 s (fase 1), < 2,0 s (fase 3) | Volgt uit TTFB; daarna builder-CSS/JS en mediagewicht (9,4 MB) |
| INP-proxy (TBT) | 433–683 ms | < 200 ms | Third-party scripts uitstellen (Meta Pixel, Clarity, A/B-tool) |
| CLS | 0,00 | behouden | 139 afbeeldingen dimensies geven |
| Product-schema | afwezig | Product + Offer + AggregateRating + gtin13 + shippingDetails + returnPolicy | WooCommerce core of Yoast WooCommerce SEO; JSON-LD in de audit |
| Organization-schema | naam, logo, Instagram | adres, BTW, contactPoint, founder, sameAs LinkedIn/Trustpilot | Yoast-instellingen + template |
| hreflang | afwezig | NL/DE-paren + x-default | Meertaligheidsplugin of Yoast-sitemap |
| 404-afhandeling | 301 naar home | echte 404 | Redirectregel verwijderen; 26 legacy-URL's gericht doorsturen |
| Index | ±209 URL's | ±95 | Testpagina's, kopieën en CPT-parameterpagina's verwijderen of noindex |
| Beveiligingsheaders | geen | HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP | nginx |
| Mobiel | add-to-cart onder de vouw, overlappende aankondigingsbalk, grote header | sticky add-to-cart, bug gefixt, compacte header | Theme |
| Merchant Center | 6 vertoningen | gratis productvermeldingen actief | Feed + verzend-/retourpagina |
| AI-vindbaarheid | homepage-definitie niet extraheerbaar; llms.txt met testpagina's | definitieblok van 2 zinnen op home/product/FAQ; opgeschoonde llms.txt | Content |

---

## 6. Roadmap (samenvatting van IMPLEMENTATION-ROADMAP.md)

- **Fase 1 Fundament (oktober 2026):** caching, Product-schema, 404 en redirect-map, 287 interne links, opschoning van 120 naar ±76 sitemap-URL's, beveiligingsheaders, GSC/GA4-koppeling, beslissing over DE.
- **Fase 2 Uitbreiding (november–december 2026):** titels/meta/H1 herschrijven, hreflang, cadeau-hub en business-pagina vóór 10 november, eerste drie vergelijkingsartikelen, Organization-schema, mobiele fixes, reviewspagina.
- **Fase 3 Schalen (januari–maart 2027):** pijlers 1–3, ontdubbelen, linkbuilding ronde 1 (verkooppunten, cadeaugidsen, teambuilding-directories, Vlaamse blogs, pers), Merchant Center, GEO-definitieblokken, tweede performance-ronde.
- **Fase 4 Autoriteit (april–september 2027):** oprichtersverhaal en pers, pijlers 4–5, seizoenspagina's compleet, ProductGroup/ItemList/Event-schema, kerstvoorbereiding 2027 vóór 1 oktober, maandelijkse cyclus.

---

## 7. KPI-doelen

Baseline = 12 maanden tot 16 september 2026. Niet-merkklikken zijn de stuurvariabele; merkklikken worden apart gerapporteerd.

| Meting | Baseline | 3 maanden (eind dec 2026) | 6 maanden (eind mrt 2027) | 12 maanden (eind sep 2027) |
|---|---|---|---|---|
| Organische klikken (voortschrijdend 12 mnd) | 5.335 | 5.700 | 6.300 | 8.000 |
| Klikken december | 1.747 (dec 2025) | ≥ 2.100 | — | ≥ 2.450 (dec 2027, buiten venster: doel) |
| Niet-merkklikken per maand | ±36 | 80 | 150 | 200 (±1.700 per jaar) |
| Niet-merkvertoningen per maand | ±1.700 | 2.500 | 4.000 | 6.000 |
| Zoekwoorden in top 10 (van 25 doeltermen) | 4 (wijnspel, wijn spel, wijnproeverij spel, wijnkiezer) | 9 | 14 | 20 |
| "wijnproeverij thuis" positie | 30 | 15 | 8 | 5 |
| "verschil merlot en cabernet sauvignon" positie | 10 | 5 | 3 | 3 |
| "wijncadeau" / "cadeau voor wijnkenner" positie | 19 / 14 | 12 / 10 | 8 / 6 | 5 / 5 |
| Verwijzende domeinen | onbekend (niet in Common Crawl) | meetbaar (Moz-sleutel) + 5 | + 15 | + 40 |
| Geïndexeerde URL's (GSC) | ±209 crawlbaar | ±95 | ±100 | ±120 |
| LCP mobiel home / TTFB | 5,0 s / 4,7 s | < 2,5 s / < 0,8 s | < 2,5 s | < 2,0 s |
| Productfragmenten (klikken / vertoningen per 12 mnd) | 89 / 6.646 | sterren zichtbaar op 4 producten | 250 / 12.000 | 500 / 20.000 |
| Verkopersvermeldingen (Shopping) | 6 vertoningen | feed actief | 1.000 vertoningen | 5.000 vertoningen |
| Organische B2B-aanvragen | 0 gemeten | tracking actief | 5 per kwartaal | 20 per kwartaal |
| Duitsland klikken (bij optie B) | 47 | 47 | 100 | 200 |

---

## 8. Succescriteria, afhankelijkheden en risico's

**Per fase geslaagd als:** fase 1: TTFB onder 0,8 s, Rich Results Test groen op producten, geen interne links naar redirects, sitemap ±76 URL's; fase 2: cadeau-hub en business-pagina live vóór 10 november, december ≥ 2.100 klikken; fase 3: 3 vergelijkingsartikelen in top 5, 15 nieuwe verwijzende domeinen, Shopping-vermeldingen actief; fase 4: 20 doeltermen in top 10, niet-merk 200 klikken per maand.

**Afhankelijkheden:** hostingtoegang (nginx, PHP), WordPress/Yoast/WooCommerce-beheer, Trustpilot-koppeling, Merchant Center-account, GSC/GA4-eigenaar, contentcapaciteit van Bart of een copywriter met wijnkennis.

**Risico's en mitigatie:** rankingverlies bij URL-hernoemingen (slugs behouden waar ze ranken, alleen titels wijzigen, geen wijzigingen tussen 15 november en 5 januari); caching die de winkelmand of A/B-tool breekt (staging, cookie-uitzonderingen); Duitse sectie die capaciteit opslokt (optie A); merkverkeer dat stagnatie verhult (KPI's gesplitst); afhankelijkheid van december (cadeau-hub evergreen maken en moederdag/vaderdag/valentijn uitbouwen om de piek te spreiden).

**Wat niet in dit plan zit:** betaalde advertenties, bol.com-optimalisatie (wel als kanaal erkend), e-mailmarketing. Zoekvolumes zijn afgeleid uit eigen vertoningen in Search Console, niet uit een keyword-tool; ze onderschatten de totale marktvraag maar zijn wel de vraag waarvoor Flavory al wordt getoond.
