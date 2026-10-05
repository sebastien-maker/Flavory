import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { WOO_URL, parseStoreProducts, storeProductsPath, type WooStock } from './commerce/woo';

export type Product = CollectionEntry<'products'>;
export type Post = CollectionEntry<'blog'>;
export type Category = CollectionEntry<'categories'>;

export const productPath = (id: string) => `/shop/${id}/`;
export const categoryPath = (id: string) => `/shop/${id}/`;
export const postPath = (id: string) => `/blog/${id}/`;

export type Variant = Product['data']['variants'][number];

// Options that can be bought; sold-out options are not shown at all.
export const availableVariants = (product: Product): Variant[] => product.data.variants.filter((v) => v.available);
export const isAvailable = (product: Product) => availableVariants(product).length > 0;
// Placeholder SKUs ("TMP-…") stay out of structured data and the Merchant Center feed until Shopify has the real one.
export const realSku = (sku: string) => (/^TMP-/i.test(sku) ? undefined : sku);

// The two main boxes versus leftover stock (Italië of Spanje), which is listed apart.
export const mainProducts = (products: Product[]) => products.filter((p) => !p.data.clearance);
export const clearanceProducts = (products: Product[]) => products.filter((p) => p.data.clearance && isAvailable(p));

// The first choice on the home page, /shop/ and the gift pages is the colour. Per colour the card leads
// to the first box that can be bought, in the manual order from the CMS (so the red card moves from
// Merlot of Cabernet Sauvignon to Italië of Spanje when the first is sold out). Nothing in stock: the first box.
const COLOURS = [
  { label: 'Wit', category: 'witte-wijn' },
  { label: 'Rood', category: 'rode-wijn' },
] as const;
export function colourChoices(products: Product[]) {
  return COLOURS.flatMap(({ label, category }) => {
    const boxes = products.filter((p) => p.data.category.id === category).sort((a, b) => a.data.order - b.data.order);
    const product = boxes.find(isAvailable) ?? boxes[0];
    return product ? [{ label, product }] : [];
  });
}

export const fromPrice = (product: Product) =>
  Math.min(...(isAvailable(product) ? availableVariants(product) : product.data.variants).map((v) => v.price));

// Price and stock from WooCommerce, fetched once per build. Without a shop URL, or when the shop
// cannot be reached, the prices in the CMS stay (the page then refreshes them in the browser).
let wooStock: Promise<Map<number, WooStock>> | undefined;
function loadWooStock(ids: number[]): Promise<Map<number, WooStock>> {
  if (!WOO_URL || ids.length === 0) return Promise.resolve(new Map());
  wooStock ??= (async () => {
    const url = `${WOO_URL}/wp-json/wc/store/v1${storeProductsPath(ids)}`;
    // Three tries: a single slow response would otherwise publish the CMS prices site-wide.
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const stock = parseStoreProducts(await res.json());
        if (stock.size > 0) return stock;
        throw new Error('no products in response');
      } catch (error: unknown) {
        console.warn(`[woocommerce] try ${attempt}/3 failed: ${String(error)}`);
        if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
      }
    }
    console.warn('[woocommerce] prices not loaded, using the prices from the CMS');
    return new Map<number, WooStock>();
  })();
  return wooStock;
}

// In-stock products first, then by manual order.
export async function getProducts(): Promise<Product[]> {
  const all = await getCollection('products', ({ data }) => !data.draft);
  const ids = all.flatMap((p) => p.data.variants.flatMap((v) => (v.wooId ? [v.wooId] : [])));
  const stock = await loadWooStock(ids);
  for (const product of all) {
    for (const v of product.data.variants) {
      const live = v.wooId ? stock.get(v.wooId) : undefined;
      if (!live) continue;
      v.price = live.price;
      v.available = v.available && live.buyable;
    }
  }
  return all.sort((a, b) => Number(!isAvailable(a)) - Number(!isAvailable(b)) || a.data.order - b.data.order);
}

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('blog', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// Only categories with at least one visible product get a page (no empty, thin pages).
export async function getCategories(): Promise<Category[]> {
  const products = await getProducts();
  const all = await getCollection('categories', (c) => products.some((p) => p.data.category.id === c.id));
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getReviews() {
  const all = await getCollection('reviews');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getFaq(group?: CollectionEntry<'faq'>['data']['group']) {
  const all = await getCollection('faq', (e) => !group || e.data.group === group);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Related posts: explicit `related` first, then posts from the same pillar, newest first.
 */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const posts = await getPosts();
  const explicit = post.data.related.map((r) => posts.find((p) => p.id === r.id)).filter((p): p is Post => !!p);
  const samePillar = posts.filter(
    (p) => p.id !== post.id && p.data.pillar && p.data.pillar === post.data.pillar && !explicit.includes(p),
  );
  return [...explicit, ...samePillar].slice(0, limit);
}

export async function resolvePosts(refs: { id: string }[]): Promise<Post[]> {
  const entries = await Promise.all(refs.map((r) => getEntry('blog', r.id)));
  return entries.filter((e): e is Post => !!e && !e.data.draft);
}

export const PILLAR_LABELS: Record<NonNullable<Post['data']['pillar']>, string> = {
  'wijnproeverij-thuis': 'Wijnproeverij thuis',
  'wijn-leren-proeven': 'Wijn leren proeven',
  'druiven-en-stijlen': 'Druiven en stijlen',
  'wijn-en-eten': 'Wijn en eten',
  'wijn-cadeau': 'Wijn als cadeau',
  zakelijk: 'Zakelijk',
};

/** Rough word count for reading time. */
export function readingMinutes(markdown: string | undefined): number {
  const words = (markdown ?? '')
    .replace(/<[^>]+>|[#*_>\-[\]()!]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
