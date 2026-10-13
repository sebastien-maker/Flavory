// Downloads the anonymous quiz results as two CSV files for Excel: one row per game and one row per answer.
//   node scripts/quiz-results.mjs [van JJJJ-MM-DD] [tot JJJJ-MM-DD] [map]
// Without dates: the last 7 days. The key comes from the environment variable QUIZ_RESULTS_KEY, never from a
// file. QUIZ_RESULTS_URL points elsewhere, for example a deploy preview (test plays, no key needed).
// See docs/quiz-meten.md.
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [from, to, dir = '.'] = process.argv.slice(2);
const key = process.env.QUIZ_RESULTS_KEY;
const base = process.env.QUIZ_RESULTS_URL ?? 'https://flavory.wine/.netlify/functions/quiz-results';

for (const vorm of ['spellen', 'antwoorden']) {
  const url = new URL(base);
  if (from) url.searchParams.set('van', from);
  if (to) url.searchParams.set('tot', to);
  url.searchParams.set('vorm', vorm);
  const response = await fetch(url, { headers: key ? { authorization: `Bearer ${key}` } : {} });
  if (!response.ok) {
    console.error(`${vorm}: ${response.status} ${await response.text()}`);
    process.exit(1);
  }
  const name = response.headers.get('content-disposition')?.match(/filename="([^"]+)"/)?.[1] ?? `quiz-${vorm}.csv`;
  const body = await response.text();
  await writeFile(join(dir, name), body);
  console.log(`${join(dir, name)}: ${body.trim().split('\n').length - 1} rijen`);
}
