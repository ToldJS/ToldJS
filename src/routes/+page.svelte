<svelte:head>
	<title>ToldJS</title>
</svelte:head>

<div class="flex flex-col items-center">
	<img src="/World-map-25.svg" class="absolute ml-10 my-6 hidden lg:block z-0" alt="" />
	<img src="/World-map-50.svg" class="absolute ml-10 my-6 dark:hidden lg:block z-0" alt="" />
	<div class="z-10 flex flex-col items-center">
		<div class="text-center mb-5 mx-3 ">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold pt-10 pb-3">Velkommen til ToldJS!</h1>
				<p class="pb-3">
					ToldJS er en hjemmeside, der hjælper med at udfylde dokumenterne til selvfortoldning. Men
					hvorfor selvfortolde? Det er for at undgå det transportgebyr som Postnord, og andre
					pålægger dig for at fortolde en pakke.
				</p>
				<a class="btn variant-filled-primary" href="/generator">Åben Generator</a>
			</div>
		</div>
		<div class="card variant-card max-w-screen-md m-5">
			<h1 class="text-3xl font-bold mt-5 text-center">Hvad er selvfortoldning?</h1>
			<p class="mx-5 my-3">
				At selvfortolde betyder at man selv udfylder de dokumenter der skal til for at fortolde en
				pakke. Når man har udfyldt dokumenterne afleverer man dem selv nede hos Toldstyrelsen. Det
				skal desværre ske fysisk.
			</p>
			<p class="mx-5 mb-5">
				Er det besværligt? Desværre er det normalt ret besværligt at selvfortolde, da den eneste
				guide der eksisterer er Toldstyrelsen egen guide. Denne guide har vi dog fundet misledende,
				så man ender med et forkert udfyldt dokument.
			</p>
		</div>
	</div>
</div>
