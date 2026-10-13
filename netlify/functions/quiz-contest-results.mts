// The contest entries (see quiz-contest.mts) as a CSV file for Excel: semicolons, UTF-8.
//   GET /.netlify/functions/quiz-contest-results?ronde=vorige|huidige|2026-W42&vorm=deelnames|nieuwsbrief
//   ronde: default "vorige" (the round that ended last Sunday). vorm=deelnames: one row per person with the
//   number of chances. vorm=nieuwsbrief: everyone who ticked the newsletter, all rounds.
// Production: only with the header "Authorization: Bearer <key>", where the key is the Netlify environment
// variable CONTEST_RESULTS_KEY (scope Functions, marked as secret). The key never goes in the code. Without that
// variable, reading is off. Deploy previews: test entries only, with the e-mail addresses masked.
// How to: docs/quiz-wedstrijd.md.
import { createHash, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { CONTEST, roundOf } from '../../src/lib/quiz/contest.ts';

const ROUND = /^\d{4}-W\d{2}$/;
const WEEK_MS = 7 * 86_400_000;

type Entry = {
  round: string;
  at: string;
  email: string;
  reached: number;
  completed: boolean;
  title: string;
  newsletter: boolean;
  code: string;
  invitedBy: string | null;
};
type Person = { email: string; code?: string | undefined; entry?: Entry | undefined; friends: number };

const text = (status: number, body: string) =>
  new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });

function sameKey(given: string, expected: string): boolean {
  const hash = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(hash(given), hash(expected));
}

const brussels = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Brussels', ...options }).format(new Date(iso));
const cell = (value: unknown) => {
  const s = value === undefined || value === null ? '' : String(value);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const yesNo = (value: boolean | undefined) => (value === undefined ? '' : value ? 'ja' : 'nee');
const csv = (rows: unknown[][]) => '﻿' + rows.map((row) => row.map(cell).join(';')).join('\r\n') + '\r\n';

// On deploy previews e-mail addresses are never shown in full: t***@example.com.
const masked = (email: string) => email.replace(/^(.)[^@]*/, '$1***');

async function readAll<T>(keys: string[], read: (key: string) => Promise<unknown>): Promise<T[]> {
  const values: T[] = [];
  let next = 0;
  const worker = async () => {
    while (next < keys.length) {
      const key = keys[next++];
      const value = key ? await read(key) : null;
      if (value) values.push(value as T);
    }
  };
  await Promise.all(Array.from({ length: Math.min(25, keys.length) }, worker));
  return values;
}

export default async (request: Request, context: { deploy?: { context?: string } }): Promise<Response> => {
  if (request.method !== 'GET') return text(405, 'Alleen GET.');
  const production = context.deploy?.context === 'production';
  if (production) {
    const key = process.env.CONTEST_RESULTS_KEY;
    if (!key) return text(503, 'Uitlezen staat uit: CONTEST_RESULTS_KEY ontbreekt in Netlify.');
    const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
    if (!given || !sameKey(given, key)) return text(401, 'Geen toegang.');
  }
  const show = (email: string) => (production ? email : masked(email));

  const url = new URL(request.url);
  const asked = url.searchParams.get('ronde') ?? 'vorige';
  const round = asked === 'huidige' ? roundOf() : asked === 'vorige' ? roundOf(new Date(Date.now() - WEEK_MS)) : asked;
  if (!ROUND.test(round)) return text(400, 'Gebruik ronde=vorige, huidige of JJJJ-Www (bv. 2026-W42).');

  const env = production ? 'production' : 'test';
  const store = getStore({ name: 'quiz-contest', consistency: 'strong' });
  const read = (key: string) => store.get(key, { type: 'json' });
  const keys = async (prefix: string) => (await store.list({ prefix })).blobs.map((blob) => blob.key);

  if (url.searchParams.get('vorm') === 'nieuwsbrief') {
    type Signup = { email: string; at: string; round: string };
    const signups = (await readAll<Signup>(await keys(`${env}/newsletter/`), read)).sort((a, b) =>
      a.at.localeCompare(b.at),
    );
    const rows: unknown[][] = [['e-mail', 'ingeschreven op', 'ronde']];
    for (const s of signups) rows.push([show(s.email), brussels(s.at, {}), s.round]);
    return file(csv(rows), `wedstrijd-nieuwsbrief-tot-${round}.csv`);
  }

  // Everyone with a chance this round: an entry, friends who entered through their link, or both.
  const people = new Map<string, Person>();
  for (const entry of await readAll<Entry>(await keys(`${env}/entries/${round}/`), read)) {
    const hash = createHash('sha256').update(entry.email).digest('hex');
    people.set(hash, { email: entry.email, code: entry.code, entry, friends: 0 });
  }
  for (const key of await keys(`${env}/referrals/${round}/`)) {
    const inviter = key.split('/')[3];
    if (!inviter) continue;
    const person = people.get(inviter) ?? { email: '', friends: 0 };
    person.friends += 1;
    people.set(inviter, person);
  }
  // Inviters without an entry of their own this round: their address comes from their code.
  for (const [hash, person] of people) {
    if (person.entry) continue;
    const owner = (await read(`${env}/codes/${hash}`)) as { code?: string; email?: string } | null;
    person.email = owner?.email ?? '(onbekend)';
    person.code = owner?.code;
  }

  const rows: unknown[][] = [
    [
      'ronde',
      'e-mail',
      'datum',
      'uur',
      'eigen code',
      'bereikte vraag',
      'alles gehaald',
      'titel',
      'nieuwsbrief',
      'uitgenodigd met code',
      'deelname',
      'vrienden die meededen',
      `extra kansen vrienden (max ${CONTEST.maxReferrals})`,
      'story getagd (+1, zelf invullen)',
      'kansen zonder story',
    ],
  ];
  const sorted = [...people.values()].sort((a, b) => (a.entry?.at ?? '~').localeCompare(b.entry?.at ?? '~'));
  for (const p of sorted) {
    const e = p.entry;
    const extra = Math.min(p.friends, CONTEST.maxReferrals);
    rows.push([
      round,
      show(p.email),
      e ? brussels(e.at, {}) : '',
      e ? brussels(e.at, { hour: '2-digit', minute: '2-digit' }) : '',
      p.code,
      e?.reached,
      yesNo(e?.completed),
      e?.title,
      yesNo(e?.newsletter),
      e?.invitedBy,
      e ? 1 : 0,
      p.friends,
      extra,
      '',
      (e ? 1 : 0) + extra,
    ]);
  }
  return file(csv(rows), `wedstrijd-deelnames-${round}.csv`);
};

function file(body: string, name: string): Response {
  return new Response(body, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${name}"`,
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}
