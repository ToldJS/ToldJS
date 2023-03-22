<script lang="ts">
	import { stringContainsAny } from '$lib/utils';
	import { Step, Stepper } from '@skeletonlabs/skeleton';
	import { z } from 'zod';
	import { ANDRE_LANDEKODER, HYPPIGE_LANDEKODER } from '../../data/landekoder';

	const schema = z.object({
		modtager: z.object({
			navn: z.string().min(1),
			addresse: z.string().min(1)
		}),
		afsender: z.object({
			navn: z.string().min(1),
			addresse: z.string().min(1),
			land: z.string().min(1)
		}),
		varer: z
			.object({
				antal: z.number().int().min(1),
				beskrivelse: z.string().min(1),
				varekode: z.number().int(),
				pris: z.number().int().min(1)
			})
			.array()
	});
	let data = {
		modtager: {
			navn: '',
			addresse: ''
		},
		afsender: {
			navn: '',
			addresse: '',
			land: ''
		},
		varer: [
			{
				antal: 1,
				beskrivelse: '',
				varekode: 0,
				pris: 1
			}
		]
	};

	let result = schema.safeParse(data);
	$: result = schema.safeParse(data);
	$: if (!result.success) console.log(result.error.format());
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
	<Step locked={Boolean(!result.success && result.error.format()?.modtager)}>
		<svelte:fragment slot="header">Modtageren</svelte:fragment>

		<label class="label">
			<span>Navn</span>
			<input
				bind:value={data.modtager.navn}
				type="text"
				class="input {!result.success &&
				data.modtager.navn &&
				result.error.format()?.modtager?.navn?._errors
					? 'variant-filled-error'
					: ''}"
				placeholder="Modtagerens navn"
			/>
		</label>
		<label class="label">
			<span>Adresse</span>
			<input
				bind:value={data.modtager.addresse}
				type="text"
				class="input {!result.success &&
				data.modtager.addresse &&
				result.error.format()?.modtager?.addresse?._errors
					? 'variant-filled-error'
					: ''}"
				placeholder="Modtagerens addresse"
			/>
		</label>
	</Step>
	<Step locked={Boolean(!result.success && result.error.format()?.afsender)}>
		<svelte:fragment slot="header">Afsenderen</svelte:fragment>

		<label class="label">
			<span>Navn</span>
			<input
				bind:value={data.afsender.navn}
				type="text"
				class="input {!result.success &&
				data.modtager.navn &&
				result.error.format()?.modtager?.navn?._errors
					? 'variant-filled-error'
					: ''}"
				placeholder="Modtagerens navn"
			/>
		</label>
		<label class="label">
			<span>Adresse</span>
			<input
				bind:value={data.afsender.addresse}
				type="text"
				class="input {!result.success &&
				data.modtager.addresse &&
				result.error.format()?.modtager?.addresse?._errors
					? 'variant-filled-error'
					: ''}"
				placeholder="Modtagerens addresse"
			/>
		</label>
		<label>
			<span>Land</span>
			<select bind:value={data.afsender.land} class="select">
				<option value="" disabled selected>Vælg afsender landet</option>
				<optgroup label="Ofte valgte">
					{#each HYPPIGE_LANDEKODER as country}
						<option value={country['Kode'] + '__' + country['Navn']}>{country['Navn']}</option>
					{/each}
				</optgroup>
				<optgroup label="Andre">
					{#each ANDRE_LANDEKODER.sort( (a, b) => (!stringContainsAny( a.Navn, ['Æ', 'Å'] ) ? a.Navn.localeCompare(b.Navn) : 1) ) as country}
						<option value={country['Kode'] + '__' + country['Navn']}>{country['Navn']}</option>
					{/each}
				</optgroup>
			</select>
		</label>
	</Step>
	<Step>
		<svelte:fragment slot="header">Varer</svelte:fragment>

		<table class="table">
			<thead>
				<tr>
					<th>Antal</th>
					<th>Beskrivelse</th>
					<th>Varekode</th>
					<th>Pris</th>
				</tr>
			</thead>
			<tbody>
				{#each [...Array(Object.keys(data.varer).length).keys()] as i}
					<tr>
						<td>
							<input
								bind:value={data.varer[i].antal}
								type="number"
								class="input {!result.success &&
									data.varer[i].antal &&
									result.error.format()?.varer[i]?.antal?._errors}"
							/>
						</td>
						<td>
							<input
								bind:value={data.varer[i].beskrivelse}
								type="text"
								class="input {!result.success &&
									data.varer[i].beskrivelse &&
									result.error.format()?.varer[i]?.beskrivelse?._errors}"
							/>
						</td>
						<td>
							<input
								bind:value={data.varer[i].varekode}
								type="number"
								class="input {!result.success && result.error.format()?.varer[i]?.varekode?._errors
									? 'variant-filled-error'
									: ''}"
							/>
						</td>
						<td>
							<input
								bind:value={data.varer[i].pris}
								type="number"
								class="input {!result.success && result.error.format()?.varer[i]?.pris?._errors
									? 'variant-filled-error'
									: ''}"
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Step>
</Stepper>
