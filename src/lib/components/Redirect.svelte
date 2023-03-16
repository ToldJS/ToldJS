<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	//@ts-ignore
	export let to: string;

	onMount(() => goto(to));
</script>
