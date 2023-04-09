<script lang="ts">
	import { TableOfContents } from '@skeletonlabs/skeleton';
	// den virker ved at scanne efter h2 og h3 tags i .legal-content og laver en liste over dem.
	// h3 er så et underkapitel til h2'en.
</script>

<div class="flex items-start gap-10">
	<div class="legal-content">
        <h1>Privatlivspolitik</h1>
        <section class="space-y-4">
            <h2>Introduktion</h2>
            <p>Et eller andet smart</p>
            <h3>Formål</h3>
            <p>Formålet med dette</p>
            <h3>Personoplysninger</h3>
            <p>Hvilke oplysninger</p>
        </section>

        <section class="space-y-4">
            <h2>Kapitel 1</h2>
            <p>
                Ullamco proident sit ex officia Lorem excepteur voluptate laboris commodo et ullamco non.
                Aliqua reprehenderit aliqua adipisicing id nulla anim aute ullamco do esse incididunt. Ex
                irure magna culpa nostrud et dolore eu dolore sunt. Magna qui reprehenderit amet elit velit
                ullamco veniam magna ut ea proident do. Lorem deserunt consequat exercitation eu sint nisi
                pariatur deserunt magna elit sunt magna est quis. Proident Lorem id qui ex sit aliqua.
                Proident sunt nostrud velit tempor incididunt occaecat consectetur et culpa ullamco
                adipisicing laboris. Ullamco duis anim sit minim consectetur ex ad fugiat ad occaecat officia.
                Cupidatat irure eiusmod exercitation excepteur do eu ullamco irure id est commodo consectetur.
                Consectetur laboris aliqua veniam in est ipsum sit aliquip consectetur adipisicing labore
                dolor consectetur. In id laborum enim officia officia labore commodo sunt eu ex minim commodo
                voluptate. Ullamco sint excepteur nisi eu consectetur ipsum mollit ex laboris est do amet
                pariatur esse. Est duis officia anim reprehenderit aliqua incididunt et eu non excepteur.
                Eiusmod ipsum dolor culpa nulla nulla in elit cupidatat ex esse sint nostrud aute. Ullamco
                dolor eiusmod enim voluptate nostrud ex. Excepteur qui cupidatat pariatur Lorem sint nostrud
                do labore aliqua et. Amet id aute laboris excepteur nisi non magna occaecat consectetur. Dolor
                esse officia aliqua labore culpa commodo ut proident dolore id officia. Pariatur nostrud nulla
                excepteur tempor fugiat quis tempor magna fugiat velit. Culpa ullamco exercitation dolor quis
                nisi magna laboris. Laboris fugiat velit esse ut est ut amet. Laboris id labore enim sit
                labore anim voluptate. Laboris dolor aliqua eiusmod nulla ipsum tempor duis deserunt irure
                dolore laboris. Enim et veniam anim et do do aliquip minim commodo quis ea. Amet officia sit
                sit commodo proident enim voluptate occaecat anim dolore adipisicing fugiat sunt. Nostrud
                eiusmod adipisicing do do reprehenderit laboris ad nulla. Et laborum tempor cupidatat sit
                irure ex incididunt ipsum ea nostrud adipisicing ipsum ullamco. Ut exercitation exercitation
                eu cupidatat laborum Lorem pariatur sit Lorem do voluptate. Exercitation cupidatat in nisi
                duis deserunt eiusmod veniam duis cupidatat. Eu sint eu nostrud ea reprehenderit quis officia
                aliqua nulla sint nulla aute. Est excepteur consequat et labore proident sit dolore aute ut
                enim aliqua ut cupidatat duis. In Lorem velit amet duis. Fugiat Lorem exercitation sunt et
                dolore sit minim laboris. Et ex ea dolor reprehenderit non non voluptate. Aliquip occaecat
                exercitation eu reprehenderit aliquip laborum ipsum occaecat deserunt Lorem eu commodo
                reprehenderit. Occaecat quis duis ut esse commodo ipsum. Veniam laboris commodo veniam dolor
                cillum do elit. Proident adipisicing ea quis magna in dolor ad minim duis in labore anim
                aliquip. Magna tempor duis et dolore reprehenderit exercitation dolore velit voluptate aliqua.
                Culpa aute Lorem veniam dolore mollit non esse. Consequat do sint voluptate tempor est
                occaecat non ex anim laboris ipsum aliquip officia mollit. Eiusmod sint nostrud reprehenderit
                aliquip sunt ipsum esse cupidatat culpa. Ipsum fugiat et ea culpa excepteur occaecat sit velit
                sint. Lorem ex ad exercitation minim labore proident excepteur sunt sint deserunt laborum
                velit. Veniam ex voluptate anim commodo voluptate eu reprehenderit cillum. In qui ex sunt
                proident magna est eu dolore non laborum minim esse labore culpa.
            </p>
        </section>
	</div>
	<aside class="sticky hidden xl:block space-y-4 w-72">
		<TableOfContents target=".legal-content" label="Indhold" />
	</aside>
</div>
