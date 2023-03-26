<script lang="ts">
  import { encrypt } from '$lib/encryption';
  import { sleep } from '$lib/sleep';

  const maxPlaintextLength = 120;

  let isSubmitting = false;
  let password = '';
  let plaintext = '';
  let ciphertext: string | undefined;

  const handleSubmit = async () => {
    isSubmitting = true;

    try {
      [, ciphertext] = await Promise.all([
        sleep(1000),
        encrypt({ password, plaintext })
      ]);
    } finally {
      isSubmitting = false;
    }
  };

  $: isFormValid = password && plaintext;
  $: decryptUrl =
    ciphertext &&
    `${location.origin}/decrypt/${encodeURIComponent(ciphertext)}`;
</script>

<form on:submit={handleSubmit}>
  <fieldset disabled={isSubmitting}>
    <label for="password-input">Password</label>
    <input id="password-input" type="password" bind:value={password} />

    <label for="plaintext-input">Plaintext</label>
    <textarea id="plaintext-input" bind:value={plaintext} />
    <div class="max-length-progress">
      <progress value={plaintext.length} max={maxPlaintextLength} />

      {#if plaintext.length >= maxPlaintextLength}
        <small>Plaintext too large!</small>
      {/if}
    </div>

    <input disabled={!isFormValid} type="submit" value="Encrypt" />
  </fieldset>
</form>

{#if decryptUrl}
  <div>
    Here's your encrypted ciphertext:

    <pre>{ciphertext}</pre>

    Copy{' '}<a href={decryptUrl}> this link</a> and use it to later decrypt the
    ciphertext using the same password.
  </div>
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
    margin-bottom: 20px;
  }

  input[type='submit'] {
    font-size: 24px;
  }

  textarea {
    min-height: 200px;
    resize: none;
    width: 100%;
  }

  pre {
    white-space: normal;
    word-break: break-word;
  }

  .max-length-progress {
    align-items: center;
    display: flex;
  }

  .max-length-progress progress {
    margin-right: 8px;
    margin-bottom: 20px;
  }
</style>
