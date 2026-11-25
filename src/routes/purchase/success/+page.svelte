<script>
  import { setPurchased } from '$lib/store.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    setPurchased();
  });
</script>

<div class="prose" style="text-align:center; margin-top:5rem;">
  <span style="font-size:2rem; color:var(--color-seal); display:block; margin-bottom:1rem;">天命算法</span>
  <h1 style="margin-bottom:1rem;"><i class="fa-solid fa-check-circle" style="color:#4a8;"></i> Full access unlocked.</h1>
  <p style="opacity:0.6; margin-bottom:2.5rem;">
    All scenes, all tiers, all choices — the complete pyramid is yours.
  </p>
  <button class="purchase-btn" on:click={() => goto('/read/hub')} style="cursor:pointer; border:none;">
    <i class="fa-solid fa-book-open"></i> Begin reading
  </button>
</div>
