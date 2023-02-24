<script lang="ts">
	import { createPackageInfo } from '$lib/packageInfo';
	import type { IApiResult } from '../types/web';
	import type { PageData } from './$types';
	import { LANDEKODER } from '../data/landekoder';
	import { formatBytes } from '$lib/format';

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
			pris: {
				value: '',
				valid: false,
				hasValue: false
			},
		}
	];
	
	$: vareBeskrivelseData.forEach((item) => {
		item.antal.valid = !isNaN(+item.antal.value) && item.antal.value > 0;
		item.beskrivelse.valid = item.beskrivelse.value.length > 0; item.beskrivelse.hasValue = item.beskrivelse.value.length > 0;
		item.pris.valid = /^[+-]?(\d*(\.|,))?\d+$/.test(item.pris.value); item.pris.hasValue = item.pris.value.length > 0;
	});

	let modtager_navn = {value: '', valid: false, hasValue: false};
	$: {modtager_navn.valid = modtager_navn.value.length > 0; modtager_navn.hasValue = modtager_navn.value.length > 0};
	let modtager_adresse = {value: '', valid: false, hasValue: false};
	$: {modtager_adresse.valid = modtager_adresse.value.length > 0; modtager_adresse.hasValue = modtager_adresse.value.length > 0};
	let afsender_navn = {value: '', valid: false, hasValue: false};
	$: {afsender_navn.valid = afsender_navn.value.length > 0; afsender_navn.hasValue = afsender_navn.value.length > 0};
	let afsender_adresse = {value: '', valid: false, hasValue: false};
	$: {afsender_adresse.valid = afsender_adresse.value.length > 0; afsender_adresse.hasValue = afsender_adresse.value.length > 0};
	let afsender_land = {value: '', valid: false, hasValue: false};
	$: {afsender_land.valid = afsender_land.value.length > 0; afsender_land.hasValue = afsender_land.value.length > 0};
	let varekode = {value: '', valid: false, hasValue: false};
	$: {varekode.valid = varekode.value.length > 0; varekode.hasValue = varekode.value.length > 0};
	let antal_pakker = {value: '1', valid: true, hasValue: true};
	$: {antal_pakker.valid = /^[\d]+$/.test(antal_pakker.value); antal_pakker.hasValue = antal_pakker.value.length > 0};
	let valuta = {value: '', valid: false, hasValue: false};
	$: {valuta.valid = valuta.value.length > 0; valuta.hasValue = valuta.value.length > 0};
	let transport_pris = {value: '', valid: false, hasValue: false};
	$: {transport_pris.valid = /^[+-]?(\d*(\.|,))?\d+$/.test(transport_pris.value); transport_pris.hasValue = transport_pris.value.length > 0};
	let gave: boolean = false;
	let vaegt = {value: '', valid: false, hasValue: false};
	$: {vaegt.valid = /^[+-]?(\d*(\.|,))?\d+$/.test(vaegt.value); vaegt.hasValue = vaegt.value.length > 0};
	let unit: 'kg' | 'lb' = 'kg';

	$: allFieldsFilled =
		modtager_navn.valid &&
		modtager_adresse.valid &&
		afsender_navn.valid &&
		afsender_adresse.valid &&
		afsender_land.valid &&
		varekode.valid &&
		antal_pakker.valid &&
		valuta.valid &&
		transport_pris.valid &&
		vaegt.valid &&
		vareBeskrivelseData.every((item) => item.antal.valid && item.beskrivelse.valid && item.pris.valid);

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
			if (apiResult.Weight) {
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
			vareKode: varekode.value,
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
		const data = await fetch('Enhedsdokument_6_7.pdf').then((res) => res.arrayBuffer());

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

		<div class="flex flex-row items-center">
			<div class="flex flex-row items-center">
				<input
					on:keydown={(e) => {
						if (trackingNumber && e.code == 'Enter') parseTracking();
					}}
					bind:value={trackingNumber}
					type="text"
					placeholder="Tracking number"
					class="input input-bordered {trackingNumber ? 'input-success' : ''} w-full max-w-xs"
				/>
				<button
					on:click={() => parseTracking()}
					disabled={!trackingNumber}
					class="btn btn-primary {isLoadingTracking ? 'loading' : ''}">Get info</button
				>
			</div>
		</div>
		<div class="m-2 max-w-md">
			{#if apiResult}
				<div class="stats">
					<div class="stat">
						<div class="stat-title">Sender</div>
						<div class="stat-value text-primary">{apiResult.Sender}</div>
					</div>
					<div class="stat">
						<div class="stat-title">Origin</div>
						<div class="stat-value text-primary">{apiResult.Origin}</div>
					</div>
					<div class="stat">
						<div class="stat-title">Destination</div>
						<div class="stat-value text-primary">{apiResult.Destination}</div>
					</div>
				</div>
			{/if}
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={modtager_navn['value']}
				type="text"
				placeholder="Modtager navn"
				class="input input-bordered {modtager_navn.hasValue ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={modtager_adresse['value']}
				type="text"
				placeholder="Modtager adresse"
				class="input input-bordered {modtager_adresse.hasValue ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={afsender_navn['value']}
				type="text"
				placeholder="Afsender navn"
				class="input input-bordered {afsender_navn.hasValue ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={afsender_adresse['value']}
				type="text"
				placeholder="Afsender adresse"
				class="input input-bordered {afsender_adresse.hasValue ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<select
				bind:value={afsender_land['value']}
				class="select select-bordered {afsender_land.hasValue ? 'select-success' : ''} w-full max-w-xs"
			>
				<option value="" disabled selected>Vælg afsender landet</option>
				{#each LANDEKODER as country}
					<option value={country['Kode'] + '__' + country['Navn']}>{country['Navn']}</option>
				{/each}
			</select>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={antal_pakker['value']}
				type="text"
				placeholder="Antal pakker"
				class="input input-bordered {antal_pakker.hasValue
					? antal_pakker.valid
						? 'input-success'
						: 'input-error'
					: ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 overflow-x-auto">
			<h2>Varer</h2>
			<table class="table table-compact w-full">
				<thead>
					<tr>
						<th>Antal</th>
						<th>Vare beskrivelse</th>
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
									class="input input-bordered {vareBeskrivelseData[index]['beskrivelse'].hasValue ? 'input-success' : ''}"
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
								{#if Object.keys(vareBeskrivelseData).length > 1}
									<button
										on:click={() => {
											vareBeskrivelseData.splice(index, 1);
											vareBeskrivelseData = vareBeskrivelseData;
										}}
										on:keypress={() => {}}
										class="ml-4 btn cursor-pointer"><i class="bi bi-x-lg" /></button
									>
								{/if}
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
									vareBeskrivelseData.push({ antal: {value: 1, valid: true, hasValue: true}, beskrivelse: {value: '', valid: false, hasValue: false}, pris: {value: '', valid: false, hasValue: false} });
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
					</tr>
				</tfoot>
			</table>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={transport_pris['value']}
				type="text"
				placeholder="Transport værdi"
				class="input input-bordered {transport_pris.hasValue
					? transport_pris.valid
						? 'input-success'
						: 'input-error'
					: ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<select bind:value={valuta['value']} class="select select-bordered {valuta.hasValue ? 'select-success' : ''}">
				<option value="" disabled selected>Vælg valutaen for transport og pakke prisen</option>
				{#each CURRENCIES as currency}
					<option value={currency} selected={currency == 'USD'}>{currency}</option>
				{/each}
			</select>
		</div>
		<div class="m-2 min-w-md">
			<input
				bind:value={varekode['value']}
				type="text"
				placeholder="Varekode"
				class="input input-bordered {varekode.hasValue ? 'input-success' : ''} w-full max-w-md min-w-330"
			/>
		</div>
		<div class="form-control m-2 max-w-md">
			<label class="input-group w-full justify-mid">
				<input
					bind:value={vaegt['value']}
					type="text"
					placeholder="Vægt"
					class="input input-bordered {vaegt.hasValue
						? vaegt.valid
							? 'input-success'
							: 'input-error'
						: ''} max-w-xs"
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
		<div class="form-contro max-w-md">
			<label class="label cursor-pointer flex-row items-center">
				<span class="label-text mb-1">Gave: </span>
				<input bind:checked={gave} type="checkbox" class="checkbox checkbox-primary m-1" />
			</label>
		</div>
		<button
			on:click={createPdf}
			disabled={!allFieldsFilled}
			class="btn btn-primary {isLoadingPdf ? 'loading' : ''}">Opret PDF</button
		>
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
		{/if}
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
