// The contest with the quiz: win a box every week. Rules: src/lib/quiz/wedstrijdreglement.md (the only copy of
// the text, shown on /quiz/reglement/). Shared by the quiz page and the functions quiz-contest*.mts.

export const CONTEST = {
  quiz: 'ken-jij-spanje',
  // Brussels time: from Wednesday 14 October 2026 00:00 (summer time) up to and including Sunday
  // 22 November 2026 23:59 (winter time). Rounds run Monday 00:00 to Sunday 23:59.
  start: '2026-10-14T00:00:00+02:00',
  end: '2026-11-23T00:00:00+01:00',
  /** Extra chances per round for friends who play through your link and enter. */
  maxReferrals: 10,
} as const;

/** Personal invitation code: 10 characters, no look-alikes (i, l, o, 0, 1), not guessable. */
export const REF_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
export const REF_CODE = /^[a-hjkmnp-z2-9]{10}$/;

export const isOpen = (now = new Date()) => now >= new Date(CONTEST.start) && now < new Date(CONTEST.end);

/** The round of a moment: its ISO week in Brussels time, for example "2026-W42" (12 to 18 October 2026). */
export function roundOf(now = new Date()): string {
  const [year = 1970, month = 1, day = 1] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Brussels' })
    .format(now)
    .split('-')
    .map(Number);
  // ISO week: the week of the Thursday in it.
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const week = Math.ceil(((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
