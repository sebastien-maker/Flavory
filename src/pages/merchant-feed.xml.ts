// Google Merchant Center product feed (RSS 2.0), one item per purchasable option.
// Shipping (incl. free from 2 boxes) and returns are set in Merchant Center itself, not per item.
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getProducts, productPath, realSku } from '@/lib/content';
import { SITE, absoluteUrl } from '@/lib/site';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const products = await getProducts();
  const items: string[] = [];

  for (const product of products) {
    const { data } = product;
    const images = await Promise.all(
      data.images
        .slice(0, 10)
        .map(async (img) => absoluteUrl((await getImage({ src: img.src, width: 1200, format: 'jpg' })).src)),
    );
    for (const v of data.variants) {
      const sku = realSku(v.sku);
      const fields: [string, string | undefined][] = [
        ['g:id', `${product.id}-${v.id}`],
        ['g:item_group_id', product.id],
        ['g:title', `${data.name}: ${v.duel} (${v.formula})`],
        ['g:description', data.definition],
        ['g:link', `${absoluteUrl(productPath(product.id))}?box=${v.id}`],
        ['g:image_link', images[0]],
        ['g:availability', v.available ? 'in_stock' : 'out_of_stock'],
        ['g:price', `${v.price.toFixed(2)} EUR`],
        ['g:condition', 'new'],
        ['g:brand', SITE.name],
        ['g:gtin', v.gtin13],
        ['g:mpn', v.gtin13 ? undefined : sku],
        ['g:product_type', `Wijnspel > ${data.name}`],
      ];
      const lines = fields.filter(([, value]) => value).map(([tag, value]) => `      <${tag}>${escape(value!)}</${tag}>`);
      lines.push(...images.slice(1).map((src) => `      <g:additional_image_link>${escape(src)}</g:additional_image_link>`));
      items.push(`    <item>\n${lines.join('\n')}\n    </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>Wijnspellen met twee flessen wijn voor een wijnproeverij thuis</description>
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
