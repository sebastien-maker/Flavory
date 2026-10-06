// Sitewide facts. Used by the layout, footer and Organization schema.
export const SITE = {
  name: 'Flavory',
  legalName: 'Flavory BV',
  url: 'https://flavory.wine',
  tagline: 'Taste the fun',
  // Neutral Dutch: the site serves Belgium and the Netherlands equally.
  locale: 'nl',
  email: 'info@flavory.wine',
  vatId: 'BE0757810421',
  foundingDate: '2021',
  // Number of customers for 'Flavory in het kort', for example 'meer dan 2.000'. Empty: the row is left out.
  customers: '' as string,
  address: {
    street: 'Broedersstraat 15',
    postalCode: '9150',
    city: 'Bazel',
    country: 'BE',
  },
  social: {
    instagram: 'https://www.instagram.com/flavory.wine/',
    facebook: 'https://www.facebook.com/flavorywinetastingathome',
    youtube: 'https://www.youtube.com/@flavory-wine',
    trustpilot: 'https://nl.trustpilot.com/review/flavory.wine',
  },
  // Trustpilot aggregate (audit 16 Sep 2026). Replace with the scheduled sync once the API key exists.
  rating: { value: 4.5, count: 31, source: 'Trustpilot' },
  // Short quote from a real review (src/content/reviews/charlotte.yaml), shown next to the rating.
  featuredReview: { quote: 'Tweede box is al besteld en de derde staat op mijn lijstje!', author: 'Charlotte' },
  // Orders placed before this hour (Brussels time) on working days ship the same day.
  shippingCutoffHour: 12,
  announcement: 'Gratis verzending vanaf 2 boxen',
  shipping: {
    countries: ['BE', 'NL'] as const,
    minDays: 1,
    maxDays: 3,
    freeFromBoxes: 2,
    // Rate for one box, the same for Belgium and the Netherlands. Free from `freeFromBoxes` boxes.
    rate: 7.5,
  },
  returnDays: 14,
  // The only guarantee we make. Use this wording wherever we claim it; the details below belong on
  // the shipping/returns and terms pages.
  guarantee: 'Niet tevreden? Je krijgt je geld terug.',
  guaranteeDetails:
    'Neem binnen 14 dagen na levering contact op via info@flavory.wine en we betalen je terug. Geopende flessen hoeven niet terug.',
  // Seasonal block on /cadeau/. Empty means no block at all. Set a season and the last order day
  // together, for example 'kerst' and 'maandag 22 december'.
  giftSeason: '' as '' | 'kerst' | 'moederdag' | 'vaderdag',
  giftDeadline: '',
  ageNotice: 'Wijn: enkel voor 16+ (België) en 18+ (Nederland)',
  gtmId: 'GTM-MPJ8DPDM',
  // PostHog project API key (public by design: it can only send events). EU cloud.
  posthogKey: 'phc_wyE7EYQB42WLwnUmp7u7b8WLJScYNe74mzLTLe452BM7',
} as const;

export const NAV = [
  { href: '/shop/', label: 'Shop' },
  { href: '/cadeau/', label: 'Cadeau' },
  { href: '/hoe-werkt-het/', label: 'Hoe werkt het?' },
  { href: '/blog/', label: 'Blog' },
] as const;

export const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      { href: '/shop/', label: 'Alle boxen' },
      { href: '/shop/rode-wijn/', label: 'Rode wijn' },
      { href: '/shop/witte-wijn/', label: 'Witte wijn' },
    ],
  },
  {
    title: 'Meer ontdekken',
    links: [
      { href: '/hoe-werkt-het/', label: 'Hoe werkt het?' },
      { href: '/cadeau/', label: 'Cadeau' },
      { href: '/over-flavory/', label: 'Over Flavory' },
      { href: '/reviews/', label: 'Reviews' },
      { href: '/blog/', label: 'Blog' },
    ],
  },
  {
    title: 'Zakelijk',
    links: [{ href: '/zakelijk/', label: 'Relatiegeschenken' }],
  },
  {
    title: 'Klantenservice',
    links: [
      { href: '/faq/', label: 'Veelgestelde vragen' },
      { href: '/verzending-en-retour/', label: 'Verzending en retour' },
      { href: '/contact/', label: 'Contact' },
      { href: '/algemene-voorwaarden/', label: 'Algemene voorwaarden' },
      { href: '/privacybeleid/', label: 'Privacybeleid' },
    ],
  },
] as const;

// Authors with their own page; the others are introduced on /over-flavory/.
export const authorPath = (id: string) => (id === 'bart' ? '/over-flavory/bart/' : '/over-flavory/');

// Press about Flavory: the block "Over ons geschreven" on /over-flavory/, one line on /zakelijk/ and
// subjectOf in the Organization schema. Never on the home page.
export const PRESS = [
  {
    title: 'Flavory: lessen in flessen',
    source: 'Acerta',
    date: '2025-11-05',
    dateLabel: 'november 2025',
    url: 'https://www.acerta.be/nl/inspiratie/flavory-lessen-flessen',
    // A short quote from the article. Empty: the block shows no quote.
    quote: '' as string,
  },
] as const;

// Explanation shown under the option list on product pages.
export const FORMULAS = {
  Standaard: 'Twee heerlijke wijnen die het verschil duidelijk laten proeven',
  Premium: 'Twee duurdere wijnen met meer diepgang',
} as const;

/** One line about shipping, used in the cart, on product pages and in the shipping page intro. */
export const shippingLine = () =>
  `Verzending ${formatPrice(SITE.shipping.rate)} in België en Nederland, gratis vanaf ${SITE.shipping.freeFromBoxes} boxen.`;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(value);

// Price per player at a full table, e.g. "€ 9,98" for € 59,90 and 6 players.
export const pricePerPerson = (price: number, players: number) =>
  formatPrice(Math.floor((price / players) * 100) / 100);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

export const absoluteUrl = (path: string) => new URL(path, SITE.url).href;
