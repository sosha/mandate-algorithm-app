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
  'ep-a':          'ep-a-the-collector',
  'ep-b':          'ep-b-the-designer',
  'ep-c':          'ep-c-the-operator',
  'ep-d':          'ep-d-the-conscience',
  'ep-e':          'ep-e-if-nairobi-falls',
  'ep-f':          'ep-f-the-au-session',
  'ep-g':          'ep-g-the-correspondent',
  'ep-h':          'ep-h-the-european-response',
  'convergence':   'act-one-convergence',
  't1-a':          't1-a-the-interview',
  't1-b':          't1-b-the-briefing-room',
  't1-c':          't1-c-the-document',
  't1-d':          't1-d-the-anomaly',
  't1-e':          't1-e-the-handover',
  't1-f':          't1-f-the-review-meeting',
  'signal-a':      'signal-a-the-tsmc-pipeline',
  'signal-b':      'signal-b-the-mandate-document',
  'signal-c':      'signal-c-the-footnote',
  'signal-d':      'signal-d-lin-wei-chen-says-yes',
  'apex':          'apex-the-21st-national-congress'
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
