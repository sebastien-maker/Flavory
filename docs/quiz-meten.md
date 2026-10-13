# De quiz meten

Elk spel van de quiz `/quiz/ken-jij-spanje/` laat een anonieme registratie achter, zodat we zien wat spelers invullen.

## Wat er bewaard wordt

Per spel, in Netlify Blobs (opslag `quiz-results`):

- datum en uur (Brusselse tijd);
- de quiz (`ken-jij-spanje`) en een willekeurige spel-ID die de browser voor dat ene spel maakt;
- per vraag: het vraag-ID, de trap, juist of fout, en bij kaartvragen de afstand in km;
- de bereikte vraag, of alles gehaald is, het aantal fouten en de titel;
- het antwoord op de slotvraag;
- of de speler op "Bekijk de box" of "Delen" klikte;
- een spel dat halverwege stopt (de speler verlaat de pagina): de antwoorden tot dan.

## Wat er niet bewaard wordt

Geen IP-adres, geen cookies, geen user agent, geen ID op het toestel (geen localStorage), geen fingerprinting. De spel-ID leeft alleen in het geheugen van de pagina en is bij elk nieuw spel anders. De functie aanvaardt alleen een vaste vorm, dus vrije tekst (zoals een e-mailadres) komt er niet in, en ze logt niets.

Spellen op een voorbeeldversie (Deploy Preview) worden apart bewaard als testspellen.

## De resultaten ophalen

Eenmalig instellen (Bart of Kathleen, met Barts ja):

1. Maak een sleutel: `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"`.
2. Zet ze in Netlify bij het project `flavory2`, onder **Site configuration > Environment variables**, als `QUIZ_RESULTS_KEY`, met als scope **Functions**. Daarna één keer opnieuw publiceren, want functies lezen een nieuwe variabele pas na een deploy.
3. Zet dezelfde sleutel op de pc als Windows-omgevingsvariabele: `setx QUIZ_RESULTS_KEY "<sleutel>"`. Nooit in een bestand.

Wekelijks:

```
node scripts/quiz-results.mjs 2026-10-13 2026-10-19 "C:\pad\naar\map"
```

Dat maakt twee CSV-bestanden voor Excel: één rij per spel en één rij per antwoord. Zonder datums krijg je de laatste 7 dagen. Zolang `QUIZ_RESULTS_KEY` niet in Netlify staat, staat uitlezen uit.

Testspellen van een voorbeeldversie lees je zonder sleutel:

```
QUIZ_RESULTS_URL=https://deploy-preview-<nr>--flavory2.netlify.app/.netlify/functions/quiz-results node scripts/quiz-results.mjs
```

## Kost

Elke registratie is één webverzoek (2 credits per 10.000) en een korte functie-aanroep (10 credits per GB-uur): samen ongeveer 0,001 credit. Een spel geeft 2 à 4 registraties, dus 1.000 spellen kosten zo'n 3 credits. Netlify noemt voor Blobs zelf geen apart tarief; het gaat van dezelfde credits af (stand oktober 2026).
