  <script lang="ts">
    import { sendEmail } from '$lib/sendEmail';
    $: allFieldsFilled =
		email.valid &&
		navn.valid &&
		besked.valid;

    let sendingMessage = false;
    let email = { value: '', valid: false, hasValue: false };
    $: {
      email.valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value);
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

    const sendbeskedenflyvendeafsted = async (event: MouseEvent): Promise<void> => {
      sendingMessage = true;
      await sendEmail(navn, email, besked);
    };

  </script>
  
  <div class="form-control m-5">
    <label class="input-group">
      <span class="bg-neutral">Email</span>
      <input 
      bind:value={email['value']}
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
      type="text" 
      id="navn"
      placeholder="John Doe" 
      class="input input-bordered {navn.hasValue
        ? 'input-success'
        : ''} w-full"
        />
    </label>
  </div>
  <div class="form-control m-5">
    <label class="label">
      <span class="label-text">Besked</span>
    </label>
    <textarea
    bind:value={besked['value']}
    id="besked"
    placeholder="Skriv din besked her..."
    class="textarea textarea-bordered {besked.hasValue
      ? 'textarea-success'
      : ''} w-full h-24"
    />
  </div>
  <div class="text-center">
    <button 
    on:click={sendbeskedenflyvendeafsted}
    disabled={!allFieldsFilled}
    class="btn btn-primary {sendingMessage ? 'loading' : ''}">Send besked
  </button>
  </div>