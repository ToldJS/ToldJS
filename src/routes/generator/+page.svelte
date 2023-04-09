<script lang="ts">
	import { CodeBlock, Step, Stepper, toastStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { ANDRE_LANDEKODER, HYPPIGE_LANDEKODER } from '../../data/landekoder';
	import { formatBytes } from '$lib/format';
	import { createPackageInfo } from '$lib/packageInfo';
	import { inputSchema } from '$lib/types/package';
	import { BarLoader } from 'svelte-loading-spinners';

	export let data: PageData;
	const CURRENCIES: string[] = Object.keys(data.currencies);

	let loadingPdf: boolean = false;
	let resultPdf: { item: string; url: string; size: string }[] | null = null;
	const emailTemplate = `Hej PostNord.

Jeg ønsker at selvfortolde min pakke med nr: XXXXXXXXX
Jeg vil også spørge om hvor lang tid det er muligt for jer at holde pakken, så jeg har bedst muligt tid til at få den fortoldet.

Mvh. NAVN`;

	let information: inputSchema = {
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
			fragtpris: '1',
			vægt: '1',
			vægtEnhed: 'kg',
			gave: false
		},
		varer: [
			{
				antal: 1,
				beskrivelse: '',
				varekode: 'xxxx',
				pris: '1'
			}
		]
	};

	let result = inputSchema.safeParse(information);
	$: result = inputSchema.safeParse(information);

	async function createPdf() {
		loadingPdf = true;
		resultPdf = null;

		const [packageInfo, errors] = await createPackageInfo(information);

		if (errors) {
			toastStore.trigger({
				message: errors.message,
				background: 'variant-filled-error',
				timeout: 5000
			});
			loadingPdf = false;
			return;
		}

		let pdfs = [];
		const templatePdfBuffer = await fetch('Enhedsdokument.pdf').then((res) => res.arrayBuffer());

		for (let i = 0; i < packageInfo.length; i++) {
			const packageInfoNth = packageInfo[i];
			const actualInfo = packageInfoNth['packageInfo'];

			// @ts-ignore
			const templatePdf = await window.PDFLib.PDFDocument.load(templatePdfBuffer);
			const form = templatePdf.getForm();

			let key: keyof typeof actualInfo;
			for (key in actualInfo) {
				const value = String(actualInfo[key]);
				form.getTextField(key).setText(value);
			}

			const finalPdfBytes = await templatePdf.save();
			var blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
			pdfs.push({
				item: packageInfoNth['desc'],
				url: window.URL.createObjectURL(blob),
				size: formatBytes(blob.size)
			});
		}
		resultPdf = pdfs;
		loadingPdf = false;
	}
</script>

<svelte:head>
	<title>Generator - ToldJS</title>
	<script src="https://unpkg.com/pdf-lib/dist/pdf-lib.js"></script>
</svelte:head>

<h1 class="mt-3">Tolddokuments generator</h1>
<Stepper
	on:complete={createPdf}
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
					{#each ANDRE_LANDEKODER.sort( (a, b) => (!a.Navn.containsAny( ['Æ', 'Å'] ) ? a.Navn.localeCompare(b.Navn) : 1) ) as country}
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
				type="text"
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
					type="text"
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
								type="text"
								class="input {!result.success &&
								result.error.format()?.varer?.[i]?.varekode?._errors
									? 'variant-filled-error'
									: ''}"
							/>
						</td>
						<td>
							<input
								bind:value={information.varer[i].pris}
								type="text"
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
									varekode: 'xxxx',
									pris: '1'
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
		{#if loadingPdf}
			<BarLoader color={"#30b7e2"} />
		{:else if resultPdf}
			{#each resultPdf as pdf}
				<h3 class="mb-2">{pdf.item}</h3>
				<a class="unstyled download-button" href={pdf.url} download="Enhedsdokument.pdf">
					<div class="download-primary variant-filled-primary">
						<span class="bi bi-cloud-arrow-down" />
						Download PDF
					</div>
					<div class="download-secondary">
						<span class="bi bi-download" />
						Size: {pdf.size}
					</div>
				</a>
			{/each}
		{:else}
			Nu er du klar til at lave din PDF. Tryk på knappen herunder for at lave PDF'en.
		{/if}
	</Step>
</Stepper>

<style>
	.download-button {
		height: 50px;
		display: inline-block;
		font-size: 20px;
		font-weight: 500;
		text-align: center;
		text-decoration: none;
		overflow: hidden;
	}
	.download-button .download-primary,
	.download-button .download-secondary {
		display: block;
		padding: 0 25px;
		line-height: 50px;
		transition: margin 0.4s;
	}
	.download-button:hover .download-primary {
		margin-top: -50px;
	}
</style>
