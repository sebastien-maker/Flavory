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
  // During the Black Friday campaign `giftDeadline` is also the last order day for Christmas on /black-friday/.
  giftSeason: '' as '' | 'kerst' | 'moederdag' | 'vaderdag',
  giftDeadline: '',
  // Campaign. Empty means none. 'blackfriday' switches /black-friday/ to the running promotion and
  // links the announcement bar to it. The sale prices themselves are set in WooCommerce.
  campaign: '' as '' | 'blackfriday',
  // Fill in together with campaign = 'blackfriday'.
  blackFriday: {
    // The promotion in one sentence, for example 'Black Friday: het wijnspel met 20% korting'.
    // This is the only place where the discount is named.
    offer: '' as string,
    // Last day of the promotion, for example 'maandag 30 november'.
    endDate: '' as string,
  },
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
      { href: '/black-friday/', label: 'Black Friday' },
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

// Explanation shown under the option list on product pages.
export const FORMULAS = {
  Standaard: 'Heerlijke, eerlijke wijn',
  Premium: 'Twee duurdere flessen met meer diepgang',
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
