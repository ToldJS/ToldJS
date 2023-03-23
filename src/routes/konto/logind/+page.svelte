<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import Redirect from '$lib/components/Redirect.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { Provider } from '@supabase/supabase-js';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: if (form?.error) {
		toastStore.trigger({
			message: form.error,
			background: 'variant-filled-error',
			timeout: 5000
		});
	}

	const signInViaProvider = async (provider: Provider) => {
		const { data: result, error } = await data.supabase.auth.signInWithOAuth({
			provider: provider
		});
	};

	const submitProviderLogin: SubmitFunction = async ({ action, cancel }) => {
		switch (action.searchParams.get('provider')) {
			case 'google':
				await signInViaProvider('google');
				break;
			case 'discord':
				await signInViaProvider('discord');
				break;
			case 'github':
				await signInViaProvider('github');
				break;
			default:
				break;
		}

		cancel();
	};
</script>

<svelte:head>
	<title>Log ind - ToldJS</title>
</svelte:head>

{#if data.session}
	<Redirect to="/konto" />
{:else}
	<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
		<h1
			class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
		>
			Log ind
		</h1>
		<form action="?/login" method="POST" use:enhance={submitProviderLogin}>
			<div class="logo-cloud grid-cols-1 lg:!grid-cols-3 gap-1">
				<button formaction="?/login&provider=google" class="logo-item">
					<span><i class="bi bi-google" /></span>
					<span>Google</span>
				</button>
				<button formaction="?/login&provider=discord" class="logo-item">
					<span><i class="bi bi-discord" /></span>
					<span>Discord</span>
				</button>
				<button formaction="?/login&provider=github" class="logo-item">
					<span><i class="bi bi-github" /></span>
					<span>GitHub</span>
				</button>
			</div>
		</form>
		<form action="?/login" method="POST" class="space-y-4 md:space-y-6" use:enhance>
			<div>
				<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>Email</label
				>
				<input
					type="email"
					name="email"
					id="email"
					class="input input-bordered"
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
					class="input input-bordered"
					required
				/>
			</div>
			<button type="submit" class="btn btn-primary">Log ind</button>
			<p class="text-sm font-light text-gray-500 dark:text-gray-400">
				Har du ikke en konto endnu? <a
					href="/konto/opret"
					class="font-medium text-primary-600 hover:underline dark:text-primary-500"
					>Opret konto her</a
				>
			</p>
		</form>
	</div>
{/if}
