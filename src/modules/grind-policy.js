// Grind adjustment policy, ported from the legacy Streamline skin
// (de1app ffdf75da): the grind tile steps by 0.025 per tap and 0.25 per
// long press, and the setting is carried and shown at three decimals.
// DOM-free so node tests can import it directly.

export const GRIND_STEP = 0.025;
export const GRIND_STEP_LONG = 0.25;
export const GRIND_MIN = 0;
export const GRIND_MAX = 9999;

// Three-decimal rounding; a blank or non-numeric value falls back to 0,
// matching the legacy labels' `[ifexists ::settings(grinder_setting) 0]`.
export function roundGrind(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 1000) / 1000;
}

export function clampGrind(value) {
    return Math.min(GRIND_MAX, Math.max(GRIND_MIN, roundGrind(value)));
}

// Display/storage spelling — always three decimals ("8.250"), like the
// legacy skin's `format "%.3f"`.
export function formatGrind(value) {
    return roundGrind(value).toFixed(3);
}
