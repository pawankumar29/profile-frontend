import axios from 'axios'

export const PROFILE_API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_PROFILE_BACKEND_URL ||
  ''

export const CHAT_API_BASE =
  import.meta.env.VITE_CHAT_SERVICE_URL ||
  ''

export const SOCKET_IO_PATH =
  import.meta.env.VITE_SOCKET_IO_PATH ||
  '/socket.io'

const SOCKET_IO_TRANSPORTS = (import.meta.env.VITE_SOCKET_IO_TRANSPORTS || 'polling')
  .split(',')
  .map((transport) => transport.trim())
  .filter(Boolean)

export const PAYMENT_API_BASE =
  import.meta.env.VITE_PAYMENT_SERVICE_URL ||
  '/payment'

const PROFILE_API_KEY = import.meta.env.VITE_PROFILE_API_KEY || ''
const CHAT_API_KEY = import.meta.env.VITE_CHAT_API_KEY || ''
const PAYMENT_API_KEY = import.meta.env.VITE_PAYMENT_API_KEY || ''

const buildHeaders = async (apiKey, headers = {}) => {
  const nextHeaders = { ...headers }

  if (apiKey) {
    nextHeaders['x-api-key'] = apiKey
  }

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

const attachAuthInterceptor = (client, apiKey) => {
  client.interceptors.request.use(async (config) => {
    config.headers = await buildHeaders(apiKey, config.headers || {})
    return config
  })
}

attachAuthInterceptor(profileHttp, PROFILE_API_KEY)
attachAuthInterceptor(chatHttp, CHAT_API_KEY)
attachAuthInterceptor(paymentHttp, PAYMENT_API_KEY)

export const withProfileAuth = (headers = {}) => buildHeaders(PROFILE_API_KEY, headers)
export const withChatAuth = (headers = {}) => buildHeaders(CHAT_API_KEY, headers)
export const withPaymentAuth = (headers = {}) => buildHeaders(PAYMENT_API_KEY, headers)
export const getSocketAuth = () => ({})
export const getSocketOptions = () => ({
  auth: getSocketAuth(),
  path: SOCKET_IO_PATH,
  transports: SOCKET_IO_TRANSPORTS,
  timeout: 10000,
})
