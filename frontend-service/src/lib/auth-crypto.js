import { getStoredAuthToken } from './auth'

const ENCRYPTED_AUTH_HEADER = 'x-client-auth'
const SHARED_SECRET = import.meta.env.VITE_AUTH_SHARED_SECRET || import.meta.env.VITE_AUTH_ENCRYPTION_KEY || ''
const PUBLIC_KEY_PEM = import.meta.env.VITE_AUTH_PUBLIC_KEY || ''
const ENCRYPTED_AUTH_TTL_MS = Number(import.meta.env.VITE_ENCRYPTED_AUTH_TTL_MS || 300000)

const toBase64Url = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }
  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }
  return window.btoa(binary)
}

const hexToBytes = (hex) => {
  const normalized = hex.trim()
  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error('VITE_AUTH_SHARED_SECRET must be a 64-char hex (32 bytes) or any string')
  }

  const bytes = new Uint8Array(32)
  for (let index = 0; index < 32; index += 1) {
    bytes[index] = Number.parseInt(normalized.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

const pemToArrayBuffer = (pem) => {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s+/g, '')

  if (!base64) {
    throw new Error('VITE_AUTH_PUBLIC_KEY is missing or invalid')
  }

  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes.buffer
}

let cachedPublicKeyPromise
let cachedAesKeyPromise

const getPublicKey = async () => {
  if (!PUBLIC_KEY_PEM) return null

  if (!cachedPublicKeyPromise) {
    cachedPublicKeyPromise = window.crypto.subtle.importKey(
      'spki',
      pemToArrayBuffer(PUBLIC_KEY_PEM),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt'],
    )
  }

  return cachedPublicKeyPromise
}

const getAesKey = async () => {
  if (!SHARED_SECRET) return null

  if (!cachedAesKeyPromise) {
    cachedAesKeyPromise = (async () => {
      const trimmed = String(SHARED_SECRET).trim()

      let keyBytes
      if (/^[0-9a-f]{64}$/i.test(trimmed)) {
        keyBytes = hexToBytes(trimmed)
      } else {
        const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(trimmed))
        keyBytes = new Uint8Array(digest)
      }

      return window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['encrypt'],
      )
    })()
  }

  return cachedAesKeyPromise
}

export const getEncryptedAuthHeaderName = () => ENCRYPTED_AUTH_HEADER

export const buildEncryptedAuthHeaders = async (headers = {}) => {
  const nextHeaders = { ...headers }
  const token = getStoredAuthToken()

  if (!token) {
    return nextHeaders
  }

  const aesKey = await getAesKey()
  if (aesKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const payload = JSON.stringify({
      token,
      timestamp: Date.now(),
      expiresAt: Date.now() + ENCRYPTED_AUTH_TTL_MS,
    })

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      new TextEncoder().encode(payload),
    )

    nextHeaders[ENCRYPTED_AUTH_HEADER] = `v1.${toBase64Url(iv)}.${toBase64Url(encrypted)}`
    delete nextHeaders.Authorization
    return nextHeaders
  }

  const publicKey = await getPublicKey()
  if (!publicKey) {
    nextHeaders.Authorization = `Bearer ${token}`
    return nextHeaders
  }

  const payload = JSON.stringify({
    token,
    timestamp: Date.now(),
    expiresAt: Date.now() + ENCRYPTED_AUTH_TTL_MS,
  })

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    new TextEncoder().encode(payload),
  )

  nextHeaders[ENCRYPTED_AUTH_HEADER] = toBase64(encrypted)
  delete nextHeaders.Authorization
  return nextHeaders
}
