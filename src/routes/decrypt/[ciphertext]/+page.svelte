<script lang="ts">
  import { decrypt, type DecryptionResult } from '$lib/encryption';
  import { sleep } from '$lib/sleep';

  export let data;

  let isSubmitting = false;
  let password = '';
  let decryptionResult: DecryptionResult | undefined;

  const handleSubmit = async () => {
    isSubmitting = true;

    try {
      [, decryptionResult] = await Promise.all([
        sleep(1000),
        decrypt({ password, ciphertextBlob: data.ciphertextBlob })
      ]);
    } finally {
      isSubmitting = false;
    }
  };

  $: isFormValid = !!password;
</script>

<p>Enter the password associated with this encrypted payload to decrypt it.</p>

<form on:submit={handleSubmit}>
  <fieldset disabled={isSubmitting}>
    <label for="password-input">Password</label>
    <input id="password-input" type="password" bind:value={password} />

    <input disabled={!isFormValid} type="submit" value="Decrypt" />
  </fieldset>
</form>

{#if decryptionResult}
  {#if decryptionResult.success}
    <p>Here's the decrypted payload:</p>

    <pre>{decryptionResult.plaintext}</pre>
  {:else}
    <p>Decryption failed. Either the payload or password is invalid.</p>
  {/if}
{/if}

<style>
  fieldset {
    border: none;
    padding: 0;
  }

  label {
    display: block;
    margin-bottom: 12px;
  }

  input {
    display: block;
    margin-bottom: 20px;
  }

  input[type='submit'] {
    font-size: 24px;
  }
</style>
