<script lang="ts">
	let active: 'Info' | 'Step 1' | 'Step 2' = 'Info';

	const inactiveClasses = 'dark:border-gray-300 dark:text-gray-400';
	const activeClasses = 'dark:border-violet-400 dark:text-gray-50';
</script>

<div class="p-4 text-center md:px-10 lg:px-32 xl:max-w-3xl">
	<h2 class="text-2xl font-bold leading-none sm:text-4xl">Guide</h2>
	<p class="my-4">
		Få hjælp til at komme i gang med at bruge vores platform. Her kan du finde en guide til at komme
		hurtigt i gang.
	</p>
</div>
<div class="grid grid-cols-5 p-4 md:p-8">
	<div
		class="flex justify-center px-4 col-span-full md:col-span-1 md:flex-col md:justify-start md:items-start">
		<button
			on:click={() => (active = 'Info')}
			class="p-2 border-b-2 md:border-l-2 md:border-b-0 md:py-3 {active == 'Info'
				? activeClasses
				: inactiveClasses}">Info</button
		>
		<button
			on:click={() => (active = 'Step 1')}
			class="px-2 py-1 border-b-2 md:border-l-2 md:border-b-0 md:py-3 {active == 'Step 1'
				? activeClasses
				: inactiveClasses}">Step 1</button>
		<button
			on:click={() => (active = 'Step 2')}
			class="px-2 py-1 border-b-2 md:border-l-2 md:border-b-0 md:py-3 {active == 'Step 2'
				? activeClasses
				: inactiveClasses}">Step 2</button>
	</div>
	{#if active == 'Info'}
		<div class="">
			Info
		</div>
	{:else if active == 'Step 1'}
		<div class="">
			Step 1
		</div>
	{:else if active == 'Step 2'}
		<div class="">
			Step 2
		</div>
	{/if}
</div>
