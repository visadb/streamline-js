// Grind adjustment policy (src/modules/grind-policy.js), ported from the
// legacy Streamline skin (de1app ffdf75da): tap steps 0.025, long-press
// steps 0.25, and the setting is rounded and rendered at three decimals.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    GRIND_STEP,
    GRIND_STEP_LONG,
    GRIND_MIN,
    GRIND_MAX,
    roundGrind,
    clampGrind,
    formatGrind,
} from '../src/modules/grind-policy.js';

test('step sizes match the legacy skin: fine tap, coarse long press', () => {
    assert.equal(GRIND_STEP, 0.025);
    assert.equal(GRIND_STEP_LONG, 0.25);
    assert.ok(GRIND_STEP < GRIND_STEP_LONG);
});

test('roundGrind keeps three decimals and eats float noise', () => {
    // 1.4 - 0.025 accumulates binary noise (1.3750000000000002-style).
    assert.equal(roundGrind(1.4 - 0.025), 1.375);
    assert.equal(roundGrind(8.2 + 0.025), 8.225);
    assert.equal(roundGrind(1.2345), 1.235); // fourth decimal rounds, like Tcl round()
    assert.equal(roundGrind(1.2344), 1.234);
    assert.equal(roundGrind('8.250'), 8.25); // workflow carries strings
});

test('roundGrind falls back to 0 for blank or non-numeric input', () => {
    // Legacy labels render [ifexists ::settings(grinder_setting) 0].
    assert.equal(roundGrind(''), 0);
    assert.equal(roundGrind(undefined), 0);
    assert.equal(roundGrind('n/a'), 0);
});

test('clampGrind pins the setting to its bounds', () => {
    assert.equal(clampGrind(-0.2), GRIND_MIN);
    assert.equal(clampGrind(GRIND_MAX + 1), GRIND_MAX);
    assert.equal(clampGrind(1.375), 1.375);
});

test('formatGrind always shows three decimals, like the legacy %.3f', () => {
    assert.equal(formatGrind(8.25), '8.250');
    assert.equal(formatGrind(8), '8.000');
    assert.equal(formatGrind('1.4'), '1.400');
    assert.equal(formatGrind(1.4 - 0.025), '1.375');
    assert.equal(formatGrind(''), '0.000');
});

test('a tap sequence stays on exact 0.025 boundaries', () => {
    let v = 1.4;
    for (let i = 0; i < 3; i++) v = roundGrind(v + GRIND_STEP);
    assert.equal(v, 1.475);
    v = roundGrind(v + GRIND_STEP_LONG);
    assert.equal(v, 1.725);
});
