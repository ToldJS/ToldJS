<script lang="ts">
	import { createSearchStore, searchHandler } from '$lib/search';
	import { modalStore, toastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const { supabase, user, documents } = data;

	let blurred = false;
	const confirmDelete: ModalSettings = {
		type: 'confirm',
		title: 'Bekræft sletning',
		body: 'Er du sikker på at du vil slette din konto? Dette kan ikke fortrydes.',
		buttonTextCancel: 'Fortryd',
		buttonTextConfirm: 'Slet konto',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: async (r: boolean) => {
			blurred = true;
			const response = await fetch('/konto', { method: 'DELETE' });
			const json = await response.json();
			blurred = false;
			toastStore.trigger({
				message: response.status == 200 ? json.message : 'Der skete en uventet fejl.',
				background: 'variant-filled-error',
				timeout: 5000
			});
			try {
				supabase.auth.signOut();
			} catch (e: any) {
				return;
			}
		}
	};
</script>

<svelte:head>
	<title>Konto - ToldJS</title>
</svelte:head>

{#if blurred}
	<div class="absolute inset-0 bg-black opacity-50 z-10" />
{/if}

<div class="space-y-4">
	<p>Velkommen, {user.email}</p>
	<p>User ID: {user.id}</p>
	<h2>Dokumenter</h2>
	{#if documents}
		{#each documents as document}
			<div class="card">
				<div class="p-4 space-y-4">
					{#each document.data as item}
						<h3>{item.desc}</h3>
						<p>{item['packageInfo']['Text-LETnSee-lw']}</p>
					{/each}
					<button
						class="btn variant-ghost-surface"
						on:click={() => goto(`/dokument/${document.id}`)}
						>Genskab Dokument{document.data.length > 1 ? 'er' : ''}</button
					>
				</div>
			</div>
		{/each}
	{:else}
		<p>Du har ingen gemte dokumenter endnu.</p>
	{/if}
	<button on:click={() => modalStore.trigger(confirmDelete)} class="btn variant-ghost-error"
		>Slet konto</button
	>
</div>
