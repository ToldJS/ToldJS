<script lang="ts">
	let emailTemplate: HTMLPreElement;
	let active: 'Info' | 'Step 1' | 'Step 2' = 'Info';

	const inactiveClasses = 'dark:border-gray-300 dark:text-gray-400';
	const activeClasses = 'dark:border-violet-400 dark:text-gray-50';
</script>

<div class="p-4 text-center md:px-10 lg:px-32 xl:max-w-3xl">
	<h2 class="text-2xl font-bold leading-none sm:text-4xl">Guide til selvfortoldning</h2>
	<p class="my-4">
		Få hjælp til at komme i gang med at bruge vores platform. Her kan du finde en guide til at komme
		hurtigt i gang.
	</p>
</div>
<div class="grid grid-cols-5 p-4 md:p-8">
	<div
		class="flex justify-center px-4 col-span-full md:col-span-1 md:flex-col md:justify-start md:items-start"
	>
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
				: inactiveClasses}">Step 1</button
		>
		<button
			on:click={() => (active = 'Step 2')}
			class="px-2 py-1 border-b-2 md:border-l-2 md:border-b-0 md:py-3 {active == 'Step 2'
				? activeClasses
				: inactiveClasses}">Step 2</button
		>
	</div>
	<div class="col-span-full md:col-span-4">
		{#if active == 'Info'}
			<h1 class="text-3xl font-bold">Info</h1>
			<p>
				Først skal du sende en email til din transportør om at du gerne vil selvfortolde. Derefter
				skal du opsamle noget information om din pakke. Udfyld felterne i generatoren på siden, og
				download PDF dokumentet. Til sidst skal du aflevere dokumentet til toldekspeditionen, og
				betale tolden.
			</p>
		{:else if active == 'Step 1'}
			<h1 class="text-3xl font-bold">Email</h1>
			<p>
				Første step er at skrive en email til dit transportørfirma, hvor du siger at du gerne selv
				vil fortolde din pakke. Den kan for eksempel se sådan ud:
			</p>
			<pre bind:this={emailTemplate}>
Hej PostNord.

Jeg ønsker at selvfortolde min pakke med nr: XXXXXXXXX
Jeg vil også spørge om hvor lang tid det er muligt for jer at holde pakken, så jeg har bedst muligt tid til at få den fortoldet.

Mvh. NAVN
</pre>
			<button
				class="btn btn-primary"
				on:click={() => {
					navigator.clipboard.writeText(emailTemplate.innerText);
				}}>Kopier</button
			>
		{:else if active == 'Step 2'}
			<h1 class="text-3xl font-bold">Aflevering</h1>
			<p>Nu hvor du har dine tolddokumenter skal du tage ned til en toldekspedition og aflevere papirerne. Her kan du se et kort over lokationerne:</p>
			<iframe
				title="Kort over toldekspeditioner"
				src="https://www.google.com/maps/d/embed?mid=1-Wmnv0sU-QEMNZ11zr78HPwC11lWxjg&ehbc=2E312F"
				width="640"
				height="480"
			/>
		{/if}
	</div>
</div>
