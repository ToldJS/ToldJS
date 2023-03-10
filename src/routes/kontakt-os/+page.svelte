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

<form action="https://formsubmit.co/bf3a5850f13285e5dcae9ac19dd10980" method="POST">
	<div class="form-control m-5">
		<label class="input-group">
			<span class="bg-neutral">Email</span>
			<input
				bind:value={email['value']}
				name="Email"
				type="text"
				id="email"
				placeholder="john@doe.dk"
				class="input input-bordered {email.hasValue
					? email.valid
						? 'input-success'
						: 'input-error'
					: ''} w-full"
			/>
		</label>
	</div>
	<div class="form-control m-5">
		<label class="input-group">
			<span class="bg-neutral">Navn</span>
			<input
				bind:value={navn['value']}
				name="Name"
				type="text"
				id="navn"
				placeholder="John Doe"
				class="input input-bordered {navn.hasValue ? 'input-success' : ''} w-full"
			/>
		</label>
	</div>
	<div class="form-control m-5">
		<label class="label">
			<span class="label-text">Besked</span>
		</label>
		<textarea
			bind:value={besked['value']}
			name="Message"
			id="besked"
			placeholder="Skriv din besked her..."
			class="textarea textarea-bordered {besked.hasValue ? 'textarea-success' : ''} w-full h-24"
		/>
	</div>
	<div class="text-center">
		<button type="submit" disabled={!allFieldsFilled} class="btn btn-primary">Send besked </button>
	</div>
	<input type="hidden" name="_next" value="https://toldjs.dk" />
</form>
