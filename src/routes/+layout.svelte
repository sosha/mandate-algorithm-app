<script>
  import { state, setRegister } from '$lib/store.js';
  import { onMount } from 'svelte';
  import '../app.css';

  // Sync register to <html> data-register attribute for CSS targeting
  $: if (typeof document !== 'undefined') {
    document.documentElement.dataset.register = $state.register;
  }

  onMount(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  });
</script>

<slot />
