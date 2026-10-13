// Downloads the contest results of one round as two CSV files for Excel: the entries with the number of chances
// per person, and the newsletter sign-ups.
//   node scripts/contest-results.mjs [ronde: vorige | huidige | 2026-W42] [map]
// Without a round: the round that ended last Sunday. The key comes from the environment variable
// CONTEST_RESULTS_KEY, never from a file. CONTEST_RESULTS_URL points elsewhere, for example a deploy preview
// (test entries, e-mail addresses masked, no key needed). See docs/quiz-wedstrijd.md.
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [round = 'vorige', dir = '.'] = process.argv.slice(2);
const key = process.env.CONTEST_RESULTS_KEY;
const base = process.env.CONTEST_RESULTS_URL ?? 'https://flavory.wine/.netlify/functions/quiz-contest-results';

for (const vorm of ['deelnames', 'nieuwsbrief']) {
  const url = new URL(base);
  url.searchParams.set('ronde', round);
  url.searchParams.set('vorm', vorm);
  const response = await fetch(url, { headers: key ? { authorization: `Bearer ${key}` } : {} });
  if (!response.ok) {
    console.error(`${vorm}: ${response.status} ${await response.text()}`);
    process.exit(1);
  }
  const name = response.headers.get('content-disposition')?.match(/filename="([^"]+)"/)?.[1] ?? `wedstrijd-${vorm}.csv`;
  const body = await response.text();
  await writeFile(join(dir, name), body);
  console.log(`${join(dir, name)}: ${body.trim().split('\n').length - 1} rijen`);
}
