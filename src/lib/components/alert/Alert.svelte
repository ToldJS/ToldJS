<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	import type { Alert } from '$lib/alerts';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		ExclamationCircle,
		ExclamationTriangle,
		CalendarDays,
		InformationCircle,
		ChatBubbleBottomCenterText
	} from '@steeze-ui/heroicons';

	// @ts-nocheck
	export let data: Alert;

	if (!data.time) data.time = 5;

	let visible = data.time > -1 && data.time != 0;

	const [color, icon] = (() => {
		switch (data.type) {
			case 'ERROR':
				return ['red', ExclamationCircle];
			case 'WARN':
				return ['yellow', ExclamationTriangle];
			case 'INFO':
				return ['blue', InformationCircle];
			case 'EVENT':
				return ['green', CalendarDays];
			case 'MESSAGE':
				return ['white', ChatBubbleBottomCenterText];
			default:
				return data.type;
		}
	})();

	if (data.time != -1 && visible) {
		const interval = setInterval(() => {
			if (data.time - 1 == 0) {
				clearInterval(interval);
				visible = false;
			}

			data.time--;
		}, 1000);
	}

	const _color = color as any;
	const position = data.position ?? 'top-right';
</script>

<Toast
	transition={fly}
	params={{ x: position.includes('right') ? 200 : -200 }}
	{position}
	color={_color}
	bind:open={visible}
>
	<svelte:fragment slot="icon">
		<Icon src={icon} size="24" />
	</svelte:fragment>
	<div class="ml-3">
		<h4 class="text-sm font-semibold text-gray-900 dark:text-white">
			{data.name}
			{#if data.time != -1}
				<span class="text-gray-500">({data.time}s)</span>
			{/if}
		</h4>
		<div class="text-sm font-normal">{data.body}</div>
	</div>
</Toast>
