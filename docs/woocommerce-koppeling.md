# Koppeling met WooCommerce

De nieuwe site (Astro, Netlify) toont de producten en heeft het winkelmandje. WooCommerce (WordPress) blijft de winkel: prijs, voorraad, afrekenen, betalen, orders en mails.

## Hoe het werkt

1. **Prijs en voorraad.** Elke keuze in Keystatic heeft een veld *WooCommerce-product-ID*. Bij elke build haalt de site prijs en voorraad van die producten op uit WooCommerce. In de browser worden ze nog eens ververst via `/woo-api/…`, een proxy op Netlify, omdat WooCommerce geen CORS-header voor andere domeinen meestuurt.
2. **Afrekenen.** De knop *Afrekenen* stuurt de bezoeker naar `<winkel>/?flavory_cart=13647:1,19757:2`. De plugin *Flavory cart bridge* maakt daarmee het WooCommerce-winkelmandje aan en stuurt door naar de checkout.
3. **Een box zonder WooCommerce-ID** kan niet afgerekend worden. Het winkelmandje toont dan een melding om via e-mail te bestellen.

Het adres van de winkel staat op twee plaatsen in `netlify.toml`: `PUBLIC_WOO_URL` en de `/woo-api/*`-proxy. Bij de lancering worden beide `https://www.flavory.wine` (zie `docs/lancering.md`).

## Stap 1: producten in WooCommerce (Bart)

- **Elke box die op de site te koop is, bestaat als eigen product in WooCommerce**, met prijs, SKU, EAN en voorraad.
- **Het product moet gepubliceerd zijn.** "Verborgen in de catalogus" mag wel, maar een concept of privéproduct kan niemand kopen.
- **Het product-ID** vind je in de adresbalk als je het product bewerkt (`post.php?post=13647`). Vul het in Keystatic in: Producten → Keuzes → WooCommerce-product-ID.

## Stap 2: plugin installeren (Bart)

1. Zet `integrations/wordpress/flavory-cart-bridge.php` in `wp-content/mu-plugins/` op de server, via FTP of het bestandsbeheer van de hosting. Een *must-use plugin* staat altijd aan en kan niet per ongeluk uitgezet worden.
2. Test het door `https://flavory.wine/?flavory_cart=13647:1` te openen. Je moet op de checkout landen met één box Italië vs Spanje in het winkelmandje.
3. Werkt dat, dan werkt de knop *Afrekenen* op https://flavory2.netlify.app ook.

De plugin kan ook nu al op de huidige site staan. Zonder `?flavory_cart=` in de URL doet hij niets.

## Stap 3: lancering

De lancering volgt `docs/lancering.md`. WordPress komt op **`www.flavory.wine`**, en niet op `shop.flavory.wine`, omdat de server van Combell `www` al kent. Zo kan elke stap zonder hostingtoegang teruggedraaid worden.

## Stap 4: testen

- Bestel naar een Belgisch en een Nederlands adres, met Bancontact en iDEAL. Gebruik een kortingscode van 100% of de testmodus van de betaalprovider.
- Controleer:
  - komt het winkelmandje juist over (aantallen, twee verschillende boxen)?
  - gratis verzending vanaf 2 boxen
  - leeftijdscheck
  - orderbevestiging
  - de aankoopmeting (`purchase`) in GA4

## Promoties (kortingsprijzen)

Een promotie stel je in WooCommerce in: vul bij het product de *actieprijs* in, en via *Inplannen* de begin- en einddatum. De site doet de rest:

- **Op de site.** Kaarten, productpagina's en het winkelmandje tonen de gewone prijs doorstreept naast de actieprijs.
- **Voor Google.** De productgegevens (Offer) en de merchant feed (`sale_price`) gebruiken de actieprijs.
- **Einddatum.** De Store API van WooCommerce geeft de einddatum van een promotie niet mee. Versie 1.3.0 van de plugin *Flavory cart bridge* voegt ze toe (`extensions.flavory.sale_end`). Zet dus de nieuwe versie van `integrations/wordpress/flavory-cart-bridge.php` in `wp-content/mu-plugins/`. Zonder die versie werken de kortingsprijzen wel, maar blijft `priceValidUntil` op een jaar na de build staan.
- **Na het einde van de promotie** moet de site opnieuw bouwen, anders blijft de actieprijs in de productgegevens en de feed staan. De prijs op de pagina zelf wordt wel in de browser ververst. Start een deploy in Netlify zolang de webhook hieronder er niet is.

De campagnepagina `/black-friday/` en de aankondigingsbalk zet je aan met `SITE.campaign` in `src/lib/site.ts`.

## Nog te doen

- **Cross-domain meting in GA4** voor `flavory.wine` en `www.flavory.wine`, zodat een aankoop aan de juiste bron wordt toegekend.
- **Webhook in WooCommerce** (Instellingen → Geavanceerd → Webhooks, *Product bijgewerkt*) naar een Netlify build hook, zodat de site opnieuw bouwt na een prijswijziging. De build hook-URL is geheim: zet hem enkel in WooCommerce, nooit in deze repository.
