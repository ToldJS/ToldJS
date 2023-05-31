<script lang="ts">
	import { enhance } from '$app/forms';
	import Redirect from '$lib/components/Redirect.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: if (form?.error) toastStore.trigger({
		message: form.error,
		background: 'variant-filled-error',
		timeout: 5000,
	})
</script>

<svelte:head>
	<title>Opret Konto - ToldJS</title>
</svelte:head>

{#if data.session}
	<Redirect to="/konto" />
{:else}
	<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
		<h1
			class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
		>
			Opret konto
		</h1>
		<form action="?/register" method="POST" class="space-y-4 md:space-y-6" use:enhance>
			<div>
				<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Email</label
				>
				<input
					type="email"
					name="email"
					id="email"
					class="input"
					placeholder="name@company.com"
					required
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Adgangskode</label
				>
				<input
					type="password"
					name="password"
					id="password"
					placeholder="••••••••"
					class="input"
					required
				/>
			</div>
			<div class="flex items-start">
				<div class="flex items-center h-5">
					<input
						id="terms"
						aria-describedby="terms"
						type="checkbox"
						class="checkbox"
						required
					/>
				</div>
				<div class="ml-3 text-sm">
					<label for="terms" class="font-light text-gray-500 dark:text-gray-300"
						>Jeg accepterer <a
							class="font-medium text-primary-600 hover:underline dark:text-primary-500"
							href="/legal/servicevilkår">vilkår og betingelser</a
						></label
					>
				</div>
			</div>
			<button type="submit" class="btn variant-filled">Opret konto</button>
			<p class="text-sm font-light text-gray-500 dark:text-gray-400">
				Har du allerede en konto? <a
					href="/konto/logind"
					class="font-medium text-primary-600 hover:underline dark:text-primary-500">Log ind her</a
				>
			</p>
		</form>
	</div>
{/if}
