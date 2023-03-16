<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="w-full text-center pt-12">
	<span class="font-bold text-xl">Der skete en uventet fejl ({$page.status})</span> <br />
	{#if $page.error?.errorId}
		<span class="text-gray-500">Error ID: {$page.error.errorId}</span>
	{/if}
</div>
