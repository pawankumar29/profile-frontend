import { getStoredAuthToken } from './auth'

const ENCRYPTED_AUTH_HEADER = 'x-client-auth'
const PUBLIC_KEY_PEM = import.meta.env.VITE_AUTH_PUBLIC_KEY || ''
const ENCRYPTED_AUTH_TTL_MS = Number(import.meta.env.VITE_ENCRYPTED_AUTH_TTL_MS || 300000)

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

const encodeBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const value of bytes) {
    binary += String.fromCharCode(value)
  }
  return window.btoa(binary)
}

export const getEncryptedAuthHeaderName = () => ENCRYPTED_AUTH_HEADER

export const buildEncryptedAuthHeaders = async (headers = {}) => {
  const nextHeaders = { ...headers }
  const token = getStoredAuthToken()

  if (!token) {
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

  nextHeaders[ENCRYPTED_AUTH_HEADER] = encodeBase64(encrypted)
  delete nextHeaders.Authorization
  return nextHeaders
}
