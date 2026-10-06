// The two colours a visitor chooses between (home page, /shop/, gift pages) and how each one looks:
// white = light blue, red = brand red (docs/design-richtlijnen.md). The packshot belongs to the colour,
// not to the box the card leads to.
import whitePackshot from '@/assets/images/products/packshot-wit-zakjes.jpg';
import redPackshot from '@/assets/images/products/packshot-rood-zakjes.jpg';

export const COLOUR_STYLES = {
  Wit: {
    title: 'Witte wijn',
    cta: 'Kies wit',
    image: whitePackshot,
    alt: 'Wit wijnspel: de doos met twee flessen wijn in zakjes A en B',
    line: 'text-wine-white-text',
    button: 'bg-wine-white text-ink hover:bg-wine-white-dark',
    /** Tinted zone behind the title on the product page. */
    zone: 'bg-wine-white-tint',
    /** Accent colour of the chosen option on the product page (CSS custom properties). */
    tiles: 'theme-white',
  },
  Rood: {
    title: 'Rode wijn',
    cta: 'Kies rood',
    image: redPackshot,
    alt: 'Rood wijnspel: de doos met twee flessen wijn in zakjes A en B',
    line: 'text-wine-red-text',
    button: 'bg-brand text-white hover:bg-brand-dark',
    zone: 'bg-blush',
    tiles: 'theme-red',
  },
} as const;

export type Colour = keyof typeof COLOUR_STYLES;

export const colourOf = (categoryId: string): Colour => (categoryId === 'witte-wijn' ? 'Wit' : 'Rood');
