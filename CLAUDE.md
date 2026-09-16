# Flavory — projectafspraken voor Claude

Herbouw van flavory.wine (Belgisch D2C-merk, wijnspel-boxen: twee wijnen blind proeven) als SEO-first e-commerce site. Team: Bart (bouw), Sébastien (SEO, content, review), Thomas. Communiceer in het Nederlands; code, commits en identifiers in het Engels.

## Repo-indeling
- `flavory.wine-audit/` — SEO-audit van 16 sep 2026 (health score 37/100). Lees `ACTION-PLAN.md` voor de prioriteiten.
- `flavory.wine-plan/` — strategie, sitestructuur, contentkalender, roadmap, `STACK-RECOMMENDATION.md` (de gekozen stack en repo-structuur in §5).
- Sitecode komt in de root: `src/`, `public/`, `netlify/functions/`, `scripts/`, `astro.config.mjs`, `keystatic.config.ts`.

## Stack
Astro 7 (SSG, on-demand rendering alleen waar nodig) + `@astrojs/netlify` op Netlify; Shopify Basic via Headless-kanaal en Storefront API (checkout op shop.flavory.wine); Keystatic als git-CMS; TypeScript strict; Tailwind; pnpm. Geen andere frameworks toevoegen zonder overleg.

## Harde SEO-regels (elke PR wordt hierop gereviewd)
1. Elke indexeerbare pagina is server-gerenderde HTML. Geen content die pas na JavaScript verschijnt. Islands alleen voor winkelmandje, prijs/voorraad-verversing, wijnkiezer en formulieren.
2. Elke pagina gaat door `<SeoHead>` met verplichte `title` (≤ 60 tekens, zoekwoord vooraan, "| Flavory" achteraan), `description` (120–155 tekens), `canonical`, OG/Twitter en hreflang (`nl` zonder prefix, `de` onder `/de/`, `x-default` = nl). Alleen vertaalde paren krijgen hreflang.
3. Precies één `<h1>` per pagina.
4. JSON-LD via de helpers in `src/components/seo/`: Product + Offer (price, priceCurrency, availability, url, shippingDetails, hasMerchantReturnPolicy) + AggregateRating + gtin13 op producten; Article + Person op blog; Organization en WebSite sitewide; BreadcrumbList op alles behalve home; CollectionPage/ItemList op categorieën; FAQPage alleen bij echte zichtbare vragen.
5. Afbeeldingen via Astro `<Image>`/`<Picture>` met verplichte `alt`, `width`, `height`; hero-afbeelding `loading="eager"` en `fetchpriority="high"`, de rest lazy.
6. Geen URL verdwijnt zonder 301 in `public/_redirects`. Nooit een catch-all naar de homepage; onbekende URL's geven 404.
7. Sitemap bevat alleen 200-pagina's die self-canonical en index,follow zijn. Cart, zoek, previews, testpagina's en parameter-URL's staan erbuiten.
8. Performance-budget per pagina: HTML < 60 KB, JS < 80 KB, LCP < 1,5 s, CLS 0. Third-party scripts (GTM, Meta Pixel, Clarity) laden pas na consent en nooit render-blocking.
9. Zoektermen die we gebruiken: "wijnproeverij thuis" (categorie), "wijnspel" (merk), "wijnbox cadeau" (cadeau), "X of Y: wat is het verschil?" (vergelijkingen). Geen "het ultieme duel"-titels meer.
10. Content is Nederlands (Vlaams-neutraal, "je/jij"), Duitse pagina's alleen als volledige vertaling.

## Commerce-regels
- Shopify is de bron voor prijs, voorraad, varianten, SKU, GTIN en afbeeldingen; marketingcopy per product leeft in Keystatic op Shopify-handle.
- Productpagina's worden bij build gegenereerd; een Shopify-webhook triggert een Netlify build hook. Prijs en voorraad worden bij paginaload ververst in een island.
- Leeftijdsbevestiging in de checkout; 18+-bezorgoptie voor NL-orders.
- Secrets (Storefront-token, Trustpilot-key, build hooks) alleen in Netlify-omgevingsvariabelen. Nooit in de repo.

## Werkwijze
- Feature-branches in deze repo (geen forks: fork-PR's krijgen geen secrets), pull request naar `main`, Netlify Deploy Preview per PR, minstens één review.
- Commits: Conventional Commits (`feat:`, `fix:`, `content:`, `seo:`, `chore:`), Engels, korte imperatieve titel.
- Vóór elke commit: `pnpm astro check`, `pnpm lint`, en bij pagina-wijzigingen de SEO-check (skill `/seo-check` zodra die bestaat).
- Kleine, gerichte PR's. Geen refactors mengen met features.

## Bij review op een PR
Controleer in deze volgorde: (1) SEO-regels 1–8 hierboven, (2) redirects voor verwijderde of hernoemde URL's, (3) schema-validiteit, (4) toegankelijkheid (alt, labels, contrast, focus), (5) performance-budget, (6) geen secrets in de diff. Meld bevindingen als inline-opmerkingen met een concreet voorstel. Wees kort.
