// Entries for the contest with the quiz (rules: src/lib/quiz/wedstrijdreglement.md, settings: src/lib/quiz/contest.ts).
// Stored in Netlify Blobs, store "quiz-contest", apart from the anonymous quiz records:
//   <env>/entries/<round>/<email hash>   the entry: e-mail, round, time, score, newsletter, own code, invited by
//   <env>/codes/<email hash>             the personal invitation code of an e-mail address (the same every round)
//   <env>/refs/<code>                    which e-mail hash a code belongs to
//   <env>/referrals/<round>/<inviter hash>/<friend hash>   one per friend who entered through a link
//   <env>/newsletter/<email hash>        e-mail addresses that ticked the newsletter
// <env> is "production" on flavory.wine and "test" on deploy previews.
// Privacy: no IP address, no cookies, nothing logged; e-mail addresses only in the store, never in a log or a reply.
// One entry per e-mail per round: the entry is only written when it does not exist yet (onlyIfNew).
import { createHash, randomInt } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { CONTEST, REF_ALPHABET, REF_CODE, isOpen, roundOf } from '../../src/lib/quiz/contest.ts';
import { TITLES, TOP_TITLE } from '../../src/lib/quiz/ken-jij-spanje.ts';

const EMAIL = /^[^\s@"<>]{1,64}@[a-z0-9.-]{1,185}\.[a-z]{2,24}$/;
const VALID_TITLES = new Set([...TITLES.map((t) => t.title), TOP_TITLE]);
const MAX_BODY = 2000;

type Entry = { email: string; newsletter: boolean; reached: number; completed: boolean; title: string; ref?: string };

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const isInt = (value: unknown, min: number, max: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

/** The accepted entry, or null when anything does not fit. Both boxes (18+ and the rules) must be ticked. */
function clean(input: unknown): Entry | null {
  if (typeof input !== 'object' || input === null) return null;
  const { email, adult, rules, newsletter, reached, completed, title, ref } = input as Record<string, unknown>;
  if (typeof email !== 'string') return null;
  const address = email.trim().toLowerCase();
  if (address.length > 254 || !EMAIL.test(address)) return null;
  if (adult !== true || rules !== true || typeof newsletter !== 'boolean') return null;
  if (!isInt(reached, 1, 15) || typeof completed !== 'boolean') return null;
  if (typeof title !== 'string' || !VALID_TITLES.has(title)) return null;
  if (ref !== undefined && ref !== null && (typeof ref !== 'string' || !REF_CODE.test(ref))) return null;
  const entry: Entry = { email: address, newsletter, reached, completed, title };
  if (typeof ref === 'string') entry.ref = ref;
  return entry;
}

const newCode = () => Array.from({ length: 10 }, () => REF_ALPHABET[randomInt(REF_ALPHABET.length)]).join('');

export default async (request: Request, context: { deploy?: { context?: string } }): Promise<Response> => {
  if (request.method !== 'POST') return json(405, { status: 'method' });
  const body = await request.text();
  if (body.length > MAX_BODY) return json(413, { status: 'invalid' });
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return json(400, { status: 'invalid' });
  }
  const entry = clean(input);
  if (!entry) return json(400, { status: 'invalid' });

  const production = context.deploy?.context === 'production';
  const now = new Date();
  // Deploy previews accept entries outside the contest period, for testing.
  if (production && !isOpen(now)) return json(403, { status: 'closed' });

  const env = production ? 'production' : 'test';
  const store = getStore({ name: 'quiz-contest', consistency: 'strong' });
  const hash = createHash('sha256').update(entry.email).digest('hex');
  const round = roundOf(now);

  // The personal code: made once per e-mail address, then the same in every round.
  const codeKey = `${env}/codes/${hash}`;
  let code = ((await store.get(codeKey, { type: 'json' })) as { code?: string } | null)?.code;
  if (!code) {
    const fresh = newCode();
    const { modified } = await store.setJSON(codeKey, { code: fresh, email: entry.email }, { onlyIfNew: true });
    code = modified ? fresh : ((await store.get(codeKey, { type: 'json' })) as { code: string }).code;
    if (modified) await store.setJSON(`${env}/refs/${fresh}`, { hash });
  }

  const record = {
    quiz: CONTEST.quiz,
    round,
    at: now.toISOString(),
    email: entry.email,
    reached: entry.reached,
    completed: entry.completed,
    title: entry.title,
    newsletter: entry.newsletter,
    code,
    invitedBy: entry.ref ?? null,
  };
  const { modified } = await store.setJSON(`${env}/entries/${round}/${hash}`, record, { onlyIfNew: true });
  if (!modified) return json(200, { status: 'already' });

  // A friend who entered through a personal link: one extra chance for the inviter, once per friend per round.
  // The limit of ten per round is applied when the results are read.
  if (entry.ref) {
    const inviter = (await store.get(`${env}/refs/${entry.ref}`, { type: 'json' })) as { hash?: string } | null;
    if (inviter?.hash && inviter.hash !== hash) {
      await store.setJSON(`${env}/referrals/${round}/${inviter.hash}/${hash}`, { at: record.at }, { onlyIfNew: true });
    }
  }
  if (entry.newsletter) {
    await store.setJSON(`${env}/newsletter/${hash}`, { email: entry.email, at: record.at, round }, { onlyIfNew: true });
  }
  return json(201, { status: 'ok', code });
};
