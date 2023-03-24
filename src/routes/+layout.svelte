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
		popup,
		LightSwitch,
		Drawer,
		drawerStore,
		autoModeWatcher
	} from '@skeletonlabs/skeleton';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { page } from '$app/stores';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let accountPopupSettings: PopupSettings = {
		event: 'click',
		target: 'account-popup'
	};

	export let data: LayoutData;
	$: ({ supabase } = data);

	let path = '';
	$: path = $page.url.pathname;

	const activeItem = 'text-primary-500 dark:text-white';
	const inactiveItem =
		'text-gray-700 hover:text-primary-500 dark:text-gray-400 dark:hover:text-white dark:border-gray-700';

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

<!--  Automatisk dark/light mode ift. brugerens OS  -->
<!--  <svelte:head>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head>  -->

<Drawer width="w-auto">
	<ul
		class="flex flex-col p-4 mt-4 space-y-4"
	>
		<li>
			<a href="/guide" class="block btn {path == '/guide' ? 'variant-filled-primary' : 'variant-filled'}">Guide</a>
		</li>
		<li>
			<a href="/generator" class="block btn {path == '/generator' ? 'variant-filled-primary' : 'variant-filled'}"
				>Generator</a
			>
		</li>
	</ul>
</Drawer>

<AppShell>
	<svelte:fragment slot="pageHeader">
		<AppBar
			background="bg-translucent-light dark:bg-translucent-dark backdrop-blur-sm shadow-nav"
			padding="p-0"
			gridColumns="grid-cols-3"
			slotLead="!justify-start"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
		>
			<svelte:fragment slot="lead">
				<button on:click={() => drawerStore.open()} class="pl-4 lg:hidden"><i class="text-2xl bi bi-list" /></button>
				<a class="flex justify-center align-middle" href="/">
					<img src="/ToldJS_Black.png" class="m-2 pl-2 max-h-10 block dark:hidden" alt="ToldJS Logo" />
					<img src="/ToldJS_White.png" class="m-2 pl-2 max-h-10 dark:block hidden" alt="ToldJS Logo" />
				</a>
			</svelte:fragment>
			<ul
				class="hidden lg:flex flex-row space-x-8 mt-0 text-sm font-medium"
			>
				<li>
					<a href="/guide" class="block {path == '/guide' ? activeItem : inactiveItem}">Guide</a>
				</li>
				<li>
					<a href="/generator" class="block {path == '/generator' ? activeItem : inactiveItem}"
						>Generator</a
					>
				</li>
				<li>
					<a href="/om-os" class="block {path == '/om-os' ? activeItem : inactiveItem}"
						>Om projektet</a
					>
				</li>
				<li>
					<a href="/kontakt-os" class="block {path == '/kontakt-os' ? activeItem : inactiveItem}"
						>Kontakt os</a
					>
				</li>
			</ul>
			<svelte:fragment slot="trail">
				<LightSwitch />
				{#if data.session}
					<div use:popup={accountPopupSettings}>
						<!-- <Avatar
							src={data.session.user.user_metadata?.avatar_url}
							background="h-12 w-12"
							cursor="cursor-pointer"
						/> -->
						<i class="pr-4 text-3xl bi bi-person cursor-pointer" />
					</div>
					<div class="card variant-filled-surface p-4" data-popup="account-popup">
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
					<a href="konto/logind" class="btn variant-filled-primary">Log ind</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<Toast />
	<div class="container mx-auto">
		<slot />
	</div>
</AppShell>
