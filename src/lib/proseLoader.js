/**
 * THE MANDATE ALGORITHM — Prose Loader
 *
 * Maps passage IDs to their prose files (imported as raw strings via Vite's ?raw suffix).
 * Each prose file is a plain text extract from the vault markdown,
 * with metadata stripped and reader choice markers preserved.
 *
 * The reader route imports this map and renders the correct file.
 */

// ── Import all prose files as raw strings ────────────────────────────────────
// Vite's ?raw suffix loads file contents as a string at build time.
// These are bundled into the final output — no runtime file access needed.

const proseFiles = import.meta.glob('./prose/*.txt', { query: '?raw', import: 'default', eager: true });

/**
 * Map passage IDs to prose file keys.
 * The key is the filename without path or extension.
 */
const ID_TO_FILE = {
  // ── Entry points ──────────────────────────────────────────────────────────
  'ep-a':          'ep-a-the-collector',
  // EP-A choice/ending passages use the main file (prose split handled inline)
  'ep-a-choice-a': 'ep-a-the-collector',
  'ep-a-choice-b': 'ep-a-the-collector',
  'ep-a-continued':'ep-a-the-collector',
  'ep-a-end-a':    'ep-a-the-collector',
  'ep-a-end-b':    'ep-a-the-collector',

  // EP-B — 8 sections + 2 endings
  'ep-b-s1':    'ep-b-s1',
  'ep-b-s2':    'ep-b-s2',
  'ep-b-s3':    'ep-b-s3',
  'ep-b-s4':    'ep-b-s4',
  'ep-b-s5':    'ep-b-s5',
  'ep-b-s6':    'ep-b-s6',
  'ep-b-s7':    'ep-b-s7',
  'ep-b-s8':    'ep-b-s8',
  'ep-b-end-a': 'ep-b-end-a',
  'ep-b-end-b': 'ep-b-end-b',

  // EP-C — 6 sections + 3 endings
  'ep-c-s1':    'ep-c-s1',
  'ep-c-s2':    'ep-c-s2',
  'ep-c-s3':    'ep-c-s3',
  'ep-c-s4':    'ep-c-s4',
  'ep-c-s5':    'ep-c-s5',
  'ep-c-s6':    'ep-c-s6',
  'ep-c-end-a': 'ep-c-end-a',
  'ep-c-end-b': 'ep-c-end-b',
  'ep-c-end-c': 'ep-c-end-c',

  // EP-D — 5 sections
  'ep-d-s1':    'ep-d-s1',
  'ep-d-s2':    'ep-d-s2',
  'ep-d-s3':    'ep-d-s3',
  'ep-d-s4':    'ep-d-s4',
  'ep-d-s5':    'ep-d-s5',

  // Convergence — 4 sections
  'convergence':    'act-one-convergence', // kept for Hub completion check
  'convergence-s1': 'convergence-s1',
  'convergence-s2': 'convergence-s2',
  'convergence-s3': 'convergence-s3',
  'convergence-s4': 'convergence-s4',
  'ep-e-d2':       'ep-e-if-nairobi-falls',
  'ep-e-d3':       'ep-e-if-nairobi-falls',
  'ep-e-d4':       'ep-e-if-nairobi-falls',
  'ep-e-end':      'ep-e-if-nairobi-falls',
  'ep-f':          'ep-f-the-au-session',
  'ep-f-s1':       'ep-f-s1',
  'ep-f-s2':       'ep-f-s2',
  'ep-f-s3':       'ep-f-s3',
  'ep-f-s4':       'ep-f-s4',
  'ep-f-s5':       'ep-f-s5',
  'ep-f-s6':       'ep-f-s6',
  'ep-f-end-a':    'ep-f-end-a',
  'ep-f-end-b':    'ep-f-the-au-session',
  'ep-g':          'ep-g-the-correspondent',
  'ep-g-s1':       'ep-g-s1',
  'ep-g-s2':       'ep-g-s2',
  'ep-g-s3':       'ep-g-s3',
  'ep-g-s4':       'ep-g-s4',
  'ep-g-s5':       'ep-g-s5',
  'ep-g-s6':       'ep-g-s6',
  'ep-g-s7':       'ep-g-s7',
  'ep-g-end-a':    'ep-g-end-a',
  'ep-g-end-b':    'ep-g-the-correspondent',
  'ep-h':          'ep-h-the-european-response',
  'ep-h-s1':       'ep-h-s1',
  'ep-h-s2':       'ep-h-s2',
  'ep-h-s3':       'ep-h-s3',
  'ep-h-s4':       'ep-h-s4',
  'ep-h-s5':       'ep-h-s5',
  'ep-h-s6':       'ep-h-s6',
  'ep-h-s7':       'ep-h-s7',
  'ep-h-s8':       'ep-h-s8',
  'ep-h-end-a':    'ep-h-end-a',
  'ep-h-end-b':    'ep-h-the-european-response',
  't1-a':          't1-a-the-interview',
  't1-a-s1':       't1-a-s1',
  't1-a-s2':       't1-a-s2',
  't1-a-s3':       't1-a-s3',
  't1-a-end-a':    't1-a-end-a',
  't1-a-end-b':    't1-a-the-interview',
  't1-b':          't1-b-the-briefing-room',
  't1-b-s1':       't1-b-s1',
  't1-b-s2':       't1-b-s2',
  't1-b-s3':       't1-b-s3',
  't1-c':          't1-c-the-document',
  't1-c-s1':       't1-c-s1',
  't1-c-s2':       't1-c-s2',
  't1-c-s3':       't1-c-s3',
  't1-d':          't1-d-the-anomaly',
  't1-d-s1':       't1-d-s1',
  't1-d-s2':       't1-d-s2',
  't1-d-s3':       't1-d-s3',
  't1-d-s4':       't1-d-s4',
  't1-d-s5':       't1-d-s5',
  't1-e':          't1-e-the-handover',
  't1-e-s1':       't1-e-s1',
  't1-e-s2':       't1-e-s2',
  't1-f':          't1-f-the-review-meeting',
  't1-f-s1':       't1-f-s1',
  't1-f-s2':       't1-f-s2',
  't1-f-s3':       't1-f-s3',
  'signal-a':      'signal-a-the-tsmc-pipeline',
  'signal-a-s1':   'signal-a-s1',
  'signal-a-s2':   'signal-a-s2',
  'signal-a-s3':   'signal-a-s3',
  'signal-a-s4':   'signal-a-s4',
  'signal-b':      'signal-b-the-mandate-document',
  'signal-c':      'signal-c-the-footnote',
  'signal-c-s1':   'signal-c-s1',
  'signal-c-s2':   'signal-c-s2',
  'signal-c-s3':   'signal-c-s3',
  'signal-c-s4':   'signal-c-s4',
  'signal-c-s5':   'signal-c-s5',
  'signal-d':      'signal-d-lin-wei-chen-says-yes',
  'signal-d-s1':   'signal-d-s1',
  'signal-d-s2':   'signal-d-s2',
  'signal-d-s3':   'signal-d-s3',
  'signal-d-s4':   'signal-d-s4',
  'signal-d-s5':   'signal-d-s5',
  'apex':          'apex-the-21st-national-congress',
  'apex-s1':       'apex-s1',
  'apex-s2':       'apex-s2',
  'apex-s3':       'apex-s3',
  'apex-s4':       'apex-s4',
  'apex-s5':       'apex-s5',
  'apex-s6':       'apex-s6',
};

/**
 * Get prose content for a passage ID.
 * Returns the raw text, or null if no prose file exists.
 *
 * @param {string} passageId
 * @returns {string|null}
 */
export function getProse(passageId) {
  const fileKey = ID_TO_FILE[passageId];
  if (!fileKey) return null;

  const fullKey = `./prose/${fileKey}.txt`;
  const content = proseFiles[fullKey];

  return content ?? null;
}

/**
 * Split prose into segments: alternating prose text and reader choice markers.
 * Choice markers in the text look like:
 *   > **DECISION ONE — Emergency broadcast**
 *   or
 *   **Choice:** Does Hsiu-ying file the query through...
 *
 * This function splits the text at these markers so the PassageContent component
 * can insert interactive choice buttons at the right points.
 *
 * @param {string} prose — raw prose text
 * @returns {{type: 'prose'|'choice', text: string, label?: string}[]}
 */
export function parseProseSegments(prose) {
  if (!prose) return [];

  // Split on lines that start with > **DECISION or **Choice or > **DECISION
  // These are the reader choice insertion points
  const segments = [];
  const lines = prose.split('\n');
  let currentProse = [];
  let inChoiceBlock = false;
  let choiceLabel = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect choice markers
    // Pattern 1: > **DECISION ONE — Emergency broadcast**
    // Pattern 2: **Choice:** What does Hsiu-ying do?
    // Pattern 3: > **The reader chooses...
    // Pattern 4: > **What does...
    const isChoiceStart =
      /^\s*>\s*\*\*(DECISION|Choice|The reader|What does)/.test(line) ||
      /^\s*\*\*(DECISION|Choice|The reader|What does)/.test(line);

    if (isChoiceStart) {
      // Flush current prose
      if (currentProse.length > 0) {
        segments.push({ type: 'prose', text: currentProse.join('\n').trim() });
        currentProse = [];
      }
      // Extract the label (strip markdown formatting)
      choiceLabel = line
        .replace(/^\s*>\s*/, '')
        .replace(/\*\*/g, '')
        .replace(/^DECISION\s+\w+\s*—\s*/i, '')
        .replace(/^Choice:\s*/i, '')
        .replace(/^The reader chooses.*?:\s*/i, '')
        .replace(/^What does.*?\?$/i, '')
        .trim();
      inChoiceBlock = true;
      continue;
    }

    if (inChoiceBlock) {
      // Lines in a choice block are the choice description — skip them
      // (the actual choices come from the passage definition)
      // But keep track of where the choice block ends (next non-empty non-quote line)
      if (trimmed && !trimmed.startsWith('>') && !trimmed.startsWith('@@')) {
        inChoiceBlock = false;
        currentProse.push(line);
      }
    } else {
      currentProse.push(line);
    }
  }

  // Flush remaining prose
  if (currentProse.length > 0) {
    segments.push({ type: 'prose', text: currentProse.join('\n').trim() });
  }

  return segments;
}

/**
 * Convert raw prose text to simple HTML.
 * Handles: paragraphs, scene breaks (---), headers (###),
 * blockquotes (>), emphasis (*), bold (**), and code blocks (```).
 *
 * This is intentionally minimal — the production version may use
 * a proper markdown parser, but for the novel's clean prose this is sufficient.
 *
 * @param {string} text
 * @returns {string} HTML
 */
export function proseToHtml(text) {
  if (!text) return '';

  // Split into blocks by double-newline (paragraph boundaries)
  const blocks = text.split(/\n\n+/);
  const htmlBlocks = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Scene break: --- on its own line
    if (/^---+$/.test(trimmed)) {
      htmlBlocks.push('<hr />');
      continue;
    }

    // Headers: ### or ## or #
    if (/^###\s+/.test(trimmed)) {
      const content = trimmed.replace(/^###\s+/, '');
      htmlBlocks.push(`<h3>${escapeHtml(content)}</h3>`);
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      const content = trimmed.replace(/^##\s+/, '');
      htmlBlocks.push(`<h3>${escapeHtml(content)}</h3>`);
      continue;
    }

    // Code block: ```...```
    if (/^```/.test(trimmed)) {
      const code = trimmed.replace(/^```\w*\n?/, '').replace(/```$/, '');
      htmlBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
      continue;
    }

    // Blockquote: lines starting with >
    if (/^>/.test(trimmed)) {
      const content = trimmed
        .split('\n')
        .map(l => l.replace(/^>\s?/, ''))
        .join('\n');
      htmlBlocks.push(`<blockquote>${inlineFormat(content)}</blockquote>`);
      continue;
    }

    // Production note markers: [PRODUCTION NOTE: ...]
    if (/^\[PRODUCTION/i.test(trimmed) || /^\*\[PRODUCTION/i.test(trimmed)) {
      htmlBlocks.push(`<p class="production-note">${inlineFormat(trimmed)}</p>`);
      continue;
    }

    // Regular paragraph
    htmlBlocks.push(`<p>${inlineFormat(trimmed)}</p>`);
  }

  return htmlBlocks.join('\n');
}

/**
 * Inline formatting: bold (**), italic (*), and code (`)
 */
function inlineFormat(text) {
  let result = escapeHtml(text);
  // Bold: **text** (must come before italic)
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text* (but not inside tags)
  result = result.replace(/(?<![>\w])\*(?!\s)(.+?)\*(?![\w])/g, '<em>$1</em>');
  // Code: `text`
  result = result.replace(/`(.+?)`/g, '<code>$1</code>');
  return result;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
