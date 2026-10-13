// The anonymous quiz records (see quiz-log.mts) as a CSV file for Excel: semicolons, UTF-8.
//   GET /.netlify/functions/quiz-results?van=2026-10-13&tot=2026-10-19&vorm=spellen|antwoorden
//   Without van/tot: the last 7 days. vorm=spellen (default) gives one row per game, vorm=antwoorden one per answer.
// Production: only with the header "Authorization: Bearer <key>", where the key is the Netlify environment
// variable QUIZ_RESULTS_KEY (scope Functions). The key never goes in the code. Without that variable, reading
// is off. Deploy previews: test plays only, without a key. How to: docs/quiz-meten.md.
import { createHash, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const QUIZ = 'ken-jij-spanje';
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;
const MAX_DAYS = 92;

type Answer = { id: string; level: number; correct: boolean; km?: number };
type Event = {
  at: string;
  game: string;
  event: string;
  answers?: Answer[];
  reached?: number;
  completed?: boolean;
  mistakes?: number;
  title?: string;
  answer?: string;
};
type Game = {
  game: string;
  at: string;
  ended: boolean;
  answers: Answer[];
  reached?: number | undefined;
  completed?: boolean | undefined;
  mistakes?: number | undefined;
  title?: string | undefined;
  answer?: string | undefined;
  box: boolean;
  share: boolean;
};

const text = (status: number, body: string) =>
  new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });

const brussels = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Brussels', ...options }).format(new Date(iso));

function sameKey(given: string, expected: string): boolean {
  const hash = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(hash(given), hash(expected));
}

function dayRange(from: string, to: string): string[] | null {
  if (!DAY.test(from) || !DAY.test(to)) return null;
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start || (end - start) / DAY_MS >= MAX_DAYS) return null;
  return Array.from({ length: (end - start) / DAY_MS + 1 }, (_, i) =>
    new Date(start + i * DAY_MS).toISOString().slice(0, 10),
  );
}

// Several reads at once, so a week of games fits well within the function time limit.
async function readAll(keys: string[], read: (key: string) => Promise<unknown>): Promise<Event[]> {
  const events: Event[] = [];
  let next = 0;
  const worker = async () => {
    while (next < keys.length) {
      const key = keys[next++];
      const value = key ? await read(key) : null;
      if (value) events.push(value as Event);
    }
  };
  await Promise.all(Array.from({ length: Math.min(25, keys.length) }, worker));
  return events;
}

function toGames(events: Event[]): Game[] {
  const games = new Map<string, Game>();
  for (const e of events.sort((a, b) => a.at.localeCompare(b.at))) {
    const game = games.get(e.game) ?? { game: e.game, at: e.at, ended: false, answers: [], box: false, share: false };
    if (e.event === 'progress' && !game.ended) {
      game.answers = e.answers ?? [];
      game.reached = e.reached;
    } else if (e.event === 'end') {
      Object.assign(game, {
        ended: true,
        answers: e.answers ?? [],
        reached: e.reached,
        completed: e.completed,
        mistakes: e.mistakes,
        title: e.title,
      });
    } else if (e.event === 'final') game.answer = e.answer;
    else if (e.event === 'box') game.box = true;
    else if (e.event === 'share') game.share = true;
    games.set(e.game, game);
  }
  return [...games.values()];
}

const cell = (value: unknown) => {
  const s = value === undefined || value === null ? '' : String(value);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const yesNo = (value: boolean | undefined) => (value === undefined ? '' : value ? 'ja' : 'nee');
const csv = (rows: unknown[][]) => '﻿' + rows.map((row) => row.map(cell).join(';')).join('\r\n') + '\r\n';

function gamesCsv(games: Game[]): string {
  const rows: unknown[][] = [
    [
      'datum',
      'uur',
      'spel',
      'bereikte vraag',
      'alles gehaald',
      'titel',
      'fouten',
      'slotvraag',
      'bekijk de box',
      'gedeeld',
      'spel uitgespeeld',
      'antwoorden',
    ],
  ];
  for (const g of games) {
    const answers = g.answers
      .map((a, i) => `${i + 1}. ${a.id}: ${a.correct ? 'juist' : 'fout'}${a.km === undefined ? '' : ` (${a.km} km)`}`)
      .join(' | ');
    rows.push([
      brussels(g.at, {}),
      brussels(g.at, { hour: '2-digit', minute: '2-digit' }),
      g.game.slice(0, 8),
      g.reached,
      yesNo(g.completed),
      g.title,
      g.mistakes,
      g.answer,
      yesNo(g.box),
      yesNo(g.share),
      yesNo(g.ended),
      answers,
    ]);
  }
  return csv(rows);
}

function answersCsv(games: Game[]): string {
  const rows: unknown[][] = [['datum', 'uur', 'spel', 'nr', 'trap', 'vraag', 'juist', 'km naast']];
  for (const g of games) {
    g.answers.forEach((a, i) =>
      rows.push([
        brussels(g.at, {}),
        brussels(g.at, { hour: '2-digit', minute: '2-digit' }),
        g.game.slice(0, 8),
        i + 1,
        a.level,
        a.id,
        yesNo(a.correct),
        a.km,
      ]),
    );
  }
  return csv(rows);
}

export default async (request: Request, context: { deploy?: { context?: string } }): Promise<Response> => {
  if (request.method !== 'GET') return text(405, 'Alleen GET.');
  const production = context.deploy?.context === 'production';
  if (production) {
    const key = process.env.QUIZ_RESULTS_KEY;
    if (!key) return text(503, 'Uitlezen staat uit: QUIZ_RESULTS_KEY ontbreekt in Netlify.');
    const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
    if (!given || !sameKey(given, key)) return text(401, 'Geen toegang.');
  }

  const url = new URL(request.url);
  const today = brussels(new Date().toISOString(), {});
  const to = url.searchParams.get('tot') ?? today;
  const from =
    url.searchParams.get('van') ?? new Date(Date.parse(`${to}T00:00:00Z`) - 6 * DAY_MS).toISOString().slice(0, 10);
  const days = dayRange(from, to);
  if (!days) return text(400, `Gebruik van en tot als JJJJ-MM-DD, hoogstens ${MAX_DAYS} dagen.`);
  const byAnswer = url.searchParams.get('vorm') === 'antwoorden';

  const store = getStore({ name: 'quiz-results', consistency: 'strong' });
  const env = production ? 'production' : 'test';
  const keys: string[] = [];
  for (const day of days) {
    const { blobs } = await store.list({ prefix: `${env}/${QUIZ}/${day}/` });
    keys.push(...blobs.map((blob) => blob.key));
  }
  const games = toGames(await readAll(keys, (key) => store.get(key, { type: 'json' })));
  const body = byAnswer ? answersCsv(games) : gamesCsv(games);
  return new Response(body, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="quiz-${QUIZ}-${byAnswer ? 'antwoorden' : 'spellen'}-${from}-${to}.csv"`,
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
};
