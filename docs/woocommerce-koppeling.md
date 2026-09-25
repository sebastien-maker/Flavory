# Koppeling met WooCommerce

De nieuwe site (Astro, Netlify) toont de producten en heeft het winkelmandje. WooCommerce (WordPress) blijft de winkel: prijs, voorraad, afrekenen, betalen, orders en mails.

## Hoe het werkt

1. **Prijs en voorraad.** Elke keuze in Keystatic heeft een veld *WooCommerce-product-ID*. Bij elke build haalt de site prijs en voorraad van die producten op uit WooCommerce. In de browser worden ze nog eens ververst via `/woo-api/…`, een proxy op Netlify, omdat WooCommerce geen CORS-header voor andere domeinen meestuurt.
2. **Afrekenen.** De knop *Afrekenen* stuurt de bezoeker naar `<winkel>/?flavory_cart=13647:1,19757:2`. De plugin *Flavory cart bridge* maakt daarmee het WooCommerce-winkelmandje aan en stuurt door naar de checkout.
3. **Een box zonder WooCommerce-ID** kan niet afgerekend worden. Het winkelmandje toont dan een melding om via e-mail te bestellen.

Het adres van de winkel staat op twee plaatsen in `netlify.toml`: `PUBLIC_WOO_URL` en de `/woo-api/*`-proxy. Verandert het adres, dan pas je beide aan.

## Stap 1: producten in WooCommerce (Bart)

- **Elke box die op de site te koop is, bestaat als eigen product in WooCommerce**, met prijs, SKU, EAN en voorraad.
- **Het product moet gepubliceerd zijn.** "Verborgen in de catalogus" mag wel, maar een concept of privéproduct kan niemand kopen.
- **Het product-ID** vind je in de adresbalk als je het product bewerkt (`post.php?post=13647`). Vul het in Keystatic in: Producten → Keuzes → WooCommerce-product-ID.

## Stap 2: plugin installeren (Bart)

1. Zet `integrations/wordpress/flavory-cart-bridge.php` in `wp-content/mu-plugins/` op de server, via FTP of het bestandsbeheer van de hosting. Een *must-use plugin* staat altijd aan en kan niet per ongeluk uitgezet worden.
2. Test het door `https://flavory.wine/?flavory_cart=13647:1` te openen. Je moet op de checkout landen met één box Italië vs Spanje in het winkelmandje.
3. Werkt dat, dan werkt de knop *Afrekenen* op https://flavory2.netlify.app ook.

De plugin kan ook nu al op de huidige site staan. Zonder `?flavory_cart=` in de URL doet hij niets.

## Stap 3: WordPress naar `shop.flavory.wine` (Bart, bij de lancering)

1. **Maak het subdomein aan** bij de hosting, met een SSL-certificaat.
2. **Zet in WordPress** onder Instellingen → Algemeen het WordPress-adres en het site-adres op `https://shop.flavory.wine`.
3. **Vervang in de database** `https://flavory.wine` door `https://shop.flavory.wine`, bijvoorbeeld met de plugin *Better Search Replace*. Maak eerst een back-up.
4. **Zet de WordPress-pagina's op noindex.** Alles behalve winkelwagen, checkout, mijn account en bedankt stuurt met een 301 door naar dezelfde URL op `https://flavory.wine`. De nieuwe site heeft voor elke oude URL een redirect klaarstaan.
5. **Stem de checkout visueel af** op de nieuwe site: logo, kleuren (rood `#d60021`, crème `#faf4ed`), en een link terug naar `https://flavory.wine`.
6. **Controleer** de leeftijdsbevestiging en de 18+-bezorgoptie voor Nederland, de betaalmethodes en de orderbevestigingsmail.
7. **DNS:** `flavory.wine` gaat naar Netlify, `shop.flavory.wine` naar de huidige hosting. **Pas alleen de website-records aan (A/CNAME), nooit de MX-records**, anders valt de mail weg.
8. **In deze repository:** `netlify.toml` aanpassen, zowel `PUBLIC_WOO_URL` als de proxy, naar `https://shop.flavory.wine`. Pas daarna `FLAVORY_SHOP_URL` in de plugin aan als dat nodig is.

## Stap 4: testen

- Bestel naar een Belgisch en een Nederlands adres, met Bancontact en iDEAL. Gebruik een kortingscode van 100% of de testmodus van de betaalprovider.
- Controleer:
  - komt het winkelmandje juist over (aantallen, twee verschillende boxen)?
  - gratis verzending vanaf 2 boxen
  - leeftijdscheck
  - orderbevestiging
  - de aankoopmeting (`purchase`) in GA4

## Nog te doen

- **Cross-domain meting in GA4** voor `flavory.wine` en `shop.flavory.wine`, zodat een aankoop aan de juiste bron wordt toegekend.
- **Webhook in WooCommerce** (Instellingen → Geavanceerd → Webhooks, *Product bijgewerkt*) naar een Netlify build hook, zodat de site opnieuw bouwt na een prijswijziging. De build hook-URL is geheim: zet hem enkel in WooCommerce, nooit in deze repository.
