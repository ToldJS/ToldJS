<script>
	let searchString = '';
    let date = new Date();
    let dateStringReverse = date.toISOString().slice(0,10).replace(/-/g,"");
    let dateString = dateStringReverse.slice(6,8) + dateStringReverse.slice(4,6) + dateStringReverse.slice(0,4);

	$: searchLink = `https://tarif.skat.dk/arctictariff-public-web/#!/taric/nomenclature/sbt?sd=${dateString}&ts=${searchString}&gnd=true&add=false&fnd=false&ql=da&l=da`;
</script>

<input bind:value={searchString} type="text" class="input input-bordered" />
<a class="btn btn-primary" href={searchLink}>Søg</a>
