// bulgarianSplit is used by five plans (home_bw3 aside) and had three
// independent defects in one record: a unilateral exercise whose set count
// didn't say "per side", a knee cue contradicting both its own description
// and the three parallel entries in the catalogue, and a tip that isn't an
// instruction a lifter can act on.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EX } from './catalogue.mjs';

const ex = EX.bulgarianSplit;

test('states its set count per side, like every other unilateral lift', () => {
  assert.match(ex.sets, /לצד/, 'sets string: ' + ex.sets);
});

test('agrees with its own description: knee does not pass the toes', () => {
  // desc says "ירידה אנכית" (vertical descent) — a tip telling the lifter to
  // let the knee travel past the toes contradicts that, and contradicts the
  // three parallel single-leg entries (lunges, bulgSplit, bulgSplitHome),
  // which all say the knee does NOT pass the toes.
  const kneeTip = ex.tips.find(t => t.includes('ברך'));
  assert.ok(kneeTip, 'no knee cue found in tips');
  assert.doesNotMatch(kneeTip, /ברך קדמית מעל אצבעות/, 'knee tip: ' + kneeTip);
});

test('every tip is an instruction, not an unexplained label', () => {
  assert.ok(!ex.tips.includes('יסוד אנכי'), 'tips: ' + JSON.stringify(ex.tips));
});
