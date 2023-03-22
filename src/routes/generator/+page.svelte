<script lang="ts">
	import { Step, Stepper } from '@skeletonlabs/skeleton';
	import { z } from 'zod';

	const schema = z.object({
		varer: z.object({
			antal: z.number().int().min(1),
			beskrivelse: z.string(),
			varekode: z.number().int(),
			vægt: z.number().positive()
		}).array(),
		// modtager: z.object({
		// 	navn: z.string(),
		// 	addresse: z.string()
		// }),
		// afsender: z.object({
		// 	navn: z.string(),
		// 	addresse: z.string(),
		// 	land: z.string(),
		// }),
	});
</script>

<h1 class="mt-3">Tolddokuments generator</h1>
<Stepper buttonCompleteLabel="Generer PDF" buttonNextLabel="Næste" buttonBackLabel="Tilbage">
	<Step>
		<svelte:fragment slot="header">Tracking (Virker ikke endnu)</svelte:fragment>

		Dette er et optionalt trin, men det er muligt at få nogle basis informationer om pakken, hvis du
		har tracking nummeret.

		<label class="label">
			<span>Tracking nummer</span>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input type="text" placeholder="Dit tracking nummer" />
				<button class="variant-filled-primary">Hent info</button>
			</div>
		</label>
	</Step>
	<Step>
		<svelte:fragment slot="header">Modtageren</svelte:fragment>

		<label class="label">
			<span>Navn</span>
			<input type="text" class="input" placeholder="Modtagerens navn" />
		</label>
		<label class="label">
			<span>Adresse</span>
			<input type="text" class="input" placeholder="Modtagerens addresse" />
		</label>
	</Step>
</Stepper>
