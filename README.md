# 天命算法 — The Mandate Algorithm

> *An Interactive Animated Graphical Novel*
>
> *天命所歸，非力之爭。 — Where the Mandate rests, it is not decided by force.*

---

## What This Is

The Mandate Algorithm is a branching interactive novel delivered as a web application. The reader navigates a pyramid structure — entry points at the base, Signal Thread scenes in the middle, a single Apex at the top — assembling the story of a Taiwanese AGI that calculates the transfer of the Mandate of Heaven, and of the war its African blind spot causes.

**Story bible and vault:** [`sosha/the_mandate_algorithm`](https://github.com/sosha/the_mandate_algorithm)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev/) 2.16 + Vite 5 |
| Animation | [GSAP](https://gsap.com/) 3.15 |
| Icons | [Font Awesome](https://fontawesome.com/) 6 (kit: `c0adf715c1`) |
| Narrative engine | Twine/SugarCube (story file in `build/`) |
| Deployment | Static adapter → any static host |
| PWA | Service worker + manifest |

---

## Structure

```
src/
├── app.html              # Shell — Font Awesome kit loaded here
├── app.css               # Visual register system (act1/act2/signal/apex)
├── lib/
│   ├── passages.js       # Passage registry — all 43 scene IDs, choices, unlock rules
│   ├── proseLoader.js    # Vite glob import — loads .txt files at build time
│   ├── store.js          # State — progress, purchases, reading position (localStorage)
│   ├── transitions.js    # GSAP transitions — register shifts, typewriter, seal animation
│   ├── Hub.svelte        # The pyramid map — shows locked/unlocked/complete state
│   ├── PassageContent.svelte  # Prose renderer — {@html} with Mandate Document special treatment
│   ├── PurchaseGate.svelte    # Payment wall — shown for paid content without purchase
│   └── prose/            # 20 × .txt files — the full novel (~36K words)
└── routes/
    ├── +page.svelte          # Title screen
    ├── +layout.svelte        # Register sync → <html data-register>
    ├── read/[passage]/       # Dynamic reader — routes by passage ID
    └── purchase/             # Payment flow (Stripe Payment Link)
```

---

## Development

```bash
npm install
npx vite dev        # Dev server at http://localhost:5173
npx vite build      # Production build → dist/
npx vite preview    # Preview production build
```

### Test Mode

All chapters are unlocked during development. To toggle:

```js
// src/lib/store.js
export const TEST_MODE = true;   // ← set to false before launch
```

When `true`, all purchase gates, unlock requirements, and progression locks are bypassed. A yellow banner appears in the hub.

---

## Content

### The Pyramid

| Tier | Scenes | Unlock condition |
|---|---|---|
| Tier 0 — Entry Points | 8 (EP-A free, EP-E free, 6 paid) | Always available |
| Act One Convergence | 1 | 3 of 4 Act One entries complete |
| Tier 1 — Connections | 6 | Specific pairs of entry points |
| Tier 2 — Signal Thread | 4 | 1× Act One + 1× Act Two entry |
| Tier 3 — Apex | 1 | All 4 Signal Thread scenes |

### Visual Registers

The app switches visual mode based on which act the reader is in:

- `act1` — Cold, institutional, monospace. Act One Taiwan scenes.
- `act2` — Warm, chaotic, serif. Act Two Africa/World scenes.
- `signal` — Technical black with red accents. Signal Thread scenes.
- `apex` — Blended registers. The 21st National Congress.

Applied via `[data-register]` on `<html>` — all CSS uses custom properties from that selector.

---

## Pricing (Production)

| Content | Price |
|---|---|
| EP-A + EP-E | Free |
| Everything else | $8.99 one-time |

Replace `STRIPE_PAYMENT_LINK` in `src/routes/purchase/+page.svelte` with your Stripe Payment Link URL. The success page at `/purchase/success` calls `setPurchased()` to unlock the full content locally.

---

## Deployment

The build output in `dist/` is a fully static site. Deploy to any static host:

```bash
npx vite build
# → dist/ contains index.html + _app/ assets + sw.js + manifest.json
```

Recommended hosts: **Cloudflare Pages**, Netlify, Vercel. The `fallback: 'index.html'` in `svelte.config.js` handles client-side routing on all three.

---

## Related

- **Story Bible & Vault:** [`sosha/the_mandate_algorithm`](https://github.com/sosha/the_mandate_algorithm)
  Contains: all prose drafts, research notes, character sheets, timeline, production plan, Obsidian vault

- **Twine story file:** `build/the-mandate-algorithm.html` — the full narrative in SugarCube format, importable into Twine desktop

---

*天命算法 · The Mandate Algorithm*
