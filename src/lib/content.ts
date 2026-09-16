import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;
export type Post = CollectionEntry<'blog'>;
export type Category = CollectionEntry<'categories'>;

export const productPath = (id: string) => `/shop/${id}/`;
export const categoryPath = (id: string) => `/shop/${id}/`;
export const postPath = (id: string) => `/blog/${id}/`;

// In-stock products first, then by manual order.
export async function getProducts(): Promise<Product[]> {
  const all = await getCollection('products', ({ data }) => !data.draft);
  return all.sort(
    (a, b) =>
      Number(a.data.availability === 'out_of_stock') - Number(b.data.availability === 'out_of_stock') ||
      a.data.order - b.data.order,
  );
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
