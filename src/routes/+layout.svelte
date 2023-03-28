<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';

	import '../lib/utils';

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
		autoModeWatcher,
		Modal
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
	<ul class="flex flex-col p-4 mt-4 space-y-4">
		<li>
			<a
				href="/generator"
				class="block btn {path == '/generator' ? 'variant-filled-primary' : 'variant-filled'}"
				>Generator</a
			>
		</li>
		<li>
			<a
				href="/om-os"
				class="block btn {path == '/om-os' ? 'variant-filled-primary' : 'variant-filled'}"
				>Om projektet</a
			>
		</li>
		<li>
			<a
				href="/kontakt-os"
				class="block btn {path == '/kontakt-os' ? 'variant-filled-primary' : 'variant-filled'}"
				>Kontakt os</a
			>
		</li>
	</ul>
</Drawer>

<Modal />
<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar
			background="bg-translucent-light dark:bg-translucent-dark backdrop-blur-sm shadow-nav"
			padding="p-0"
			gridColumns="grid-cols-3"
			slotLead="!justify-start"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
		>
			<svelte:fragment slot="lead">
				<button on:click={() => drawerStore.open()} class="pl-4 lg:hidden"
					><i class="text-2xl bi bi-list" /></button
				>
				<a class="flex justify-center align-middle" href="/">
					<img
						src="/ToldJS_Black.png"
						class="m-2 pl-2 max-h-10 block dark:hidden"
						alt="ToldJS Logo"
					/>
					<img
						src="/ToldJS_White.png"
						class="m-2 pl-2 max-h-10 dark:block hidden"
						alt="ToldJS Logo"
					/>
				</a>
			</svelte:fragment>
			<ul class="hidden lg:flex flex-row space-x-8 mt-0 text-sm font-medium">
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
					<div
						class="flex flex-col space-y-4 card variant-filled-surface p-4 w-32 lg:w-64"
						data-popup="account-popup"
					>
						<ul>
							<li>
								<a class="btn variant-filled w-20 lg:w-40" href="/konto">Konto</a>
							</li>
							<li>
								<form action="/konto/logud" method="POST" use:enhance={submitLogout}>
									<button class="btn variant-filled w-20 lg:w-40" type="submit">Log ud</button>
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

	<div class="container mx-auto">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		<footer
			class="grid grid-cols-2 card p-4 bg-translucent-light dark:bg-translucent-dark backdrop-blur-sm shadow-nav"
		>
			<div class="items-center">
				<p>Copyright ToldJS © {new Date().getFullYear()} - CVR: 43902113</p>
			</div>
			<div class="justify-self-end">
				<a href="https://discord.gg/toldjs"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 127.14 96.36"
						class="fill-black dark:fill-white"
						><path
							d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
						/></svg
					></a
				>
			</div>
		</footer>
	</svelte:fragment>
</AppShell>
