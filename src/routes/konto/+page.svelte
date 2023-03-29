<script lang="ts">
	import { createSearchStore, searchHandler } from '$lib/search';
	import { modalStore, toastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	const { supabase, user, orders } = data;

	let blurred = false;
	const confirmDelete: ModalSettings = {
		type: 'confirm',
		title: 'Bekræft sletning',
		body: 'Er du sikker på at du vil slette din konto? Dette kan ikke fortrydes.',
		buttonTextCancel: 'Fortryd',
		buttonTextConfirm: 'Slet konto',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: async (r: boolean) => {
			blurred = true
			const response = await fetch('/konto', { method: 'DELETE' });
			const json = await response.json();
			blurred = false
			toastStore.trigger({
				message: response.status == 200 ? json.message : 'Der skete en uventet fejl.',
				background: 'variant-filled-error',
				timeout: 5000
			});
			try {
				supabase.auth.signOut();
			} catch (e: any) {
				return
			}
		}
	};

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

{#if blurred}
	<div class="absolute inset-0 bg-black opacity-50 z-10"></div>
{/if}

<div class="space-y-4">
	<p>Velkommen, {user.email}</p>
	<p>User ID: {user.id}</p>
	<h2>Ordre</h2>
	{#if orders}
		<input type="text" class="input" placeholder="Søg..." bind:value={$searchStore.search} />
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
	<button on:click={() => modalStore.trigger(confirmDelete)} class="btn variant-ghost-error"
		>Slet konto</button
	>
</div>
