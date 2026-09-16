import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// SEO constraints from CLAUDE.md, enforced at build time.
const seoTitle = z
  .string()
  .max(60 - ' | Flavory'.length, 'SEO title (without "| Flavory") must be at most 50 characters');
const seoDescription = z
  .string()
  .min(120, 'description must be at least 120 characters')
  .max(155, 'description must be at most 155 characters');

const faqItem = z.object({
  question: z.string(),
  answer: z.string(),
});

// A purchasable option of a product (duel + formula). Out-of-stock options are hidden entirely.
const variant = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  duel: z.string(),
  formula: z.enum(['Regular', 'Premium']),
  price: z.number().positive(),
  sku: z.string(),
  // Links the option to one of the product's `descriptions`.
  group: z.string(),
  available: z.boolean().default(true),
});

const products = defineCollection({
  // Frontmatter = product data and copy; the markdown body is not used (texts live in `descriptions`).
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      h1: z.string(),
      seoTitle,
      seoDescription,
      duel: z.string().describe('Short summary of the duels on product cards'),
      cardTagline: z.string(),
      definition: z.string().describe('Two-sentence definition block for AI citability'),
      variants: z.array(variant).min(1),
      descriptions: z
        .array(z.object({ group: z.string(), heading: z.string(), text: z.string() }))
        .min(1)
        .describe('First entry is shown until the visitor picks an option'),
      category: reference('categories'),
      playersMin: z.number().int(),
      playersMax: z.number().int(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(5, 'alt text is required'),
          }),
        )
        .min(1),
      usps: z.array(z.string()),
      highlights: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      boxContents: z.array(z.string()),
      faq: z.array(faqItem),
      relatedPosts: z.array(reference('blog')).max(4).default([]),
      order: z.number().int().default(0),
      draft: z.boolean().default(false),
    }),
});

const categories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    h1: z.string(),
    seoTitle,
    seoDescription,
    order: z.number().int().default(0),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle,
      description: seoDescription,
      excerpt: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: reference('authors'),
      heroImage: image(),
      heroAlt: z.string().min(5, 'alt text is required'),
      pillar: z
        .enum([
          'wijnproeverij-thuis',
          'wijn-leren-proeven',
          'druiven-en-stijlen',
          'wijn-en-eten',
          'wijn-cadeau',
          'zakelijk',
        ])
        .optional(),
      relatedProduct: reference('products').optional(),
      related: z.array(reference('blog')).max(4).default([]),
      draft: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    seoTitle,
    description: seoDescription,
    updatedDate: z.coerce.date().optional(),
    noindex: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/authors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      image: image().optional(),
      sameAs: z.array(z.url()).default([]),
    }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/reviews' }),
  schema: z.object({
    author: z.string(),
    rating: z.number().int().min(1).max(5),
    title: z.string().optional(),
    body: z.string(),
    product: reference('products').optional(),
    date: z.coerce.date().optional(),
    order: z.number().int().default(0),
  }),
});

const stores = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/stores' }),
  schema: z.object({
    name: z.string(),
    street: z.string(),
    postalCode: z.string(),
    city: z.string(),
    country: z.enum(['BE', 'NL']).default('BE'),
    url: z.url().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    group: z.enum(['kiezen', 'spel', 'bestellen', 'zakelijk']),
    order: z.number().int().default(0),
  }),
});

export const collections = { products, categories, blog, pages, authors, reviews, stores, faq };
