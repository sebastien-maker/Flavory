// Sitewide facts. Used by the layout, footer and Organization schema.
export const SITE = {
  name: 'Flavory',
  legalName: 'Flavory BV',
  url: 'https://flavory.wine',
  tagline: 'Taste the fun',
  locale: 'nl-BE',
  email: 'info@flavory.wine',
  vatId: 'BE0757810421',
  foundingDate: '2017',
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
  announcement: 'Gratis verzending vanaf 2 boxen',
  shipping: {
    countries: ['BE', 'NL'] as const,
    minDays: 1,
    maxDays: 3,
    freeFromBoxes: 2,
  },
  returnDays: 14,
  // The only guarantee we make; reuse this wording everywhere it is explained.
  guarantee:
    'Niet tevreden? Neem binnen 14 dagen na levering contact op via info@flavory.wine en we betalen je terug. Geopende flessen hoeven niet terug.',
  ageNotice: 'Wijn: enkel voor 16+ (België) en 18+ (Nederland)',
  gtmId: 'GTM-MPJ8DPDM',
} as const;

export const NAV = [
  { href: '/shop/', label: 'Shop' },
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
  Regular: 'Heerlijke, eerlijke wijn.',
  Premium: 'Zelfde spel, twee duurdere flessen. Wijnen met nog meer diepgang.',
} as const;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(value);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

export const absoluteUrl = (path: string) => new URL(path, SITE.url).href;
