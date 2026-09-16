// Converts scraped Elementor HTML (scraped/html) into readable markdown (scraped/text)
// so page structure and copy can be reviewed and ported by hand.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import TurndownService from 'turndown';

const SRC = 'scraped/html';
const OUT = 'scraped/text';

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
td.remove(['script', 'style', 'noscript', 'svg', 'form', 'iframe']);
td.addRule('img', {
  filter: 'img',
  replacement: (_c, node) => {
    const src = node.getAttribute('data-src') || node.getAttribute('src') || '';
    if (src.startsWith('data:')) return '';
    return `![${node.getAttribute('alt') || ''}](${src.replace('https://flavory.wine/wp-content/', '')})`;
  },
});
td.addRule('video', {
  filter: 'video',
  replacement: (_c, node) =>
    `[video: ${(node.getAttribute('src') || '').replace('https://flavory.wine/wp-content/', '')}]`,
});

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

for (const file of await walk(SRC)) {
  const html = await readFile(file, 'utf8');
  // Drop Elementor header/footer templates; keep the main page body.
  const body = html
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<div[^>]+data-elementor-type="(header|footer|popup)"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');
  const main = body.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? body;
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '';
  const md = td
    .turndown(main)
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*\[\s*\]\(.*?\)\s*$/gm, '');
  const target = join(OUT, file.slice(SRC.length + 1).replace(/\.html$/, '.md'));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `<!-- title: ${title}\n description: ${desc} -->\n\n${md}\n`);
}
console.log('done');
