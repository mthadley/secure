export const IV_LENGTH = 32;
export const SALT_LENGTH = 16;

const deriveKey = async (
  password: string,
  usage:
    | { use: 'encrypt' }
    | {
        use: 'decrypt';
        salt: Uint8Array;
      }
): Promise<{ key: CryptoKey; salt: Uint8Array }> => {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt =
    usage.use === 'decrypt'
      ? usage.salt
      : crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 1000 },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    [usage.use]
  );

  return { key, salt };
};

export const encrypt = async ({
  password,
  plaintext
}: {
  password: string;
  plaintext: string;
}): Promise<string> => {
  const wrappedPlaintext = JSON.stringify({ plaintext });

  const { key, salt } = await deriveKey(password, { use: 'encrypt' });
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(wrappedPlaintext)
  );

  return btoa(
    String.fromCharCode(...[...salt, ...iv, ...new Uint8Array(ciphertext)])
  );
};

export type DecryptionResult =
  | { success: false; reason: 'decryption-failed' | 'invalid-payload' }
  | { success: true; plaintext: string };

export const decrypt = async ({
  password,
  ciphertextBlob
}: {
  password: string;
  ciphertextBlob: string;
}): Promise<DecryptionResult> => {
  const binaryBlob = new Uint8Array(
    atob(ciphertextBlob)
      .split('')
      .map((char) => char.charCodeAt(0))
  );

  const salt = binaryBlob.slice(0, SALT_LENGTH);
  const iv = binaryBlob.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = binaryBlob.slice(SALT_LENGTH + IV_LENGTH);

  const { key } = await deriveKey(password, { use: 'decrypt', salt });

  let plaintextBuffer: ArrayBuffer;

  try {
    plaintextBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
  } catch {
    return { success: false, reason: 'decryption-failed' };
  }

  const possiblePlaintextWrapper = new TextDecoder().decode(plaintextBuffer);

  try {
    const plaintextWrapper = JSON.parse(possiblePlaintextWrapper);

    if (
      'plaintext' in plaintextWrapper &&
      typeof plaintextWrapper.plaintext === 'string'
    ) {
      return { success: true, plaintext: plaintextWrapper.plaintext };
    }
  } catch {
    // Ignore error and fall-through to error case below.
  }

  return { success: false, reason: 'invalid-payload' };
};
