# Flavory — flavory.wine

Herbouw van [flavory.wine](https://flavory.wine) als SEO-first e-commerce site: **Astro 7** op **Netlify**, content in **Keystatic** (git), Tailwind, TypeScript strict, pnpm. Shopify (Storefront API + hosted checkout) wordt later gekoppeld; tot dan komen prijs en voorraad uit de content en toont het winkelmandje een "binnenkort"-melding bij afrekenen.

De afspraken voor code en SEO staan in [`CLAUDE.md`](CLAUDE.md).

## Starten

```bash
pnpm install
pnpm dev          # http://localhost:4321, beheer op http://localhost:4321/keystatic
```

Vóór je een pull request opent:

```bash
pnpm verify       # contentcheck, astro check, lint, build, SEO-check op de build, redirect-dekking
```

Dezelfde stappen draaien in GitHub Actions (`.github/workflows/ci.yml`).

## Structuur

```
src/
├── content/              Alle content (Keystatic schrijft hier)
│   ├── products/         Eén .md per product: prijs, SKU, foto's, USP's, FAQ + beschrijving
│   ├── categories/       rode-wijn, witte-wijn, bubbels
│   ├── blog/             29 artikels, gemigreerd uit WordPress
│   ├── pages/            Juridische en e-mailflowpagina's
│   ├── faq/ reviews/ stores/ authors/
├── content.config.ts     Schema's; build faalt bij SEO-titel > 50 tekens, description buiten 120–155, ontbrekende alt
├── components/seo/       SeoHead.astro (titel, description, canonical, OG, robots) + schema.ts (JSON-LD)
├── components/commerce/  Productpagina, productkaart, winkelmandje (vanilla TS, geen framework)
├── lib/site.ts           Bedrijfsgegevens, navigatie, rating, verzendregels
├── lib/commerce/         cart.ts (localStorage) en checkout.ts (plek voor de Shopify-koppeling)
└── pages/                Routes
public/
├── _redirects            GEGENEREERD door scripts/build-redirects.mjs, niet met de hand bewerken
├── media/                Gecomprimeerde video's
scripts/                  Scraper, contentimport, SEO-check, redirects, icons
scraped/                  Lokale snapshot van de oude site (niet in git; `pnpm scrape`)
```

## Pagina's

| URL                                                                                                       | Bron                                                          |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `/`                                                                                                       | `src/pages/index.astro`                                       |
| `/shop/`, `/shop/[product]/`, `/shop/[categorie]/`                                                        | `src/content/products`, `src/content/categories`              |
| `/hoe-werkt-het/`, `/wijnkiezer/`, `/faq/`, `/reviews/`, `/verkooppunten/`, `/over-flavory/`, `/contact/` | `src/pages/`                                                  |
| `/zakelijk/`, `/zakelijk/teambuilding-wijnproeverij/`                                                     | `src/pages/zakelijk/` (Netlify Forms: `offerte`, `proeverij`) |
| `/blog/`, `/blog/[slug]/`                                                                                 | `src/content/blog`                                            |
| `/algemene-voorwaarden/`, `/verzending-en-retour/`, `/privacybeleid/`                                     | `src/content/pages`                                           |
| `/het-was-een-cadeau/`, `/mijn-ervaring/`, `/nog-niet-gespeeld/`, `/win/`, `/partnership/`                | E-mail- en campagnepagina's, `noindex`                        |

## Redirects

`pnpm redirects` schrijft `public/_redirects` uit de regels in `scripts/build-redirects.mjs`. `pnpm redirects:verify` controleert na een build dat elke oude URL uit de audit-crawl, de Search Console-export en de oude sitemap op een bestaande pagina of een expliciete redirect uitkomt. Een nieuwe of hernoemde URL? Voeg een regel toe en draai beide commando's.

## Oude site opnieuw scrapen

```bash
pnpm scrape          # WordPress REST API + gerenderde HTML + media → scraped/
pnpm scrape:text     # HTML → leesbare markdown in scraped/text
pnpm import:content  # blogposts en algemene voorwaarden → src/content (overschrijft!)
```

## Netlify

- Build: `pnpm build`, publish: `dist` (zie `netlify.toml`).
- Deploy previews en branch deploys krijgen automatisch `noindex` (`PUBLIC_NOINDEX=true`).
- Formulieren: Netlify Forms (`contact`, `offerte`, `proeverij`, `nieuwsbrief`). Stel e-mailnotificaties in onder _Forms_.
- Keystatic in productie: maak een GitHub-app aan via `/keystatic` en zet `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` en `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` als omgevingsvariabelen. Zonder die variabelen werkt het beheer alleen lokaal.
- Primair domein `flavory.wine`; `www` stuurt Netlify zelf door.

## SEO-audit en plan

- `flavory.wine-audit/` — SEO-audit van 16 september 2026 (health score 37/100), met `ACTION-PLAN.md`, bevindingen, screenshots en crawldata.
- `flavory.wine-plan/` — strategie, sitestructuur, contentkalender, roadmap en `STACK-RECOMMENDATION.md`.
