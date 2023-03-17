<script lang="ts">
	import Redirect from '$lib/components/Redirect.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Bekræft din email - ToldJS</title>
</svelte:head>

{#if data.session}
	<Redirect to="/konto" />
{:else}
	<p>Check din email!</p>
{/if}
