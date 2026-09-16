// Snapshot of the current WordPress/WooCommerce site (flavory.wine) for the rebuild.
// Usage: node scripts/scrape-wordpress.mjs [--no-html] [--no-media]
// Output: scraped/ (json per type, rendered html per NL url, referenced media).
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://flavory.wine';
const OUT = 'scraped';
const UA = 'Mozilla/5.0 (compatible; FlavoryRebuildScraper/1.0)';
const args = new Set(process.argv.slice(2));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, { json = true, tries = 3 } = {}) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return json ? { data: await res.json(), headers: res.headers } : res;
    } catch (err) {
      if (i === tries) throw err;
      await sleep(1000 * i);
    }
  }
}

async function save(path, content) {
  const full = join(OUT, path);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(
    full,
    typeof content === 'string' || content instanceof Uint8Array ? content : JSON.stringify(content, null, 2),
  );
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function paginate(endpoint, params = '') {
  const items = [];
  for (let page = 1; ; page++) {
    const sep = endpoint.includes('?') ? '&' : '?';
    const { data, headers } = await get(`${BASE}${endpoint}${sep}per_page=100&page=${page}${params}`);
    items.push(...data);
    const total = Number(headers.get('x-wp-totalpages') ?? 1);
    if (page >= total) break;
  }
  return items;
}

const collections = {
  pages: '/wp-json/wp/v2/pages',
  posts: '/wp-json/wp/v2/posts',
  products: '/wp-json/wp/v2/product',
  'store-products': '/wp-json/wc/store/v1/products',
  'product-categories': '/wp-json/wc/store/v1/products/categories',
  categories: '/wp-json/wp/v2/categories',
  tags: '/wp-json/wp/v2/tags',
  users: '/wp-json/wp/v2/users',
  media: '/wp-json/wp/v2/media',
};

const result = {};
for (const [name, endpoint] of Object.entries(collections)) {
  try {
    // store API does not paginate with x-wp-totalpages the same way for categories; handled by paginate break.
    result[name] = await paginate(endpoint);
    await save(`${name}.json`, result[name]);
    console.log(`${name}: ${result[name].length}`);
  } catch (err) {
    console.warn(`${name}: failed (${err.message})`);
    result[name] = [];
  }
}

// Menus and site info (best effort, may be unavailable without auth)
for (const [name, endpoint] of Object.entries({ site: '/wp-json', menus: '/wp-json/wp/v2/navigation' })) {
  try {
    const { data } = await get(`${BASE}${endpoint}`);
    await save(
      `${name}.json`,
      name === 'site' ? { name: data.name, description: data.description, url: data.url } : data,
    );
  } catch (err) {
    console.warn(`${name}: ${err.message}`);
  }
}

// Rendered HTML of every published Dutch URL (Elementor layouts live only there).
const isDutch = (link) => !/flavory\.wine\/(de|en)\//.test(link);
const urls = new Set([BASE + '/']);
for (const item of [...result.pages, ...result.posts, ...result.products]) {
  if (item.status === 'publish' && isDutch(item.link)) urls.add(item.link);
}
for (const cat of result['product-categories']) if (cat.permalink) urls.add(cat.permalink);
for (const u of ['/shop/', '/blog/', '/faq/', '/contact/', '/wijnkiezer/', '/over-flavory/']) urls.add(BASE + u);

const slugFor = (url) => {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, '');
  return path === '' ? 'index' : path;
};

const assetUrls = new Set();
const collectAssets = (html) => {
  for (const m of html.matchAll(
    /https?:\/\/flavory\.wine\/wp-content\/uploads\/[^"'\s)\\]+?\.(?:jpe?g|png|webp|gif|svg|avif|mp4|webm)/gi,
  )) {
    assetUrls.add(m[0]);
  }
};

if (!args.has('--no-html')) {
  const cssUrls = new Set();
  for (const url of urls) {
    try {
      const res = await get(url, { json: false });
      const html = await res.text();
      await save(`html/${slugFor(url)}.html`, html);
      collectAssets(html);
      for (const m of html.matchAll(/<link[^>]+href=['"]([^'"]+\.css[^'"]*)['"]/g)) cssUrls.add(m[1]);
      console.log(`html ${url}`);
    } catch (err) {
      console.warn(`html ${url}: ${err.message}`);
    }
    await sleep(250);
  }
  // Stylesheets (fonts, colors, spacing)
  for (const cssUrl of cssUrls) {
    if (!cssUrl.includes('flavory.wine')) continue;
    try {
      const res = await get(cssUrl, { json: false });
      const name = new URL(cssUrl).pathname.replace(/^\//, '');
      const css = await res.text();
      await save(`css/${name}`, css);
      for (const m of css.matchAll(/url\(['"]?([^'")]+\.(?:woff2?|ttf|otf))['"]?\)/g)) {
        assetUrls.add(new URL(m[1], cssUrl).href);
      }
    } catch (err) {
      console.warn(`css ${cssUrl}: ${err.message}`);
    }
  }
}

for (const item of [...result.pages, ...result.posts, ...result.products]) {
  collectAssets(JSON.stringify(item));
}
for (const p of result['store-products']) for (const img of p.images ?? []) assetUrls.add(img.src);

if (!args.has('--no-media')) {
  let n = 0;
  for (const url of assetUrls) {
    const path = join(OUT, 'media', new URL(url).pathname.replace(/^\/wp-content\//, ''));
    if (await exists(path)) continue;
    try {
      const res = await get(url, { json: false });
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, new Uint8Array(await res.arrayBuffer()));
      n++;
    } catch (err) {
      console.warn(`media ${url}: ${err.message}`);
    }
  }
  console.log(`media downloaded: ${n} (referenced: ${assetUrls.size})`);
}
await save('asset-urls.json', [...assetUrls].sort());
console.log('done');
