// SEO checks (CLAUDE.md rules 1-8).
//   node scripts/seo-check.mjs content  -> title/description lengths in src/content (fast, pre-build)
//   node scripts/seo-check.mjs dist     -> checks every built HTML page in dist/ (post-build)
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const mode = process.argv[2] ?? 'dist';
const problems = [];
const warn = (file, msg) => problems.push(`${file}: ${msg}`);

async function walk(dir, ext) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, ext)));
    else if (ext.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  for (const line of (m?.[1] ?? '').split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"');
  }
  return fm;
}

if (mode === 'content') {
  for (const file of await walk('src/content', ['.md'])) {
    const fm = frontmatter((await readFile(file, 'utf8')).replace(/\r\n/g, '\n'));
    const title = fm.seoTitle;
    const desc = fm.description ?? fm.seoDescription;
    const rel = relative('src/content', file);
    if (title !== undefined && title.length > 50) warn(rel, `seoTitle ${title.length} > 50: "${title}"`);
    if (desc !== undefined && (desc.length < 120 || desc.length > 155))
      warn(rel, `description ${desc.length} (120-155): "${desc}"`);
  }
} else {
  const BUDGET_HTML = 60 * 1024;
  const files = await walk('dist', ['.html']);
  const redirectSources = new Set(
    (await readFile('public/_redirects', 'utf8'))
      .split('\n')
      .filter((l) => l.startsWith('/') && !l.includes('=') && !l.includes('*'))
      .map((l) => l.split(/\s+/)[0]),
  );
  const exists = (p) =>
    stat(p)
      .then(() => true)
      .catch(() => false);
  const checked = new Map();
  const linkTargetExists = async (href) => {
    if (!checked.has(href)) {
      const path = decodeURIComponent(href);
      checked.set(
        href,
        path.endsWith('/') ? await exists(join('dist', path, 'index.html')) : await exists(join('dist', path)),
      );
    }
    return checked.get(href);
  };
  const titles = new Map();
  for (const file of files) {
    const rel =
      '/' +
      relative('dist', file)
        .replace(/\\/g, '/')
        .replace(/index\.html$/, '');
    if (rel.startsWith('/keystatic')) continue;
    const html = await readFile(file, 'utf8');
    const size = (await stat(file)).size;
    const noindex = /<meta name="robots" content="noindex/.test(html);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;

    if (size > BUDGET_HTML) warn(rel, `HTML ${Math.round(size / 1024)} KB > 60 KB`);
    if (!title) warn(rel, 'missing <title>');
    else {
      const decoded = title.replace(/&amp;/g, '&').replace(/&#39;/g, "'");
      if (decoded.length > 60) warn(rel, `title ${decoded.length} > 60: "${decoded}"`);
      if (!noindex) {
        if (titles.has(decoded)) warn(rel, `duplicate title with ${titles.get(decoded)}`);
        titles.set(decoded, rel);
      }
    }
    if (!desc) warn(rel, 'missing meta description');
    else if (!noindex && (desc.length < 120 || desc.length > 160)) warn(rel, `description ${desc.length} chars`);
    if (!canonical) warn(rel, 'missing canonical');
    else if (!noindex && rel !== '/404.html' && new URL(canonical).pathname !== rel)
      warn(rel, `canonical points to ${canonical}`);
    if (h1s !== 1 && rel !== '/404.html') warn(rel, `${h1s} <h1> elements`);
    if (!html.includes('application/ld+json')) warn(rel, 'no JSON-LD');
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      // A bare `alt` is how Astro renders alt="" (decorative image), which is valid.
      if (!/\balt(=|[\s>])/.test(img)) warn(rel, `img without alt: ${img.slice(0, 80)}`);
      if (!/\bwidth=/.test(img) || !/\bheight=/.test(img)) warn(rel, `img without width/height: ${img.slice(0, 80)}`);
    }
    // Internal links must point straight at a built page or file, never through a redirect (rule 6).
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)/g)) {
      if (redirectSources.has(href)) warn(rel, `internal link via redirect: ${href}`);
      else if (!(await linkTargetExists(href))) warn(rel, `broken internal link: ${href}`);
    }
    // A word glued to a link ("Als<a …>", "</a>en"): Astro drops the line break between text and an inline tag.
    // Fix with {' '} in the source.
    for (const [glued] of html.matchAll(/[\p{L}\d,;:]<(?:a|strong|em|b)[\s>]|<\/(?:a|strong|em|b)>[\p{L}\d]/gu)) {
      warn(rel, `missing space around inline tag: ${glued}`);
    }
    for (const json of html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? []) {
      try {
        JSON.parse(json.replace(/^<script[^>]*>|<\/script>$/g, ''));
      } catch {
        warn(rel, 'invalid JSON-LD');
      }
    }
  }
  // Sitemap: only indexable, self-canonical pages.
  try {
    const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
    for (const loc of sitemap.match(/<loc>[^<]+<\/loc>/g) ?? []) {
      const path = new URL(loc.slice(5, -6)).pathname;
      const file = join('dist', path, 'index.html');
      const html = await readFile(file, 'utf8').catch(() => null);
      if (!html) warn('sitemap', `${path} has no built page`);
      else if (/content="noindex/.test(html)) warn('sitemap', `${path} is noindex but listed`);
    }
  } catch {
    warn('sitemap', 'dist/sitemap-0.xml missing');
  }
  console.log(`checked ${files.length} pages`);
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log('SEO check passed');
