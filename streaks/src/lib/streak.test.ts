import test from 'node:test';
import assert from 'node:assert/strict';
import { bestStreak, currentStreak, heatmapWeeks, lastSevenDays, successRate } from './streak';

const T = '2026-03-10';

test('current streak counts back from today', () => {
  assert.equal(currentStreak(['2026-03-10', '2026-03-09', '2026-03-08'], T), 3);
});
test('streak survives until end of day when today is unlogged', () => {
  assert.equal(currentStreak(['2026-03-09', '2026-03-08'], T), 2);
});
test('streak breaks after a missed day', () => {
  assert.equal(currentStreak(['2026-03-08'], T), 0);
});
test('crosses month and DST boundaries', () => {
  assert.equal(currentStreak(['2026-03-01', '2026-02-28', '2026-02-27'], '2026-03-01'), 3);
  assert.equal(bestStreak(['2026-03-28', '2026-03-29', '2026-03-30']), 3);
});
test('best streak and duplicates', () => {
  assert.equal(bestStreak(['2026-01-01', '2026-01-01', '2026-01-02', '2026-01-05']), 2);
  assert.equal(bestStreak([]), 0);
});
test('success rate', () => {
  assert.equal(successRate([], T), 0);
  assert.equal(successRate(['2026-03-09', '2026-03-10'], T), 1);
  assert.equal(successRate(['2026-03-07'], T), 0.25);
});
test('dot tracker and heatmap shape', () => {
  const d = lastSevenDays(['2026-03-10'], T);
  assert.equal(d.length, 7);
  assert.ok(d[6].done && d[6].isToday);
  const h = heatmapWeeks([], 12, T);
  assert.equal(h.length, 12);
  assert.ok(h.every((w) => w.length === 7));
  assert.equal(h[11].find((c) => c.key === T)?.future, false);
});
