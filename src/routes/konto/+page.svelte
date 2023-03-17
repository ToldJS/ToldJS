<script lang="ts">
	import Redirect from '$lib/components/Redirect.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let orders: { [x: string]: any }[] | null = null;
	async function loadOrders() {
		const { data: resp, error: err } = await data.supabase.from('orders').select('name, created_at');
		orders = resp;
	}

	// Load orders when session is available
	$: if (data.session) {
		loadOrders();
	}
</script>

<svelte:head>
	<title>Konto - ToldJS</title>
</svelte:head>

{#if data.session}
	<p>Velkommen, {data.session.user.email}</p>
	<pre>{JSON.stringify(orders, null, 2)}</pre>
{:else}
	<Redirect to="/konto/logind" />
{/if}
