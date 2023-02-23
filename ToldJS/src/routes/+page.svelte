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
	let error: string | undefined = 'Test';
	let trackingNumber: string;
	let apiResult: IApiResult | undefined = undefined;
	let finalPdf: { url: string; size: string } | undefined = undefined;
	let downloadBtn: HTMLAnchorElement | undefined = undefined;

	let vareBeskrivelseData = [
		{
			Name: 'Maria',
			'Favorite Subject': 'Math',
			Age: 14
		},
		{
			Name: 'Jose',
			'Favorite Subject': 'Science',
			Age: 13
		}
	];

	let beskrivelseHtml =
		'<div class="m-2 max-w-md"><inputbind:value={modtager_adresse}type="text"placeholder="Modtager adresse"class="input input-bordered {modtager_adresse ? "input-success" : ""} w-full max-w-xs"/></div>';

	let modtager_navn = '';
	let modtager_adresse = '';
	let afsender_navn = '';
	let afsender_adresse = '';
	let afsender_land = '';
	let varekode = '';
	let antal_pakker = '';
	let antal_varer = '';
	let vareBeskrivelse = '';
	let valuta = '';
	let pakke_pris = '';
	let transport_pris = '';
	let gave: boolean = false;
	let vaegt = '';
	let unit: 'kg' | 'lb' = 'kg';

	$: allFieldsFilled =
		valuta &&
		modtager_navn &&
		modtager_adresse &&
		afsender_navn &&
		afsender_adresse &&
		afsender_land &&
		varekode &&
		antal_pakker &&
		antal_varer &&
		pakke_pris &&
		transport_pris &&
		vaegt;

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
				afsender_navn = apiResult.Sender;
			}
			// if (apiResult.Origin) {
			// 	afsender_land = apiResult.Origin;
			// }
			// if (apiResult.Destination) {
			// 	modtager_land = apiResult.Destination;
			// }
			if (apiResult.Weight) {
				vaegt = apiResult.Weight.toString();
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
		finalPdf = undefined;

		const [packageInfo, errors] = await createPackageInfo({
			trackingNumber, // same key / value
			modtagerNavn: modtager_navn,
			modtagerAdresse: modtager_adresse,
			afsenderNavn: afsender_navn,
			afsenderAdresse: afsender_adresse,
			afsenderLand: afsender_land,
			vareKode: varekode,
			pakkerIAlt: antal_pakker,
			varerIAlt: antal_varer,
			valuta, // same key / value
			pakkePris: pakke_pris,
			fragtPris: transport_pris,
			gave, // same key / value
			vaegtEnhed: unit,
			vaegt // same key / value
		});
		// @ts-ignore
		if (errors) {
			error = errors.message;
			isLoadingPdf = false;
			return;
		}

		const data = await fetch('Enhedsdokument_6_7.pdf').then((res) => res.arrayBuffer());

		// @ts-ignore
		const doc = await window.PDFLib.PDFDocument.load(data);
		const form = doc.getForm();

		let key: keyof typeof packageInfo;
		for (key in packageInfo) {
			const value = String(packageInfo[key]);
			form.getTextField(key).setText(value);
		}

		const pdfBytes = await doc.save();
		var blob = new Blob([pdfBytes], { type: 'application/pdf' });
		finalPdf = {
			url: window.URL.createObjectURL(blob),
			size: formatBytes(blob.size)
		};
		downloadBtn?.scroll({ top: downloadBtn.scrollHeight, behavior: 'smooth' });
		isLoadingPdf = false;
	}
</script>

<svelte:head>
	<script src="https://unpkg.com/pdf-lib/dist/pdf-lib.js"></script>
</svelte:head>

<main>
	<div class="flex flex-col min-w-330 items-center mb-10">
		{#if error}
			<div class="alert alert-error shadow-lg">
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
				bind:value={modtager_navn}
				type="text"
				placeholder="Modtager navn"
				class="input input-bordered {modtager_navn ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={modtager_adresse}
				type="text"
				placeholder="Modtager adresse"
				class="input input-bordered {modtager_adresse ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={afsender_navn}
				type="text"
				placeholder="Afsender navn"
				class="input input-bordered {afsender_navn ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={afsender_adresse}
				type="text"
				placeholder="Afsender adresse"
				class="input input-bordered {afsender_adresse ? 'input-success' : ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<select
				bind:value={afsender_land}
				class="select select-bordered {afsender_land ? 'select-success' : ''} w-full max-w-xs"
			>
				<option value="" disabled selected>Vælg afsender landet</option>
				{#each LANDEKODER as country}
					<option value={country['Kode'] + '__' + country['Navn']}>{country['Navn']}</option>
				{/each}
			</select>
			<!-- <input
				bind:value={afsender_land}
				type="text"
				placeholder="Afsender land"
				class="input input-bordered {afsender_land ? 'input-success' : ''} w-full max-w-xs"
			/> -->
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={antal_varer}
				type="text"
				placeholder="Antal varer"
				class="input input-bordered {antal_varer
					? /^[\d]+$/.test(antal_varer)
						? 'input-success'
						: 'input-error'
					: ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={antal_pakker}
				type="text"
				placeholder="Antal pakker"
				class="input input-bordered {antal_pakker
					? /^[\d]+$/.test(antal_pakker)
						? 'input-success'
						: 'input-error'
					: ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 flex flex-row">
			<div class="overflow-x-auto flex-col">
				<table class="table w-full">
					<!-- head -->
					<thead>
						<tr class="flex flex-row">
							<th />
							<th>Vare beskrivelse</th>
							<button class="m-2 justify-end"
								><i class="text-xl text-primary fa-solid fa-circle-plus" /></button
							>
						</tr>
					</thead>
					<tbody>
						{#each Object.values(vareBeskrivelseData) as row}
							<tr>
								{#each Object.values(row) as cell}
									<td>{@html beskrivelseHtml}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={pakke_pris}
				type="text"
				placeholder="Pakke værdi"
				class="input input-bordered {pakke_pris
					? /^[+-]?(\d*(\.|,))?\d+$/.test(pakke_pris)
						? 'input-success'
						: 'input-error'
					: ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<input
				bind:value={transport_pris}
				type="text"
				placeholder="Transport værdi"
				class="input input-bordered {transport_pris
					? /^[+-]?(\d*(\.|,))?\d+$/.test(transport_pris)
						? 'input-success'
						: 'input-error'
					: ''} w-full max-w-xs"
			/>
		</div>
		<div class="m-2 max-w-md">
			<select bind:value={valuta} class="select select-bordered {valuta ? 'select-success' : ''}">
				<option value="" disabled selected>Vælg valutaen for transport og pakke prisen</option>
				{#each CURRENCIES as currency}
					<option value={currency} selected={currency == 'USD'}>{currency}</option>
				{/each}
			</select>
		</div>
		<div class="m-2 min-w-md">
			<input
				bind:value={varekode}
				type="text"
				placeholder="Varekode"
				class="input input-bordered {varekode ? 'input-success' : ''} w-full max-w-md min-w-330"
			/>
		</div>
		<div class="form-control m-2 max-w-md">
			<label class="input-group w-full justify-mid">
				<input
					bind:value={vaegt}
					type="text"
					placeholder="Vægt"
					class="input input-bordered {vaegt
						? /^[+-]?(\d*(\.|,))?\d+$/.test(vaegt)
							? 'input-success'
							: 'input-error'
						: ''} max-w-xs"
				/>
				<select
					bind:value={unit}
					class="select select-bordered {vaegt
						? /^[+-]?(\d*(\.|,))?\d+$/.test(vaegt)
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
		{#if finalPdf}
			<a
				bind:this={downloadBtn}
				class="mt-4 face-button border-2 text-black border-primary"
				href={finalPdf.url}
				download="Enhedsdokument.pdf"
			>
				<div class="face-primary bg-primary">
					<span class="fa-solid fa-cloud" />
					Download PDF
				</div>
				<div class="face-secondary text-primary">
					<span class="fa-solid fa-hdd-o" />
					Size: {finalPdf.size}
				</div>
			</a>
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
	.face-button .icon {
		margin-right: 5px;
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
