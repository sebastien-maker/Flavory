# Sitestructuur en informatiearchitectuur — flavory.wine

Doel: van 209 gecrawlde URL's (waarvan ±40% test, duplicaat of redirect) naar een compacte, doelgerichte structuur van ±60 Nederlandstalige en ±20 Duitstalige pagina's die elk één zoekintentie bedienen. Basis: e-commerce-template, audit van 16 september 2026 en de Search Console-export.

## 1. Ontwerpprincipes

1. **Eén pagina per intentie.** Elke zoekintentie uit Search Console krijgt precies één doelpagina (geen 7 kerstcadeau-varianten, geen 14 Duitse product-kopieën).
2. **Producten heten zoals mensen zoeken.** "Wijnspel" blijft de merkterm, maar titels en H1's dragen ook "wijnproeverij thuis" en "wijnbox" (samen 6.241 vertoningen per jaar tegenover 3.765 voor "wijnspel"-varianten).
3. **Vergelijkingsartikelen vangen de druivenvragen op.** 235 zoekopdrachten rond "verschil merlot en cabernet sauvignon", "sauvignon of chardonnay", "cava of prosecco" (5.863 vertoningen, 11 klikken) landen nu op productpagina's op positie 9–15. Een informatief artikel per duel rankt hoger en linkt door naar de box.
4. **Hub-and-spoke.** Zes pijlerpagina's bundelen de blog; elk artikel linkt naar zijn pijler en naar exact één product.
5. **Taalsecties zijn compleet of bestaan niet.** Elke Duitse URL heeft een echte vertaling en een hreflang-paar, of wordt niet aangeboden.

## 2. Doelstructuur (NL)

```
/                                   Home — "Wijnproeverij thuis: het wijnspel voor vrienden"
├── /shop/                          Alle boxen (categorie-overzicht, min. 300 woorden intro)
│   ├── /shop/rode-wijnbox/         Rode wijnspel: Merlot of Cabernet Sauvignon? (nu: wijnproeverij-thuis-rood)
│   ├── /shop/witte-wijnbox/        Witte wijnspel: Chardonnay of Sauvignon Blanc? (nu: wijnproeverij-thuis-wit)
│   ├── /shop/bubbelbox/            Bubbelspel: Cava of Prosecco?
│   ├── /shop/italie-of-spanje/     Rode wijnspel: Italië of Spanje? (nu: valentijn-…-10-korting)
│   ├── /shop/premium-editie/       Premium-editie (indien apart product blijft)
│   ├── /shop/business-pack/        Business pack 5 boxen (nu redirect; had 1.088 vertoningen op positie 4,6)
│   ├── /shop/rode-wijn/            Categorie rood (was productcategorie/rode-wijn)
│   ├── /shop/witte-wijn/           Categorie wit
│   └── /shop/bubbels/              Categorie bubbels (nu redirect; had 1.254 vertoningen)
├── /hoe-werkt-het/                 Spelregels in 3 stappen (nu /flavory-gameplay/)
├── /wijnkiezer/                    Keuzehulp (tool)
├── /cadeau/                        Pijler: wijn cadeau geven
│   ├── /cadeau/wijncadeau/         "Origineel wijncadeau" landingspagina (wijncadeau 333 vert., cadeau voor wijnkenner 286)
│   ├── /cadeau/kerstcadeau/        Evergreen kerst (vervangt 7 varianten + 3 posts)
│   ├── /cadeau/valentijn/          Evergreen valentijn
│   ├── /cadeau/moederdag/          Evergreen moederdag
│   └── /cadeau/vaderdag/           Nieuw
├── /zakelijk/                      Pijler B2B (nu /eindejaars-en-relatiegeschenken/)
│   ├── /zakelijk/relatiegeschenken/  Met staffelprijzen zichtbaar
│   ├── /zakelijk/eindejaarsgeschenken/
│   └── /zakelijk/teambuilding-wijnproeverij/  (nu /proeverij/)
├── /proeverij-op-locatie/          Consumentenvariant van proeverij (verjaardag, vrijgezellen)
├── /blog/                          Blogoverzicht
│   ├── /blog/wijnproeverij-thuis-organiseren/   PIJLER 1 (host-persona)
│   ├── /blog/wijn-leren-proeven/                PIJLER 2 (blind proeven, balans, smaak)
│   ├── /blog/druiven-en-stijlen/                PIJLER 3 (alle "X of Y"-vergelijkingen)
│   ├── /blog/welke-wijn-bij-welk-gerecht/       PIJLER 4 (foodpairing, spiekbriefje)
│   ├── /blog/wijn-cadeau-ideeen/                PIJLER 5 (gidsen, verwijst naar /cadeau/)
│   └── /blog/…                                  Spokes (bestaande 28 posts, ontdubbeld tot ±22)
├── /over-flavory/                  Verhaal, oprichter Bart, adres, BTW, pers
├── /reviews/                       Eén reviewpagina (vervangt 12 ?reviews=-pagina's; Review-schema)
├── /verkooppunten/                 Eén pagina met alle partnerwinkels + links (vervangt ?store=-pagina's)
├── /faq/
├── /contact/
├── /verzending-en-retour/          Nieuw; vereist voor Merchant Center (shippingDetails/returnPolicy)
├── /privacybeleid/                 Herstellen (nu redirect naar home)
└── /algemene-voorwaarden/
```

Verwijderen of doorsturen (301): `/home/`, `/home-2/`, `/home-3/`, `/hero-section/`, `/hero-section-2/`, `/home-hero-image/`, `/home-hero-image-duplicate-2/`, `/shop2/`, `/de/shop-2/`, 7× `5-redenen-…kerstcadeau…`, `…-dupliceren`, `/dit-voorspelt-jouw-wijnhoroscoop-voor-valentijn/` (samenvoegen met blogversie), `/start-to-wijnkelder-…` (niet-blog kopie), `/alcoholvrije-wijnen/` (herbeoordelen: 56 vertoningen; behouden als er echt aanbod is), `/win/`, `/het-was-een-cadeau/`, `/mijn-ervaring/`, `/nog-niet-gespeeld/`, `/flavory-landingpage/`, `/partnership/` (samenvoegen met /zakelijk/ of /verkooppunten/), `/shop/productcategorie/geen-categorie/`, `/shop/producttag/box/`.

URL-wijzigingen zijn optioneel: de huidige productslugs mogen blijven als de 301-keten voor bestaande rankings een risico is. Verplicht is alleen dat titels, H1's en interne links de nieuwe benaming dragen. Bij hernoemen: 301 van de oude slug, sitemap bijwerken, interne links direct aanpassen (nooit via redirect).

## 3. Redirect-map voor verkeer dat nu verloren gaat

Deze URL's kregen de afgelopen 12 maanden nog klikken of vertoningen maar sturen nu naar de homepage:

| Oude URL | Klikken / vertoningen (12 mnd) | Nieuwe bestemming |
|---|---|---|
| /shop/legendarische-wijnlanden-rood/ | 97 / 7.268 (pos 4,3) | /shop/italie-of-spanje/ (Italië vs Spanje-box) |
| /shop/merlot-of-cabernet-sauvignon/ | 20 / 5.893 | /shop/rode-wijnbox/ |
| /shop/legendarische-druiven-wit/ | 21 / 2.714 | /shop/witte-wijnbox/ |
| /shop/chardonnay-of-sauvignon-blanc-premium/ | 16 / 1.758 | /shop/witte-wijnbox/ of premium-editie |
| /shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/ | 14 / 1.238 | /shop/witte-wijnbox/ |
| /shop/productcategorie/bubbels/ | 28 / 1.254 | /shop/bubbels/ (categorie herstellen) |
| /shop/flavory-business-pack-5-wijnboxen/ | 25 / 1.088 (pos 4,6) | /shop/business-pack/ (product herstellen) of /zakelijk/ |
| /shop/merlot-of-cabernet-sauvignon-premium/ | 10 / 838 | premium-editie |
| /home/, /shop2/, /de/shop-2/ | 122 / 8.600 | / , /shop/, /de/shop/ |
| /shop/nieuw-combi-box-rose-wit-rood-rood-20-korting/ | 2 / 193 | /shop/ |
| /shop/rode-wijn-box/, /shop/witte-wijn-box/, /shop/cava-prosecco-box/, /shop/rose-wijn-box/, /product/… | in blogs gelinkt (287×) | resp. rode-wijnbox, witte-wijnbox, bubbelbox, /shop/ |
| /cava-vs-prosecco, /merlot-vs-cabernet-sauvignon, /chardonnay-vs-sauvignon-blanc, /italie-vs-spanje | gelinkt | nieuwe vergelijkingsartikelen in /blog/druiven-en-stijlen/ |
| http://www.flavory.wine/ | 71 / 5.494 | bestaat al (301) — correct |

Totaal in gevaar: 442 klikken en 38.717 vertoningen per jaar, ongeveer 8% van het verkeer en het grootste deel van het niet-merkverkeer naar productpagina's.

## 4. Duitse sectie (DE)

Feiten: Duitsland leverde 4.208 vertoningen en 47 klikken (CTR 1,1%). Duitse vergelijkingsvragen ("chardonnay oder sauvignon blanc", "unterschied …") staan op positie 10–15 met productpagina's, samen 1.848 vertoningen en 3 klikken. De sectie heeft 5 echte producten, 14 kopieën, geen hreflang, en `/de/` stuurt naar de Nederlandse home.

Twee opties, kies er één in fase 1:

- **Optie A — bevriezen (aanbevolen bij beperkte capaciteit):** houd `/de/start/`, `/de/shop/` met 5 producten, `/de/kontakt/`, `/de/ueber-flavory/`, `/de/so-geht-das-flavory-spiel/`, `/de/blog/` met de 2 bestaande vertaalde artikelen. Verwijder de 14 kopieën, zet hreflang tussen de bestaande paren, laat `/de/` op `/de/start/` uitkomen. Geen nieuwe Duitse content tot NL/BE stabiel is.
- **Optie B — uitbouwen:** zoals A plus 4 Duitse vergelijkingsartikelen (de queries bestaan al) en een Duitse cadeaupagina. Alleen zinvol als verzending naar DE/AT/CH en Duitstalige klantenservice geregeld zijn.

Engels (`/en/blog/`, `/en/shop/`): geen Engelstalige vraag in de data; noindex of verwijderen.

## 5. Interne linkstructuur

- **Navigatie:** Shop · Hoe werkt het · Cadeau · Zakelijk · Blog · (icoon) winkelmand. "Wat is Flavory?" verhuist naar de footer/over-pagina.
- **Homepage** linkt naar de 4 producten, /hoe-werkt-het/, /cadeau/, /zakelijk/ en de 3 sterkste blogartikelen.
- **Productpagina's** linken naar: bijhorend vergelijkingsartikel ("Wat is het verschil tussen Merlot en Cabernet Sauvignon?"), /hoe-werkt-het/, /cadeau/, de twee andere boxen, /reviews/.
- **Blogartikelen:** 1 link naar de pijler, 1 naar het relevante product, 2–3 naar verwante spokes. Het huidige "alle 28 posts"-blok en de link naar de winkelmand verdwijnen.
- **Pijlers** linken naar alle spokes en naar /shop/.
- **Footer:** verkooppunten, verzending en retour, privacy, voorwaarden, contact, reviews.
- Doel: elke commerciële pagina minstens 10 interne links; /wijnkiezer/, /proeverij-op-locatie/ en /hoe-werkt-het/ hebben er nu 1–2.

## 6. Sitemap en kwaliteitsregels

- Eén sitemap-index met: pages, products, product-categories, posts. Uit: author, reviews-CPT, store-CPT, tags, geen-categorie.
- Elke sitemap-URL: 200, self-canonical, index,follow, minstens 300 woorden unieke tekst, minstens 1 interne link.
- hreflang via de sitemap of via de meertaligheidsplugin voor NL/DE-paren, met x-default op NL.
- Doelomvang na opschoning: ±75 NL-URL's, ±20 DE-URL's.

## 7. Schema per paginatype

| Paginatype | Schema |
|---|---|
| Product | Product + Offer (price, priceCurrency, availability, url, shippingDetails, hasMerchantReturnPolicy) + AggregateRating + Review + gtin13 + BreadcrumbList |
| Categorie | CollectionPage + ItemList + BreadcrumbList |
| Blog/vergelijking | Article (of BlogPosting, consistent) + Person met echte auteur-URL |
| Cadeau- en zakelijke landingspagina's | WebPage + FAQPage waar echte vragen staan; ItemList voor cadeaugidsen |
| Reviews | Organization met AggregateRating, losse Review-items |
| Verkooppunten | Eén LocalBusiness/Store per winkel |
| Sitewide | Organization (adres, VAT, contactPoint, founder, sameAs Instagram/LinkedIn/Trustpilot), WebSite + SearchAction |
