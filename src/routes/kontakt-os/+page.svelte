<script lang="ts">
	$: allFieldsFilled = email.valid && navn.valid && besked.valid;

	let email = { value: '', valid: false, hasValue: false };
	$: {
		email.valid =
			/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
				email.value
			);
		email.hasValue = email.value.length > 0;
	}
	let navn = { value: '', valid: false, hasValue: false };
	$: {
		navn.valid = navn.value.length > 0;
		navn.hasValue = navn.value.length > 0;
	}
	let besked = { value: '', valid: false, hasValue: false };
	$: {
		besked.valid = besked.value.length > 0;
		besked.hasValue = besked.value.length > 0;
	}
</script>

<div class="alert shadow-lg">
	<div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="stroke-current flex-shrink-0 w-6 h-6"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>Kontakt os på mail</span> <a href="mailto:kontakt@toldjs.dk"> kontakt@toldjs.dk</a>
		<span> eller ved brug af formularen</span>
	</div>
</div>

<form action="https://formsubmit.co/bf3a5850f13285e5dcae9ac19dd10980" method="POST">
	<label class="label">
		<span>Email</span>
		<input
			bind:value={email['value']}
			name="Email"
			type="text"
			id="email"
			placeholder="john@doe.dk"
			class="input {email.hasValue ? (email.valid ? 'input-success' : 'input-error') : ''}"
		/>
	</label>
	<label class="label">
		<span>Navn</span>
		<input
			bind:value={navn['value']}
			name="Name"
			type="text"
			id="navn"
			placeholder="John Doe"
			class="input {navn.hasValue ? 'input-success' : ''}"
		/>
	</label>
	<label class="label">
		<span>Besked</span>
		<textarea
			bind:value={besked['value']}
			name="Message"
			id="besked"
			placeholder="Skriv din besked her..."
			class="textarea textarea-bordered {besked.hasValue ? 'textarea-success' : ''}"
		/>
	</label>
	<div class="text-center">
		<button type="submit" disabled={!allFieldsFilled} class="btn variant-filled-primary"
			>Send besked
		</button>
	</div>
	<input type="hidden" name="_next" value="https://toldjs.dk/kontakt-os/sendt" />
</form>
