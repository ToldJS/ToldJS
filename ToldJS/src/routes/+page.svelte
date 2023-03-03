<script>
	import { Application } from '@splinetool/runtime';
	import { onMount } from 'svelte';

	onMount(() => {
		const canvas = document.getElementById('document_canvas');
		const app = new Application(canvas);
		app.load('document.spline');
	});
</script>

<div class="flex" style="width: 1000px !important; height: 1000px !important;">
	<canvas id="document_canvas" />
</div>
