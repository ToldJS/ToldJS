<script lang="ts">
	import { createSearchStore, searchHandler } from '$lib/search';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	const { user, orders } = data;

	const searchOrders = orders
		? orders.map((order) => ({
				...order,
				searchTerms: `${order.name} ${order.created_at}`
		  }))
		: [];

	const searchStore = createSearchStore(searchOrders);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});
</script>

<svelte:head>
	<title>Konto - ToldJS</title>
</svelte:head>

<p>Velkommen, {user.email}</p>
<p>User ID: {user.id}</p>
<h2>Ordre</h2>
{#if orders}
	<input
		type="text"
		class="input"
		placeholder="Søg..."
		bind:value={$searchStore.search}
	/>
	<table class="table w-full">
		<thead>
			<tr>
				<th>Navn</th>
				<th>Oprettet</th>
			</tr>
		</thead>
		<tbody>
			{#if $searchStore.filtered.length === 0}
				<tr>
					<td class="text-center" colspan="2">Ingen resultater</td>
				</tr>
			{/if}
			{#each $searchStore.filtered as order}
				<tr in:fade out:fade>
					<td>{order.name}</td>
					<td>{order.created_at}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>Du har ingen ordre endnu.</p>
{/if}
