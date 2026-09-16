# Stackadvies: flavory.wine opnieuw bouwen (SEO-first e-commerce)

Datum: 16 september 2026. Context: herbouw van scratch, Bart doet het meeste bouwwerk, Sébastien werkt mee in de repo, hosting op Netlify. Eisen: maximale SEO en snelheid, klein assortiment (4–6 boxen, premium-editie, business pack), verkoop in BE en NL met Bancontact/iDEAL, kleine Duitse sectie, blog met pijlers, B2B-offerteflow, Trustpilot-reviews, bol.com als extra kanaal.

---

## 1. Aanbeveling in één alinea

**Astro 7 als frontend (statisch gegenereerd, met on-demand rendering alleen waar het moet) op Netlify, Shopify Basic als commerce-backend via het Headless-kanaal en de Storefront API, Shopify Payments voor Bancontact/iDEAL, en Keystatic als git-gebaseerde CMS zodat alle content in de repo leeft.** Dit geeft de snelste mogelijke HTML voor Google (geen JavaScript nodig om te renderen), volledige controle over titels, schema en hreflang in code, een betrouwbare backoffice voor orders, verzendlabels en kortingscodes zonder eigen servers, en een workflow waarin Bart en Sébastien allebei via pull requests met deploy previews werken.

Een lichter alternatief (Stripe Checkout zonder commerce-platform) staat in §4 voor als jullie onder de ±500 bestellingen per jaar blijven en geen backoffice nodig hebben.

---

## 2. Waarom deze keuzes

### Frontend: Astro 7
- Standaard nul JavaScript naar de browser; interactieve stukken (winkelmandje, wijnkiezer) zijn "islands". Dat is precies wat de audit vroeg: de huidige site stuurt 314 KB HTML plus 30 blokkerende scripts per pagina; met Astro wordt dat typisch 20–40 KB HTML en één klein script.
- Content collections met typechecking, ingebouwde i18n-routing (`/` voor nl, `/de/` voor de), ingebouwde beeldoptimalisatie die op Netlify automatisch de Image CDN gebruikt, `@astrojs/sitemap`, view transitions.
- Astro 7 (juni 2026) heeft dag-één ondersteuning op Netlify via `@astrojs/netlify`, inclusief server islands, actions en sessions. Bron: [Netlify changelog Astro 7](https://www.netlify.com/changelog/2026-06-22-astro-7/), [adapterdocs](https://docs.astro.build/en/guides/integrations-guide/netlify/).
- Waarom niet Next.js: werkt op Netlify, maar levert voor een contentzware shop met 6 producten meer JavaScript, meer configuratie en minder SEO-voordeel per uur werk. Waarom niet Shopify Hydrogen: gebouwd voor Shopify's eigen Oxygen-hosting en React Router; op Netlify voelt het als tegen de stroom in.

### Hosting: Netlify (Pro-plan)
- Deploy Previews per pull request (Bart en Sébastien reviewen elkaars werk op een echte URL), branch deploys, `_redirects` voor de honderden oude WordPress-URL's, Netlify Functions voor webhooks en de Trustpilot-cache, Netlify Forms voor het B2B-offerteformulier, Netlify Image CDN, scheduled functions voor een nachtelijke rebuild.
- Pro (±€20/maand, 3.000 credits) in plaats van Free: het gratis plan heeft een harde limiet zonder overage, waarbij de site offline gaat tot de eerste van de volgende maand. Voor een shop met een decemberpiek is dat onaanvaardbaar. Bron: [Netlify pricing 2026](https://toolchase.com/blog/netlify-pricing-guide/).

### Commerce: Shopify Basic + Headless-kanaal
- Het Headless-kanaal en de Storefront API werken op Basic; Shopify Plus is alleen nodig voor checkout-aanpassingen en native B2B. Bron: [Shopify headless pricing](https://weaverse.io/blogs/shopify-headless-pricing), [Storefront API-docs](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api).
- Shopify Payments in België: Bancontact €0,39 vast, iDEAL €0,29 vast; met een externe PSP zoals Mollie betaal je op Basic 2% extra. Bron: [Klikslim transactiekosten](https://klikslim.nl/blogs/shopify/shopify-transactiekosten), [Shopify Payments Belgium](https://bsscommerce.com/shopify/shopify-payments-for-belgium/).
- Wat Bart gratis meekrijgt en anders zelf moet bouwen: orderbeheer, voorraad, kortingscodes en automatische kortingen, verzendtarieven per land, Sendcloud/PostNL-labels via app, bol.com-koppeling via app, Trustpilot-app, abandoned-cart e-mails, facturen, terugbetalingen, klantenaccounts (nieuwe Customer Account API, oude Multipass is in februari 2026 uitgefaseerd).
- Checkout draait op Shopify's hosted checkout op `shop.flavory.wine`. Dat is SEO-neutraal (checkout-pagina's worden nooit geïndexeerd) en conversie-geoptimaliseerd (Shop Pay). Alle indexeerbare pagina's blijven op `flavory.wine` in Astro. De Shopify-storefront zelf zet je op "redirect naar flavory.wine" zodat er geen dubbele productpagina's ontstaan.
- Waarom niet Medusa: open source en gratis, maar zelf hosten en onderhouden (Postgres, Redis, updates). Voor een team zonder DevOps-tijd kost dat meer dan het bespaart; het omslagpunt ligt volgens vergelijkingen rond €1,5–3 miljoen omzet. Bron: [Medusa vs Shopify 2026](https://www.buildwithmatija.com/blog/medusa-vs-shopify-2026-cost-b2b-headless-tradeoffs).
- Waarom niet Snipcart: 2% transactiekost bovenop de PSP. Bron: [Snipcart review 2026](https://theartofcto.com/technologies/snipcart).
- Waarom niet WooCommerce headless: het huidige probleem (trage PHP-backend, cookies die caching breken) blijft dan bestaan.

### CMS: Keystatic (git-based)
- Admin-interface in de site zelf (`/keystatic`), schrijft Markdown/MDX en YAML naar de repo via een GitHub-app; lokaal werkt het direct op het bestandssysteem. Gratis, geen externe dienst, alles versiebeheerd. Bron: [Keystatic review 2026](https://www.luckymedia.dev/insights/keystatic), [Best CMS for Astro 2026](https://agnitestudio.com/blog/best-cms-for-astro/).
- Beperkingen om te kennen: geen planning van publicaties, geen goedkeuringsworkflow buiten git, geen losse conceptstatus. Voor twee auteurs die allebei met git werken is dat prima; drafts zijn gewoon een branch of een `draft: true`-veld.
- Alternatief als Bart liever visueel bewerkt: Netlify Visual Editor met de Git-contentbron (bewerken op een live preview, opslaan maakt een commit). Bron: [Netlify Visual Editor + Astro](https://docs.netlify.com/manage/visual-editor/frameworks/astro/). Zwaarder in configuratie; alleen invoeren als Keystatic te kaal blijkt.
- Sanity of Storyblok zijn goed maar brengen een externe bron, kosten en een tweede plek waar content leeft. Niet nodig bij dit volume.

### Waar de productdata leeft
- Shopify is de bron voor prijs, voorraad, varianten, SKU, GTIN, afbeeldingen en verzendregels.
- Marketingcopy per product (lange beschrijving, FAQ, "wat zit erin", vergelijkingsblok, SEO-titel/-description) leeft in Keystatic in de repo, gekoppeld op Shopify-handle. Zo kunnen Bart en Sébastien productteksten in een pull request reviewen en blijven ze buiten Shopify's editor.
- Bij build haalt Astro producten op via de Storefront API en genereert statische productpagina's met volledige JSON-LD. Een Shopify-webhook (product update, voorraad) triggert een Netlify build hook; prijs en voorraad worden daarnaast bij paginaload ververst in een klein island, zodat een uitverkocht product nooit verkeerd wordt getoond tussen twee builds.

---

## 3. SEO-eisen die in de fundering moeten zitten

| Eis | Implementatie |
|---|---|
| Server-gerenderde HTML voor elke indexeerbare pagina | Astro SSG; alleen winkelmandje en B2B-formulier client-side |
| Titel, meta description, canonical, OG/Twitter, hreflang per pagina | Eén `<SeoHead>`-component met verplichte props; build faalt bij ontbrekende titel/description (Astro content schema met Zod) |
| JSON-LD | Helpers voor Product + Offer (price, priceCurrency, availability, url, shippingDetails, hasMerchantReturnPolicy) + AggregateRating + gtin13, Article + Person, Organization (adres, BTW, founder, sameAs), BreadcrumbList, CollectionPage/ItemList, FAQPage, LocalBusiness voor verkooppunten |
| Sitemap en robots | `@astrojs/sitemap` met hreflang-alternates; uitsluiten van cart, zoek, previews; `robots.txt` in `public/` |
| 404 en redirects | Echte 404-pagina; `_redirects` met de volledige oude WordPress-URL-lijst (uit de audit-crawl en GSC-pagina's) naar de juiste nieuwe URL, plus `www` naar apex en `/de` naar `/de/` |
| i18n | `nl` zonder prefix (BE/NL delen content; optioneel `nl-NL`-variant later), `de` onder `/de/`; hreflang met `x-default` op nl; alleen vertaalde paren gekoppeld |
| Beelden | Astro `<Image>` naar Netlify Image CDN (AVIF/WebP, srcset, width/height verplicht, alt verplicht in het contentschema) |
| Core Web Vitals | Doel LCP < 1,5 s, CLS 0, INP < 100 ms; Lighthouse CI in de pipeline met budgetten (HTML < 60 KB, JS < 80 KB per pagina) |
| Reviews | Trustpilot-API in een scheduled Netlify Function, gecachet in Netlify Blobs, server-side gerenderd met Review-schema; geen client-side widget in de kritieke render |
| Google Merchant Center | Productfeed (XML) gegenereerd bij build vanuit Shopify-data; verzend- en retourpagina als vereiste |
| Analytics en consent | GTM met Consent Mode v2, consentbanner (CookieConsent v3 of Cookiebot) die pas na toestemming Meta Pixel/Clarity laadt; scripts via Partytown of `defer` |
| AI-vindbaarheid | Definitieblok van twee zinnen op home, product en FAQ; gecureerde `llms.txt` uit de content collections gegenereerd |
| Leeftijdsverificatie | België: wijn vanaf 16 jaar (2026-regeling: 16–18 alleen bier en wijn). Nederland: online alcoholverkoop vereist een leeftijdscontrole bij bestelling én bij levering (verkoper is verantwoordelijk). Implementatie: leeftijdsbevestiging in checkout (Shopify-app of eigen veld) en een 18+-bezorgoptie via Sendcloud/PostNL voor NL-orders. Bronnen: [FOD Volksgezondheid](https://www.health.belgium.be/nl/professionals/ondernemingen/consumptieproducten/alcoholverkoop), [Ondernemersplein leeftijdscontrole](https://ondernemersplein.overheid.nl/bedrijfsvoering/juridische-zaken/doe-een-leeftijdscontrole-bij-alcohol-verkopen-op-afstand/) |

---

## 4. Alternatief: Stripe Checkout zonder commerce-platform

Voor wie het echt minimaal wil: producten als content in de repo, winkelmandje in een Astro-island, één Netlify Function die een Stripe Checkout-sessie maakt (Bancontact, iDEAL, kaarten, verzendtarieven, kortingscodes en btw zijn ingebouwd), een webhook-function die bevestigingsmails stuurt, orders in het Stripe-dashboard.

| | Shopify headless | Stripe-only |
|---|---|---|
| Vaste kosten | ±€24–36/maand | €0 |
| Transactiekosten | Bancontact €0,39 / iDEAL €0,29 vast | Stripe-tarieven (Bancontact/iDEAL enkele tientallen cent + %) |
| Orderbeheer, labels, bol.com, voorraad | Ingebouwd of via app | Zelf bouwen of handmatig |
| Kortingscodes, abandoned cart, facturen | Ingebouwd | Stripe-coupons; rest zelf |
| Alles in de repo | Content ja, orders nee | Ja |
| Bouwtijd checkout | Laag (hosted) | Laag (hosted), maar orderflow eromheen is werk |
| Geschikt tot | Onbeperkt | ±500 orders/jaar, geen B2B-facturatie op schaal |

Kies Stripe-only alleen als Bart bewust een minimale backoffice wil. Met "+5000 klanten", bol.com en een B2B-tak is Shopify de veiligere keuze.

---

## 5. Repo-opzet en samenwerking

```
flavory/
├── astro.config.mjs            i18n nl/de, netlify adapter, sitemap, keystatic
├── keystatic.config.ts         collecties: blog, pages, cadeau, zakelijk, products-copy, verkooppunten, reviews-manual
├── src/
│   ├── content/                Markdown/MDX per taal: blog/nl, blog/de, pages/nl, …
│   ├── components/seo/         SeoHead.astro, JsonLd.astro, schema-helpers.ts
│   ├── components/commerce/    Cart.tsx (island), PriceStock.tsx (island), AddToCart.tsx
│   ├── lib/shopify/            storefront-client.ts, queries.ts, cart.ts
│   ├── lib/trustpilot.ts
│   ├── pages/                  index, shop/[handle], cadeau/…, zakelijk/…, blog/[...slug], de/…
│   └── layouts/
├── netlify/functions/          shopify-webhook.ts, trustpilot-sync.ts (scheduled), b2b-quote.ts, merchant-feed.ts
├── public/                     robots.txt, _redirects, favicons
├── scripts/                    wp-export-to-markdown.ts, build-redirects.ts, merchant-feed.ts
└── .github/workflows/          ci.yml: astro check, eslint, lighthouse-ci met budgetten
```

Werkwijze:
- GitHub-repo, `main` = productie op Netlify, elke wijziging via pull request met Deploy Preview; Netlify's Drawer voor opmerkingen op de preview.
- Branch `staging` gekoppeld aan een Shopify-development store voor het testen van checkout en webhooks.
- Conventionele commits, `pnpm`, TypeScript strict, Prettier/ESLint, Astro `check` in CI.
- Contentschema's dwingen af: titel ≤ 60 tekens, description 120–155, alt-tekst verplicht, één H1, `draft`-veld.
- Secrets (Storefront-token, Trustpilot-key, build hook) alleen in Netlify-omgevingsvariabelen; nooit in de repo.

Rolverdeling die past bij "Bart doet de heavy lifting": Bart bouwt layouts, commerce-koppeling en functions; Sébastien beheert SEO-componenten, contentschema's, redirects, schema-helpers en de contentkalender, en reviewt elke PR op SEO-checklist.

---

## 6. Migratieplan en timing

1. **Nu tot november 2026: niet herbouwen tijdens de piek.** Voer op de huidige WordPress-site alleen fase 1 van de roadmap uit (caching, Product-schema, redirects, opschoning). November en december zijn 46% van het jaarverkeer; een migratie in Q4 is een onnodig risico.
2. **Oktober–december: bouwen op een preview-URL.** Repo opzetten, Shopify-store inrichten (producten, verzendzones BE/NL/DE, Payments, apps), WordPress-content exporteren naar Markdown (script via de WP REST API; 28 posts, ±15 pagina's), beelden overzetten, nieuwe pagina's uit de contentkalender direct in de nieuwe site schrijven.
3. **Redirect-map opstellen** uit drie bronnen: de audit-crawl (209 URL's), de GSC-pagina-export (120 URL's met verkeer) en de huidige sitemap. Elke oude URL krijgt een expliciete bestemming; niets valt terug op de homepage.
4. **Lancering: tweede helft januari 2027**, na de kerstverkoop en vóór valentijn. DNS omzetten naar Netlify, `shop.flavory.wine` naar Shopify, sitemap indienen in GSC en Bing, IndexNow-ping, Merchant Center-feed activeren.
5. **Nazorg twee weken:** dagelijkse GSC-controle op 404's en dekkingsfouten, Core Web Vitals-meting, rankings van de 25 doeltermen, drift-baseline vastleggen.

Vervalt de huidige site-verbetering in stap 1, dan verlies je de kerstpiek 2026 aan de bekende problemen (3–7 s laadtijd, geen sterren, 442 weglekkende klikken).

---

## 7. Kosten (indicatief, per maand)

| Post | Bedrag |
|---|---|
| Netlify Pro | ±€20 |
| Shopify Basic (jaarlijks betaald is ±25% goedkoper) | ±€24–36 |
| Shopify Payments | per transactie (Bancontact €0,39, iDEAL €0,29, kaarten ±1,5–2,9% + vast) |
| Shopify-apps (Sendcloud, bol.com-koppeling, leeftijdscheck) | €0–40 afhankelijk van keuze |
| Keystatic, GitHub, Astro | €0 |
| Trustpilot | gratis tier volstaat voor API-weergave van reviews |
| Domein/DNS | bestaand |
| **Totaal vast** | **±€45–100/maand** |

Ter vergelijking: de huidige WordPress-stack heeft hosting plus meerdere betaalde plugins (Yoast, Advanced Coupons, A/B-test, JetEngine) en levert een laadtijd van 3–7 s.

---

## 8. Open beslissingen voor Bart en Sébastien

1. Shopify headless of Stripe-only (§4)? Aanbeveling: Shopify.
2. Keystatic of Netlify Visual Editor als bewerkingslaag? Aanbeveling: Keystatic; Visual Editor alleen als visueel bewerken een harde eis is.
3. Duitse sectie meenemen in de eerste lancering (optie A: 5 producten + 4 pagina's met hreflang) of pas daarna? Aanbeveling: meenemen als optie A, want de vertalingen bestaan al.
4. Eén Nederlandse variant voor BE en NL of aparte `nl-BE`/`nl-NL`? Aanbeveling: één variant bij lancering; verzendinfo per land dynamisch tonen.
5. Lanceerdatum vastleggen in januari 2027 en fase 1 van de roadmap nu op de huidige site uitvoeren.

---

## Bronnen
- [Astro 7 op Netlify (changelog)](https://www.netlify.com/changelog/2026-06-22-astro-7/) · [Astro Netlify-adapter](https://docs.astro.build/en/guides/integrations-guide/netlify/)
- [Shopify headless pricing 2026](https://weaverse.io/blogs/shopify-headless-pricing) · [Building with the Storefront API](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api) · [Shopify Payments Belgium](https://bsscommerce.com/shopify/shopify-payments-for-belgium/) · [Shopify transactiekosten 2026](https://klikslim.nl/blogs/shopify/shopify-transactiekosten) · [Shopify kosten 2026](https://opklopper.nl/blog/shopify-kosten)
- [Keystatic review 2026](https://www.luckymedia.dev/insights/keystatic) · [Best CMS for Astro 2026](https://agnitestudio.com/blog/best-cms-for-astro/)
- [Netlify Visual Editor met Astro](https://docs.netlify.com/manage/visual-editor/frameworks/astro/) · [Git CMS in Visual Editor](https://docs.netlify.com/manage/visual-editor/content-sources/git/)
- [Netlify pricing 2026](https://toolchase.com/blog/netlify-pricing-guide/) · [Netlify pricing uitleg](https://gautamkhorana.com/blog/netlify-pricing-explained-2026/)
- [Medusa vs Shopify 2026](https://www.buildwithmatija.com/blog/medusa-vs-shopify-2026-cost-b2b-headless-tradeoffs) · [Headless platforms 2026 (Vendure)](https://vendure.io/blog/best-headless-commerce-platforms) · [Snipcart review 2026](https://theartofcto.com/technologies/snipcart)
- [Stripe Bancontact](https://stripe.com/payment-method/bancontact) · [Netlify Functions + Stripe](https://main--functions.netlify.com/example/payment-processing-via-stripe/)
- [FOD Volksgezondheid alcoholverkoop](https://www.health.belgium.be/nl/professionals/ondernemingen/consumptieproducten/alcoholverkoop) · [Ondernemersplein leeftijdscontrole op afstand](https://ondernemersplein.overheid.nl/bedrijfsvoering/juridische-zaken/doe-een-leeftijdscontrole-bij-alcohol-verkopen-op-afstand/) · [Conversal: alcohol op je webshop (BE)](https://www.conversal.be/blog/alcoholische-dranken-op-je-webshop-let-op-de-wetgeving/)
