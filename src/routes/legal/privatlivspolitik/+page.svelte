<script lang="ts">
	import { TableOfContents } from "@skeletonlabs/skeleton";
    // den virker ved at scanne efter h2 og h3 tags i #content og laver en liste over dem.
    // h3 er så et underkapitel til h2'en.
</script>

<div class="grid grid-cols-4">
    <div class="col-span-3" id="content">
        <h1>Privatlivspolitik</h1>
        <h2>Introduktion</h2>
        <p>Et eller andet smart</p>
    </div>
    <aside class="col-span-1 sticky top-10 hidden xl:block space-y-4 w-72">
        <TableOfContents scrollParent="#body" target="#content" label="Indhold" />
    </aside>
</div>