/**
 * THE MANDATE ALGORITHM — Passage Registry
 *
 * All 20 scenes + 24 choice/ending variants.
 * Each entry maps a passage ID to its metadata and content.
 *
 * Content is kept minimal here — full prose is loaded from
 * the markdown files in the vault (future: via SvelteKit load functions).
 * For the initial build, passages embed their prose directly.
 */

/** @typedef {'act1'|'act2'|'signal'|'apex'|'hub'} Register */
/** @typedef {'free'|'paid'} AccessTier */
/** @typedef {'entry'|'choice'|'ending'|'convergence'|'tier1'|'tier2'|'apex'|'hub'} PassageType */

/**
 * @typedef {Object} Passage
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {Register} register
 * @property {AccessTier} access
 * @property {PassageType} type
 * @property {string[]} tags
 * @property {string[]} [requiredCompleted]  — scene IDs that must be complete
 * @property {number} [requiredCount]        — minimum from requiredCompleted
 * @property {Object[]} [choices]            — [{label, next}]
 * @property {string} [next]                 — single next passage (no choice)
 * @property {string} [completes]            — scene ID to mark complete
 */

/** @type {Passage[]} */
export const PASSAGES = [
  // ── HUB ──
  {
    id: 'hub',
    title: '天命算法',
    subtitle: 'The Mandate Algorithm',
    register: 'act1',
    access: 'free',
    type: 'hub',
    tags: ['hub']
  },

  // ── ENTRY POINTS — ACT ONE ──
  {
    id: 'ep-a',
    title: 'EP-A · The Collector',
    subtitle: 'Chen Hsiu-ying — Act One',
    register: 'act1',
    access: 'free',
    type: 'entry',
    tags: ['act1', 'entry'],
    choices: [
      { label: 'Official channels (creates paper trail)', next: 'ep-a-choice-a' },
      { label: 'Contractor messaging (no record)', next: 'ep-a-choice-b' }
    ]
  },
  {
    id: 'ep-a-choice-a',
    title: 'Official channels',
    register: 'act1', access: 'free', type: 'choice', tags: ['act1'],
    next: 'ep-a-continued'
  },
  {
    id: 'ep-a-choice-b',
    title: 'Contractor messaging',
    register: 'act1', access: 'free', type: 'choice', tags: ['act1'],
    next: 'ep-a-continued'
  },
  {
    id: 'ep-a-continued',
    title: 'Three years',
    register: 'act1', access: 'free', type: 'choice', tags: ['act1'],
    choices: [
      { label: 'She files a formal report', next: 'ep-a-end-a' },
      { label: 'She closes the interface and continues', next: 'ep-a-end-b' }
    ]
  },
  { id: 'ep-a-end-a', title: 'Continuing', register: 'act1', access: 'free', type: 'ending', tags: ['act1'], completes: 'ep-a', next: 'hub' },
  { id: 'ep-a-end-b', title: 'Continuing', register: 'act1', access: 'free', type: 'ending', tags: ['act1'], completes: 'ep-a', next: 'hub' },

  // ── EP-B — The Designer (8 sections) ──
  { id: 'ep-b-s1', title: 'The site', subtitle: 'James Huang — Act One', register: 'act1', access: 'paid', type: 'entry', tags: ['act1', 'entry'], next: 'ep-b-s2' },
  { id: 'ep-b-s2', title: 'The power', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-b-s3' },
  { id: 'ep-b-s3', title: 'The other contractors', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-b-s4' },
  { id: 'ep-b-s4', title: 'The conduit', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-b-s5' },
  { id: 'ep-b-s5', title: 'Signed and moved on', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-b-s6' },
  { id: 'ep-b-s6', title: 'The handover', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-b-s7' },
  { id: 'ep-b-s7', title: 'The letter', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-b-s8' },
  {
    id: 'ep-b-s8', title: 'The news', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'],
    choices: [
      { label: 'He makes the connection', next: 'ep-b-end-a' },
      { label: "He doesn't", next: 'ep-b-end-b' }
    ]
  },
  { id: 'ep-b-end-a', title: 'The letter and the news', register: 'act1', access: 'paid', type: 'ending', tags: ['act1'], completes: 'ep-b', next: 'hub' },
  { id: 'ep-b-end-b', title: 'The concert', register: 'act1', access: 'paid', type: 'ending', tags: ['act1'], completes: 'ep-b', next: 'hub' },

  // ── EP-C — The Operator (6 sections) ──
  { id: 'ep-c-s1', title: 'The posting', subtitle: 'Captain Wu Shao-han — Act One', register: 'act1', access: 'paid', type: 'entry', tags: ['act1', 'entry'], next: 'ep-c-s2' },
  { id: 'ep-c-s2', title: 'System Twelve', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-c-s3' },
  { id: 'ep-c-s3', title: '03:14', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-c-s4' },
  { id: 'ep-c-s4', title: 'The grandfather', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-c-s5' },
  { id: 'ep-c-s5', title: 'The two numbers', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'],
    choices: [
      { label: 'Loyalty', next: 'ep-c-end-a' },
      { label: 'Fear', next: 'ep-c-end-b' },
      { label: 'Something he cannot name', next: 'ep-c-end-c' }
    ]
  },
  { id: 'ep-c-s6', title: 'The corridor', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'],
    choices: [
      { label: 'Loyalty', next: 'ep-c-end-a' },
      { label: 'Fear', next: 'ep-c-end-b' },
      { label: 'Something he cannot name', next: 'ep-c-end-c' }
    ]
  },
  { id: 'ep-c-end-a', title: 'Loyalty', register: 'act1', access: 'paid', type: 'ending', tags: ['act1'], completes: 'ep-c', next: 'hub' },
  { id: 'ep-c-end-b', title: 'Fear', register: 'act1', access: 'paid', type: 'ending', tags: ['act1'], completes: 'ep-c', next: 'hub' },
  { id: 'ep-c-end-c', title: 'Something he cannot name', register: 'act1', access: 'paid', type: 'ending', tags: ['act1'], completes: 'ep-c', next: 'hub' },

  // ── EP-D — The Conscience (5 sections) ──
  { id: 'ep-d-s1', title: 'The hole', subtitle: 'Dr. Kuo Ming-che — Act One', register: 'act1', access: 'paid', type: 'entry', tags: ['act1', 'entry'], next: 'ep-d-s2' },
  { id: 'ep-d-s2', title: 'The email', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-d-s3' },
  { id: 'ep-d-s3', title: 'The footnote', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-d-s4' },
  { id: 'ep-d-s4', title: 'The uncle', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], next: 'ep-d-s5' },
  { id: 'ep-d-s5', title: 'Singapore', register: 'act1', access: 'paid', type: 'choice', tags: ['act1'], completes: 'ep-d', next: 'hub' },

  // ── CONVERGENCE ──
  {
    id: 'convergence',
    title: 'The Decision Room',
    subtitle: 'Act One Convergence',
    register: 'act1', access: 'paid', type: 'convergence', tags: ['act1', 'convergence'],
    requiredCompleted: ['ep-a', 'ep-b', 'ep-c', 'ep-d'],
    requiredCount: 3,
    completes: 'convergence', next: 'hub'
  },

  // ── ENTRY POINTS — ACT TWO ──
  {
    id: 'ep-e',
    title: 'EP-E · If Nairobi Falls',
    subtitle: 'Grace Wanjiku Muthoni — Act Two',
    register: 'act2', access: 'free', type: 'entry', tags: ['act2', 'entry'],
    choices: [
      { label: 'Emergency broadcast — activate now', next: 'ep-e-d2' },
      { label: 'Emergency broadcast — wait', next: 'ep-e-d2' }
    ]
  },
  {
    id: 'ep-e-d2', title: 'KDF command', register: 'act2', access: 'free', type: 'choice', tags: ['act2'],
    choices: [
      { label: 'Escalate nationally', next: 'ep-e-d3' },
      { label: 'Operate independently', next: 'ep-e-d3' }
    ]
  },
  {
    id: 'ep-e-d3', title: 'Gigiri', register: 'act2', access: 'free', type: 'choice', tags: ['act2'],
    choices: [
      { label: 'Shelter in place', next: 'ep-e-d4' },
      { label: 'Evacuate', next: 'ep-e-d4' }
    ]
  },
  {
    id: 'ep-e-d4', title: 'Her daughter calls', register: 'act2', access: 'free', type: 'choice', tags: ['act2'],
    choices: [
      { label: '"Stay where you are."', next: 'ep-e-end' },
      { label: '"Come home."', next: 'ep-e-end' }
    ]
  },
  { id: 'ep-e-end', title: 'Dawn', register: 'act2', access: 'free', type: 'ending', tags: ['act2'], completes: 'ep-e', next: 'hub' },

  {
    id: 'ep-f',
    title: 'EP-F · The AU Session',
    subtitle: 'Dr. Amara Diallo — Act Two',
    register: 'act2', access: 'paid', type: 'entry', tags: ['act2', 'entry'],
    choices: [
      { label: 'Send the demand immediately', next: 'ep-f-end-a' },
      { label: 'Wait — give China time to respond', next: 'ep-f-end-b' }
    ]
  },
  { id: 'ep-f-end-a', title: '"Send it."', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 'ep-f', next: 'hub' },
  { id: 'ep-f-end-b', title: 'Forty-eight hours', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 'ep-f', next: 'hub' },

  {
    id: 'ep-g',
    title: 'EP-G · The Correspondent',
    subtitle: 'Yusuf Al-Rashid — Act Two',
    register: 'act2', access: 'paid', type: 'entry', tags: ['act2', 'entry'],
    choices: [
      { label: 'He sends the story', next: 'ep-g-end-a' },
      { label: 'He holds it', next: 'ep-g-end-b' }
    ]
  },
  { id: 'ep-g-end-a', title: 'Sent', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 'ep-g', next: 'hub' },
  { id: 'ep-g-end-b', title: 'Held', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 'ep-g', next: 'hub' },

  {
    id: 'ep-h',
    title: 'EP-H · The European Response',
    subtitle: 'Anneliese Brandt — Act Two',
    register: 'act2', access: 'paid', type: 'entry', tags: ['act2', 'entry'],
    choices: [
      { label: 'Share with EU coordination group', next: 'ep-h-end-a' },
      { label: 'Investigate alone', next: 'ep-h-end-b' }
    ]
  },
  { id: 'ep-h-end-a', title: 'It will leak', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 'ep-h', next: 'hub' },
  { id: 'ep-h-end-b', title: 'Alone', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 'ep-h', next: 'hub' },

  // ── TIER 1 ──
  { id: 't1-a', title: 'T1-A · The Interview', subtitle: 'Grace + Yusuf', register: 'act2', access: 'paid', type: 'tier1', tags: ['act2', 'tier1'],
    requiredCompleted: ['ep-e', 'ep-g'], requiredCount: 2,
    choices: [{ label: 'Grace calls him back', next: 't1-a-end-a' }, { label: 'Grace doesn\'t call', next: 't1-a-end-b' }]
  },
  { id: 't1-a-end-a', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 't1-a', next: 'hub' },
  { id: 't1-a-end-b', register: 'act2', access: 'paid', type: 'ending', tags: ['act2'], completes: 't1-a', next: 'hub' },
  { id: 't1-b', title: 'T1-B · The Briefing Room', subtitle: 'Yusuf + Diallo', register: 'act2', access: 'paid', type: 'tier1', tags: ['act2', 'tier1'],
    requiredCompleted: ['ep-f', 'ep-g'], requiredCount: 2, completes: 't1-b', next: 'hub' },
  { id: 't1-c', title: 'T1-C · The Document', subtitle: 'Brandt + Kuo (via work)', register: 'act2', access: 'paid', type: 'tier1', tags: ['act2', 'tier1'],
    requiredCompleted: ['ep-h'], requiredCount: 1, completes: 't1-c', next: 'hub' },
  { id: 't1-d', title: 'T1-D · The Anomaly', subtitle: 'Hsiu-ying + Wu', register: 'act1', access: 'paid', type: 'tier1', tags: ['act1', 'tier1'],
    requiredCompleted: ['ep-a', 'ep-c'], requiredCount: 2, completes: 't1-d', next: 'hub' },
  { id: 't1-e', title: 'T1-E · The Handover', subtitle: 'Huang + Wu', register: 'act1', access: 'paid', type: 'tier1', tags: ['act1', 'tier1'],
    requiredCompleted: ['ep-b', 'ep-c'], requiredCount: 2, completes: 't1-e', next: 'hub' },
  { id: 't1-f', title: 'T1-F · The Review Meeting', subtitle: 'Kuo + Hsiu-ying', register: 'act1', access: 'paid', type: 'tier1', tags: ['act1', 'tier1'],
    requiredCompleted: ['ep-a', 'ep-d'], requiredCount: 2, completes: 't1-f', next: 'hub' },

  // ── SIGNAL THREAD ──
  { id: 'signal-a', title: 'Signal A · The TSMC Pipeline', register: 'signal', access: 'paid', type: 'tier2', tags: ['signal'],
    completes: 'signal-a', next: 'hub' },
  { id: 'signal-b', title: 'Signal B · The Mandate Document', register: 'signal', access: 'paid', type: 'tier2', tags: ['signal'],
    completes: 'signal-b', next: 'hub' },
  { id: 'signal-c', title: 'Signal C · The Footnote', register: 'signal', access: 'paid', type: 'tier2', tags: ['signal'],
    completes: 'signal-c', next: 'hub' },
  { id: 'signal-d', title: 'Signal D · Lin Wei-chen Says Yes', register: 'signal', access: 'paid', type: 'tier2', tags: ['signal'],
    completes: 'signal-d', next: 'hub' },

  // ── APEX ──
  { id: 'apex', title: 'The 21st National Congress', subtitle: 'Autumn 2027', register: 'apex', access: 'paid', type: 'apex', tags: ['apex'],
    requiredCompleted: ['signal-a', 'signal-b', 'signal-c', 'signal-d'], requiredCount: 4,
    completes: 'apex', next: 'hub' }
];

/** Fast lookup by ID */
export const PASSAGE_MAP = Object.fromEntries(PASSAGES.map(p => [p.id, p]));
