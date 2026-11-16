# Design-richtlijnen

Deze regels gelden voor elke wijziging aan layout of vormgeving van flavory.wine. Wijkt een voorstel ervan af, leg dan in de pull request uit waarom.

Visuele referentie (alleen gsm-schermen): https://claude.ai/artifact/NwaGf54mcZsooDZp5s9cTM

Bijgewerkt op 16 november 2026, bij de Black Friday-versie: een maat voor de computer, de taak van foto's en tekeningen, en wat er tijdens een actie mag. Wat nieuw is, staat telkens onder "Sinds 16/11".

## Kleur

- Rood (`--color-brand`) alleen voor de primaire knop, links en kleine accenten.
- Achtergronden zijn crème en wit, afwisselend per sectie.
- Geen volle rode vlakken, ook niet in de footer.
- `--color-sticker` (oranje) wordt niet meer gebruikt.

Sinds 16/11:

- Tijdens een actie is de balk bovenaan zwart met witte tekst, net als de balk "weer op voorraad". Dezelfde zwarte balk staat dan bovenaan in het winkelmandje.
- De zin van de actie staat in het rood, vet, vlak bij de prijs of de knop.

### Uitzondering: de keuze tussen wit en rood

In de kaarten "Witte wijn" en "Rode wijn" volgt de kleur de wijn:

- Wit: knop lichtblauw `#8fd5e4` (`--color-wine-white`) met zwarte tekst, accenttekst `#1f6f86`.
- Rood: knop `#d60021` (`--color-brand`) met witte tekst, accenttekst `#b8001c`.
- De kaarten gebruiken de maten van artboard 5A: titel 24 px, knop 15 px, de cursieve regel en "vanaf" 13 px.
- Op de productpagina loopt de kleur door: de titelzone in een lichte tint, de gekozen box en de knop "In winkelmandje" in de kleur van de wijn (artboard 2B).

Buiten die keuze blijft rood de enige accentkleur.

Sinds 16/11 geldt dezelfde regel voor de dozenkaarten met koopknop (`BoxShelf.astro`) en voor het aanbod in het winkelmandje: de knop heeft de kleur van de wijn.

## Lettertypes

- TheSans alleen voor H1 en H2.
- Montserrat voor al de rest: tekst, H3 en lager, knoppen, labels.

## Tekstgroottes

- Toegestaan: 14, 16, 18, 22, 28 en 36 px.
- Niets onder 14 px, behalve wettelijke tekst.

Sinds 16/11:

- De kop van de homepage is 48 px vanaf een schermbreedte van 1024 px: 36 px staat daar verloren. Op de gsm is hij 28 px, omdat de zin lang is. Geen andere tekst gaat boven 36 px.

## Knoppen

- Eén primaire knop per scherm.
- Gewone schrijfwijze, geen uppercase.
- Al de rest is een tekstlink of een omlijnde knop.

Sinds 16/11:

- In een rij dozen heeft elke doos haar eigen koopknop: dat is één knop per doos, niet per scherm. De tweede keuze op dezelfde kaart (Premium) is een omlijnde knop.
- Op de productpagina blijft de koopknop in beeld: als de gewone knop buiten beeld valt, verschijnt onderaan een vaste balk met dezelfde knop, op de gsm en op de computer.

## Ruimte

- Afstanden in stappen van 8 px.
- 64 px tussen secties op mobiel.

## Secties

- Maximaal 6 secties per pagina.
- Elke sectie heeft één H2 en hoogstens één knop.

Sinds 16/11:

- De homepage is de uitzondering en heeft er acht: bovenaan, wat is Flavory, de dozen, de stappen, cadeau, reviews, blogs en de nieuwsbrief.
- De sectie met de dozen heeft een knop per doos (zie Knoppen).

## Computer

Nieuw sinds 16/11. De referentie toont alleen gsm-schermen; dit zijn de regels voor brede schermen.

- Wat je op de gsm in het eerste scherm ziet, zie je ook op een laptop in het eerste scherm: de kop, het beeld, de prijs en de knop.
- Tekst en beeld staan naast elkaar in twee kolommen. Een kolom tekst is nooit breder dan ongeveer 36 rem.
- Kaarten vullen de breedte: drie dozen naast elkaar, geen losse kaart in een lege rij.

## Beelden

- Foto's van echte mensen en van de dozen dragen het verhaal.
- Geen tekst in afbeeldingen.

Sinds 16/11:

- **De foto verkoopt.** Waar iemand beslist om te kopen (bovenaan, de dozenkaarten, de productpagina, het winkelmandje), staat een foto van de echte doos.
- **De tekening legt uit.** De tekeningen van de doos staan bij "Wat is Flavory?" en bij de stappen. Dat vervangt de oude regel "illustraties alleen als klein accent".
- In een kaart staat de doos helemaal in beeld en in het midden. De foto's met de twee zakjes zijn rechts afgesneden in de foto zelf: gebruik die alleen groot, niet in een klein vierkant.
- Tijdens een actie mag de tekening van die actie op de site (bijvoorbeeld de Black Friday-tekening van 2025). Staat er een korting in de tekening, dan staat ze er alleen zolang die korting klopt (`SITE.blackFriday.drawing`). Dat is de enige uitzondering op "geen tekst in afbeeldingen".

## Iconen

- Eén set lijniconen, zwart, met één lijndikte.

## Lijsten

- Hoogstens drie vinkjes op een rij.

## Bewegende elementen

- Geen horizontale carrousels op mobiel. Enige uitzondering: de productgalerij.

Sinds 16/11:

- Een aftelklok telt af naar een echte einddatum en begint nooit opnieuw. Zonder JavaScript staat de einddatum er in woorden (`Countdown.astro`).
