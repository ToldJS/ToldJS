<script lang="ts">
	import { createPackageInfo } from '$lib/packageInfo';
	import type { IApiResult } from '../../types/web';
	import type { PageData } from './$types';
	import { ANDRE_LANDEKODER, HYPPIGE_LANDEKODER } from '../../data/landekoder';
	import { formatBytes } from '$lib/format';
	import { stringContainsAny } from '$lib/utils';

	export let data: PageData;
	const CURRENCIES: string[] = Object.keys(data);
	const APIURL: string = 'https://parcelapi.super02.me/getParcel?tracking=';

	let isLoadingTracking: boolean = false;
	let isLoadingPdf: boolean = false;
	let error: string | undefined = undefined;
	let trackingNumber: string;
	let apiResult: IApiResult | undefined = undefined;
	let finalPdfs: { item: string; url: string; size: string }[] | undefined = undefined;

	let vareBeskrivelseData = [
		{
			antal: {
				value: 1,
				valid: true,
				hasValue: true
			},
			beskrivelse: {
				value: '',
				valid: false,
				hasValue: false
			},
			varekode: {
				value: '',
				valid: false,
				hasValue: false
			},
			pris: {
				value: '',
				valid: false,
				hasValue: false
			}
		}
	];

	$: vareBeskrivelseData.forEach((item) => {
		item.antal.valid = !isNaN(+item.antal.value) && item.antal.value > 0;
		item.beskrivelse.valid = item.beskrivelse.value.length > 0;
		item.beskrivelse.hasValue = item.beskrivelse.value.length > 0;
		item.varekode.valid = /^[0-9]*$/gm.test(item.varekode.value);
		item.varekode.hasValue = item.varekode.value.length > 0;
		item.pris.valid = /^[+-]?(\d*(\.|,))?\d+$/.test(item.pris.value);
		item.pris.hasValue = item.pris.value.length > 0;
	});

	let modtager_navn = { value: '', valid: false, hasValue: false };
	$: {
		modtager_navn.valid = modtager_navn.value.length > 0;
		modtager_navn.hasValue = modtager_navn.value.length > 0;
	}
	let modtager_adresse = { value: '', valid: false, hasValue: false };
	$: {
		modtager_adresse.valid = modtager_adresse.value.length > 0;
		modtager_adresse.hasValue = modtager_adresse.value.length > 0;
	}
	let afsender_navn = { value: '', valid: false, hasValue: false };
	$: {
		afsender_navn.valid = afsender_navn.value.length > 0;
		afsender_navn.hasValue = afsender_navn.value.length > 0;
	}
	let afsender_adresse = { value: '', valid: false, hasValue: false };
	$: {
		afsender_adresse.valid = afsender_adresse.value.length > 0;
		afsender_adresse.hasValue = afsender_adresse.value.length > 0;
	}
	let afsender_land = { value: '', valid: false, hasValue: false };
	$: {
		afsender_land.valid = afsender_land.value.length > 0;
		afsender_land.hasValue = afsender_land.value.length > 0;
	}
	let antal_pakker = { value: '1', valid: true, hasValue: true };
	$: {
		antal_pakker.valid = /^[\d]+$/.test(antal_pakker.value);
		antal_pakker.hasValue = antal_pakker.value.length > 0;
	}
	let valuta = { value: '', valid: false, hasValue: false };
	$: {
		valuta.valid = valuta.value.length > 0;
		valuta.hasValue = valuta.value.length > 0;
	}
	let transport_pris = { value: '', valid: false, hasValue: false };
	$: {
		transport_pris.valid = /^[+-]?(\d*(\.|,))?\d+$/.test(transport_pris.value);
		transport_pris.hasValue = transport_pris.value.length > 0;
	}
	let gave: boolean = false;
	let vaegt = { value: '', valid: false, hasValue: false };
	$: {
		vaegt.valid = /^[+-]?(\d*(\.|,))?\d+$/.test(vaegt.value);
		vaegt.hasValue = vaegt.value.length > 0;
	}
	let unit: 'kg' | 'lb' = 'kg';

	$: allFieldsFilled =
		modtager_navn.valid &&
		modtager_adresse.valid &&
		afsender_navn.valid &&
		afsender_adresse.valid &&
		afsender_land.valid &&
		antal_pakker.valid &&
		valuta.valid &&
		transport_pris.valid &&
		vaegt.valid &&
		vareBeskrivelseData.every(
			(item) => item.antal.valid && item.beskrivelse.valid && item.varekode.valid && item.pris.valid
		);

	async function parseTracking() {
		isLoadingTracking = true;

		// clear previous results
		error = undefined;
		apiResult = undefined;

		const trackingUrl = APIURL + trackingNumber;
		try {
			const response = await fetch(trackingUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Allow-Control-Allow-Origin': '*'
				}
			});

			const data = await response.json();
			if (data.error) {
				error = data.error;
				isLoadingTracking = false;
				return;
			}
			apiResult = data as IApiResult;
			if (apiResult.Sender) {
				afsender_navn['value'] = apiResult.Sender;
			}
			// if (apiResult.Origin) {
			// 	afsender_land = apiResult.Origin;
			// }
			// if (apiResult.Destination) {
			// 	modtager_land = apiResult.Destination;
			// }
			if (apiResult.Weight && apiResult.Weight != null) {
				vaegt['value'] = apiResult.Weight.toString();
			}
			if (apiResult.Unit) {
				unit = apiResult.Unit;
			}
		} catch (catchedError: any) {
			error = catchedError;
		}

		isLoadingTracking = false;
	}

	async function createPdf() {
		isLoadingPdf = true;
		finalPdfs = undefined;

		const [packageInfo, errors] = await createPackageInfo({
			trackingNumber, // same key / value
			modtagerNavn: modtager_navn.value,
			modtagerAdresse: modtager_adresse.value,
			afsenderNavn: afsender_navn.value,
			afsenderAdresse: afsender_adresse.value,
			afsenderLand: afsender_land.value,
			valuta: valuta.value, // same key / value
			fragtPris: transport_pris.value,
			gave, // same key / value
			vaegtEnhed: unit,
			vaegt: vaegt.value, // same key / value
			varer: vareBeskrivelseData
		});
		// @ts-ignore
		if (errors) {
			error = errors.message;
			isLoadingPdf = false;
			return;
		}

		let pdfs = [];
		const data = await fetch('Enhedsdokument.pdf').then((res) => res.arrayBuffer());

		for (let i = 0; i < packageInfo.length; i++) {
			const packageInfoNth = packageInfo[i];
			const actualInfo = packageInfoNth['packageInfo'];

			// @ts-ignore
			const doc = await window.PDFLib.PDFDocument.load(data);
			const form = doc.getForm();

			let key: keyof typeof actualInfo;
			for (key in actualInfo) {
				const value = String(actualInfo[key]);
				form.getTextField(key).setText(value);
			}

			const pdfBytes = await doc.save();
			var blob = new Blob([pdfBytes], { type: 'application/pdf' });
			pdfs.push({
				item: packageInfoNth['desc'],
				url: window.URL.createObjectURL(blob),
				size: formatBytes(blob.size)
			});
		}
		finalPdfs = pdfs;
		isLoadingPdf = false;
	}
</script>

<svelte:head>
	<title>Generator - ToldJS</title>
	<script src="https://unpkg.com/pdf-lib/dist/pdf-lib.js"></script>
</svelte:head>

<main>
	<div class="mb-10">
		{#if error}
			<div class="mb-8 alert alert-error shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/></svg
					>
					<span>{error}</span>
				</div>
				<div class="flex-none">
					<button
						on:click={() => {
							error = undefined;
						}}
						><svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						></button
					>
				</div>
			</div>
		{/if}
		<h1 class="mt-3">Tolddokuments generator</h1>
		<div class="grid gap-4 gap-y-2 grid-cols-1 md:grid-cols-6">
			<div class="md:col-span-6">
				<label for="tracking_number" class="label">Tracking nummer</label>
				<input
					on:keydown={(e) => {
						if (trackingNumber && e.code == 'Enter') parseTracking();
					}}
					bind:value={trackingNumber}
					type="text"
					id="tracking_number"
					placeholder="Tracking nummer"
					class="input input-bordered {trackingNumber ? 'input-success' : ''}"
				/>
				<button
					on:click={() => parseTracking()}
					disabled={!trackingNumber}
					class="btn btn-primary {isLoadingTracking ? 'loading' : ''}">Hent Info</button
				>
			</div>
			<div class="md:col-span-3">
				<div
					class="tooltip"
					data-tip="Navnet af pakkemodtageren, for eksempel dig selv. Det skal være modtagerens FULDE navn"
				>
					<label for="modtager_navn" class="label"
						>Modtagerens fulde navn <i class="ml-4 bi bi-info-circle" /></label
					>
				</div>
				<input
					bind:value={modtager_navn['value']}
					type="text"
					id="modtager_navn"
					placeholder="Modtagerens fulde navn"
					class="input input-bordered {modtager_navn.hasValue
						? 'input-success'
						: ''} w-full max-w-xs"
				/>
			</div>
			<div class="md:col-span-3">
				<div
					class="tooltip"
					data-tip="Adressen af pakkemodtageren, i formatet 'Vejnavn Husnummer, [Etagebetegnelse. ] [Dørbetegnelse, ] Bynavn, Postnummer, Postnummerområde'"
				>
					<label for="modtager_adresse" class="label"
						>Modtager adresse <i class="ml-4 bi bi-info-circle" /></label
					>
				</div>
				<input
					bind:value={modtager_adresse['value']}
					type="text"
					id="modtager_adresse"
					placeholder="Modtager adresse"
					class="input input-bordered {modtager_adresse.hasValue
						? 'input-success'
						: ''} w-full max-w-xs"
				/>
			</div>
			<div class="md:col-span-2">
				<label for="afsender_navn" class="label">Afsender navn</label>
				<input
					bind:value={afsender_navn['value']}
					type="text"
					id="afsender_navn"
					placeholder="Afsender navn"
					class="input input-bordered {afsender_navn.hasValue
						? 'input-success'
						: ''} w-full max-w-xs"
				/>
			</div>
			<div class="md:col-span-2">
				<label for="afsender_adresse" class="label">Afsender adresse</label>
				<input
					bind:value={afsender_adresse['value']}
					type="text"
					id="afsender_adresse"
					placeholder="Afsender adresse"
					class="input input-bordered {afsender_adresse.hasValue
						? 'input-success'
						: ''} w-full max-w-xs"
				/>
			</div>
			<div class="md:col-span-2">
				<label for="afsender_land" class="label">Afsender land</label>
				<select
					bind:value={afsender_land['value']}
					id="afsender_land"
					class="select select-bordered {afsender_land.hasValue
						? 'select-success'
						: ''} w-full max-w-xs"
				>
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
			</div>
			<div class="md:col-span-6">
				<h2>Varer</h2>
				<table class="table table-compact w-full">
					<thead>
						<tr>
							<th>Antal</th>
							<th>Vare beskrivelse</th>
							<th>Varekode</th>
							<th>Vare pris</th>
						</tr>
					</thead>
					<tbody>
						{#each [...Array(Object.keys(vareBeskrivelseData).length).keys()] as index}
							<tr>
								<td
									><input
										bind:value={vareBeskrivelseData[index]['antal']['value']}
										type="number"
										class="input input-bordered {vareBeskrivelseData[index]['antal'].hasValue
											? vareBeskrivelseData[index]['antal'].valid
												? 'input-success'
												: 'input-error'
											: ''} w-24"
									/></td
								>
								<td
									><input
										bind:value={vareBeskrivelseData[index]['beskrivelse']['value']}
										type="text"
										class="input input-bordered {vareBeskrivelseData[index]['beskrivelse'].hasValue
											? 'input-success'
											: ''}"
									/></td
								>
								<td
									><input
										bind:value={vareBeskrivelseData[index]['varekode']['value']}
										type="text"
										class="input input-bordered {vareBeskrivelseData[index]['varekode'].hasValue
											? vareBeskrivelseData[index]['varekode'].valid
												? 'input-success'
												: 'input-error'
											: ''}"
									/></td
								>
								<td
									><input
										bind:value={vareBeskrivelseData[index]['pris']['value']}
										type="text"
										class="input input-bordered {vareBeskrivelseData[index]['pris'].hasValue
											? vareBeskrivelseData[index]['pris'].valid
												? 'input-success'
												: 'input-error'
											: ''} w-24"
									/>
									<button
										on:click={() => {
											vareBeskrivelseData.splice(index, 1);
											vareBeskrivelseData = vareBeskrivelseData;
										}}
										on:keypress={() => {}}
										disabled={!(Object.keys(vareBeskrivelseData).length > 1)}
										class="ml-4 btn cursor-pointer"><i class="bi bi-x-lg" /></button
									>
								</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td />
							<td>
								<button
									on:click={() => {
										vareBeskrivelseData.push({
											antal: { value: 1, valid: true, hasValue: true },
											beskrivelse: { value: '', valid: false, hasValue: false },
											varekode: { value: '', valid: false, hasValue: false },
											pris: { value: '', valid: false, hasValue: false }
										});
										vareBeskrivelseData = vareBeskrivelseData;
									}}
									on:keypress={() => {}}
									class="btn gap-2"
								>
									<i class="text-xl text-primary bi bi-plus-circle" />
									Tilføj vare
								</button>
							</td>
							<td />
							<td />
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="md:col-span-4">
				<label for="transport_pris" class="label">Fragt pris</label>
				<input
					bind:value={transport_pris['value']}
					type="text"
					id="transport_pris"
					placeholder="Fragt pris"
					class="input input-bordered {transport_pris.hasValue
						? transport_pris.valid
							? 'input-success'
							: 'input-error'
						: ''} w-full max-w-xs"
				/>
			</div>
			<div class="md:col-span-2">
				<div
					class="tooltip"
					data-tip="Dette er valutaen af alle prisangivelser på hele siden; varepriser og fragt prisen."
				>
					<label for="valuta" class="label"
						>Valuta af priserne <i class="ml-4 bi bi-info-circle" /></label
					>
				</div>
				<select
					bind:value={valuta['value']}
					id="valuta"
					class="select select-bordered {valuta.hasValue ? 'select-success' : ''} w-full "
				>
					<option value="" disabled selected>Vælg valuta...</option>
					{#each CURRENCIES as currency}
						<option value={currency} selected={currency == 'USD'}>{currency}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-6">
				<label for="vaegt" class="label">Vægt i alt</label>
				<label class="input-group justify-mid">
					<input
						bind:value={vaegt['value']}
						type="text"
						id="vaegt"
						placeholder="Vægt i alt"
						class="input input-bordered {vaegt.hasValue
							? vaegt.valid
								? 'input-success'
								: 'input-error'
							: ''} w-full"
					/>
					<select
						bind:value={unit}
						class="select select-bordered {vaegt.hasValue
							? vaegt.valid
								? 'select-success'
								: 'select-error'
							: ''}"
					>
						<option value="kg" selected>KG</option>
						<option value="lb">LB</option>
					</select>
				</label>
			</div>
			<div class="md:col-span-1">
				<label class="label cursor-pointer flex-row items-center">
					<span class="label-text mb-1">Gave: </span>
					<input bind:checked={gave} type="checkbox" class="checkbox checkbox-primary m-1" />
				</label>
			</div>
			<div class="md:col-span-6">
				<button
					on:click={createPdf}
					disabled={!allFieldsFilled}
					class="btn btn-primary {isLoadingPdf ? 'loading' : ''}">Generer PDF</button
				>
				<h1 class="mt-8 text-3xl font-bold">Enhedsdokumenter</h1>
				{#if finalPdfs}
					{#each finalPdfs as pdf}
						<h3 class="mb-2">{pdf.item}</h3>
						<a
							class="face-button border-2 text-black border-primary"
							href={pdf.url}
							download="Enhedsdokument.pdf"
						>
							<div class="face-primary bg-primary">
								<span class="bi bi-cloud-arrow-down" />
								Download PDF
							</div>
							<div class="face-secondary text-primary">
								<span class="bi bi-download" />
								Size: {pdf.size}
							</div>
						</a>
					{/each}
				{:else}
					<p class="text-gray-500">
						Ingen enhedsdokumenter her. Udfyld felterne, og tryk på "Generer PDF".
					</p>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	.face-button {
		height: 50px;
		display: inline-block;
		font-size: 20px;
		font-weight: 500;
		text-align: center;
		text-decoration: none;
		overflow: hidden;
	}
	.face-button .face-primary,
	.face-button .face-secondary {
		display: block;
		padding: 0 25px;
		line-height: 50px;
		transition: margin 0.4s;
	}
	.face-button:hover .face-primary {
		margin-top: -50px;
	}
</style>
