<script>
  import { setPurchased } from '$lib/store.js';
  import { goto } from '$app/navigation';

  const PRICE = '$8.99';
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_WITH_YOUR_LINK';

  function goToStripe() {
    window.location.href = STRIPE_PAYMENT_LINK;
  }

  function devPurchase() {
    setPurchased();
    goto('/read/hub');
  }
</script>

<div class="purchase-gate prose" style="max-width:520px; margin:5rem auto;">
  <div style="text-align:center; margin-bottom:2rem;">
    <span style="font-size:2rem; color:var(--color-seal);">天命算法</span>
  </div>

  <h2 style="text-align:center; margin-bottom:1rem;"><i class="fa-solid fa-key"></i> Full Access</h2>

  <p>
    EP-A (The Collector) and EP-E (If Nairobi Falls) are free and always available.
    The complete novel includes:
  </p>

  <ul style="margin:1.25rem 0 1.25rem 1.5rem; line-height:2; font-size:0.9rem; opacity:0.8; list-style:none;">
    <li><i class="fa-solid fa-check" style="color:var(--color-accent); margin-right:0.5rem;"></i> All 8 entry points across both acts</li>
    <li><i class="fa-solid fa-check" style="color:var(--color-accent); margin-right:0.5rem;"></i> 6 Tier 1 connection scenes</li>
    <li><i class="fa-solid fa-check" style="color:var(--color-accent); margin-right:0.5rem;"></i> 4 Signal Thread scenes — the full architecture of Bǎituán</li>
    <li><i class="fa-solid fa-check" style="color:var(--color-accent); margin-right:0.5rem;"></i> The Apex — the 21st National Congress, three perspectives</li>
  </ul>

  <p style="font-size:0.8rem; opacity:0.5;">
    No subscription. No microtransactions. One price, complete novel.
    Your progress is saved locally and never expires.
  </p>

  <div style="text-align:center; margin-top:2.5rem;">
    <span class="price">{PRICE}</span>
    <button class="purchase-btn" on:click={goToStripe} style="cursor:pointer; border:none;">
      <i class="fa-solid fa-lock-open"></i> Purchase full access
    </button>
    <p style="font-size:0.65rem; opacity:0.3; margin-top:0.75rem;">
      <i class="fa-solid fa-shield-halved"></i> Secure payment via Stripe
    </p>
  </div>

  <div style="margin-top:3rem; border-top:0.5px solid var(--color-border); padding-top:1.5rem; text-align:center;">
    <button class="choice-btn" style="font-size:0.75rem; opacity:0.4; width:auto;" on:click={devPurchase}>
      <i class="fa-solid fa-flask"></i> [DEV] Unlock without payment
    </button>
  </div>
</div>
