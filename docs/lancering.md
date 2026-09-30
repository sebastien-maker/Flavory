# Draaiboek lancering flavory.wine

De nieuwe site (Netlify) komt op `flavory.wine`. WordPress/WooCommerce wordt de kassa op `www.flavory.wine`. De server van Combell kent `www` al (het certificaat dekt het), dus elke stap kan teruggedraaid worden **zonder hostingtoegang**.

> **Nooit** het WordPress-adres naar een adres zetten dat nog niet werkt. In september werd het op `shop.flavory.wine` gezet, dat bij Combell niet ingesteld was. Daardoor was de winkel een halve dag onbereikbaar.

## Voorwaarden (allemaal afgevinkt vóór de lanceringsdag)

- [ ] Volledige back-up met UpdraftPlus, gedownload (databank, plugins, thema's, uploads)
- [ ] Plugin *Flavory cart bridge* **1.1.0** geïnstalleerd. Die stuurt na de verhuis alles behalve de kassa door en zet noindex. Zolang WordPress op flavory.wine staat, doet de nieuwe code niets.
- [ ] WooCommerce: alle boxen gepubliceerd, prijzen juist, testbestelling via flavory2.netlify.app gelukt
- [ ] In Netlify (project **flavory2**): `flavory.wine` toegevoegd als domein. **Voeg `www` niet toe.** Het A-record van Netlify genoteerd.
- [ ] De PR "switch shop URL to www" staat klaar (nog niet gemerged)
- [ ] Een dag vooraf: TTL van het `@`-record bij Combell op **300**
- [ ] Iedereen beschikbaar tussen 09:00 en 12:00, op een dinsdag of woensdag, vóór 15 november

## Huidige DNS-waarden (om terug te zetten)

| Type | Naam | Waarde |
|---|---|---|
| A | `@` | `188.208.37.2` |
| AAAA | `@` | `2a00:1c98:1000:12a2:0:3:b06c:43cb` |
| A | `www` | `188.208.37.2` (**blijft zo**) |
| MX, TXT | — | **nooit aanraken** (mail via Google Workspace, SPF, DMARC, verificaties) |

## Stap A: WordPress naar www (± 09:00)

1. Maak een nieuwe back-up met UpdraftPlus.
2. WordPress → Instellingen → Algemeen: **WordPress-adres** en **Site-adres** op `https://www.flavory.wine`. Opslaan.
3. **Controle (Claude):**
   - `https://flavory.wine` stuurt door naar www
   - de checkout werkt op www
   - `www.flavory.wine/?flavory_cart=13647:1` komt op de checkout uit
   - een pagina als `/over-flavory/` op www gaat met een 301 naar flavory.wine. De oude site is dan tijdelijk even weg; dat is de verwachte toestand tussen stap A en B.
4. **Terugdraaien:** inloggen op `https://www.flavory.wine/wp-login.php` en beide adressen terugzetten naar `https://flavory.wine`.

Voer stap B pas uit als stap A in orde is. Laat de tijd tussen A en B zo kort mogelijk, want de oude pagina's wijzen dan naar de nieuwe site, die nog niet live is.

## Stap B: nieuwe site live (meteen na A)

1. **Claude** merget de PR "switch shop URL to www". De build duurt ongeveer 2 minuten.
2. **DNS bij Combell:**
   - A-record `@` wordt het IP van Netlify (zie Netlify → Domain management)
   - het AAAA-record van `@` **verwijderen**
   - `www`, MX en TXT: **niets aan veranderen**
3. In Netlify → Domain management → HTTPS: wacht tot het certificaat voor `flavory.wine` er is. Duurt het langer dan een paar minuten, klik dan op *Verify DNS configuration*.
4. **Controle (Claude):**
   - flavory.wine toont de nieuwe site met een geldig certificaat
   - 10 oude URL's geven een 301 naar de juiste nieuwe pagina
   - winkelmandje → checkout op www → betaalpagina van Mollie (niet afronden, of met een code van 100%)
   - de mail naar info@flavory.wine komt aan
   - `robots.txt` en `sitemap-index.xml` op flavory.wine zijn die van de nieuwe site
5. **Terugdraaien:** de DNS-waarden hierboven terugzetten, en eventueel stap A terugdraaien.

## Na de lancering (dezelfde dag)

- Search Console en Bing Webmaster Tools: sitemap `https://flavory.wine/sitemap-index.xml` indienen
- Een echte bestelling volgen tot in WooCommerce: status betaald, orderbevestiging, leeftijdscheck
- Klaviyo, GA4 en Meta Pixel nakijken
- Een WooCommerce-webhook (*Product bijgewerkt*) naar een Netlify build hook instellen
- 404's in de gaten houden (Netlify → Logs), en ontbrekende redirects toevoegen

## Noodprocedure: WordPress onbereikbaar en geen login mogelijk

Werkt het adres waar WordPress naartoe verwijst niet, dan kan niemand inloggen om het terug te zetten. Zonder hostingtoegang werkt deze omweg (in september getest):

1. Netlify: nieuw project, en een map met een bestand `_redirects` erin slepen, met deze inhoud:
   `/*  https://flavory.wine/:splat  200!`
   Daarin moet `flavory.wine` een adres zijn waarop de server van Combell nog antwoordt.
2. Het kapotte adres toevoegen als domein van dat project. Netlify vraagt om een TXT-record ter verificatie.
3. DNS: het kapotte adres als CNAME naar `<project>.netlify.app`.
4. Inloggen via het kapotte adres en onder Instellingen → Algemeen het adres terugzetten.
5. Opruimen: de CNAME en de TXT verwijderen, en het project verwijderen.

Of: laat de contracthouder de support van Combell vragen om `siteurl` en `home` terug te zetten.
