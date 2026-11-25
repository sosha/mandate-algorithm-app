/**
 * THE MANDATE ALGORITHM — State Store
 *
 * Single source of truth for:
 *   - Which scenes are complete
 *   - Which scenes are unlocked
 *   - Purchase/access status
 *   - Current reading position
 *   - Current visual register (act1 / act2 / signal / apex)
 *
 * Persisted to localStorage. Hydrated on first load.
 */

import { writable, derived, get } from 'svelte/store';

// ─── TEST MODE ────────────────────────────────────────────────────────────────
// When true, ALL content is accessible regardless of purchase status or unlock
// requirements. Set to false before launch.
export const TEST_MODE = true;

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'mandate_state_v1';

// ─── Default state ────────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  // Access
  hasPurchased: false,

  // Reading position
  currentPassage: null,
  scrollPosition: 0,

  // Visual register
  register: 'act1', // 'act1' | 'act2' | 'signal' | 'apex'

  // Reader choices (preserved across sessions)
  choices: {},

  // ── Entry points (Tier 0) ──
  completed: {
    'ep-a': false,
    'ep-b': false,
    'ep-c': false,
    'ep-d': false,
    'ep-e': false,
    'ep-f': false,
    'ep-g': false,
    'ep-h': false,
    'convergence': false,
    // Tier 1
    't1-a': false,
    't1-b': false,
    't1-c': false,
    't1-d': false,
    't1-e': false,
    't1-f': false,
    // Tier 2 — Signal Thread
    'signal-a': false,
    'signal-b': false,
    'signal-c': false,
    'signal-d': false,
    // Tier 3
    'apex': false
  }
};

// ─── Persist / hydrate ────────────────────────────────────────────────────────
function loadState() {
  if (typeof localStorage === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const saved = JSON.parse(raw);
    // Merge with defaults so new keys added in updates don't break
    return {
      ...DEFAULT_STATE,
      ...saved,
      completed: { ...DEFAULT_STATE.completed, ...saved.completed },
      choices: { ...DEFAULT_STATE.choices, ...(saved.choices || {}) }
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ─── Core store ───────────────────────────────────────────────────────────────
const _state = writable(loadState());

// Subscribe and persist on every change
_state.subscribe(saveState);

// Public store — only expose what components need
export const state = _state;

// ─── Derived: counts ──────────────────────────────────────────────────────────
export const act1Count = derived(_state, $s => {
  const eps = ['ep-a', 'ep-b', 'ep-c', 'ep-d'];
  return eps.filter(id => $s.completed[id]).length;
});

export const act2Count = derived(_state, $s => {
  const eps = ['ep-e', 'ep-f', 'ep-g', 'ep-h'];
  return eps.filter(id => $s.completed[id]).length;
});

export const signalCount = derived(_state, $s => {
  return ['signal-a', 'signal-b', 'signal-c', 'signal-d']
    .filter(id => $s.completed[id]).length;
});

// ─── Derived: unlock gates ────────────────────────────────────────────────────

/** All entry points (free or purchased) accessible */
export const canAccessEntry = derived(_state, $s => (id) => {
  if (TEST_MODE) return true;
  if (id === 'ep-a' || id === 'ep-e') return true; // Always free
  return $s.hasPurchased;
});

/** Convergence: 3 of 4 Act One entries complete */
export const convergenceUnlocked = derived([_state, act1Count], ([$s, $c]) => TEST_MODE || $c >= 3);

/** Tier 1 unlock rules */
export const tier1Unlocked = derived(_state, $s => (id) => {
  if (TEST_MODE) return true;
  if (!$s.hasPurchased) return false;
  const c = $s.completed;
  switch (id) {
    case 't1-a': return c['ep-e'] && c['ep-g'];
    case 't1-b': return c['ep-f'] && c['ep-g'];
    case 't1-c': return c['ep-h'] && (c['ep-e'] || c['ep-f'] || c['ep-g']);
    case 't1-d': return c['ep-a'] && c['ep-c'];
    case 't1-e': return c['ep-b'] && c['ep-c'];
    case 't1-f': return c['ep-a'] && c['ep-d'];
    default: return false;
  }
});

/** Signal Thread: 1+ Act One + 1+ Act Two complete */
export const signalThreadUnlocked = derived([_state, act1Count, act2Count],
  ([$s, $a1, $a2]) => TEST_MODE || ($s.hasPurchased && $a1 >= 1 && $a2 >= 1)
);

/** Apex: all 4 Signal Thread scenes complete */
export const apexUnlocked = derived([_state, signalCount],
  ([$s, $sc]) => TEST_MODE || ($s.hasPurchased && $sc >= 4)
);

// ─── Actions ──────────────────────────────────────────────────────────────────

/** Mark a scene as complete */
export function markComplete(sceneId) {
  _state.update(s => ({
    ...s,
    completed: { ...s.completed, [sceneId]: true }
  }));
}

/** Save a reader choice */
export function saveChoice(sceneId, choiceKey, value) {
  _state.update(s => ({
    ...s,
    choices: {
      ...s.choices,
      [`${sceneId}:${choiceKey}`]: value
    }
  }));
}

/** Get a saved choice */
export function getChoice(sceneId, choiceKey) {
  return get(_state).choices[`${sceneId}:${choiceKey}`] ?? null;
}

/** Save reading position */
export function savePosition(passageId, scrollY = 0) {
  _state.update(s => ({ ...s, currentPassage: passageId, scrollPosition: scrollY }));
}

/** Set visual register */
export function setRegister(register) {
  _state.update(s => ({ ...s, register }));
}

/** Set purchase status (called after payment confirmation) */
export function setPurchased() {
  _state.update(s => ({ ...s, hasPurchased: true }));
}

/** Reset all progress (dev/testing only) */
export function resetState() {
  _state.set({ ...DEFAULT_STATE });
}
