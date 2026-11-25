/**
 * THE MANDATE ALGORITHM — GSAP Transitions
 *
 * Visual register transitions between Act One (cold, institutional)
 * and Act Two (warm, chaotic). The register shift IS the narrative signal.
 *
 * Act One:   Clip-path left-to-right, stepped — data loading feel
 * Act Two:   Drop from above, organic — urgency, disorientation
 * Signal:    Typewriter on the passage, fade through deep black
 * Apex:      Both registers, bleed between them
 * Register:  Hard cut with grain flash — the seam is visible
 */

let gsap;

/** Lazy-load GSAP (runs only in browser) */
async function getGsap() {
  if (gsap) return gsap;
  const mod = await import('gsap');
  gsap = mod.gsap ?? mod.default;
  return gsap;
}

/**
 * Transition into a new passage.
 * @param {HTMLElement} el  — the passage container element
 * @param {'act1'|'act2'|'signal'|'apex'} from  — leaving register
 * @param {'act1'|'act2'|'signal'|'apex'} to    — arriving register
 */
export async function transitionIn(el, from, to) {
  const g = await getGsap();
  if (!g || !el) return;

  const isRegisterChange = from !== to;

  if (isRegisterChange) {
    // Hard register shift: grain flash
    await registerShift(el, g, to);
  } else if (to === 'act1') {
    // Act One: mechanical clip-path reveal
    await act1Enter(el, g);
  } else if (to === 'act2') {
    // Act Two: organic drop
    await act2Enter(el, g);
  } else if (to === 'signal') {
    // Signal Thread: fade from deep black
    await signalEnter(el, g);
  } else if (to === 'apex') {
    // Apex: slow dissolve
    await apexEnter(el, g);
  }
}

/** Act One passage entry — left-to-right mechanical clip */
function act1Enter(el, g) {
  return new Promise(resolve => {
    g.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0.8 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.45,
        ease: 'steps(7)', onComplete: resolve }
    );
  });
}

/** Act Two passage entry — drop from above */
function act2Enter(el, g) {
  return new Promise(resolve => {
    g.fromTo(el,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', onComplete: resolve }
    );
  });
}

/** Signal Thread entry — fade from near-black */
function signalEnter(el, g) {
  return new Promise(resolve => {
    g.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power1.inOut', onComplete: resolve }
    );
  });
}

/** Apex entry — slow dissolve, both registers bleeding */
function apexEnter(el, g) {
  return new Promise(resolve => {
    g.fromTo(el,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.inOut', onComplete: resolve }
    );
  });
}

/** Hard register shift — grain flash between acts */
function registerShift(el, g, to) {
  return new Promise(resolve => {
    // Create grain flash overlay
    const grain = document.createElement('div');
    grain.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: #000;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(grain);

    const tl = g.timeline({ onComplete: () => {
      document.body.removeChild(grain);
      resolve();
    }});

    tl
      .to(grain, { opacity: 1, duration: 0.15, ease: 'power2.in' })
      .call(() => {
        // Apply grain texture during black frame
        grain.style.backgroundImage =
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")';
        grain.style.backgroundSize = '200px';
        grain.style.mixBlendMode = 'screen';
      })
      .to(grain, { opacity: 0, duration: 0.35, delay: 0.05, ease: 'power1.out' });

    // Bring in the new passage during the black frame
    g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35, delay: 0.15, ease: 'power1.out' });
  });
}

/**
 * Typewriter effect for special text (System Twelve output, Mandate Document).
 * @param {HTMLElement} el    — element whose text content to reveal
 * @param {number} speed      — ms per character (default 35 — clinical)
 * @param {boolean} slow      — true for Mandate Document (25ms — reverential)
 */
export function typewriter(el, speed = 35, slow = false) {
  if (!el) return;
  const ms = slow ? 25 : speed;
  const text = el.textContent || '';
  el.textContent = '';
  el.style.visibility = 'visible';

  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, ms);

  return () => clearInterval(interval); // cleanup
}

/**
 * Mandate Document seal animation.
 * @param {SVGElement|HTMLElement} sealEl
 */
export async function animateSeal(sealEl) {
  const g = await getGsap();
  if (!g || !sealEl) return;

  g.fromTo(sealEl,
    { scale: 0, rotation: -15, opacity: 0 },
    { scale: 1, rotation: 0, opacity: 1,
      duration: 0.6, ease: 'back.out(1.4)',
      transformOrigin: 'center center' }
  );
}
