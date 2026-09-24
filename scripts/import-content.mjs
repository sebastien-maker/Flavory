// One-time migration: scraped WordPress data -> Astro content collections.
// Run after `pnpm scrape`. Re-running overwrites generated blog/page files.
import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import { dirname, join, extname, basename } from 'node:path';
import TurndownService from 'turndown';

const SCRAPED = 'scraped';
const load = async (name) => JSON.parse(await readFile(join(SCRAPED, `${name}.json`), 'utf8'));

const posts = await load('posts');
const media = await load('media');
const pages = await load('pages');

// Slug changes for posts (old slug -> new slug). Everything else keeps its slug.
export const POST_SLUG_CHANGES = {
  'waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie-dupliceren': 'wijnproeven-op-date-night',
};

// Pillar per post (SITE-STRUCTURE §2 / findings/cluster.md).
const PILLARS = {
  'slow-wine-moederdag-het-verhaal-achter-de-slak': 'wijn-cadeau',
  'natuurwijn-kopen': 'druiven-en-stijlen',
  'blind-wijn-proeven': 'wijn-leren-proeven',
  'wijn-cadeau-pasen': 'wijn-cadeau',
  'originele-date-night-thuis': 'wijnproeverij-thuis',
  'italiaanse-rode-wijnen': 'druiven-en-stijlen',
  'welke-wijn-bij-welk-gerecht-spiekbriefje': 'wijn-en-eten',
  'wijnproeverij-date-night-chardonnay-of-sauvignon-blanc': 'druiven-en-stijlen',
  'wat-te-doen-op-een-vriendenweekend-organiseer-een-wijnproeverij-spel': 'wijnproeverij-thuis',
  'valentijn-wijn-horoscoop-2026': 'wijn-cadeau',
  'op-zoek-naar-het-leukste-kerstcadeau-van-2025-ontdek-waarom-de-flavory-wijnproeverij-het-perfecte-geschenk-is':
    'wijn-cadeau',
  'wijnproeverij-thuis-flavory': 'wijnproeverij-thuis',
  'luxe-wijnpakket-als-geschenk': 'wijn-cadeau',
  'wijnspel-als-kerstcadeau-black-friday': 'wijn-cadeau',
  'wijnproeven-op-date-night': 'wijnproeverij-thuis',
  'waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie': 'wijnproeverij-thuis',
  'relatiegeschenken-slimme-investering-of-weggegooid-budget': 'zakelijk',
  'vijf-cadeaus-die-iedereen-geeft-en-een-dat-bijblijft': 'wijn-cadeau',
  'is-dure-wijn-beter': 'wijn-leren-proeven',
  'balans-in-wijn': 'wijn-leren-proeven',
  'welke-wijn-moet-je-altijd-in-huis-hebben-ontdek-de-beste-keuzes-voor-elke-gelegenheid': 'druiven-en-stijlen',
  '5-redenen-waarom-flavory-het-leukste-wijngeschenk-is': 'wijn-cadeau',
  'het-prille-begin-van-flavory-anno-2017': 'wijnproeverij-thuis',
  'waarom-smaakt-elke-wijn-anders': 'wijn-leren-proeven',
  'de-ene-rose-is-de-andere-niet': 'druiven-en-stijlen',
  'drie-redenen-waarom-geen-twee-wijnen-ooit-helemaal-hetzelfde-smaken': 'wijn-leren-proeven',
  'verdwaald-in-de-wijnrayon': 'wijn-leren-proeven',
  'start-to-wijnkelder-welke-types-wijn-moet-je-altijd-in-huis-hebben': 'druiven-en-stijlen',
  'alcoholvrije-wijn': 'druiven-en-stijlen',
};

// Product each post links to (one per post, SITE-STRUCTURE §5).
const PRODUCT_FOR_PILLAR = {
  'wijnproeverij-thuis': 'wijnproeverij-thuis-rood',
  'wijn-leren-proeven': 'wijnproeverij-thuis-rood',
  'druiven-en-stijlen': 'wijnproeverij-thuis-wit',
  'wijn-en-eten': 'wijnproeverij-thuis-rood',
  'wijn-cadeau': 'wijnproeverij-thuis-rood',
  zakelijk: 'wijnproeverij-thuis-rood',
};

const decode = (s) =>
  s
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;|&#8217;/g, '’')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8230;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#038;/g, '&')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const stripTags = (s) =>
  decode(s.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
const yamlStr = (s) => JSON.stringify(s ?? '');
const stripSuffix = (t) =>
  decode(t ?? '')
    .replace(/\s*[-|–]\s*Flavory\s*$/i, '')
    .trim();

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

// Map a wp-content URL to the scraped local file, preferring the full-size original.
async function localMedia(url) {
  const rel = url.replace(/^https?:\/\/flavory\.wine\/wp-content\//, '').split('?')[0];
  const full = rel.replace(/-\d+x\d+(\.\w+)$/, '$1');
  for (const candidate of [full, rel]) {
    const p = join(SCRAPED, 'media', candidate);
    if (await exists(p)) return p;
  }
  return null;
}

const internalLink = (href) => {
  if (!href) return href;
  let h = href.replace(/^https?:\/\/(www\.)?flavory\.wine/, '');
  if (h === '') h = '/';
  for (const [from, to] of Object.entries(POST_SLUG_CHANGES)) h = h.replace(`/blog/${from}/`, `/blog/${to}/`);
  return h;
};

function makeTurndown() {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '_' });
  td.remove(['script', 'style', 'noscript']);
  td.keep(['iframe', 'video', 'source']);
  td.addRule('links', {
    filter: 'a',
    replacement: (content, node) => {
      const href = internalLink(node.getAttribute('href'));
      if (!content.trim()) return '';
      return `[${content}](${href})`;
    },
  });
  return td;
}

async function importPost(post, assetDir, publicMediaDir) {
  const slug = POST_SLUG_CHANGES[post.slug] ?? post.slug;
  const td = makeTurndown();
  let html = post.content.rendered;

  // Inline images -> co-located assets
  const imgs = [...html.matchAll(/<img[^>]+>/g)].map((m) => m[0]);
  const copies = [];
  for (const tag of imgs) {
    const src = tag.match(/src="([^"]+)"/)?.[1];
    if (!src) continue;
    const local = await localMedia(src);
    if (!local) continue;
    const name = basename(local).toLowerCase();
    copies.push([local, join(assetDir, slug, name)]);
    const alt = tag.match(/alt="([^"]*)"/)?.[1] ?? '';
    html = html.replace(tag, `<img src="./${slug}/${name}" alt="${alt}">`);
  }
  // Inline videos -> public/media
  for (const m of html.matchAll(
    /(?:src|href)="(https?:\/\/flavory\.wine\/wp-content\/uploads\/[^"]+\.(?:mp4|webm))"/g,
  )) {
    const local = await localMedia(m[1]);
    const name = basename(m[1]).toLowerCase();
    if (local) copies.push([local, join(publicMediaDir, name)]);
    html = html.replaceAll(m[1], `/media/${name}`);
  }

  let body = td
    .turndown(html)
    .replace(/\n{3,}/g, '\n\n')
    // One H1 per page: the layout renders it, so body headings start at H2.
    .replace(/^# /gm, '## ')
    // Bold inside headings is noise.
    .replace(/^(#{2,6} .*)$/gm, (line) => line.replace(/\*\*/g, '').replace(/\s+$/, ''))
    .replace(/^(#{2,6})\s*$/gm, '')
    .replace(
      /<iframe([^>]*?)src="https:\/\/www\.youtube\.com\/embed\//g,
      '<iframe$1loading="lazy" src="https://www.youtube-nocookie.com/embed/',
    )
    .replace(/<iframe([^>]*?)width="\d+" height="\d+"/g, '<iframe$1')
    .replace(
      /<video ([^>]*?)style="[^"]*"/g,
      '<video $1preload="none" playsinline class="mx-auto max-h-[80vh] w-auto rounded-2xl"',
    )
    .trim();

  // Featured image
  const featured = media.find((m) => m.id === post.featured_media);
  let hero = null;
  if (featured) {
    const local = await localMedia(featured.source_url);
    if (local) {
      const name = `${slug}${extname(local).toLowerCase()}`;
      copies.push([local, join(assetDir, name)]);
      hero = { path: `../../assets/images/blog/${name}`, alt: decode(featured.alt_text || '') };
    }
  }

  for (const [from, to] of copies) {
    await mkdir(dirname(to), { recursive: true });
    await copyFile(from, to);
  }
  // Images referenced from the markdown are relative to src/content/blog.
  body = body.replace(new RegExp(`\\]\\(\\./${slug}/`, 'g'), `](../../assets/images/blog/${slug}/`);

  const y = post.yoast_head_json ?? {};
  const title = decode(post.title.rendered);
  const pillar = PILLARS[slug];
  const fm = [
    '---',
    `title: ${yamlStr(title)}`,
    `seoTitle: ${yamlStr(stripSuffix(y.title || title))}`,
    `description: ${yamlStr(decode(y.description || stripTags(post.excerpt.rendered)))}`,
    `excerpt: ${yamlStr(stripTags(post.excerpt.rendered))}`,
    `pubDate: ${post.date.slice(0, 10)}`,
    post.modified.slice(0, 10) !== post.date.slice(0, 10) ? `updatedDate: ${post.modified.slice(0, 10)}` : null,
    'author: bart',
    hero ? `heroImage: ${yamlStr(hero.path)}` : null,
    `heroAlt: ${yamlStr(hero?.alt || title)}`,
    pillar ? `pillar: ${pillar}` : null,
    pillar ? `relatedProduct: ${PRODUCT_FOR_PILLAR[pillar]}` : null,
    '---',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n');

  await mkdir('src/content/blog', { recursive: true });
  await writeFile(join('src/content/blog', `${slug}.md`), `${fm}${body}\n`);
  return slug;
}

const imported = [];
for (const post of posts.filter((p) => p.status === 'publish')) {
  imported.push(await importPost(post, 'src/assets/images/blog', 'public/media'));
}
console.log(`blog: ${imported.length} posts`);

// Legal page (Elementor content is rendered in page JSON as plain HTML).
const legal = pages.find((p) => p.slug === 'algemene-voorwaarden');
if (legal) {
  const td = makeTurndown();
  const body = td
    .turndown(legal.content.rendered)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  await mkdir('src/content/pages', { recursive: true });
  await writeFile(
    'src/content/pages/algemene-voorwaarden.md',
    [
      '---',
      'title: "Algemene voorwaarden"',
      'seoTitle: "Algemene voorwaarden"',
      'description: "Lees de algemene verkoopsvoorwaarden van Flavory BV: bestellen, betalen, levering, herroepingsrecht, garantie en klachten bij je wijnspel."',
      `updatedDate: ${legal.modified.slice(0, 10)}`,
      '---',
      '',
      body,
      '',
    ].join('\n'),
  );
  console.log('pages: algemene-voorwaarden');
}

// Alcohol-free wine page is really an article: import it as a blog post.
const af = pages.find((p) => p.slug === 'alcoholvrije-wijnen');
if (af) {
  await importPost(
    {
      ...af,
      slug: 'alcoholvrije-wijn',
      excerpt: {
        rendered:
          'Alcoholvrije wijn wordt steeds populairder. Twee Flavory-fans van het eerste uur geven hun mening: trend of hype?',
      },
      yoast_head_json: {
        title: 'Alcoholvrije wijn: trend of hype?',
        description:
          'Is alcoholvrije wijn de moeite waard? Hoe het gemaakt wordt, de voor- en nadelen en wat twee Flavory-fans ervan vinden. Lees onze eerlijke conclusie.',
      },
    },
    'src/assets/images/blog',
    'public/media',
  );
  console.log('blog: alcoholvrije-wijn');
}
