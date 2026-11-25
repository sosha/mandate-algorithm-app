<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { getProse, proseToHtml } from '$lib/proseLoader.js';
  import { animateSeal } from '$lib/transitions.js';

  export let passage;

  const dispatch = createEventDispatcher();
  let sealEl;

  // ── Get prose for this passage ──
  $: proseText = getProse(passage.id);
  $: proseHtml = proseText ? proseToHtml(proseText) : '';
  $: hasProse = proseText && proseText.length > 0;

  onMount(() => {
    if (passage.id === 'signal-b' && sealEl) {
      setTimeout(() => animateSeal(sealEl), 600);
    }
  });
</script>

<article class="prose">
  {#if passage.title && passage.id !== 'hub'}
    <h1>{passage.title}</h1>
  {/if}
  {#if passage.subtitle}
    <h2>{passage.subtitle}</h2>
  {/if}

  {#if passage.id === 'signal-b' && hasProse}
    <!-- ── Mandate Document special treatment ── -->
    <div class="mandate-document">
      <div class="mandate-seal" bind:this={sealEl}>
        <span>SYSTEM TWELVE<br/>SEQ 001</span>
      </div>
      {@html proseHtml}
    </div>
  {:else if hasProse}
    <!-- ── Standard prose content ── -->
    <div class="passage-prose">
      {@html proseHtml}
    </div>
  {:else}
    <!-- ── Fallback: no prose loaded ── -->
    <div class="passage-prose">
      <p style="opacity:0.4; font-style:italic;">
        Prose for <code>{passage.id}</code> not found.
      </p>
    </div>
  {/if}

  <!-- ── Reader choices ── -->
  {#if passage.choices?.length > 0}
    <hr />
    <div class="choices">
      {#each passage.choices as choice, i}
        <button class="choice-btn" on:click={() => dispatch('choose', choice)}>
          {choice.label}
        </button>
      {/each}
    </div>
  {:else}
    <div style="margin-top:3rem; text-align:center;">
      <button class="choice-btn" style="width:auto;" on:click={() => dispatch('continue')}>
        Continue <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  {/if}
</article>
