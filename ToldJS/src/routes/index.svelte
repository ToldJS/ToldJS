<script lang="ts" >
  import svelteLogo from '../assets/svelte.svg'
  import Counter from '../lib/Counter.svelte'

  document.addEventListener("DOMContentLoaded", () => {

    let tracking_number;
    let tracking_url = "https://parcelsapp.com/en/tracking/${trackingNumber}";

    const tn = document.getElementById("tracking-number");
    tn.addEventListener("change", () => {
      tracking_number = tn.value;
      parse_tracking(tracking_url);
    });

});
</script>

<main>
  <input id="tracking-number" type="text" placeholder="Tracking number" class="input input-bordered w-full max-w-xs" />
</main>

<style></style>