<script>
    import { alerts } from "$lib/alerts";
    import Alert from "./Alert.svelte";
</script>

<div id="alertbox">
    {#each $alerts as alert}
        <Alert data={alert}></Alert>
    {/each}
</div>