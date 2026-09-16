# Starten met Claude Code op de Flavory-repo (voor Bart)

Vijf stappen. Stap 1 tot 4 doe je één keer, stap 5 is hoe je elke dag werkt.

## Stap 1 — Installeren (eenmalig, 10 minuten)

Je hebt nodig: een Claude-abonnement (Pro of Max), een GitHub-account met toegang tot `sebastien-maker/Flavory`, en op je Mac Node.js 22 of hoger.

Open Terminal en plak deze regels één voor één:

```bash
npm install -g @anthropic-ai/claude-code
```

```bash
npm install -g pnpm
```

```bash
brew install gh && gh auth login
```

Bij `gh auth login` kies je: GitHub.com → HTTPS → Login with a web browser. Volg de browser.

## Stap 2 — Token voor GitHub maken (eenmalig, 2 minuten)

Dit token laat de `@claude`-reviews op GitHub op jouw abonnement draaien.

```bash
claude setup-token
```

Er opent een browser, je logt in met je Claude-account, en Terminal toont een lang token. Kopieer het en stuur het naar Sébastien via een veilig kanaal (niet via gewone mail). Hij zet het in de repo. Daarna heb je dit token zelf nooit meer nodig.

## Stap 3 — Repo ophalen (eenmalig)

```bash
cd ~/Documents && git clone https://github.com/sebastien-maker/Flavory.git && cd Flavory
```

## Stap 4 — Claude Code starten in de repo

```bash
cd ~/Documents/Flavory && claude
```

De eerste keer log je in met je Claude-account. Daarna zit je in een chat die de hele repo kan lezen en aanpassen. Claude leest automatisch `CLAUDE.md`: daar staan alle afspraken (stack, SEO-regels, hoe we committen). Je hoeft die regels dus niet zelf te herhalen.

Handig om te weten:
- Typ gewoon Nederlands. Claude antwoordt in het Nederlands, schrijft code in het Engels.
- Claude vraagt toestemming voor het aanpassen van bestanden en het uitvoeren van commando's. Lees kort wat hij wil doen en druk op Enter om toe te staan.
- `Esc` onderbreekt Claude. `/clear` start een schone chat. `/help` toont de commando's.
- Claude maakt fouten. Lees de diff voor je commit, en test lokaal met `pnpm dev`.

## Stap 5 — Wat je typt (de prompts)

### Eerste sessie: kennismaken met het project

```
Lees CLAUDE.md, flavory.wine-plan/STACK-RECOMMENDATION.md en flavory.wine-audit/ACTION-PLAN.md. Vat in 10 zinnen samen wat we bouwen, welke stack, en wat de vijf belangrijkste SEO-eisen zijn.
```

### Tweede sessie: het project opzetten

```
Zet het Astro 7-project op in de root van deze repo volgens §5 van flavory.wine-plan/STACK-RECOMMENDATION.md: pnpm, TypeScript strict, Tailwind, @astrojs/netlify, @astrojs/sitemap, i18n met nl als standaard zonder prefix en de onder /de/, Keystatic. Maak een SeoHead-component en JSON-LD-helpers volgens de regels in CLAUDE.md, een basislayout met header en footer, een 404-pagina en een lege homepage. Zorg dat pnpm dev en pnpm build werken. Maak een branch feat/project-setup en open een pull request.
```

### Daarna: één feature per prompt, altijd op een nieuwe branch

Productpagina:
```
Maak een nieuwe branch feat/product-page. Bouw de productpagina src/pages/shop/[handle].astro die producten ophaalt uit de Shopify Storefront API (token via omgevingsvariabele SHOPIFY_STOREFRONT_TOKEN, domein via SHOPIFY_STORE_DOMAIN). Gebruik SeoHead, één H1, Product + Offer + AggregateRating JSON-LD, BreadcrumbList, galerij met Astro Image, prijs en voorraad in een klein island dat bij laden ververst. Marketingcopy komt uit de Keystatic-collectie products-copy op handle. Open een PR.
```

Winkelmandje:
```
Maak een branch feat/cart. Bouw een cart-drawer als island op de Shopify Cart API (cartCreate, cartLinesAdd, cartLinesUpdate, checkoutUrl), met kortingscodeveld en een knop naar de Shopify-checkout. De rest van de pagina moet zonder JavaScript blijven werken. Open een PR.
```

Blog:
```
Maak een branch feat/blog. Zet de Keystatic-collectie blog op (nl en de), met velden titel, description, auteur, datum, hero-afbeelding met alt, draft. Bouw /blog/ en /blog/[slug]/ met Article + Person JSON-LD en een gecureerd blok "gerelateerd" van maximaal 4 links. Open een PR.
```

Oude URL's overzetten:
```
Maak een branch seo/redirects. Genereer public/_redirects uit flavory.wine-plan/SITE-STRUCTURE.md §3 en uit alle URL's in flavory.wine-audit/data/crawl_summary.csv, elk naar de juiste nieuwe URL. Geen enkele oude URL mag op de homepage uitkomen. Open een PR.
```

### Prompts die je vaak zult gebruiken

```
Leg uit wat dit bestand doet: src/components/seo/SeoHead.astro
```
```
Fix de fout die pnpm build geeft en leg uit wat er mis was.
```
```
Controleer deze pagina op alle SEO-regels uit CLAUDE.md en geef een lijst met wat ontbreekt.
```
```
Commit mijn wijzigingen met een goede commit message en open een pull request.
```

### Op GitHub zelf

In een pull request of issue kun je `@claude` vermelden, bijvoorbeeld:
```
@claude review deze PR op de SEO-regels uit CLAUDE.md
```
```
@claude pas de meta description van de homepage aan naar maximaal 155 tekens en push het naar deze branch
```
Elke PR krijgt ook automatisch een review van Claude.

## Regels in het kort

1. Nooit rechtstreeks op `main` werken. Altijd een branch en een pull request.
2. Nooit een wachtwoord, token of API-sleutel in de code of in een prompt plakken. Die horen in Netlify-omgevingsvariabelen.
3. Eén feature per prompt, één feature per PR. Kleine stappen gaan sneller dan grote.
4. Lees wat Claude wil doen voor je toestemming geeft. Twijfel je, vraag: "Leg eerst uit wat je gaat doen, verander nog niets."
