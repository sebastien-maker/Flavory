// Generates public/_redirects (rule 6) and verifies that every known old URL resolves.
//   node scripts/build-redirects.mjs           -> write public/_redirects
//   node scripts/build-redirects.mjs --verify  -> after `pnpm build`: every old URL must be a built page or a redirect
// Sources of old URLs: audit crawl, Search Console pages export, old sitemap.
import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const HOME = '/';
const KERST_POST =
  '/blog/op-zoek-naar-het-leukste-kerstcadeau-van-2025-ontdek-waarom-de-flavory-wijnproeverij-het-perfecte-geschenk-is/';
const RED = '/shop/wijnproeverij-thuis-rood/';
const WHITE = '/shop/wijnproeverij-thuis-wit/';
// Q4 range: only red and white boxes with wine. The former Italy/Spain and white-wine-box pages are merged into them.
const WHITE_WINE = WHITE;
const IT_ES = RED;
const SHOP = '/shop/';
const B2B = '/zakelijk/';
// The bubbles box is out of the range (draft); its URLs go to the shop until it returns.
// Netlify only applies these non-forced rules when no page exists, so re-enabling the product needs no change here.
const BUBBLES = '/shop/';

// [from, to]. Order matters only for readability; Netlify uses the first match.
const RULES = [
  // Builder test pages and duplicates of the home page
  ...[
    '/home/',
    '/home-2/',
    '/home-3/',
    '/hero-section/',
    '/hero-section-2/',
    '/home-hero-image/',
    '/home-hero-image-duplicate-2/',
    '/nl/',
    '/nl',
  ].map((p) => [p, HOME]),
  ['/shop2/', '/shop/'],
  ['/b2b/', '/zakelijk/'],

  // Renamed or merged pages
  ['/flavory-gameplay/', '/hoe-werkt-het/'],
  ['/partners/', '/partnership/'],
  ['/eindejaars-en-relatiegeschenken/', '/zakelijk/'],
  ['/proeverij/', B2B],
  ['/flavory-landingpage/', B2B],
  ['/alcoholvrije-wijnen/', '/blog/alcoholvrije-wijn/'],
  ['/dit-voorspelt-jouw-wijnhoroscoop-voor-valentijn/', '/blog/valentijn-wijn-horoscoop-2026/'],
  [
    '/start-to-wijnkelder-welke-types-wijn-moet-je-altijd-in-huis-hebben/',
    '/blog/start-to-wijnkelder-welke-types-wijn-moet-je-altijd-in-huis-hebben/',
  ],
  [
    '/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie-dupliceren/',
    '/blog/wijnproeven-op-date-night/',
  ],
  ...['2024-is', '2024-is-2', '2024-is-2-2', '2025-is', '2025-is-2', '2025-is-3', '2025-is-w2'].map((s) => [
    `/5-redenen-waarom-flavorys-wine-tasting-het-leukste-kerstcadeau-van-${s}/`,
    KERST_POST,
  ]),

  // Pages removed for Q4 (2026)
  ['/wijnkiezer/', SHOP],
  ['/verkooppunten/', SHOP],
  ['/zakelijk/teambuilding-wijnproeverij/', B2B],
  ['/win/', HOME],
  ['/shop/italie-of-spanje/', RED],
  ['/shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/', WHITE],

  // WooCommerce system pages
  ['/shop/winkelwagen/', '/shop/'],
  ['/shop/afrekenen/', '/shop/'],
  ['/shop/mijn-account/', '/shop/'],

  // Products: renamed and legacy slugs (SITE-STRUCTURE §3)
  ['/shop/valentijn-wine-tasting-game-italie-of-spanje-10-korting/', IT_ES],
  ['/shop/legendarische-wijnlanden-rood/', IT_ES],
  ['/shop/wijnspel-italie-vs-spanje-proef-jij-het-verschil/', IT_ES],
  ['/product/spanje-vs-italie-wijnspel/', IT_ES],
  ['/shop/merlot-of-cabernet-sauvignon/', RED],
  ['/shop/merlot-of-cabernet-sauvignon-premium/', RED],
  ['/shop/rode-wijnspel-merlot-vs-cabernet-sauvignon-premium-editie/', RED],
  ['/shop/rode-wijn-box/', RED],
  ['/product/rode-wijn-box/', RED],
  ['/shop/legendarische-druiven-wit/', WHITE],
  ['/shop/witte-wijn-box/', WHITE],
  ['/product/witte-wijn-box/', WHITE],
  ['/shop/chardonnay-of-sauvignon-blanc-premium/', WHITE_WINE],
  ['/shop/witte-wijnspel-chardonnay-vs-sauvignon-blanc-premium-editie/', WHITE_WINE],
  ['/shop/witte-wijnspel-chardonnay-vs-sauvignon-blanc-proef-jij-het-verschil/', WHITE_WINE],
  ['/shop/bubbelbox/', BUBBLES],
  ['/shop/bubbels/', BUBBLES],
  ['/shop/cava-prosecco-box/', BUBBLES],
  ['/shop/bubbelspel-cava-vs-prosecco-proef-jij-het-verschil/', BUBBLES],
  ['/shop/rose-wijn-box/', '/shop/'],
  ['/shop/combi-box-bubbels-wit-rood-rood/', '/shop/'],
  ['/shop/nieuw-combi-box-rose-wit-rood-rood-20-korting/', '/shop/'],
  ['/shop/flavory-business-pack-5-wijnboxen/', '/zakelijk/'],
  ['/shop/flavory-business-pack-5-wijnboxen-aan-20-korting-excl-btw/', '/zakelijk/'],

  // Comparison short links (future comparison articles will take these over)
  ['/cava-vs-prosecco', BUBBLES],
  ['/merlot-vs-cabernet-sauvignon', RED],
  ['/chardonnay-vs-sauvignon-blanc', WHITE],
  ['/italie-vs-spanje', IT_ES],

  // Categories and tags
  ['/shop/productcategorie/rode-wijn/', '/shop/rode-wijn/'],
  ['/shop/productcategorie/witte-wijn/', '/shop/witte-wijn/'],
  ['/shop/productcategorie/bubbels/', BUBBLES],
  ['/shop/productcategorie/bundels/', '/shop/'],
  ['/shop/productcategorie/geen-categorie/', '/shop/'],
  ['/shop/producttag/box/', '/shop/'],

  // German section: not part of the NL launch yet. Send each page to its Dutch equivalent.
  // TODO(de): replace with real /de/ pages + hreflang when the German section is rebuilt.
  ['/de/', HOME],
  ['/de', HOME],
  ['/de/start/', HOME],
  ['/de/home-2/', HOME],
  ['/de/home-3/', HOME],
  ['/de/hero-section/', HOME],
  ['/de/hero-section-2/', HOME],
  ['/de/home-hero-image/', HOME],
  ['/de/home-hero-image-duplicate-2/', HOME],
  ['/de/shop/', '/shop/'],
  ['/de/shop-2/', '/shop/'],
  ['/de/shop2/', '/shop/'],
  ['/de/shop-2/einkaufswagen/', '/shop/'],
  ['/de/kontakt/', '/contact/'],
  ['/de/ueber-flavory/', '/over-flavory/'],
  ['/de/so-geht-das-flavory-spiel/', '/hoe-werkt-het/'],
  ['/de/faq/', '/faq/'],
  ['/de/wijnkiezer/', SHOP],
  ['/de/partners/', '/partnership/'],
  ['/de/partnership/', '/partnership/'],
  ['/de/proeverij/', B2B],
  ['/de/eindejaars-en-relatiegeschenken/', '/zakelijk/'],
  ['/de/algemene-voorwaarden/', '/algemene-voorwaarden/'],
  ['/de/alcoholvrije-wijnen/', '/blog/alcoholvrije-wijn/'],
  ['/de/abonnieren-und-gewinnen/', HOME],
  ['/de/flavory-landingpage/', B2B],
  ['/de/het-was-een-cadeau/', '/het-was-een-cadeau/'],
  ['/de/mijn-ervaring/', '/mijn-ervaring/'],
  ['/de/nog-niet-gespeeld/', '/nog-niet-gespeeld/'],
  ['/de/das-sagt-dein-weinhoroskop-fuer-den-valentinstag-voraus/', '/blog/valentijn-wijn-horoscoop-2026/'],
  ['/de/das-sagt-dein-weinhoroskop-fur-den-valentinstag-voraus/', '/blog/valentijn-wijn-horoscoop-2026/'],
  ['/de/das-sagt-dein-weinhoroskop-fur-den-valentinstag-voraus-2/', '/blog/valentijn-wijn-horoscoop-2026/'],
  [
    '/de/weinkeller-fuer-anfaenger-welche-weinsorten-solltest-du-immer-im-haus-haben/',
    '/blog/start-to-wijnkelder-welke-types-wijn-moet-je-altijd-in-huis-hebben/',
  ],
  ['/de/blog/', '/blog/'],
  [
    '/de/blog/waarom-een-wijnavond-met-vriendinnen-soms-belangrijker-is-dan-therapie-dupliceren/',
    '/blog/wijnproeven-op-date-night/',
  ],
  ['/de/blog/*', '/blog/:splat'],
  ['/de/shop/cava-oder-prosecco/', BUBBLES],
  ['/de/shop/cava-oder-prosecco-kopie/', BUBBLES],
  ['/de/shop/chardonnay-oder-sauvignon-blanc/', WHITE_WINE],
  ['/de/shop/chardonnay-oder-sauvignon-blanc-kopie/', WHITE_WINE],
  ['/de/shop/chardonnay-oder-sauvignon-blanc-kopie-kopie/', WHITE_WINE],
  ['/de/shop/chardonnay-of-sauvignon-blanc-premium/', WHITE_WINE],
  ['/de/shop/italien-oder-spanien/', IT_ES],
  ['/de/shop/italien-oder-spanien-copy/', IT_ES],
  ['/de/shop/italien-oder-spanien-kopie/', IT_ES],
  ['/de/shop/italien-oder-spanien-kopie-2/', IT_ES],
  ...[
    '',
    '-copy',
    '-copy-2',
    '-copy-copy-3',
    '-copy-copy-kopie',
    '-copy-copy-kopie-2',
    '-copy-copy-kopie-kopie',
    '-copy-kopie',
    '-kopie',
    '-premium-edition',
    '-premium-edition-kopie',
  ].map((s) => [`/de/shop/merlot-oder-cabernet-sauvignon${s}/`, RED]),
  ['/de/shop/productcategorie/rotwein/', '/shop/rode-wijn/'],
  ['/de/shop/productcategorie/weiswein/', '/shop/witte-wijn/'],
  ['/de/shop/productcategorie/schaumwein/', BUBBLES],
  ['/de/shop/productcategorie/geen-categorie/', '/shop/'],
  ['/de/shop/producttag/box-de/', '/shop/'],
  ['/de/*', HOME],

  // English stubs (no English content exists)
  ['/en/', HOME],
  ['/en/blog/', '/blog/'],
  ['/en/shop/chardonnay-of-sauvignon-blanc-premium/', WHITE_WINE],
  ['/en/shop/merlot-of-cabernet-sauvignon/', RED],
  ['/en/*', HOME],

  // WordPress leftovers
  ['/feed/', '/blog/'],
  ['/blog/feed/', '/blog/'],
  ['/wp-login.php', HOME],
];

// Query-string URLs (WordPress custom post types and previews).
const QUERY_RULES = [
  ['/', 'reviews=:review', '/reviews/'],
  ['/', 'store=:store', SHOP],
  ['/', 'post_type=:type', '/shop/'],
  ['/', 'taxonomy=:tax', '/shop/'],
  ['/de/', 'reviews=:review', '/reviews/'],
  ['/de/', 'store=:store', SHOP],
];

const pad = (s, n) => s.padEnd(n);

function render() {
  const lines = [
    '# Generated by scripts/build-redirects.mjs. Do not edit by hand: change RULES in the script.',
    '# Rule 6: every old URL gets an explicit destination; nothing falls back to the home page.',
    '',
  ];
  for (const [from, param, to] of QUERY_RULES) lines.push(`${pad(from, 12)} ${pad(param, 20)} ${to}  301!`);
  lines.push('');
  for (const [from, to] of RULES) lines.push(`${pad(from, 110)} ${to}  301`);
  return lines.join('\n') + '\n';
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function oldUrls() {
  const urls = new Set();
  const csv = await readFile('flavory.wine-audit/data/crawl_summary.csv', 'utf8');
  for (const line of csv.split('\n').slice(1)) urls.add(line.split(',')[0]);
  const gsc = await readFile('flavory.wine-plan/data/gsc-export/Paginas.csv', 'utf8');
  for (const line of gsc.split('\n').slice(1)) urls.add(line.split(',')[0]);
  for (const u of JSON.parse(await readFile('flavory.wine-audit/data/sitemap_urls.json', 'utf8'))) urls.add(u);
  return [...urls]
    .filter((u) => u.startsWith('http'))
    .map((u) => new URL(u))
    .filter((u) => u.hostname.endsWith('flavory.wine') && !u.pathname.startsWith('/wp-content/'));
}

function resolve(url) {
  const params = url.searchParams;
  for (const [from, param, to] of QUERY_RULES) {
    if (url.pathname === from && params.has(param.split('=')[0])) return to;
  }
  const path = url.pathname.endsWith('/') || url.pathname.includes('.') ? url.pathname : `${url.pathname}/`;
  for (const [from, to] of RULES) {
    if (from.endsWith('/*') && path.startsWith(from.slice(0, -1)))
      return to.replace(':splat', path.slice(from.length - 1));
    const norm = from.endsWith('/') || from.includes('.') ? from : `${from}/`;
    if (norm === path) return to;
  }
  return null;
}

if (process.argv.includes('--verify')) {
  const problems = [];
  const built = async (path) => exists(join('dist', path, 'index.html'));
  for (const url of await oldUrls()) {
    const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    const target = resolve(url);
    const label = `${url.pathname}${url.search}`;
    if (target) {
      // Query-string rules are explicit per parameter; path rules must name the old URL.
      const viaQueryRule = QUERY_RULES.some(
        ([from, param]) => url.pathname === from && url.searchParams.has(param.split('=')[0]),
      );
      if (
        target === HOME &&
        !viaQueryRule &&
        !RULES.some(([f, t]) => t === HOME && (f === url.pathname || f === path || path.startsWith(f.replace('*', ''))))
      ) {
        problems.push(`${label} -> home without an explicit rule`);
      }
      if (!(await built(target.split('?')[0]))) problems.push(`${label} -> ${target} (target not built)`);
    } else if (!(await built(path))) {
      problems.push(`${label}: no page and no redirect (would 404)`);
    }
  }
  if (problems.length) {
    console.log(problems.join('\n'));
    console.log(`\n${problems.length} unresolved URL(s)`);
    process.exit(1);
  }
  console.log('All old URLs resolve to a page or an explicit redirect.');
} else {
  await writeFile('public/_redirects', render());
  console.log(`public/_redirects: ${RULES.length + QUERY_RULES.length} rules`);
}
