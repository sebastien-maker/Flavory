# Flavory — SEO-audit, strategie en herbouwplan

Werkrepo voor de herbouw van [flavory.wine](https://flavory.wine) als SEO-first e-commerce site. Bevat de volledige SEO-audit van 16 september 2026, het strategische SEO-plan en het stackadvies. De sitecode komt later in deze repo (zie `flavory.wine-plan/STACK-RECOMMENDATION.md` §5 voor de voorgestelde structuur).

## Inhoud

### `flavory.wine-audit/` — SEO-audit (16 sep 2026, health score 37/100)
- `FULL-AUDIT-REPORT.md` — volledige bevindingen per categorie (Engels)
- `ACTION-PLAN.md` — geprioriteerde acties in vier fasen
- `Google-SEO-Report-flavory.wine-full.pdf` — rapport als PDF (16 pagina's)
- `findings/` — elf specialistische rapporten: technical, content, schema, sitemap, performance, visual, geo, ecommerce, cluster, sxo, backlinks
- `screenshots/` — desktop- en mobielcaptures van home, shop, product, blog, FAQ
- `data/` — crawl van 209 URL's (`crawl.json`, `crawl_summary.csv`), inbound links, sitemap-URL's
- `audit-data.json` — gestructureerde samenvatting waaruit het PDF-rapport is gegenereerd

### `flavory.wine-plan/` — strategisch SEO-plan (Nederlands)
- `SEO-STRATEGY.md` — discovery, positionering, technische basis, KPI-doelen tot september 2027
- `COMPETITOR-ANALYSIS.md` — vijf directe concurrenten (BE/NL), zoekwoordgaten, positionering
- `SITE-STRUCTURE.md` — doelstructuur, redirect-map, Duitse sectie, interne links, schema per paginatype
- `CONTENT-CALENDAR.md` — maandplanning oktober 2026 – september 2027
- `IMPLEMENTATION-ROADMAP.md` — vier fasen met rol, inspanning en meetpunt
- `STACK-RECOMMENDATION.md` — stackadvies voor de herbouw: Astro 7 + Netlify + Shopify headless + Keystatic
- `data/` — Search Console-analyse (12 maanden)

## Kernbevindingen in het kort
1. Serverresponstijd van 3 tot 7 seconden op elke pagina; caching wordt door cookies omzeild.
2. Geen Product-, Offer- of reviewschema op productpagina's.
3. Elke onbekende URL stuurt door naar de homepage; 26 oude product-URL's (442 klikken per jaar) en het privacybeleid lekken zo weg.
4. Geen hreflang; Duitse sectie half af; ±40% van de URL's zijn test- of duplicaatpagina's.
5. 88% van het organische verkeer is merkverkeer; de markt zoekt op "wijnproeverij thuis", "wijnbox cadeau" en druivenvergelijkingen waar Flavory onzichtbaar is.

## Volgende stappen
- Fase 1 van `ACTION-PLAN.md` uitvoeren op de huidige WordPress-site vóór 15 november 2026.
- Beslissingen uit `STACK-RECOMMENDATION.md` §8 nemen en de nieuwe site in januari 2027 lanceren.
