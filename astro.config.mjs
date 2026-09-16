// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// Noindex pages never go in the sitemap (rule 7): static ones listed here, content pages read from frontmatter.
const NOINDEX_PAGES = ['404', 'bedankt', 'win', 'partnership'];
const contentNoindex = readdirSync('src/content/pages')
  .filter((f) => /^noindex:\s*true/m.test(readFileSync(`src/content/pages/${f}`, 'utf8')))
  .map((f) => f.replace(/\.md$/, ''));
// Keystatic's admin only ships to production once its GitHub app is configured;
// otherwise it runs in local mode, which must never be exposed on the live site.
const isBuild = process.argv.includes('build');
const enableKeystatic = !isBuild || Boolean(process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG);

const SITEMAP_EXCLUDE = [
  ...[...NOINDEX_PAGES, ...contentNoindex].map((slug) => new RegExp(`/${slug}/?$`)),
  /\/keystatic/,
  /\/api\//,
];

export default defineConfig({
  site: 'https://flavory.wine',
  // Canonicals and internal links always end in "/" (build.format: 'directory'); 'ignore' lets Keystatic's API routes work.
  trailingSlash: 'ignore',
  output: 'static',
  // Edge functions are not used; skipping them avoids the local Deno server in `astro dev`.
  adapter: netlify({ imageCDN: true, devFeatures: { environmentVariables: true, images: true, edgeFunctions: false } }),
  i18n: {
    locales: ['nl'],
    defaultLocale: 'nl',
    routing: { prefixDefaultLocale: false },
  },
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [
    mdx(),
    ...(enableKeystatic ? [react({ include: ['**/keystatic/**', '**/node_modules/@keystatic/**'] }), keystatic()] : []),
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.some((re) => re.test(page)),
      i18n: { defaultLocale: 'nl', locales: { nl: 'nl-BE' } },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Ship scripts as cacheable files instead of inlining them into every page (HTML budget).
    build: { assetsInlineLimit: 0 },
    // Pre-bundle the Keystatic admin and React together; otherwise Vite's optimizer splits React inconsistently in dev.
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', '@keystatic/core', '@keystatic/core/ui'],
    },
  },
});
