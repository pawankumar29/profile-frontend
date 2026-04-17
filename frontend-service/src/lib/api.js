import axios from 'axios'
import { getStoredAuthToken } from './auth'
import { buildEncryptedAuthHeaders } from './auth-crypto'

export const PROFILE_API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_PROFILE_BACKEND_URL ||
  'http://localhost:8009'

export const CHAT_API_BASE =
  import.meta.env.VITE_CHAT_SERVICE_URL ||
  'http://localhost:8010'

export const PAYMENT_API_BASE =
  import.meta.env.VITE_PAYMENT_SERVICE_URL ||
  'http://localhost:8011'

const PROFILE_API_KEY = import.meta.env.VITE_PROFILE_API_KEY || ''
const CHAT_API_KEY = import.meta.env.VITE_CHAT_API_KEY || ''
const PAYMENT_API_KEY = import.meta.env.VITE_PAYMENT_API_KEY || ''

const buildHeaders = async (apiKey, headers = {}, useEncryptedAuth = false) => {
  const nextHeaders = { ...headers }
  const token = getStoredAuthToken()

  if (token) {
    if (useEncryptedAuth) {
      const encryptedHeaders = await buildEncryptedAuthHeaders(nextHeaders)
      if (apiKey) {
        encryptedHeaders['x-api-key'] = apiKey
      }
      return encryptedHeaders
    }

    nextHeaders.Authorization = `Bearer ${token}`
  }

  if (!apiKey) {
    return nextHeaders
  }

  nextHeaders['x-api-key'] = apiKey
  return nextHeaders
}

export const profileHttp = axios.create({
  baseURL: PROFILE_API_BASE,
})

export const chatHttp = axios.create({
  baseURL: CHAT_API_BASE,
})

export const paymentHttp = axios.create({
  baseURL: PAYMENT_API_BASE,
})

const attachAuthInterceptor = (client, apiKey, useEncryptedAuth = false) => {
  client.interceptors.request.use(async (config) => {
    config.headers = await buildHeaders(apiKey, config.headers || {}, useEncryptedAuth)
    return config
  })
}

attachAuthInterceptor(profileHttp, PROFILE_API_KEY, true)
attachAuthInterceptor(chatHttp, CHAT_API_KEY)
attachAuthInterceptor(paymentHttp, PAYMENT_API_KEY)

export const withProfileAuth = (headers = {}) => buildHeaders(PROFILE_API_KEY, headers, true)
export const withChatAuth = (headers = {}) => buildHeaders(CHAT_API_KEY, headers)
export const withPaymentAuth = (headers = {}) => buildHeaders(PAYMENT_API_KEY, headers)
export const getSocketAuth = () => {
  const token = getStoredAuthToken()
  return token ? { token } : {}
}
