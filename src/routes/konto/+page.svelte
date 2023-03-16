<script lang="ts">
	import Redirect from '$lib/components/Redirect.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.session}
	<p>Velkommen, {data.session.user.email}</p>
{:else}
	<Redirect to="/konto/logind" />
{/if}
