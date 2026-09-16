// Curated llms.txt generated from content collections (audit 3.7).
import type { APIRoute } from 'astro';
import { getPosts, getProducts, postPath, productPath } from '@/lib/content';
import { SITE, absoluteUrl, formatPrice } from '@/lib/site';

export const GET: APIRoute = async () => {
  const products = await getProducts();
  const posts = await getPosts();
  const lines = [
    `# ${SITE.name}`,
    '',
    `> Flavory is een Belgisch wijnspel voor een blinde wijnproeverij thuis. Je proeft twee wijnen naast elkaar, beantwoordt quizvragen en ontdekt wie de wijnkenner aan tafel is. Voor 2 tot 6 spelers, zonder voorkennis. Levering in België en Nederland.`,
    '',
    `Bedrijf: ${SITE.legalName}, ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, België. Contact: ${SITE.email}.`,
    '',
    '## Producten',
    ...products.map(
      (p) =>
        `- [${p.data.name}](${absoluteUrl(productPath(p.id))}): ${formatPrice(p.data.price)}, ${p.data.includesWine ? 'met 2 wijnen' : 'zonder wijn'}${p.data.availability === 'out_of_stock' ? ', tijdelijk uitverkocht' : ''}. ${p.data.definition}`,
    ),
    '',
    '## Belangrijke pagina’s',
    `- [Hoe werkt het?](${absoluteUrl('/hoe-werkt-het/')}): de spelregels in 6 stappen`,
    `- [Wijnkiezer](${absoluteUrl('/wijnkiezer/')}): welke wijn je koopt bij een spelbox zonder wijn`,
    `- [Veelgestelde vragen](${absoluteUrl('/faq/')})`,
    `- [Verzending en retour](${absoluteUrl('/verzending-en-retour/')})`,
    `- [Relatiegeschenken](${absoluteUrl('/zakelijk/')})`,
    `- [Teambuilding wijnproeverij](${absoluteUrl('/zakelijk/teambuilding-wijnproeverij/')})`,
    `- [Over Flavory](${absoluteUrl('/over-flavory/')})`,
    '',
    '## Blog',
    ...posts.map((p) => `- [${p.data.title}](${absoluteUrl(postPath(p.id))}): ${p.data.description}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
