// nordicHome is the only hamstring exercise in the equipment-free home plan
// (home_bw3) — no band, no dumbbell fallback exists for it there. Its failure
// mode is losing control around 30-40 degrees of the descent, exactly where
// the hamstring is near its most stretched, and falling. The old tips told
// the lifter to go down "as slow as you can" and to "help with your hands
// pushing back" — both react after control is already lost. Nothing said to
// keep the hands ready before that point, where to catch the rep instead of
// riding it to the floor, or what to do if the lifter has no control at all
// in the full range.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EX } from './catalogue.mjs';

const joined = () => EX.nordicHome.tips.join(' ');

test('tells the lifter to keep hands ready before losing control, not only after', () => {
  assert.match(joined(), /מוכנות/, 'expected a cue about hands being ready in advance');
});

test('gives a controlled catch point instead of riding the descent to a fall', () => {
  assert.match(joined(), /שולט/, 'expected a cue about catching the rep while still in control');
});

test('gives a regression for a lifter with no control in the full range', () => {
  assert.match(joined(), /אין שליטה/, 'expected a fallback for zero control in the full range');
});
