<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Fejl - ToldJS</title>
</svelte:head>

<div class="w-full text-center pt-12">
	{#if $page.status === 404}
		<span class="font-bold text-xl">Siden blev ikke fundet</span> <br />
		<a href="/">Gå tilbage til forsiden</a>
	{:else}
		<span class="font-bold text-xl">Der skete en uventet fejl ({$page.status})</span> <br />
		{#if $page.error?.errorId}
			<span class="text-gray-500">Error ID: {$page.error.errorId}</span>
		{/if}
	{/if}
</div>