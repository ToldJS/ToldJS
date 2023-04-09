<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	$: activeTab = decodeURI($page.url.pathname.split('/')[2] || 'oversigt').toTitleCase();

	onMount(() => {
		document.title = `Legal - ${activeTab} - ToldJS`;
	});

	const cInactive =
		'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';
	const cActive =
		'inline-block p-4 text-primary-500 border-b-2 border-primary-500 rounded-t-lg active';
</script>

<div
	class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
>
	<ul class="flex flex-wrap">
		<li class="mr-2">
			<a href="/legal" class="unstyled {activeTab === 'Oversigt' ? cActive : cInactive}">Oversigt</a
			>
		</li>
		<li class="mr-2">
			<a
				href="/legal/privatlivspolitik"
				class="unstyled {activeTab === 'Privatlivspolitik' ? cActive : cInactive}"
				>Privatlivspolitik</a
			>
		</li>
		<li>
			<a
				href="/legal/servicevilkår"
				class="unstyled {activeTab === 'Servicevilkår' ? cActive : cInactive}">Servicevilkår</a
			>
		</li>
	</ul>
</div>

<div class="mt-4">
	<slot />
</div>
