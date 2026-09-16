# Concurrentieanalyse – flavory.wine

Datum: 16 september 2026. Onderdeel van het strategisch SEO-plan voor Flavory (Belgisch D2C-merk, wijnspel / wijnproeverij-thuis boxen, €24,90–€64,90, markt Vlaanderen + Nederland).

Methode: 12 Nederlandstalige webzoekopdrachten (SERP-controle), 12 paginafetches en directe HTML-/sitemap-analyse met curl (platform, JSON-LD, hreflang, TTFB, aantal URL's in sitemaps). Alle cijfers zijn wat op de betreffende pagina's zichtbaar was op 16-09-2026; schattingen zijn expliciet als **(schatting)** gemarkeerd.

---

## Samenvatting

- **Vijf directe concurrenten geselecteerd**: Wijnbrigade (BE, wijnspel), Wine Point (BE, wijnproeverij aan huis + geschenkboxen), Wijnproeverijbox.nl (NL, marktleider in "wijnproeverij thuis"-boxen), Wine & Dice (NL, "Het Wijnproefspel", conceptueel de dichtste rivaal) en Proef.nl (NL, blind-proefpakketten, B2B-focus). bol.com is geen concurrent maar een kanaal (Flavory verkoopt er zelf; ook Amazon.com.be, Mondovino.be en exclusivebusinessgifts.com verkopen Flavory).
- **Mystery Tasting valt weg**: mysterytasting.com toont op 16-09-2026 een Namecheap-pagina "Domain registration has expired". Aprobar.be was niet bereikbaar. In het Belgische segment "online wijnproeverij / teambuilding" ontstaat daardoor ruimte.
- **Niemand combineert wat Flavory doet**: twee wijnen blind tegen elkaar in duel-formaat, met spelmechaniek, in één box, vanaf €24,90. Wijnbrigade verkoopt een kennisspel zonder wijn (€30, uitverkocht), Wine & Dice één fles + app (€19,95), Wijnproeverijbox.nl 3–6 flessen zonder spel (€79,50–€299), Proef.nl 4 geblindeerde flessen vanaf 20 kisten.
- **Belangrijkste SEO-achterstanden van Flavory t.o.v. de concurrentie**: (1) geen Product/Offer/AggregateRating JSON-LD op productpagina's (Wijnproeverijbox.nl en Wine & Dice hebben dat wel); (2) zeer trage server (TTFB 4,3–9,3 s gemeten op de homepage; concurrenten 0,2–1,5 s); (3) geen aparte landings- of gidspagina's voor "wijnproeverij thuis", "wijnproeverij pakket", "teambuilding" en "cadeaugids" (Wijnproeverijbox.nl heeft een stappenplan van ±2.000 woorden, 11 stadspagina's en een cadeaupagina); (4) geen vergelijkingsartikelen voor de zoekvragen die letterlijk overeenkomen met de boxen (Gall & Gall, Voordeelwijnen en Flesjewijn bezetten "merlot vs cabernet" en "chardonnay vs sauvignon blanc").
- **Sterke punten van Flavory die te weinig zichtbaar zijn in de SERP**: Trustpilot 4,5/5 met 31 reviews (81 % vijf sterren), FAQPage-schema met 16 vragen, 28 Nederlandstalige blogposts, drietalige site (nl/en/de), B2B-pagina eindejaarsgeschenken, aanwezigheid op bol.com BE/NL en Amazon.be.

---

## Concurrentenoverzicht

| Concurrent | Land | Aanbod | Prijs | Platform | Schema (JSON-LD) | Reviews | Blog | Geschatte autoriteit* |
|---|---|---|---|---|---|---|---|---|
| **Wijnbrigade** (wijnbrigade.be) | BE | Kennisspel "Verwijn Jezelf" (zonder wijn), wijntastings aan huis / teambuilding, cadeaubon | €30,00 (spel; uitverkocht op 16-09) | WordPress + WooCommerce + Elementor | Organization, WebSite, BreadcrumbList; op productpagina UnitPriceSpecification + AggregateRating (5,0; 1 review) | 8+ testimonials op site; geen extern platform | Geen | Laag: 16 URL's in sitemap; pers: De Tijd (sommelier Margaux Balemans) |
| **Wine Point** (wine-point.be) | BE | Wijnproeverij aan huis / op locatie / bedrijven door sommelier Jan Kerckhofs; webshop Zuid-Afrikaanse wijn; geschenkboxen; cadeaubon | Proeverij: op offerte ("voor ieders budget"); geschenkbox Graham Beck (prijs niet uitgelezen) | WordPress + WooCommerce + Elementor + Yoast | Organization, WebSite, WebPage, BreadcrumbList; geen Product/Offer op productpagina (alleen UnitPriceSpecification) | Google 4,9/5 (17 reviews) getoond op /wijnproeverij/ | 17 artikelen | Middel: ±240 URL's (202 producten, 22 pagina's, 17 posts); rankt in BE voor "wijnproeverij thuis"/"aan huis" |
| **Wijnproeverijbox.nl** | NL | Wijnreis (6 fl.), Wijntrip (3 fl.), Belevingsboxen, Giftboxen (mini), Portproeverij, proeverij op locatie, cadeaubonnen | Wijnreis €79,50–€89,50; Belevingsbox €64,50–€299; Giftbox €32,50–€35,50; Port €49,50 | Lightspeed (webshopapp) | Organization, WebSite, BreadcrumbList; op productpagina Product + Offer + AggregateRating + 50 Review-objecten | Kiyoh 9,7/10; Webshop Keurmerk | 21 artikelen (recepten, wijntips) + lange gids "wijnproeverij thuis organiseren" | Hoog binnen niche: 309 URL's (247 producten, 11 stadspagina's); nr. 1 voor "wijnproeverij thuis"/"box" in NL-SERP's |
| **Wine & Dice** (wineanddice.nl) | NL | "Het Wijnproefspel": 1 mysteryfles + app-gestuurd spel (rood / wit), duo-pakket, kaartspel, "wijn van de maand"-abonnement, spellenbundel | €19,95 per editie; duo €39,90 | Shopify (headless/JS-front; homepage 5,7 kB HTML) | Product + Offer + Brand + Organization + BreadcrumbList; geen AggregateRating | Reviewpagina op site; geen extern platform gevonden | 1 artikel | Laag: 14 URL's; rankt wel voor "wijnproefspel" (bol-vermelding en De Grote Hamersma-artikel bezetten ook die SERP) |
| **Proef.nl** | NL (Breda) | "Proef 't Zelf": kist met 4 geblindeerde wijnen, 6 proefkaarten, stickers, schenktuiten; Standaard / Exclusief / Gouden pakket; relatiegeschenken | Niet zichtbaar; productpagina toont "Geen producten gevonden"; "Bestellingen vanaf 20 kisten" | WordPress 6.9.4 + WooCommerce 10.7 | Geen JSON-LD; alleen microdata BreadcrumbList | Geen | 26 posts, maar dit zijn wijnbeschrijvingen, geen gidsen | Laag-middel: 34 URL's; rankt hoog voor "wijnproeverij thuis"/"pakket" ondanks dunne site (schatting: oud domein + exact-match merk) |
| *Referentie: Flavory* (flavory.wine) | BE | Wijnspel-boxen rood/wit/bubbels/Italië-Spanje, 2 wijnen blind, 2–6 spelers; B2B eindejaarsgeschenken; proeverij op locatie | €24,90–€64,90 | WordPress + WooCommerce + WPML (nl/en/de) | Organization, WebSite, BreadcrumbList, FAQPage (16 Q&A); **geen Product/Offer/AggregateRating JSON-LD** op productpagina (alleen microdata Rating van WooCommerce-reviews) | Trustpilot 4,5/5, 31 reviews (81 % 5 sterren; laatste 14-04-2026) | 28 NL-artikelen | Middel: ±100 NL-URL's; TTFB 4,3–9,3 s (traag) |

\* Autoriteit is een **schatting** op basis van sitemap-omvang, SERP-posities in de 12 uitgevoerde zoekopdrachten en zichtbare pers/reviews. Er is geen backlink- of Domain-Rating-data opgevraagd (Ahrefs/DataForSEO niet beschikbaar in deze sessie).

Secundaire spelers (niet in detail geanalyseerd): La Bodega'87 (NL, Shopify, wijnproeverijboxen €45–€90, 1 blogpost), Wijn Wine Wein (NL, 9 proefpakketten incl. "Blinde wijnproeverij + quiz", online proeverij, cadeaugids "25x"), Smaakvermaak (NL, wijnspel als live-event met wijndocent), Unlock the Bottle (NL, wijn-escape game), Pandora's Bottle en Wijnbeurs (NL, blindproefboxen), Gall & Gall en Flesjewijn.com (NL, vergelijkingsartikelen), WHOOwine.be en Wijntjes met Esther (cadeaulijstjes), meug.be (BE, online teambuilding tasting).

---

## Per concurrent

### 1. Wijnbrigade (wijnbrigade.be) – België

**Wat ze doen**: kennisspel "Verwijn Jezelf" (memory-kaarten over druivenrassen, regio's, terminologie; solo of in groep) voor €30, plus wijntastings aan huis voor verjaardagen, vrijgezellen en teambuilding. Oprichters Jolein Van Eyck en Margaux Balemans; Margaux won in 2024 de Young Sommelier Award of Excellence en werd in 2023 tweede in "Beste Sommelier van België" (bron: https://wijnbrigade.be/over-ons/, met link naar tijd.be-artikel).

**Sterktes**
- Sterk persoonlijk E-E-A-T-verhaal (jonge topsommelier, pers in De Tijd, 8+ testimonials op de homepage).
- Snelle site (TTFB 0,2–0,4 s), productpagina met AggregateRating-markup.
- Bezet de Belgische SERP voor "wijnspel" met een exacte productnaam.

**Zwaktes**
- Geen wijn in de box: het is een kennisspel, geen proeverij. Product was uitverkocht op 16-09-2026 (https://wijnbrigade.be/product/verwijn-jezelf/).
- Slechts 16 URL's, geen blog, geen FAQ, geen prijzen voor tastings; hreflang-tags "nl" en "nl-NL" wijzen naar dezelfde pagina (nutteloos).
- Slechts 1 review in de schema-markup; geen extern reviewplatform.

### 2. Wine Point by Jan Kerckhofs (wine-point.be) – België

**Wat ze doen**: sommelier-aan-huis in Vlaanderen (ideale groep 8–12 personen, dinsdag/woensdag/zaterdagnamiddag), bedrijfsproeverijen, webshop met 202 Zuid-Afrikaanse wijnen, geschenkboxen (o.a. Graham Beck met chocolade) en cadeaubonnen (bron: https://wine-point.be/wijnproeverij/).

**Sterktes**
- Rankt in België voor "wijnproeverij thuis" en "wijnproeverij aan huis" met meerdere pagina's (servicepagina + 3 blogartikelen in top-10 van de uitgevoerde zoekopdracht).
- 17 blogartikelen die precies de informatieve intenties afdekken die Flavory mist: "wijn-geschenkpakketten: gids", "hoe zelf thuis de perfecte wijnproeverij organiseren", "5 tips & tricks voor beginners".
- FAQ-sectie op de servicepagina, Google-score 4,9/5 (17 reviews) getoond, wedstrijd (win een proeverij voor 10) als leadmagnet.

**Zwaktes**
- Geen box-product: klant moet een sommelier boeken; geen prijs online (offerte). Dit is een dienst, geen D2C-product, dus geen concurrent op bol.com of voor "cadeau onder €50".
- Geen Product/Offer-schema op productpagina's, geen hreflang, TTFB 1,5–3,8 s.
- Blog is Zuid-Afrika-gericht; geen vergelijkingscontent per druif.

### 3. Wijnproeverijbox.nl – Nederland

**Wat ze doen**: de meest complete box-webshop in de Benelux-niche: Wijnreis (6 flessen, tot 10 personen, instructiegids, 10 proefformulieren, placemats, QR-codes), Wijntrip (3 flessen), mini-Giftboxen (375 ml), thema's per land/seizoen/kleur, alcoholvrij, Grand Cru (€299), plus proeverij op locatie en high wine (bron: https://www.wijnproeverijbox.nl/boxen/ en /belevingsboxen/).

**Sterktes**
- Autoriteit in de niche: 309 URL's, Kiyoh 9,7/10, Webshop Keurmerk, levering 1–2 dagen.
- Volledige schema-implementatie op productniveau: Product + Offer + AggregateRating + 50 Review-objecten (https://www.wijnproeverijbox.nl/wereldreis.html) – dit levert sterren in de SERP op.
- Contentarchitectuur die Flavory ontbeert: cadeau-servicepagina (/service/een-wijnproeverij-cadeau-geven/), stappenplan van ±2.000 woorden met 6 stappen en pairing-tabellen (/service/wijnproeverij-thuis-organiseren/), 11 stadspagina's (Amsterdam, Rotterdam, Utrecht … ), gratis receptenboek als leadmagnet, 21 blogartikelen.

**Zwaktes**
- Geen spelelement en geen blind-proefconcept (blind proeven wordt alleen genoemd als tip: "aluminiumfolie om de flessen").
- Hoog instapniveau (€79,50 voor een 6-flessenbox) en 750 ml-flessen: minder geschikt voor 2 personen of als cadeau onder €40 (behalve Giftbox €32,50).
- Geen hreflang, geen expliciete info over verzending naar België op de bekeken pagina's, geen FAQPage-schema, blog is generiek (asperges, rosé, port) en niet gericht op druiven-vergelijkingen.

### 4. Wine & Dice – Het Wijnproefspel (wineanddice.nl) – Nederland

**Wat ze doen**: conceptueel de dichtste concurrent. Eén mysteryfles (750 ml) per editie (rood of wit), interactieve vragen en opdrachten via een web-app (proefspel.wineanddice.nl), 2–6 spelers, ±45 minuten, "geen wijnkennis nodig". Prijs €19,95 per editie, duo €39,90. Daarnaast een kaartspel, een abonnement "Proef & Raad wijn van de maand" en een spellenbundel; B2B- en retailkorting aangeboden (bron: https://wineanddice.nl/proefspel).

**Sterktes**
- Lagere prijs dan Flavory (€19,95) en digitale spelervaring die eenvoudig te vernieuwen is.
- Product + Offer + Brand JSON-LD op productpagina's; snelle site (TTFB ±0,3 s).
- Rankt voor "wijnproefspel" (naast bol.com en een artikel van De Grote Hamersma) en voor "wijnspel wijnproeverij thuis".

**Zwaktes**
- Slechts één wijn per box: geen vergelijking/duel, dus geen leermoment "verschil tussen X en Y".
- Zeer dunne site (14 URL's, 1 blogpost), homepage is vrijwel leeg in de HTML (JS-gerenderd, 5,7 kB) – risico voor indexatie van content; geen AggregateRating, geen extern reviewplatform, geen hreflang, geen info over levering naar België.
- Geen cadeau- of teambuildingpagina.

### 5. Proef.nl – "Proef 't Zelf" – Nederland (Breda)

**Wat ze doen**: kist met 4 geblindeerde wijnen van kleinere wijnboeren, 6 proefkaarten, luxe stickers voor de hoezen en schenktuiten; varianten Standaard, Exclusief (luxe cadeaukist) en Gouden (gouden hoezen). Samenwerking van wijndocent Gill Smit en Jan Versluys. "Bestellingen vanaf 20 kisten" – de facto B2B/relatiegeschenk-aanbieder (bron: https://proef.nl/ en https://proef.nl/producten/).

**Sterktes**
- Exact-match domein en merknaam; rankt in de top voor "wijnproeverij thuis" en "wijnproeverij pakket thuis … blind proeven" ondanks een kleine site.
- Blind proeven is de kern van het concept (hoezen), inclusief unboxing- en sfeervideo's.

**Zwaktes**
- Geen prijzen online, productoverzicht toont "Geen producten gevonden" (16-09-2026): de shop is feitelijk niet transactioneel voor consumenten.
- Geen JSON-LD, geen reviews, geen FAQ, geen cadeaugids; de 26 "posts" zijn wijnbeschrijvingen (Chablis, Rioja …), geen SEO-content.
- Geen spelelement, geen vergelijking tussen twee stijlen.

---

## Zoekwoordgaten

Gebaseerd op de 12 uitgevoerde SERP-controles (Nederlandstalig, zonder geo-targeting; posities zijn indicatief). "Flavory" vermeldt of een Flavory-URL in de top-10 van dezelfde zoekopdracht verscheen.

| Zoekwoord(cluster) | Wie rankt (bewijs) | Paginatype | Kans voor Flavory |
|---|---|---|---|
| wijnproeverij thuis / wijnproeverij thuis box | Wijnproeverijbox.nl (home + /boxen/), Proef.nl, wine-point.be (BE, servicepagina + blogs), La Bodega'87 (collectie), Welkomaantafel | Homepage / categorie / servicepagina | Flavory heeft alleen een blogpost (/blog/wijnproeverij-thuis-flavory/) en /proeverij/. Maak een transactionele landingspagina "Wijnproeverij thuis" met alle boxen, prijzen, "hoe werkt het" en reviews. Hoog. |
| wijnproeverij pakket (thuis) | Wijn Wine Wein (categorie met 9 pakketten), Proef.nl, Wijnbeurs, Pandora's Bottle | Categoriepagina | Flavory niet gezien. Categorie-/verzamelpagina "Wijnproeverij pakketten" (synoniemenvariant van de landingspagina, of H2-sectie). Middel-hoog. |
| wijnbox proeverij / wijnproeverij box cadeau | Gall & Gall (/wijnbox/), Wijnproeverijbox.nl, WIJNDeal, Wijnbutler, Mannenbox (high wine) | Categorie + cadeaupagina | Flavory niet gezien. Cadeaupagina "Wijnproeverij cadeau geven" (Wijnproeverijbox.nl heeft exact deze servicepagina). Hoog. |
| blind proeven / blinde wijnproeverij pakket | Wijnbeurs (gids + pakket), Pandora's Bottle (box), Wijn Wine Wein (blind + quiz) | Gids + productpagina | Flavory heeft /blog/blind-wijn-proeven/; koppel dit aan producten en breid uit tot "Blind wijn proeven: zo doe je het thuis (+ spel)". Middel. |
| wijnproefspel / wijn proef spel | Wine & Dice, bol.com ("Wijn proef spel"), De Grote Hamersma (artikel), PartySpellen.nl | Product + artikel | Flavory rankt (home, /shop/legendarische-wijnlanden-rood/, /shop/bubbelbox/). Versterken met Product-schema en een vergelijkend artikel "Het beste wijnproefspel voor thuis (2026)". Behouden/uitbouwen. |
| wijnspel / wijnspel bordspel | Wijnbrigade (BE), Smaakvermaak, dewijnboetiek.nl, Flavory (bol + eigen site) | Productpagina | Flavory rankt. Kans: "wijnspel bordspel"-variant expliciet in titel/H1 van de rode/witte box; bol-listing gebruikt al "Bordspel & gezelschapsspel". Behouden. |
| cadeau voor wijnliefhebber / wijnkenner / origineel wijncadeau | delicious.magazine (8x), Wijntjes met Esther (17x), WHOOwine.be (35x), Cadeaufans (35x), Wijn Wine Wein (25x), Cadeauloos (21x) | Listicle / cadeaugids | Flavory-blog "Origineel wijncadeau: geef iets dat écht bijblijft" stond in top-10. Format van de winnaars is een genummerde lijst; bouw een gids "25 cadeaus voor wijnliefhebbers" met eigen boxen bovenaan + prijsfilters. Hoog. |
| verschil merlot en cabernet sauvignon | Voordeelwijnen, Gall & Gall (/ontdek/wijn/cabernet-sauvignon-vs-merlot/), Abels Wijnen, Luxury Grapes, Wijnbroeders, The Wine Box, Allewijnen | Blog / kennisartikel | Flavory niet gezien, terwijl de rode box exact dit duel is. Schrijf "Merlot vs Cabernet Sauvignon: proef het verschil (+ spel)" met interne link naar de box. Zeer hoog (transactionele koppeling uniek). |
| sauvignon blanc of chardonnay (verschil) | Gall & Gall, DrankDozijn, Flesjewijn.com (collectiepagina), WijnReis, Budgetwijnen, Wijn en Druif, BergoVino | Blog / collectie | Flavory heeft /blog/wijnproeverij-date-night-chardonnay-of-sauvignon-blanc/ (niet in top-10 gezien). Herschrijf naar een neutrale vergelijkingsgids met tabel en koppel aan witte box. Hoog. |
| cava of prosecco (verschil) | cava.wine (EN), VinePair (EN), Grandcruwijnen (EN-versie), Tasting Table | Blog | Nederlandstalige SERP werd gedomineerd door Engelstalige bronnen: weinig sterke NL-content. Gids "Cava of prosecco: wat is het verschil?" gekoppeld aan de Bubbelbox. Zeer hoog (lage NL-concurrentie). |
| Italiaanse vs Spaanse wijn | Niet apart gecontroleerd | Blog | Zelfde patroon als hierboven voor de box Italië vs Spanje. Middel (zoekvolume onbekend). |
| online wijnproeverij / wijnproeverij teambuilding / teamuitje | Wijn Wine Wein (online proeverij), wijnproeverij.online (€25,95/€36,95 pakket), proeverij.com (teambuilding wijnwedstrijd), meug.be (BE), theonlinesommelier.nl | Dienstpagina met prijzen | Flavory heeft /eindejaars-en-relatiegeschenken/ maar geen teambuilding-/online-proeverijpagina. Mysterytasting.com is verdwenen (domein verlopen): Belgisch gat. Hoog voor B2B. |
| wijnproeverij thuis organiseren / wijnproeverij spel tips | Wijnproeverijbox.nl (stappenplan), wine-point.be (blog), Wijn Wine Wein ("succes in 5 stappen + spelregels") | Lange gids | Flavory niet gezien. Gids "Wijnproeverij thuis organiseren in 6 stappen" met spelregels als downloadbare PDF. Middel-hoog. |
| wijnproeverij [stad] / wijnproeverij aan huis [stad] | Wijnproeverijbox.nl (11 NL-stadspagina's), wine-point.be (BE, aan huis) | Lokale landingspagina's | Alleen relevant als Flavory proeverijen op locatie actief wil verkopen (Antwerpen, Gent, Leuven, Brussel). Laag-middel; alleen met echt aanbod per stad. |

---

## Contentkansen

Paginatypes die concurrenten hebben en Flavory (nog) niet, in volgorde van verwachte impact:

1. **Vergelijkingscluster per duel** (blog, 4 artikelen): Merlot vs Cabernet Sauvignon; Chardonnay vs Sauvignon Blanc; Cava vs Prosecco; Italië vs Spanje. Elk artikel: smaaktabel, herkomst, "zo proef je het verschil blind", CTA naar de bijbehorende box. Niemand in de niche koppelt deze informatieve vraag aan een product waarmee je het verschil zelf proeft; de huidige ranking-sites zijn generieke wijnwinkels (Gall & Gall, Flesjewijn) of blogs zonder product.
2. **Transactionele landingspagina "Wijnproeverij thuis"** (categorie): overzicht van alle boxen met prijs, aantal spelers, duur, wat zit erin, Trustpilot-widget, FAQ-blok. Dit is de pagina waarmee Wijnproeverijbox.nl en Proef.nl ranken.
3. **Cadeaugids** ("cadeau voor wijnliefhebber", "wijncadeau", "wijnproeverij cadeau geven"): listicle-formaat zoals de winnaars (17x/25x/35x), met prijsklassen (<€30, <€50, <€100), voor koppels/vriendinnen/collega's, en Flavory-boxen als nr. 1–4. Aanvullen met seizoensvarianten (kerst, Valentijn, Vaderdag) die intern naar deze hub linken in plaats van de huidige losse kerstpagina's.
4. **Teambuilding / bedrijfsproeverij-pagina** met prijzen per persoon, formules (op locatie, remote met box per collega, eindejaarsgeschenk), referentielogo's en offerteformulier. Mystery Tasting is verdwenen; proeverij.com en meug.be zijn de enige zichtbare Belgische alternatieven.
5. **"Hoe werkt het"-pagina** (bestaat als /flavory-gameplay/ maar niet als SEO-pagina): stappen, foto's, video, spelregels-PDF, "geen wijnkennis nodig", speelduur, aantal spelers. Wijnproeverijbox.nl en Wine & Dice tonen dit prominent.
6. **Gids "Wijnproeverij thuis organiseren"** (lange vorm, 6 stappen, met pairingtabel en downloadbare proefformulieren) – rechtstreeks antwoord op de gids van Wijnproeverijbox.nl.
7. **Reviewpagina / "ervaringen"** met Trustpilot-integratie en Review-schema; Wijnproeverijbox.nl toont 50 reviews in JSON-LD per product.
8. **Landspecifieke bezoekersinfo NL vs BE**: leverkosten, levertijd (2–4 werkdagen), iDEAL/Bancontact, bol.com-alternatief. Nederlandse concurrenten vermelden België niet; Flavory kan expliciet "levering in België én Nederland" als USP in titels en FAQ opnemen.

Technische randvoorwaarden die uit de vergelijking naar voren komen (voor het technische plan):
- **Product + Offer + AggregateRating JSON-LD** op alle productpagina's (nu alleen microdata Rating; Wijnproeverijbox.nl en Wine & Dice hebben volledige Product-markup).
- **Laadtijd**: TTFB homepage 4,3–9,3 s en productpagina 3,3–9,3 s (server nginx, `cache-control: max-age=0`, geen CDN-headers gezien). Concurrenten: 0,2–1,5 s. Server-side caching/CDN is de grootste technische quick win.
- **Sitemap-opschoning**: page-sitemap bevat duplicaten en testpagina's (home-2, home-3, hero-section, hero-section-2, home-hero-image-duplicate-2, shop2, flavory-landingpage, vijf varianten van "5 redenen … kerstcadeau 2024/2025"). Noindex of verwijderen.
- **hreflang**: homepage toont nl + de maar geen en (terwijl /en/ bestaat); controleer WPML-output per pagina en voeg x-default toe. Concurrenten hebben dit nauwelijks, dus correcte implementatie is een voordeel voor de Duitse sectie.

---

## Positionering van Flavory

Onderscheidend vermogen ten opzichte van de vijf concurrenten:

| Dimensie | Flavory | Dichtste concurrent | Boodschap voor SEO-titels/H1's |
|---|---|---|---|
| Spelconcept | Volwaardig gezelschapsspel (2–6 spelers) met wijn inbegrepen | Wine & Dice (app + 1 fles), Wijnbrigade (kennisspel zonder wijn) | "Wijnspel mét twee wijnen: proef, gok, win" |
| Blind proeven als duel | Twee stijlen (Merlot vs Cabernet, Chardonnay vs Sauvignon Blanc, Cava vs Prosecco, Italië vs Spanje) blind tegen elkaar | Proef.nl (4 geblindeerde flessen, geen duel), Wijnbeurs/Pandora's Bottle (blindboxen) | "Ontdek het verschil tussen X en Y – blind" (sluit aan bij de bestaande informatieve zoekvragen) |
| Prijs en instap | €24,90–€64,90, 2 flessen, geen kennis vereist | Wijnproeverijbox.nl vanaf €79,50 (6 flessen), Wine & Dice €19,95 (1 fles) | "Complete wijnproeverij thuis vanaf €24,90" |
| Belgisch merk, Benelux-levering | Belgische oorsprong, levering BE + NL (2–4 werkdagen), bol.com BE/NL en Amazon.be | NL-concurrenten vermelden België niet; BE-concurrenten verkopen geen box | "Belgisch wijnspel, geleverd in België en Nederland" |
| Bewijs | Trustpilot 4,5/5 (31 reviews), FAQ met 16 vragen, drie talen | Wijnproeverijbox.nl Kiyoh 9,7 (sterker), rest zwak | Reviews naar productpagina's en schema brengen |
| B2B | Eindejaars-/relatiegeschenken, proeverij op locatie | Proef.nl (vanaf 20 kisten), Wijnbrigade (tastings), wine-point.be | "Eindejaarsgeschenk dat collega's samen spelen" |

Aanbevolen positioneringszin voor metadata en cadeaugidsen: "Het Belgische wijnspel waarbij je twee wijnen blind tegen elkaar proeft – een complete wijnproeverij thuis voor 2 tot 6 spelers, vanaf €24,90, geleverd in België en Nederland."

Kanaalnotitie: bol.com (BE en NL) rankt met Flavory-listings voor "wijnspel wijnproeverij thuis", "wijnproefspel" en "wijnproeverij cadeau box". bol.com concurreert dus met flavory.wine om dezelfde klik. Zorg dat de eigen productpagina's rijkere content (video, spelregels, reviews, schema) hebben dan de bol-listing en gebruik bol als vindbaarheidskanaal, niet als concurrent.

---

## Bronnen en beperkingen

**Geraadpleegde URL's (fetch of curl, 16-09-2026)**
- https://flavory.wine/ ; /shop/ ; /shop/wijnproeverij-thuis-rood/ ; /faq/ ; sitemaps (post-, page-, product-sitemap.xml) ; https://nl-be.trustpilot.com/review/flavory.wine
- https://wijnbrigade.be/ ; /over-ons/ ; /product/verwijn-jezelf/ ; /sitemap.xml
- https://wine-point.be/ ; /wijnproeverij/ ; /product/graham-beck-blanc-de-blanc-2018-geschenkbox/ ; sitemaps (post-, page-, product-, product_cat-, pa_geschenkbox-sitemap.xml)
- https://www.wijnproeverijbox.nl/ ; /boxen/ ; /belevingsboxen/ ; /wereldreis.html ; /service/wijnproeverij-thuis-organiseren/ ; /sitemap.xml
- https://proef.nl/ ; /producten/ ; wp-sitemap-posts-post-1.xml ; wp-sitemap-posts-page-1.xml
- https://wineanddice.nl/ ; /proefspel ; /shop/product/proefspel-rode-wijn-editie ; /review ; /sitemap.xml
- https://labodega87.nl/collections/wijnproeverijbox-voor-thuis ; sitemaps ; https://www.smaakvermaak.nl/ ; http://www.mysterytasting.com/ (verlopen domein)
- SERP-controles (12): "wijnspel wijnproeverij thuis spel"; "wijnproeverij box thuis bestellen België"; "wijnproeverij pakket thuis Nederland blind proeven box"; "Smaakvermaak wijnspel Wijnbrigade wijnspel"; "wine-point.be wijnproeverij thuis box"; "cadeau voor wijnkenner wijncadeau origineel"; "verschil merlot en cabernet sauvignon"; "online wijnproeverij teambuilding thuis pakket collega's"; "cava of prosecco wat is het verschil"; "sauvignon blanc of chardonnay verschil smaak"; "wijnproeverij cadeau box … Vlaanderen bestellen spel blind"; "flavory wijnspel review pers België"; "wijnproefspel kopen"; "wijnbox proeverij cadeau wijnproeverij pakket".

**Beperkingen / niet gecontroleerd**
- Zoekvolumes, posities per land (BE vs NL) en backlinkprofielen zijn niet gemeten: geen toegang tot Ahrefs, DataForSEO of Search Console van concurrenten. "Geschatte autoriteit" is uitsluitend gebaseerd op sitemap-omvang, SERP-verschijning in bovenstaande zoekopdrachten en zichtbare reviews/pers.
- De zoekmachine van deze sessie is niet geo-gericht op België of Nederland; SERP-posities kunnen lokaal afwijken. `site:`-zoekopdrachten zijn niet uitgevoerd; aantallen pagina's komen uit XML-sitemaps (kunnen afwijken van de Google-index).
- mysterytasting.com en aprobar.be konden niet worden geanalyseerd (verlopen domein resp. niet bereikbaar). Van Mystery Tasting is alleen een oud zoekresultaat gezien ("wijnsamples naar werknemers in België of Nederland, spel-element").
- Prijzen van Proef.nl en van Wine Point-proeverijen zijn niet online zichtbaar. Prijs van de Wine Point-geschenkbox is niet uitgelezen.
- Laadtijden zijn eenmalige tot drievoudige curl-metingen (time_starttransfer) vanaf één locatie en geen Core Web Vitals; ze geven een indicatie, geen benchmark.
- Reviewaantallen op Kiyoh (Wijnproeverijbox.nl) en Google (Wine Point) zijn overgenomen zoals op de eigen site getoond, niet geverifieerd op het reviewplatform. Het aantal bol.com-reviews van Flavory is niet geteld.
- Verzending naar België door Nederlandse concurrenten is niet bevestigd (niet vermeld op bekeken pagina's).
