<script lang="ts">
	import { page } from '$app/stores';

	$: activeTab = $page.url.pathname.split('/')[2] || 'Oversigt';
	$: console.log(activeTab);

	const inactiveStyles =
		'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';
	const activeStyles =
		'inline-block p-4 text-primary-500 border-b-2 border-primary-500 rounded-t-lg active';
</script>

<div
	class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
>
	<ul class="flex flex-wrap">
		<li class="mr-2">
			<a href="/legal" class="unstyled {activeTab === 'Oversigt' ? activeStyles : inactiveStyles}">Oversigt</a>
		</li>
		<li class="mr-2">
			<a
				href="/legal/privatlivspolitik"
				class="unstyled {activeTab === 'privatlivspolitik' ? activeStyles : inactiveStyles}"
				>Privatlivspolitik</a
			>
		</li>
		<li>
			<a
				href="/legal/servicevilkår"
				class="unstyled {activeTab === 'servicevilk%C3%A5r' ? activeStyles : inactiveStyles}">Servicevilkår</a
			>
		</li>
	</ul>
</div>

<div class="mt-12">
	<slot />
</div>
