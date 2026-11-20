# Design-richtlijnen

Deze regels gelden voor elke wijziging aan layout of vormgeving van flavory.wine. Wijkt een voorstel ervan af, leg dan in de pull request uit waarom.

Visuele referentie: https://claude.ai/artifact/NwaGf54mcZsooDZp5s9cTM

## Kleur

- Rood (`--color-brand`) alleen voor de primaire knop, links en kleine accenten.
- Achtergronden zijn crème en wit, afwisselend per sectie.
- Geen volle rode vlakken, ook niet in de footer.
- `--color-sticker` (oranje) wordt niet meer gebruikt.

### Uitzondering: de keuze tussen wit en rood

In de kaarten "Witte wijn" en "Rode wijn" volgt de kleur de wijn:

- Wit: knop lichtblauw `#8fd5e4` (`--color-wine-white`) met zwarte tekst, accenttekst `#1f6f86`.
- Rood: knop `#d60021` (`--color-brand`) met witte tekst, accenttekst `#b8001c`.
- De kaarten gebruiken de maten van artboard 5A: titel 24 px, knop 15 px, de cursieve regel en "vanaf" 13 px.
- Op de productpagina loopt de kleur door: de titelzone in een lichte tint, de gekozen box en de knop "In winkelmandje" in de kleur van de wijn (artboard 2B).

Buiten die keuze blijft rood de enige accentkleur.

## Lettertypes

- TheSans alleen voor H1 en H2.
- Montserrat voor al de rest: tekst, H3 en lager, knoppen, labels.

## Tekstgroottes

- Toegestaan: 14, 16, 18, 22, 28 en 36 px.
- Niets onder 14 px, behalve wettelijke tekst.

## Knoppen

- Eén primaire knop per scherm.
- Gewone schrijfwijze, geen uppercase.
- Al de rest is een tekstlink of een omlijnde knop.

## Ruimte

- Afstanden in stappen van 8 px.
- 64 px tussen secties op mobiel.

## Secties

- Maximaal 6 secties per pagina.
- Elke sectie heeft één H2 en hoogstens één knop.

## Beelden

- Foto's van echte mensen en van de dozen dragen het verhaal.
- Illustraties alleen als klein accent.
- Geen tekst in afbeeldingen.

## Iconen

- Eén set lijniconen, zwart, met één lijndikte.

## Lijsten

- Hoogstens drie vinkjes op een rij.

## Bewegende elementen

- Geen horizontale carrousels op mobiel. Enige uitzondering: de productgalerij.

## Tijdelijke actie (Black Friday)

Geldt alleen zolang `SITE.campaign` in `src/lib/site.ts` op `blackfriday` staat. Zonder actie ziet de site eruit zoals hierboven.

- De balk bovenaan is zwart met witte, vette tekst, met "Gratis verzending vanaf 2 boxen" eerst. Tijdens een actie staat de actie ernaast als link, vanaf tablet met de tijd die nog rest.
- Drie zones worden zwart met witte tekst (`.bf-dark`): de hero van de homepage, de hero van `/black-friday/` en de titelzone op de productpagina. Op de homepage en `/black-friday/` is ook de header zwart, met het witte logo. Dat is de enige uitzondering op "achtergronden zijn crème en wit". De rest van de pagina blijft licht, zodat de actie leest als een tijdelijke laag.
- In een zwarte zone is rood alleen het blokje achter de korting (`.bf-pct`) en de koopknop. Rode tekst op zwart haalt het contrast niet.
- Boven de kop staat één regel: de korting in een rood blokje, "Black Friday" en de tijd die nog rest.
- De aftelklok in blokken (`CountdownClock.astro`) staat op de productpagina en op `/black-friday/`. Ze telt af naar een echt eindmoment en begint nooit opnieuw. De einddatum staat ook in woorden in de HTML. De klok is de enige beweging op de pagina.
- Op de productpagina staat bij de prijs wat je bespaart. Dat bedrag wordt berekend uit de twee prijzen van WooCommerce.
- Op de kaarten van de boxen staat een rood label met de korting (`.bf-badge`).
- De keuzekaarten in een zwarte zone zijn zelf donker. Het product staat er vrij op, zonder beige vlak (`packshot-rood-vrij.webp` en `packshot-wit-vrij.webp`), met een zachte gloed in de kleur van de wijn. Een foto met een lichte achtergrond hoort niet op zwart.
- De actieband (`PromoBanner.astro`, zwart met witte tekst) staat nog boven de twee kaarten bij "Kies je box". Het cijfer staat stil.
- Een doorstreepte prijs komt altijd uit WooCommerce, nooit uit de code.
- Geen valse schaarste: geen voorraadtellers, geen klok die herbegint, geen "laatste kans" zolang er nog een stap van de actie volgt.

## De weg naar een box

- De twee keuzekaarten Wit en Rood staan in de hero van de homepage (`BoxPick.astro`), ook zonder actie. Eén tik van de homepage naar een productpagina.
- Op `/black-friday/` legt de knop op de kaart de Standaard-box meteen in het winkelmandje. Een tekstlink eronder gaat naar de productpagina.
- Op de productpagina staan titel, prijs en koopknop op mobiel als één blok vlak onder de foto. De eerste box die te koop is, is vooraf gekozen. Vanaf tablet staat de knop onder de opties.
