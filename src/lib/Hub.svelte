<script>
  import { goto } from '$app/navigation';
  import { state, act1Count, act2Count, signalCount,
           convergenceUnlocked, signalThreadUnlocked, apexUnlocked,
           tier1Unlocked, TEST_MODE } from '$lib/store.js';
  import { PASSAGES } from '$lib/passages.js';

  const act1Entries = [
    { id: 'ep-b-s1', hubId: 'ep-b', title: 'EP-B · The Designer', subtitle: 'James Huang — Act One', access: 'paid' },
    { id: 'ep-c-s1', hubId: 'ep-c', title: 'EP-C · The Operator', subtitle: 'Captain Wu Shao-han — Act One', access: 'paid' },
    { id: 'ep-d-s1', hubId: 'ep-d', title: 'EP-D · The Conscience', subtitle: 'Dr. Kuo Ming-che — Act One', access: 'paid' },
  ].map(e => ({ ...e, tags: ['act1', 'entry'] }));

  // EP-A is handled separately (free, already has its own section structure)
  const act1EntriesWithA = [
    PASSAGES.find(p => p.id === 'ep-a-s1'),
    ...act1Entries
  ];
  const act2EntriesConfig = [
    { id: 'ep-e',    hubId: 'ep-e',  title: 'EP-E · If Nairobi Falls',      subtitle: 'Grace Wanjiku Muthoni — Act Two', access: 'free' },
    { id: 'ep-f-s1', hubId: 'ep-f', title: 'EP-F · The AU Session',          subtitle: 'Dr. Amara Diallo — Act Two',      access: 'paid' },
    { id: 'ep-g-s1', hubId: 'ep-g', title: 'EP-G · The Correspondent',        subtitle: 'Yusuf Al-Rashid — Act Two',       access: 'paid' },
    { id: 'ep-h-s1', hubId: 'ep-h', title: 'EP-H · The European Response',    subtitle: 'Anneliese Brandt — Act Two',      access: 'paid' },
  ];
  const tier1Scenes = [
    { id: 't1-a-s1', hubId: 't1-a', title: 'T1-A · The Interview',      unlock: ['ep-e','ep-g'] },
    { id: 't1-b-s1', hubId: 't1-b', title: 'T1-B · The Briefing Room',   unlock: ['ep-f','ep-g'] },
    { id: 't1-c-s1', hubId: 't1-c', title: 'T1-C · The Document',        unlock: ['ep-h'] },
    { id: 't1-d-s1', hubId: 't1-d', title: 'T1-D · The Anomaly',         unlock: ['ep-a','ep-c'] },
    { id: 't1-e-s1', hubId: 't1-e', title: 'T1-E · The Handover',        unlock: ['ep-b','ep-c'] },
    { id: 't1-f-s1', hubId: 't1-f', title: 'T1-F · The Review Meeting',  unlock: ['ep-a','ep-d'] },
  ].map(p => ({ ...p, hubId: p.hubId ?? p.id, access: 'paid', register: 'act2', tags: ['tier1'] }));
  const signalScenes = [
    { id: 'signal-a-s1', hubId: 'signal-a', title: 'Signal A · The TSMC Pipeline' },
    { id: 'signal-b-s1', hubId: 'signal-b', title: 'Signal B · The Mandate Document' },
    { id: 'signal-c-s1', hubId: 'signal-c', title: 'Signal C · The Footnote' },
    { id: 'signal-d-s1', hubId: 'signal-d', title: 'Signal D · Lin Wei-chen Says Yes' },
  ];

  function go(id) { goto(`/read/${id}`); }

  $: totalComplete = Object.values($state.completed).filter(Boolean).length;
  $: totalScenes = 20;
</script>

<div class="hub">
  <div class="hub-header">
    {#if TEST_MODE}
      <div style="background: rgba(255,180,0,0.15); border: 0.5px solid rgba(255,180,0,0.4); border-radius: 4px; padding: 0.4rem 0.8rem; margin-bottom: 1rem; font-size: 0.7rem; color: #c8a000; text-align: center; letter-spacing: 0.08em;">
        <i class="fa-solid fa-flask"></i> TEST MODE — All chapters unlocked · Set <code>TEST_MODE = false</code> in store.js before launch
      </div>
    {/if}
    <span class="hub-hanzi">天命算法</span>
    <div class="hub-title">The Mandate Algorithm</div>
    <div style="font-size:0.7rem; opacity:0.3; margin-top:0.5rem; font-style:italic;">
      Interactive Animated Graphical Novel
    </div>

    <!-- Progress dots -->
    <div class="progress-bar" style="justify-content:center; margin-top:1.5rem;">
      {#each Array(totalScenes) as _, i}
        <div class="progress-dot {i < totalComplete ? 'progress-dot--done' : ''}"></div>
      {/each}
    </div>
    <div style="font-size:0.65rem; opacity:0.3; margin-top:0.4rem;">
      {totalComplete} / {totalScenes} scenes complete
    </div>
  </div>

  <!-- ── ACT ONE ── -->
  <div class="tier-section">
    <div class="tier-label"><i class="fa-solid fa-mountain"></i> Act One — Taiwan · Entry Points</div>
    {#each act1EntriesWithA as p}
      <div class="scene-row {$state.completed[p.hubId ?? p.id] ? 'scene-row--complete' : ''}">
        {#if $state.completed[p.hubId ?? p.id]}
          <span class="scene-check"><i class="fa-solid fa-check"></i></span>
          <span class="scene-link" style="opacity:0.5;">{p.title}</span>
        {:else if p.access === 'free'}
          <span class="scene-badge badge-free"><i class="fa-solid fa-circle-play"></i> FREE</span>
          <button class="scene-link" on:click={() => go(p.id)}>{p.title}</button>
        {:else if $state.hasPurchased || TEST_MODE}
          <button class="scene-link" on:click={() => go(p.id)}>{p.title}</button>
        {:else}
          <span class="scene-badge badge-locked"><i class="fa-solid fa-lock"></i> PAID</span>
          <span class="scene-link" style="opacity:0.4;">{p.title}</span>
        {/if}
        <span class="unlock-hint" style="font-size:0.65rem; opacity:0.3;">{p.subtitle ?? ''}</span>
      </div>
    {/each}

    <!-- Convergence -->
    <div class="scene-row {$state.completed['convergence'] ? 'scene-row--complete' : ''}
                         {!$convergenceUnlocked ? 'scene-row--locked' : ''}">
      {#if $state.completed['convergence']}
        <span class="scene-check"><i class="fa-solid fa-check"></i></span>
        <span style="opacity:0.5; font-size:0.9rem;">The Decision Room</span>
      {:else if $convergenceUnlocked}
        <span class="scene-badge badge-free">UNLOCKED</span>
        <button class="scene-link" on:click={() => go('convergence-s1')}><i class="fa-solid fa-door-open"></i> The Decision Room</button>
      {:else}
        <span class="scene-badge badge-locked"><i class="fa-solid fa-lock"></i></span>
        <span style="opacity:0.25; font-size:0.9rem;">The Decision Room</span>
        <span class="unlock-hint">needs {3 - $act1Count} more Act One entries</span>
      {/if}
    </div>
  </div>

  <!-- ── ACT TWO ── -->
  <div class="tier-section">
    <div class="tier-label"><i class="fa-solid fa-globe-africa"></i> Act Two — Africa / World · Entry Points</div>
    {#each act2EntriesConfig as p}
      <div class="scene-row {$state.completed[p.hubId ?? p.id] ? 'scene-row--complete' : ''}">
        {#if $state.completed[p.hubId ?? p.id]}
          <span class="scene-check"><i class="fa-solid fa-check"></i></span>
          <span class="scene-link" style="opacity:0.5;">{p.title}</span>
        {:else if p.access === 'free'}
          <span class="scene-badge badge-free"><i class="fa-solid fa-circle-play"></i> FREE</span>
          <button class="scene-link" on:click={() => go(p.id)}>{p.title}</button>
        {:else if $state.hasPurchased || TEST_MODE}
          <button class="scene-link" on:click={() => go(p.id)}>{p.title}</button>
        {:else}
          <span class="scene-badge badge-locked"><i class="fa-solid fa-lock"></i> PAID</span>
          <span class="scene-link" style="opacity:0.4;">{p.title}</span>
        {/if}
        <span class="unlock-hint" style="font-size:0.65rem; opacity:0.3;">{p.subtitle ?? ''}</span>
      </div>
    {/each}
  </div>

  <!-- ── TIER 1 ── -->
  {#if TEST_MODE || ($state.hasPurchased && ($act1Count >= 2 || $act2Count >= 2))}
  <div class="tier-section">
    <div class="tier-label"><i class="fa-solid fa-link"></i> Tier 1 — Connections</div>
    {#each tier1Scenes as p}
      {@const unlocked = $tier1Unlocked(p.hubId)}
      <div class="scene-row {$state.completed[p.hubId] ? 'scene-row--complete' : ''}
                           {!unlocked ? 'scene-row--locked' : ''}">
        {#if $state.completed[p.hubId]}
          <span class="scene-check"><i class="fa-solid fa-check"></i></span>
          <span style="opacity:0.5; font-size:0.9rem;">{p.title}</span>
        {:else if unlocked}
          <span class="scene-badge badge-free">UNLOCKED</span>
          <button class="scene-link" on:click={() => go(p.id)}>{p.title}</button>
        {:else}
          <span class="scene-badge badge-locked"><i class="fa-solid fa-lock"></i></span>
          <span style="opacity:0.25; font-size:0.9rem;">{p.title}</span>
          <span class="unlock-hint">{p.unlock?.join(' + ')}</span>
        {/if}
      </div>
    {/each}
  </div>
  {/if}

  <!-- ── SIGNAL THREAD ── -->
  <div class="tier-section">
    <div class="tier-label"><i class="fa-solid fa-satellite-dish"></i> Tier 2 — Signal Thread · The Architecture</div>
    {#if !$signalThreadUnlocked}
      <p style="font-size:0.75rem; opacity:0.3; margin:0.5rem 0;">
        <i class="fa-solid fa-lock"></i> Requires at least 1 Act One + 1 Act Two entry point
        {#if !$state.hasPurchased}and full access purchase{/if}.
        (Act One: {$act1Count}/1, Act Two: {$act2Count}/1)
      </p>
    {:else}
      {#each signalScenes as p}
        <div class="scene-row {$state.completed[p.hubId] ? 'scene-row--complete' : ''}">
          {#if $state.completed[p.hubId]}
            <span class="scene-check"><i class="fa-solid fa-check"></i></span>
            <span style="opacity:0.5; font-size:0.9rem;">{p.title}</span>
          {:else}
            <button class="scene-link" on:click={() => go(p.id)}>{p.title}</button>
          {/if}
        </div>
      {/each}
    {/if}
  </div>

  <!-- ── APEX ── -->
  <div class="tier-section">
    <div class="tier-label"><i class="fa-solid fa-star"></i> Tier 3 — Apex</div>
    {#if !$apexUnlocked}
      <p style="font-size:0.75rem; opacity:0.3; margin:0.5rem 0;">
        <i class="fa-solid fa-lock"></i> The 21st National Congress — requires all 4 Signal Thread scenes
        ({$signalCount}/4)
      </p>
    {:else if $state.completed['apex']}
      <span style="opacity:0.5; font-size:0.9rem;"><i class="fa-solid fa-check"></i> The 21st National Congress</span>
    {:else}
      <div class="scene-row">
        <span class="scene-badge badge-free" style="background:rgba(139,26,26,0.2);color:#c03030;">UNLOCKED</span>
        <button class="scene-link" on:click={() => go('apex-s1')}><i class="fa-solid fa-star"></i> The 21st National Congress</button>
      </div>
    {/if}
  </div>

  <!-- ── PURCHASE CTA ── -->
  {#if !TEST_MODE && !$state.hasPurchased}
  <div class="purchase-gate" style="margin-top:2rem;">
    <h2><i class="fa-solid fa-key"></i> Full Access</h2>
    <p>
      EP-A and EP-E are free. The complete novel — all entry points, Tier 1 connections,
      Signal Thread, and the Apex — is available for a one-time purchase.
    </p>
    <span class="price">$8.99</span>
    <a class="purchase-btn" href="/purchase"><i class="fa-solid fa-unlock"></i> Unlock the full story</a>
    <p style="font-size:0.65rem; margin-top:1rem;">
      No subscription. No microtransactions. One price, complete novel.
    </p>
  </div>
  {/if}

  <div style="text-align:center; margin-top:3rem; padding-top:2rem; border-top:0.5px solid var(--color-border); font-size:0.65rem; opacity:0.25; font-style:italic;">
    天命所歸，非力之爭。
  </div>
</div>
