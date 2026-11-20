// The two colours a visitor chooses between (home page, /shop/, gift pages) and how each one looks:
// white = light blue, red = brand red (docs/design-richtlijnen.md). The packshot belongs to the colour,
// not to the box the card leads to.
import whitePackshot from '@/assets/images/products/packshot-wit-zakjes.jpg';
import redPackshot from '@/assets/images/products/packshot-rood-zakjes.jpg';
// The same packshots without their background, for the box cards in a hero (BoxPick.astro): the product stands
// free on the card, also on a dark one. Cut out of the packshots above; make new ones when those change.
import whiteCutout from '@/assets/images/products/packshot-wit-vrij.webp';
import redCutout from '@/assets/images/products/packshot-rood-vrij.webp';

export const COLOUR_STYLES = {
  Wit: {
    title: 'Witte wijn',
    cta: 'Kies wit',
    image: whitePackshot,
    cutout: whiteCutout,
    /** Soft glow behind the product on a dark card (global.css). */
    glow: 'pick-white',
    alt: 'Wit wijnspel: de doos met twee flessen wijn in zakjes A en B',
    line: 'text-wine-white-text',
    button: 'bg-wine-white text-ink hover:bg-wine-white-dark',
    /** Tinted zone behind the title on the product page. */
    zone: 'bg-wine-white-tint',
    /** The same tint behind the buy button, on a phone only (there it stands inside the title zone). */
    zoneCta: 'max-md:bg-wine-white-tint',
    /** Accent colour of the chosen option on the product page (CSS custom properties). */
    tiles: 'theme-white',
  },
  Rood: {
    title: 'Rode wijn',
    cta: 'Kies rood',
    image: redPackshot,
    cutout: redCutout,
    glow: 'pick-red',
    alt: 'Rood wijnspel: de doos met twee flessen wijn in zakjes A en B',
    line: 'text-wine-red-text',
    button: 'bg-brand text-white hover:bg-brand-dark',
    zone: 'bg-blush',
    zoneCta: 'max-md:bg-blush',
    tiles: 'theme-red',
  },
} as const;

export type Colour = keyof typeof COLOUR_STYLES;

export const colourOf = (categoryId: string): Colour => (categoryId === 'witte-wijn' ? 'Wit' : 'Rood');
