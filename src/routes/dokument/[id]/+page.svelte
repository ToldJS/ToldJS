<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { formatBytes } from '$lib/format';
	import Loading from '$lib/components/Loading.svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	let finalPdfs: { url: string; size: string }[] | null = null;
	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 3000)); // The loading screen is too fast, so we add a delay xDD
		if (!data.document) return;

		const packageInfo = data.document.data;

		let pdfs = [];
		const templatePdfBuffer = await fetch('/Enhedsdokument.pdf').then((res) => res.arrayBuffer());

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
				url: window.URL.createObjectURL(blob),
				size: formatBytes(blob.size)
			});
		}
		finalPdfs = pdfs;
	});
</script>

<svelte:head>
	<title>Gemt Dokument - ToldJS</title>
	<script src="https://unpkg.com/pdf-lib/dist/pdf-lib.js"></script>
</svelte:head>

{#if data.document}
	{#if finalPdfs}
		<div in:fade class="space-y-4">
			<h1>Enhedsdokument{data.document.data.length > 1 ? 'er' : ''}</h1>
			<time>Gemt {data.document.created_at}</time>
			{#each data.document.data as item, i}
				<div class="card">
					<div class="p-4 space-y-4">
						<h3>{item.desc}</h3>
						<p>{item['packageInfo']['Text-LETnSee-lw']}</p>
						<a
							class="unstyled download-button"
							href={finalPdfs[i].url}
							download="Enhedsdokument.pdf"
						>
							<div class="download-primary variant-filled-primary">
								<span class="bi bi-cloud-arrow-down" />
								Download PDF
							</div>
							<div class="download-secondary">
								<span class="bi bi-download" />
								Size: {finalPdfs[i].size}
							</div>
						</a>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<Loading />
	{/if}
{:else}
	<div class="text-center space-y-4">
		<h1>Ugyldigt dokument</h1>
		<p>Dokumentet blev ikke fundet eller du har ikke adgang til det.</p>
	</div>
{/if}

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
