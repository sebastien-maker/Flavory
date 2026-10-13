// Questions, levels and titles of the quiz "Ken jij Spanje?" (/quiz/ken-jij-spanje/).
// Spec: "T93 Quiz Ken jij Spanje (opzet)" of 13 Oct 2026. Every play takes three random questions per level.
// Questions can be swapped here without touching the page: keep five per level and put the right answer first
// (the page shuffles the options).

interface ChoiceQuestion {
  id: string;
  kind: 'choice';
  question: string;
  /** The right answer first. */
  options: readonly [string, string, string];
  fact: string;
}

interface MapQuestion {
  id: string;
  kind: 'map';
  /** "Tik waar {place} ligt." */
  place: string;
  lat: number;
  lon: number;
  /** A tap within this distance counts as right: 200 km for a city, 100 km for a wine region (Bart, 13 Oct). */
  radiusKm: number;
  fact: string;
}

export type QuizQuestion = ChoiceQuestion | MapQuestion;

export const QUESTIONS_PER_LEVEL = 3;

/** Mistakes allowed before the game stops. */
export const JOKERS = 1;

const CITY_KM = 200;
const REGION_KM = 100;

export const LEVELS: { name: string; questions: QuizQuestion[] }[] = [
  {
    name: 'Vakantie',
    questions: [
      {
        id: 'cava',
        kind: 'choice',
        question: 'Welke bubbels komen uit Spanje?',
        options: ['Cava', 'Champagne', 'Prosecco'],
        fact: 'Cava maak je zoals champagne, met een tweede gisting in de fles. Het meeste komt uit de streek rond Barcelona.',
      },
      {
        id: 'vino-tinto',
        kind: 'choice',
        question: 'Wat betekent "vino tinto"?',
        options: ['Rode wijn', 'Witte wijn', 'Rosé'],
        fact: 'Tinto betekent getint. Rosé heet in Spanje rosado.',
      },
      {
        id: 'wijngaarden',
        kind: 'choice',
        question: 'Welk land heeft de meeste wijngaarden ter wereld?',
        options: ['Spanje', 'Frankrijk', 'Italië'],
        fact: 'Spanje heeft zo’n 930.000 hectare wijngaard. Toch maken Italië en Frankrijk meer wijn: in het droge Spanje brengt een wijngaard minder druiven op.',
      },
      {
        id: 'hoofdstad',
        kind: 'choice',
        question: 'Wat is de hoofdstad van Spanje?',
        options: ['Madrid', 'Barcelona', 'Sevilla'],
        fact: 'Ook rond Madrid maken ze wijn: Vinos de Madrid.',
      },
      {
        id: 'barcelona',
        kind: 'map',
        place: 'Barcelona',
        lat: 41.39,
        lon: 2.17,
        radiusKm: CITY_KM,
        fact: 'Net ten zuidwesten ervan ligt Penedès, de thuisbasis van cava.',
      },
    ],
  },
  {
    name: 'De kaart',
    questions: [
      {
        id: 'sevilla',
        kind: 'map',
        place: 'Sevilla',
        lat: 37.39,
        lon: -5.98,
        radiusKm: CITY_KM,
        fact: 'Een uur verder ligt Jerez, de stad van de sherry.',
      },
      {
        id: 'bilbao',
        kind: 'map',
        place: 'Bilbao',
        lat: 43.26,
        lon: -2.93,
        radiusKm: CITY_KM,
        fact: 'Op zo’n anderhalf uur rijden naar het zuiden ligt Rioja.',
      },
      {
        id: 'valencia',
        kind: 'map',
        place: 'Valencia',
        lat: 39.47,
        lon: -0.38,
        radiusKm: CITY_KM,
        fact: 'Iets zuidelijker groeit Monastrell. In Frankrijk heet die druif Mourvèdre.',
      },
      {
        id: 'madrid',
        kind: 'map',
        place: 'Madrid',
        lat: 40.42,
        lon: -3.7,
        radiusKm: CITY_KM,
        fact: 'Madrid ligt op zo’n 650 meter hoogte, midden op een hoogvlakte.',
      },
      {
        // Measured from the middle of the island: 100 km covers all of Mallorca and most of Menorca, not Ibiza.
        // From Palma, Menorca would be 112 km or more away.
        id: 'mallorca',
        kind: 'map',
        place: 'Mallorca',
        lat: 39.62,
        lon: 2.98,
        radiusKm: 100,
        fact: 'Ook op Mallorca maken ze wijn, onder meer rond Binissalem.',
      },
    ],
  },
  {
    name: 'Wijnstreken',
    questions: [
      {
        id: 'rioja',
        kind: 'map',
        place: 'Rioja',
        lat: 42.42,
        lon: -2.35,
        radiusKm: REGION_KM,
        fact: 'Rioja ligt langs de rivier de Ebro en is een van de bekendste wijnstreken van Spanje.',
      },
      {
        id: 'ribera-del-duero',
        kind: 'map',
        place: 'Ribera del Duero',
        lat: 41.63,
        lon: -3.95,
        radiusKm: REGION_KM,
        fact: 'De wijngaarden liggen hoog, van zo’n 700 tot meer dan 1.000 meter: warme dagen, koude nachten.',
      },
      {
        id: 'rioja-kleur',
        kind: 'choice',
        question: 'Rioja is vooral bekend voor ...',
        options: ['Rode wijn', 'Witte wijn', 'Bubbels'],
        fact: 'Het overgrote deel van de Rioja is rood.',
      },
      {
        id: 'rias-baixas',
        kind: 'map',
        place: 'Rías Baixas',
        lat: 42.35,
        lon: -8.65,
        radiusKm: REGION_KM,
        fact: 'Groen, nat en aan de oceaan: frisse witte wijn bij vis en schelpdieren.',
      },
      {
        id: 'sherry',
        kind: 'choice',
        question: 'Waar komt sherry vandaan?',
        options: ['Jerez', 'Rioja', 'Priorat'],
        fact: '"Sherry" is hoe de Engelsen "Jerez" uitspraken.',
      },
    ],
  },
  {
    name: 'Druiven en geuren',
    questions: [
      {
        id: 'tempranillo',
        kind: 'choice',
        question: 'De bekendste rode druif van Spanje is ...',
        options: ['Tempranillo', 'Merlot', 'Pinot Noir'],
        fact: 'Temprano betekent vroeg: de druif rijpt vroeg.',
      },
      {
        id: 'rioja-reserva',
        kind: 'choice',
        question: 'Wat ruik je vaak in een klassieke Rioja Reserva?',
        options: ['Vanille en kokos', 'Citroen en gras', 'Banaan'],
        fact: 'Dat komt van vaten van Amerikaanse eik.',
      },
      {
        id: 'albarino',
        kind: 'choice',
        question: 'Welke witte druif hoort bij Rías Baixas?',
        options: ['Albariño', 'Chardonnay', 'Riesling'],
        fact: 'Albariño staat er op zowat alle wijngaarden: meer dan 90 procent.',
      },
      {
        id: 'priorat',
        kind: 'choice',
        question: 'In Priorat groeien de wijnstokken op ...',
        options: ['Leisteen', 'Zand', 'Klei'],
        fact: 'De Catalanen noemen die bodem llicorella. De wortels gaan diep op zoek naar water.',
      },
      {
        id: 'garnacha',
        kind: 'choice',
        question: 'Garnacha heet in Frankrijk ...',
        options: ['Grenache', 'Gamay', 'Merlot'],
        fact: 'Grenache is onder meer de hoofddruif van Châteauneuf-du-Pape, in het zuiden van de Rhône.',
      },
    ],
  },
  {
    name: 'Expert',
    questions: [
      {
        id: 'gran-reserva',
        kind: 'choice',
        question: 'Crianza, Reserva of Gran Reserva: welke rijpt het langst?',
        options: ['Gran Reserva', 'Reserva', 'Crianza'],
        fact: 'In Rioja minstens vijf jaar, waarvan twee op vat.',
      },
      {
        id: 'flor',
        kind: 'choice',
        question: 'Wat is "flor" bij sherry?',
        options: ['Een laagje gist op de wijn', 'Een bloemengeur', 'Een soort kurk'],
        fact: 'Het beschermt fino tegen de lucht. Zo blijft hij bleek en fris.',
      },
      {
        id: 'vega-sicilia',
        kind: 'choice',
        question: 'De Spaanse topwijn Vega Sicilia komt uit ...',
        options: ['Ribera del Duero', 'Rioja', 'Jerez'],
        fact: 'Vega Sicilia maakt er al wijn sinds 1864, lang voor Ribera del Duero in 1982 een officiële herkomstbenaming kreeg.',
      },
      {
        id: 'tinto-fino',
        kind: 'choice',
        question: 'Hoe heet Tempranillo in Ribera del Duero?',
        options: ['Tinto Fino', 'Garnacha', 'Albariño'],
        fact: 'Ze zeggen er ook Tinta del País: de druif van het land.',
      },
      {
        id: 'doca',
        kind: 'choice',
        question: 'Welke streek kreeg naast Rioja de hoogste status (DOCa)?',
        options: ['Priorat', 'La Mancha', 'Rías Baixas'],
        fact: 'In het Catalaans heet die status DOQ. Voorlopig zijn Rioja en Priorat de enige twee.',
      },
    ],
  },
];

/** Title by the question a player reached; all questions done is the top title. */
export const TITLES: { from: number; title: string }[] = [
  { from: 1, title: 'Toerist' },
  { from: 4, title: 'Vakantieganger' },
  { from: 7, title: 'Wijnreiziger' },
  { from: 10, title: 'Kenner' },
  { from: 13, title: 'Sommelier in spe' },
];
export const TOP_TITLE = 'Spanjekenner';

export const FINAL_QUESTION = {
  question: 'Zou jij een Spaanse en een Italiaanse rode wijn blind uit elkaar halen?',
  options: ['Ja, zeker', 'Misschien', 'Geen idee'],
} as const;
