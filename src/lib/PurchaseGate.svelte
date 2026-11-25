<script>
  import { setPurchased } from '$lib/store.js';
  import { goto } from '$app/navigation';

  export let passageId = '';

  function devUnlock() {
    setPurchased();
    goto(`/read/${passageId}`);
  }
</script>

<div class="purchase-gate prose" style="margin-top:4rem;">
  <h2><i class="fa-solid fa-lock"></i> Full Access Required</h2>
  <p>
    This scene is part of the complete novel. EP-A (The Collector) and
    EP-E (If Nairobi Falls) are free — full access unlocks everything else.
  </p>
  <p>
    The complete novel includes all 8 entry points, 6 Tier 1 connection
    scenes, 4 Signal Thread scenes, and the Apex.
  </p>
  <span class="price">$8.99</span>
  <a class="purchase-btn" href="/purchase"><i class="fa-solid fa-unlock"></i> Unlock full access</a>

  <div style="margin-top:2rem; border-top:0.5px solid var(--color-border); padding-top:1.5rem;">
    <button
      class="choice-btn"
      style="font-size:0.75rem; opacity:0.4;"
      on:click={devUnlock}
    >
      <i class="fa-solid fa-flask"></i> [DEV] Unlock without payment
    </button>
  </div>
</div>
