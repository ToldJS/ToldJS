<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import {
		storePopup,
		AppBar,
		AppShell,
		Avatar,
		Toast,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance, type SubmitFunction } from '$app/forms';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let accountPopupSettings: PopupSettings = {
		event: 'click',
		target: 'account-popup',
	};

	export let data: LayoutData;
	$: ({ supabase } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	// Hvis brugeren slukker for javascript, så vil han stadig kunne logge ud
	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
		}
		cancel();
	};
</script>

<AppShell>
	<svelte:fragment slot="pageHeader">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<i class="text-2xl bi bi-list lg:hidden" />
				<a href="/" class="hidden lg:flex lg:items-center">
					<img src="/ToldJS_Black.png" class="h-12" alt="ToldJS Logo" />
				</a>
			</svelte:fragment>
			<a href="/" class="flex items-center lg:hidden">
				<img src="/ToldJS_Black.png" class="h-12" alt="ToldJS Logo" />
			</a>
			<ul
				class="flex flex-col p-4 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<li>
					<a href="/guide" class="block rounded text-blue-700 dark:text-white" aria-current="page"
						>Guide</a
					>
				</li>
				<li>
					<a
						href="/generator"
						class="block text-gray-700 rounded hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700"
						>Generator</a
					>
				</li>
			</ul>
			<svelte:fragment slot="trail">
				{#if data.session}
					<div use:popup={accountPopupSettings}>
						<Avatar
							src={data.session.user.user_metadata?.avatar_url}
							border="border-2 border-surface-300-600-token hover:!border-primary-500"
							cursor="cursor-pointer"
						/>
					</div>
					<div class="card variant-filled-surface p-4 w-1/12" data-popup="account-popup">
						<ul>
							<li>
								<a href="/konto">Konto</a>
							</li>
							<li>
								<form action="/konto/logud" method="POST" use:enhance={submitLogout}>
									<button class="button" type="submit">Log ud</button>
								</form>
							</li>
						</ul>
						
						<div class="arrow variant-filled-surface" />
					</div>
				{:else}
					<a href="konto/logind" class="btn btn-primary">Log ind</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<Toast />
	<div class="container mx-auto">
		<slot />
	</div>
</AppShell>
