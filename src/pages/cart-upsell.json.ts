// The box the cart offers next to the one already in it: per colour the Standaard box of the main duel.
// A small static file that the cart drawer fetches when it opens (CartDrawer.astro), so this data is not
// repeated in the HTML of every page. Price and stock are refreshed in the browser, as everywhere.
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { colourChoices, getProducts, productPath, variantName } from '@/lib/content';
import { COLOUR_STYLES } from '@/lib/colour-choice';

export const GET: APIRoute = async () => {
  const choices = colourChoices(await getProducts());
  const items = await Promise.all(
    choices.flatMap(({ label, product }) => {
      const variant = product.data.variants.find((v) => v.formula === 'Standaard' && v.available && !v.comingSoon);
      if (!variant) return [];
      return [
        getImage({ src: COLOUR_STYLES[label].image, width: 96, height: 96, fit: 'cover', format: 'webp' }).then(
          (image) => ({
            colour: label,
            product: product.id,
            handle: `${product.id}:${variant.id}`,
            name: variantName(product, variant),
            duel: variant.duel,
            price: variant.price,
            regularPrice: variant.regularPrice,
            image: image.src,
            url: productPath(product.id),
            wooId: variant.wooId,
          }),
        ),
      ];
    }),
  );
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
