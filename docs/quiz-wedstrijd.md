# De wedstrijd bij de quiz

Wie de quiz `/quiz/ken-jij-spanje/` uitspeelt, kan meedoen aan een wekelijkse wedstrijd om een gratis box. Het reglement staat in één bestand, `src/lib/quiz/wedstrijdreglement.md`, en op `/quiz/reglement/`. Data, rondes en het maximum aan extra kansen staan in `src/lib/quiz/contest.ts`.

## Hoe het werkt

- Op het eindscherm: e-mailadres, "Ik ben 18 jaar of ouder" (verplicht), "Ik aanvaard het wedstrijdreglement" (verplicht), "Ik wil de nieuwsbrief van Flavory" (vrij, niet vooraf aangevinkt).
- Eén deelname per e-mailadres per ronde. Een ronde loopt van maandag 00u00 tot zondag 23u59 (Brusselse tijd) en heet naar haar ISO-week, bv. `2026-W42`.
- Na deelname krijgt de speler een persoonlijke link `https://flavory.wine/quiz/ken-jij-spanje/?ref=<code>`. De code telt 10 tekens, is willekeurig en is geen e-mailadres. Doet een nieuwe speler via die link mee, dan telt dat als extra kans voor wie uitnodigde, tot tien per ronde.
- "Deel je score in je story" maakt een beeld van 1080x1920 en deelt het via de gsm, of bewaart het op een computer. Een getagde story geeft één extra kans: die tel je zelf na in Meta Business Suite.
- Buiten de wedstrijdperiode verschijnt het blok niet en weigert de functie deelnames. Op voorbeeldversies staat de wedstrijd altijd open, met testdeelnames die apart bewaard worden.

## Opslag en privacy

Netlify Function `netlify/functions/quiz-contest.mts`, Netlify Blobs, opslag `quiz-contest`. Die staat los van de anonieme registratie van de quiz.

- Per deelname: e-mailadres, ronde, tijdstip, bereikte vraag, alles gehaald, titel, nieuwsbrief ja of nee, eigen code, en de code van wie uitnodigde.
- Geen IP-adres, geen cookies, niets gelogd. E-mailadressen staan alleen in de opslag, nooit in de code, een log of een antwoord van de functie.
- Netlify is al de verwerker van de site en van het nieuwsbriefformulier. De regio van de opslag is bij Netlify niet te kiezen.

## Uitlezen (veilig, zonder sleutel in de code)

De uitleesfunctie `netlify/functions/quiz-contest-results.mts` toont e-mailadressen alleen met een sleutel. Die sleutel staat als omgevingsvariabele in Netlify, nooit in de repo.

Eenmalig instellen (Bart of Kathleen, met Barts ja):

1. Maak een sleutel: `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"`.
2. Zet ze in Netlify bij het project `flavory2`, onder **Site configuration > Environment variables**, als `CONTEST_RESULTS_KEY`, met als scope **Functions** en aangevinkt als geheime waarde ("Contains secret values"). Netlify toont de waarde dan niet meer in het dashboard en verbergt ze in logs. Publiceer daarna één keer opnieuw.
3. Zet dezelfde sleutel op de pc van wie uitleest als Windows-omgevingsvariabele: `setx CONTEST_RESULTS_KEY "<sleutel>"`. Nooit in een bestand.

Zonder die variabele staat uitlezen op productie uit. Op voorbeeldversies kan je zonder sleutel uitlezen, maar dan zijn de e-mailadressen gemaskeerd (`t***@example.com`).

Elke maandag:

```
node scripts/contest-results.mjs vorige "C:\pad\naar\map"
```

Dat maakt twee CSV-bestanden voor Excel:

- `wedstrijd-deelnames-<ronde>.csv`: één rij per persoon, met de deelname, de vrienden die meededen, de extra kansen (maximum tien) en het totaal. Vul de kolom "story getagd" zelf in.
- `wedstrijd-nieuwsbrief-tot-<ronde>.csv`: iedereen die de nieuwsbrief aanvinkte, alle rondes samen.

## De trekking

Tel per persoon de kansen (met de story erbij) en trek één lot uit alle kansen samen. Bijvoorbeeld: neem een willekeurig getal tussen 1 en het totaal aantal kansen en loop de lijst af tot je dat getal bereikt.

## Na de wedstrijd

Uiterlijk op 31 december 2026 de deelnames wissen: in Netlify bij **Blobs**, opslag `quiz-contest`, alles onder `production/entries/`, `production/referrals/`, `production/codes/` en `production/refs/`. De nieuwsbrieflijst (`production/newsletter/`) blijft, voor wie die aanvinkte.

## Kost

Een deelname is één webverzoek en een functie-aanroep met enkele schrijfacties in Blobs: ongeveer 0,001 à 0,002 credit. 1.000 deelnames kosten dus 1 à 2 credits. Netlify noemt voor Blobs zelf geen apart tarief (stand oktober 2026).
