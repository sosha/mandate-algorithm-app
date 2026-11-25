<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount, afterUpdate } from 'svelte';
  import { state, markComplete, saveChoice, savePosition, setRegister, TEST_MODE } from '$lib/store.js';
  import { transitionIn } from '$lib/transitions.js';
  import { PASSAGE_MAP } from '$lib/passages.js';
  import Hub from '$lib/Hub.svelte';
  import PassageContent from '$lib/PassageContent.svelte';
  import PurchaseGate from '$lib/PurchaseGate.svelte';

  $: passageId = $page.params.passage;
  $: passage = PASSAGE_MAP[passageId];

  let container;
  let prevRegister = 'act1';

  // Track register and animate on passage change
  $: if (passage && typeof document !== 'undefined') {
    const toRegister = passage.register ?? 'act1';
    setRegister(toRegister);
    savePosition(passageId, 0);
  }

  afterUpdate(() => {
    if (container && passage) {
      const toRegister = passage.register ?? 'act1';
      transitionIn(container, prevRegister, toRegister);
      prevRegister = toRegister;
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });

  // ── Access check ──────────────────────────────────────────────────────────
  $: needsPurchase = TEST_MODE ? false : (passage?.access === 'paid' && !$state.hasPurchased);

  // ── Check unlock requirements ─────────────────────────────────────────────
  $: isUnlocked = (() => {
    if (!passage) return false;
    if (TEST_MODE) return true;
    if (!passage.requiredCompleted) return true;
    const completed = passage.requiredCompleted.filter(id => $state.completed[id]);
    return completed.length >= (passage.requiredCount ?? passage.requiredCompleted.length);
  })();

  // ── Navigate to next or choice ────────────────────────────────────────────
  function navigate(toId) {
    if (!toId) { goto('/read/hub'); return; }
    goto(`/read/${toId}`);
  }

  function chooseOption(choice) {
    saveChoice(passageId, 'choice', choice.next);
    navigate(choice.next);
  }

  // ── Auto-complete passages with no choices ────────────────────────────────
  $: if (passage?.completes && $state.completed[passage.completes] === false) {
    // Will be marked when the user navigates away; only mark on continue/end click
  }

  function continueOn() {
    if (passage?.completes) markComplete(passage.completes);
    navigate(passage?.next ?? 'hub');
  }
</script>

<div class="passage-container" bind:this={container}>
  {#if !passage}
    <div class="not-found prose">
      <p>Passage not found: {passageId}</p>
      <button class="choice-btn" on:click={() => goto('/read/hub')}>Return to hub</button>
    </div>

  {:else if passageId === 'hub'}
    <Hub />

  {:else if needsPurchase}
    <PurchaseGate passageId={passageId} />

  {:else if !isUnlocked}
    <div class="prose">
      <p style="opacity:0.5; margin-top:4rem; text-align:center;">
        🔒 This scene is not yet unlocked.
      </p>
      <div style="text-align:center; margin-top:1.5rem;">
        <button class="choice-btn" style="width:auto;" on:click={() => goto('/read/hub')}>
          Return to hub
        </button>
      </div>
    </div>

  {:else}
    <PassageContent
      {passage}
      on:choose={e => chooseOption(e.detail)}
      on:continue={continueOn}
    />
  {/if}
</div>
