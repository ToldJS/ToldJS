<script lang="ts">
	let emailTemplate: HTMLPreElement;
	let active: 'Info' | 'Step 1' | 'Step 2' | 'Step 3' = 'Info';

	const inactiveClasses = 'dark:border-gray-300 dark:text-gray-400';
	const activeClasses = 'dark:border-primary dark:text-gray-50';
</script>

<svelte:head>
	<title>Guide - ToldJS</title>
	<meta
		name="description"
		content="Få hjælp til at komme i gang med at bruge vores platform. Her kan du finde en guide til at komme hurtigt i gang."
	/>
</svelte:head>
<h1 class="leading-none">Guide til selvfortoldning</h1>
<div class="grid grid-cols-5 p-4 md:p-8">
	<div
		class="flex justify-center px-4 col-span-full md:col-span-1 md:flex-col md:justify-start md:items-start"
	>
		<button
			on:click={() => (active = 'Info')}
			class="p-2 border-b-4 md:border-l-4 md:border-b-0 md:py-3 {active == 'Info'
				? activeClasses
				: inactiveClasses}">Info</button
		>
		<button
			on:click={() => (active = 'Step 1')}
			class="px-2 py-1 border-b-4 md:border-l-4 md:border-b-0 md:py-3 {active == 'Step 1'
				? activeClasses
				: inactiveClasses}">Step 1</button
		>
		<button
			on:click={() => (active = 'Step 2')}
			class="px-2 py-1 border-b-4 md:border-l-4 md:border-b-0 md:py-3 {active == 'Step 2'
				? activeClasses
				: inactiveClasses}">Step 2</button
		>
		<button
			on:click={() => (active = 'Step 3')}
			class="px-2 py-1 border-b-4 md:border-l-4 md:border-b-0 md:py-3 {active == 'Step 3'
				? activeClasses
				: inactiveClasses}">Step 3</button
		>
	</div>
	<div class="col-span-full md:col-span-4">
		{#if active == 'Info'}
			<h1>Info</h1>
			<p>
				Først skal du sende en email til din transportør om at du gerne vil selvfortolde. Derefter
				skal du opsamle noget information om din pakke. Brug denne information til at udfylde
				felterne i generatoren på siden, og download PDF dokumentet. Til sidst skal du aflevere
				dokumentet til toldekspeditionen, og betale tolden. Alt dette er beskrevet i de næste skridt.
			</p>
		{:else if active == 'Step 1'}
			<h1>Email</h1>
			<p>
				Første step er at skrive en email til dit transportørfirma, hvor du siger at du gerne selv
				vil fortolde din pakke. Postnords email til dette er: firmaimport@postnord.com     Den kan for eksempel se sådan ud:
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
			<h1>Generator</h1>
			<p>
				Når du har fået svar fra transportøren, skal du samle nogle oplysninger om din pakke. Du
				skal bruge disse oplysninger til at udfylde felterne i generatoren på siden. Når du har
				udfyldt felterne, skal du trykke på knappen "Generer PDF", og så skal du downloade og printe
				PDF dokumenterne. Du vil få ét dokument for hver vare i din pakke. Til sidst skal du
				underskrive i bunden af side 6 og 7 på hvert dokument.
			</p>
			<a href="/generator" class="btn btn-primary" target="_blank" rel="noreferrer"
				>Gå til generatoren</a
			>
		{:else if active == 'Step 3'}
			<h1>Aflevering</h1>
			<p>
				Nu hvor du har dine tolddokumenter skal du tage ned til en toldekspedition og aflevere
				papirerne. Her kan du se et kort over lokationerne:
			</p>
			<iframe
				title="Kort over toldekspeditioner"
				src="https://www.google.com/maps/d/embed?mid=1-Wmnv0sU-QEMNZ11zr78HPwC11lWxjg&ehbc=2E312F"
				width="640"
				height="480"
				class="mb-14"
			/>
		{/if}
	</div>
</div>
