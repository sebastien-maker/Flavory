// Anonymous record of every game of the quiz /quiz/ken-jij-spanje/, so we see what players answer.
// Stored in Netlify Blobs (store "quiz-results"), one small JSON per event:
//   <production|test>/<quiz>/<day in Brussels>/<game>/<event>
// Privacy: no IP address, no cookies, no user agent, nothing stored on the device. "game" is a random ID made
// in the browser for one game only; it links the events of that game and nothing else. Nothing is logged.
// Only a fixed shape is accepted; anything else is refused. Read the results with quiz-results.mts.
import { getStore } from '@netlify/blobs';

const QUIZZES = new Set(['ken-jij-spanje']);
const EVENTS = new Set(['progress', 'end', 'final', 'box', 'share']);
const FINAL_ANSWERS = new Set(['Ja, zeker', 'Misschien', 'Geen idee']);
const SHARE_METHODS = new Set(['share', 'copy']);
const GAME_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const QUESTION_ID = /^[a-z0-9-]{1,40}$/;
const TITLE = /^[\p{L} ]{1,40}$/u;
const MAX_BODY = 4000;

type Answer = { id: string; level: number; correct: boolean; km?: number };

const isInt = (value: unknown, min: number, max: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

function cleanAnswers(value: unknown): Answer[] | undefined {
  if (!Array.isArray(value) || value.length > 15) return undefined;
  const answers: Answer[] = [];
  for (const item of value) {
    if (typeof item !== 'object' || item === null) return undefined;
    const { id, level, correct, km } = item as Record<string, unknown>;
    if (typeof id !== 'string' || !QUESTION_ID.test(id) || !isInt(level, 1, 5) || typeof correct !== 'boolean') {
      return undefined;
    }
    if (km !== undefined && !isInt(km, 0, 5000)) return undefined;
    answers.push(km === undefined ? { id, level, correct } : { id, level, correct, km });
  }
  return answers;
}

/** The accepted record, or null when anything does not fit. */
function clean(input: unknown): Record<string, unknown> | null {
  if (typeof input !== 'object' || input === null) return null;
  const { quiz, game, event, answers, reached, completed, mistakes, title, answer, method } = input as Record<
    string,
    unknown
  >;
  if (typeof quiz !== 'string' || !QUIZZES.has(quiz)) return null;
  if (typeof game !== 'string' || !GAME_ID.test(game)) return null;
  if (typeof event !== 'string' || !EVENTS.has(event)) return null;
  const record: Record<string, unknown> = { quiz, game, event };

  if (event === 'progress' || event === 'end') {
    const list = cleanAnswers(answers);
    if (!list || !isInt(reached, 1, 15)) return null;
    record.answers = list;
    record.reached = reached;
  }
  if (event === 'end') {
    if (typeof completed !== 'boolean' || !isInt(mistakes, 0, 15)) return null;
    if (typeof title !== 'string' || !TITLE.test(title)) return null;
    Object.assign(record, { completed, mistakes, title });
  }
  if (event === 'final') {
    if (typeof answer !== 'string' || !FINAL_ANSWERS.has(answer)) return null;
    record.answer = answer;
  }
  if (event === 'share' && method !== undefined) {
    if (typeof method !== 'string' || !SHARE_METHODS.has(method)) return null;
    record.method = method;
  }
  return record;
}

const brusselsDay = (date: Date) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Brussels' }).format(date);

const reply = (status: number) => new Response(null, { status, headers: { 'cache-control': 'no-store' } });

export default async (request: Request, context: { deploy?: { context?: string } }): Promise<Response> => {
  if (request.method !== 'POST') return reply(405);
  const body = await request.text();
  if (body.length > MAX_BODY) return reply(413);
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return reply(400);
  }
  const record = clean(input);
  if (!record) return reply(400);

  // Plays on deploy previews are kept apart from the real ones.
  const env = context.deploy?.context === 'production' ? 'production' : 'test';
  const now = new Date();
  const key = `${env}/${record.quiz}/${brusselsDay(now)}/${record.game}/${record.event}`;
  await getStore('quiz-results').setJSON(key, { at: now.toISOString(), ...record });
  return reply(204);
};
