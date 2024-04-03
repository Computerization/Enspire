import { getRandomValues, subtle } from 'uncrypto'

interface Encrypted {
  cipherText: ArrayBuffer
  iv: Uint8Array
}

async function deriveKey(password: string) {
  const algo = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: new TextEncoder().encode('a-unique-salt'),
    iterations: 1000,
  }
  return subtle.deriveKey(algo, await subtle.importKey('raw', new TextEncoder().encode(password), {
    name: algo.name,
  }, false, ['deriveKey']), {
    name: 'AES-GCM',
    length: 256,
  }, false, ['encrypt', 'decrypt'])
}

export async function encrypt(text: string, password: string): Promise<Encrypted> {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: getRandomValues(new Uint8Array(12)),
  }
  return {
    cipherText: await subtle.encrypt(algo, await deriveKey(password), new TextEncoder().encode(text)),
    iv: algo.iv,
  }
}

export async function decrypt(encrypted: Encrypted, password: string) {
  console.log("Called")
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: encrypted.iv,
  }
  return new TextDecoder().decode(await subtle.decrypt(algo, await deriveKey(password), encrypted.cipherText))
}
