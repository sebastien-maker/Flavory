# Wensen voor de checkout in WordPress

De checkout draait op WooCommerce (`www.flavory.wine`), de rest van de site op Astro. Deze lijst is voor wie aan WordPress werkt: **in deze repo staat er geen code voor**. Zie ook `docs/woocommerce-koppeling.md`.

Doel: de overgang van de site naar de kassa mag niet aanvoelen als een andere website, en niets mag de klant uit het afrekenen wegleiden.

## 1. Kale checkout

- Toon in de koptekst **alleen het logo**, zonder menu, zonder winkelmandknop en zonder zoekveld. Het logo linkt naar de homepage.
- **Geen footer** op de checkout, of hoogstens één regel met de links naar de algemene voorwaarden en het privacybeleid.
- Elke extra link is een uitgang. Hoe minder uitgangen, hoe meer bestellingen afgerond raken.

## 2. Besteloverzicht bovenaan

- Zet het overzicht van de bestelling (producten, aantal, verzendkost, totaal) **boven het formulier**, zeker op gsm.
- Vandaag staat dat onderaan, waardoor je op een telefoon eerst een lang formulier ziet en pas daarna wat je koopt.

## 3. Bedrijfsgegevens achter een vinkje

- Voeg een vinkje toe: **"Bestel je als bedrijf?"**
- Pas als dat aangevinkt is, verschijnen de velden **bedrijfsnaam** en **btw-nummer**.
- Zo blijft het formulier kort voor particulieren, en kunnen bedrijven toch correct bestellen.

## 4. Zelfde uiterlijk als de nieuwe site

- **Lettertypes**: TheSans voor de titels, Montserrat voor de rest.
- **Kleuren**: rood `#d60021` voor de knoppen en links, crème `#faf4ed` en wit als achtergrond, zwart `#000000` voor tekst, lijnen in `#e8ddd2`.
- **Knoppen**: gevuld rood met witte tekst, rond, in gewone schrijfwijze (geen hoofdletters).
- Gebruik dezelfde formuleringen als de site: "Niet tevreden? Je krijgt je geld terug." en "Verzending € 7,50 in België en Nederland, gratis vanaf 2 boxen."

## 5. Dubbele footer weg

- Op de shoppagina's staat nu **twee keer een footer** onder elkaar (één van het thema en één van de plugin of de template). Eén ervan moet weg.

## Wat vervalt als we naar Shopify gaan

Als de checkout later naar Shopify verhuist, zijn deze punten overbodig:

- **1. Kale checkout**: Shopify levert dat standaard; je stelt het in via de checkout-editor.
- **2. Besteloverzicht bovenaan**: staat bij Shopify standaard goed op gsm.
- **3. Bedrijfsgegevens achter een vinkje**: Shopify heeft hier eigen instellingen en apps voor; de WordPress-aanpassing is dan weggegooid werk.
- **5. Dubbele footer**: verdwijnt samen met het WordPress-thema.

Blijft wel nodig, ook bij Shopify:

- **4. Zelfde uiterlijk**: lettertypes, kleuren en formuleringen moeten opnieuw ingesteld worden, maar het werk zelf blijft nuttig.
- De afspraken over **prijs, voorraad en garantie** uit `docs/woordenlijst.md`.

**Advies:** doe nu alleen de punten die weinig tijd kosten en meteen schelen (1, 2 en 5). Punt 3 en de volledige huisstijl in WooCommerce zijn pas de moeite als we zeker weten dat we voorlopig op WooCommerce blijven.
