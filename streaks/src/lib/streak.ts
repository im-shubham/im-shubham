/** Pure streak math. Days are local-time keys: "YYYY-MM-DD". */

export const dayKey = (d: Date = new Date()): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const parse = (k: string): Date => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (k: string, n: number): string => {
  const d = parse(k);
  d.setDate(d.getDate() + n);
  return dayKey(d);
};

/** Whole days from a to b (DST-safe). */
export const diffDays = (a: string, b: string): number => {
  const A = parse(a);
  const B = parse(b);
  return Math.round(
    (Date.UTC(B.getFullYear(), B.getMonth(), B.getDate()) -
      Date.UTC(A.getFullYear(), A.getMonth(), A.getDate())) /
      86400000,
  );
};

/** Current streak. Today not being logged yet doesn't break a streak ending yesterday. */
export function currentStreak(logs: string[], today: string = dayKey()): number {
  const set = new Set(logs);
  let cursor = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(cursor)) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function bestStreak(logs: string[]): number {
  const days = [...new Set(logs)].sort();
  let best = 0;
  let run = 0;
  days.forEach((d, i) => {
    run = i > 0 && diffDays(days[i - 1], d) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}

/** Share of days since the first log (inclusive of today) that were logged, 0..1. */
export function successRate(logs: string[], today: string = dayKey()): number {
  if (logs.length === 0) return 0;
  const first = [...logs].sort()[0];
  const span = diffDays(first, today) + 1;
  return Math.min(1, new Set(logs).size / Math.max(1, span));
}

/** The last 7 days ending today, oldest first. */
export function lastSevenDays(logs: string[], today: string = dayKey()) {
  const set = new Set(logs);
  return Array.from({ length: 7 }, (_, i) => {
    const k = addDays(today, i - 6);
    return { key: k, done: set.has(k), isToday: k === today };
  });
}

/** Heatmap grid: `weeks` columns of 7 days (Sun..Sat), ending with the current week. */
export function heatmapWeeks(logs: string[], weeks = 12, today: string = dayKey()) {
  const set = new Set(logs);
  const dow = parse(today).getDay();
  const start = addDays(today, -(dow + 7 * (weeks - 1)));
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const k = addDays(start, w * 7 + d);
      return { key: k, done: set.has(k), future: diffDays(today, k) > 0 };
    }),
  );
}
