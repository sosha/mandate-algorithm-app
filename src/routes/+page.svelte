<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { state, setRegister } from '$lib/store.js';
  import { transitionIn } from '$lib/transitions.js';

  let container;
  let mounted = false;

  onMount(() => {
    mounted = true;
    setRegister('act1');
    if ($state.currentPassage && $state.currentPassage !== 'hub') {
      resumePrompt = true;
    }
    if (container) transitionIn(container, 'act1', 'act1');
  });

  let resumePrompt = false;

  function start() {
    goto('/read/hub');
  }

  function resume() {
    goto(`/read/${$state.currentPassage}`);
  }
</script>

<div class="title-screen prose" bind:this={container}>
  <div style="text-align:center; padding: 4rem 1rem 3rem;">
    <span style="font-size:3.5rem; color: var(--color-seal); display:block; margin-bottom:0.5rem; letter-spacing:0.05em;">
      天命算法
    </span>
    <h1 style="font-size:1.1rem; opacity:0.6; letter-spacing:0.1em; text-transform:uppercase; font-weight:400; margin-bottom:0.3rem;">
      The Mandate Algorithm
    </h1>
    <p style="font-size:0.8rem; opacity:0.4; font-style:italic; margin-bottom:3rem;">
      In which the right to rule is recalculated.
    </p>

    {#if resumePrompt}
      <p style="font-size:0.85rem; opacity:0.6; margin-bottom:1.5rem;">
        You were reading <em>{$state.currentPassage}</em>.
      </p>
      <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
        <button class="choice-btn" style="width:auto;" on:click={resume}>
          <i class="fa-solid fa-bookmark"></i> Continue reading
        </button>
        <button class="choice-btn" style="width:auto; opacity:0.6;" on:click={start}>
          <i class="fa-solid fa-rotate-left"></i> Start from the beginning
        </button>
      </div>
    {:else}
      <button class="choice-btn" style="width:auto; margin:0 auto;" on:click={start}>
        <i class="fa-solid fa-play"></i> Begin
      </button>
    {/if}

    <p style="margin-top:4rem; font-size:0.75rem; opacity:0.3; font-style:italic;">
      天命所歸，非力之爭。<br/>
      Where the Mandate rests, it is not decided by force.
    </p>
  </div>
</div>
