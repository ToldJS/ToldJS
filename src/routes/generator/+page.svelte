<script lang="ts">
	import { stringContainsAny } from '$lib/utils';
	import { CodeBlock, Step, Stepper } from '@skeletonlabs/skeleton';
	import { z } from 'zod';
	import type { PageData } from './$types';
	import { ANDRE_LANDEKODER, HYPPIGE_LANDEKODER } from '../../data/landekoder';

	export let data: PageData;
	const CURRENCIES: string[] = Object.keys(data.currencies);

	const emailTemplate = `Hej PostNord.

Jeg ønsker at selvfortolde min pakke med nr: XXXXXXXXX
Jeg vil også spørge om hvor lang tid det er muligt for jer at holde pakken, så jeg har bedst muligt tid til at få den fortoldet.

Mvh. NAVN`;

	const schema = z.object({
		modtager: z.object({
			navn: z.string().nonempty(),
			addresse: z.string().nonempty()
		}),
		afsender: z.object({
			navn: z.string().nonempty(),
			addresse: z.string().nonempty(),
			land: z.string().nonempty()
		}),
		pakkeinfo: z.object({
			valuta: z.string().nonempty(),
			fragtpris: z.number().int().min(1),
			vægt: z.number().int().min(1),
			vægtEnhed: z.enum(['kg', 'lb']),
			gave: z.boolean()
		}),
		varer: z
			.object({
				antal: z.number().int().min(1),
				beskrivelse: z.string().nonempty(),
				varekode: z.number().int(),
				pris: z.number().int().min(1)
			})
			.array()
	});
	type schema = z.infer<typeof schema>;

	let information: schema = {
		modtager: {
			navn: '',
			addresse: ''
		},
		afsender: {
			navn: '',
			addresse: '',
			land: ''
		},
		pakkeinfo: {
			valuta: '',
			fragtpris: 1,
			vægt: 1,
			vægtEnhed: 'kg',
			gave: false
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

	let result = schema.safeParse(information);
	$: result = schema.safeParse(information);
</script>

<h1 class="mt-3">Tolddokuments generator</h1>
<Stepper
	stepTerm="Trin"
	buttonCompleteLabel="Generer PDF"
	buttonNextLabel="Næste"
	buttonBackLabel="Tilbage"
>
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
				bind:value={information.modtager.navn}
				type="text"
				class="input {!result.success &&
				information.modtager.navn &&
				result.error.format()?.modtager?.navn?._errors
					? 'input-error'
					: ''}"
				placeholder="Modtagerens navn"
			/>
		</label>
		<label class="label">
			<span>Adresse</span>
			<input
				bind:value={information.modtager.addresse}
				type="text"
				class="input {!result.success &&
				information.modtager.addresse &&
				result.error.format()?.modtager?.addresse?._errors
					? 'input-error'
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
				bind:value={information.afsender.navn}
				type="text"
				class="input {!result.success &&
				information.modtager.navn &&
				result.error.format()?.modtager?.navn?._errors
					? 'input-error'
					: ''}"
				placeholder="Modtagerens navn"
			/>
		</label>
		<label class="label">
			<span>Adresse</span>
			<input
				bind:value={information.afsender.addresse}
				type="text"
				class="input {!result.success &&
				information.modtager.addresse &&
				result.error.format()?.modtager?.addresse?._errors
					? 'input-error'
					: ''}"
				placeholder="Modtagerens addresse"
			/>
		</label>
		<label>
			<span>Land</span>
			<select bind:value={information.afsender.land} class="select">
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
	<Step locked={Boolean(!result.success && result.error.format()?.pakkeinfo)}>
		<svelte:fragment slot="header">Pakkeinfo</svelte:fragment>
		Her skal du angive nogle informationer om pakken. I næste trin skal du angive alle varer der er i
		pakken. Valutaen er den valuta, du vil angive priser i. Det inkluderer varepriserne i næste trin.

		<label class="label">
			<span>Valuta</span>
			<select bind:value={information.pakkeinfo.valuta} class="select">
				<option value="" disabled selected>Vælg valuta...</option>
				{#each CURRENCIES as currency}
					<option value={currency} selected={currency == 'USD'}>{currency}</option>
				{/each}
			</select>
		</label>
		<label class="label">
			<span>Fragt pris</span>
			<input
				bind:value={information.pakkeinfo.fragtpris}
				type="number"
				class="input {!result.success && result.error.format()?.pakkeinfo?.fragtpris?._errors
					? 'input-error'
					: ''}"
				placeholder="Pakkens fragt pris"
			/>
		</label>
		<label class="label">
			<span>Vægt</span>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input
					bind:value={information.pakkeinfo.vægt}
					type="number"
					class="input {!result.success && result.error.format()?.pakkeinfo?.vægt?._errors
						? 'input-error'
						: ''}"
					placeholder="Pakkens vægt"
				/>
				<select bind:value={information.pakkeinfo.vægtEnhed} class="w-24 select">
					<option value="kg" selected>KG</option>
					<option value="lb">LB</option>
				</select>
			</div>
		</label>
		<label class="label">
			<span>Gave</span>
			<input bind:checked={information.pakkeinfo.gave} type="checkbox" class="checkbox" />
		</label>
	</Step>
	<Step locked={Boolean(!result.success && result.error.format()?.varer)}>
		<svelte:fragment slot="header">Varer</svelte:fragment>
		Her skal du angive alle varer der er i pakken. Varekoden er en kode du får fra dit transportørfirma,
		ved at skrive en mail til dem. Du skal sige til dem, at du selv vil fortolde pakken, og så skal de
		sende dig varekoderne. Postnords email til dette er
		<a href="mailto:firmaimport@postnord.com">firmaimport@postnord.com</a>. Emailen kunne se sådan
		her ud:
		<CodeBlock language="Email" buttonLabel="Kopier" buttonCopied="Kopieret" code={emailTemplate} />
		<br />

		<table class="table">
			<thead>
				<tr>
					<th>Antal</th>
					<th>Beskrivelse</th>
					<th>Varekode</th>
					<th>Pris</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each [...Array(Object.keys(information.varer).length).keys()] as i}
					<tr>
						<td>
							<input
								bind:value={information.varer[i].antal}
								type="number"
								class="input {!result.success && result.error.format()?.varer?.[i]?.antal?._errors
									? 'variant-filled-error'
									: ''}"
							/>
						</td>
						<td>
							<input
								bind:value={information.varer[i].beskrivelse}
								type="text"
								class="input {!result.success &&
								information.varer[i].beskrivelse &&
								result.error.format()?.varer?.[i]?.beskrivelse?._errors
									? 'variant-filled-error'
									: ''}"
							/>
						</td>
						<td>
							<input
								bind:value={information.varer[i].varekode}
								type="number"
								class="input {!result.success &&
								result.error.format()?.varer?.[i]?.varekode?._errors
									? 'variant-filled-error'
									: ''}"
							/>
						</td>
						<td>
							<input
								bind:value={information.varer[i].pris}
								type="number"
								class="input {!result.success && result.error.format()?.varer?.[i]?.pris?._errors
									? 'variant-filled-error'
									: ''}"
							/>
						</td>
						<td>
							<button
								on:click={() => {
									information.varer.splice(i, 1);
									information.varer = information.varer;
								}}
								on:keypress={() => {}}
								class="btn variant-ghost-surface"
								disabled={!(Object.keys(information.varer).length > 1)}
							>
								<i class="bi bi-x-lg" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="5" class="">
						<button
							on:click={() => {
								information.varer.push({
									antal: 1,
									beskrivelse: '',
									varekode: 0,
									pris: 1
								});
								information.varer = information.varer;
							}}
							on:keypress={() => {}}
							class="w-full btn gap-2 variant-ghost-surface"
						>
							<i class="text-xl text-primary bi bi-plus-circle" />
							Tilføj vare
						</button>
					</td>
				</tr>
			</tfoot>
		</table>
	</Step>
	<Step>
		<svelte:fragment slot="header">Resultat</svelte:fragment>
		Nu er du klar til at lave din PDF. Tryk på knappen herunder for at lave PDF'en.
		(dette step er her for at man ikke kan trykke "Generer PDF" uden validate varer. Man kan ikke "locke" "Generer PDF knappen" uden at have et step imellem)
	</Step>
</Stepper>
