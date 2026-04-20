const AUTH_TOKEN_KEY = 'profile_auth_token'
const USER_EMAIL_KEY = 'chat_user_email'
const USER_NAME_KEY = 'chat_user_name'
const USER_PHONE_KEY = 'chat_user_phone'
const USER_COUNTRY_KEY = 'chat_user_country'
const USER_IS_ADMIN_KEY = 'chat_user_is_admin'

const isBrowser = typeof window !== 'undefined'

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  const padded = padding ? normalized.padEnd(normalized.length + (4 - padding), '=') : normalized
  return window.atob(padded)
}

export const decodeJwtPayload = (token) => {
  if (!isBrowser || !token) return null

  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    return JSON.parse(decodeBase64Url(payload))
  } catch {
    return null
  }
}

export const isJwtExpired = (payload) => {
  if (!payload?.exp) return true
  return payload.exp * 1000 <= Date.now()
}

export const clearStoredAuth = () => {
  if (!isBrowser) return

  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(USER_EMAIL_KEY)
  sessionStorage.removeItem(USER_NAME_KEY)
  sessionStorage.removeItem(USER_PHONE_KEY)
  sessionStorage.removeItem(USER_COUNTRY_KEY)
  sessionStorage.removeItem(USER_IS_ADMIN_KEY)
}

export const getStoredAuthToken = () => {
  if (!isBrowser) return ''

  const token = sessionStorage.getItem(AUTH_TOKEN_KEY) || ''
  if (!token) return ''

  const payload = decodeJwtPayload(token)
  if (!payload || isJwtExpired(payload)) {
    clearStoredAuth()
    return ''
  }

  return token
}

export const getStoredAuthPayload = () => {
  const token = getStoredAuthToken()
  if (!token) return null
  return decodeJwtPayload(token)
}

export const storeAuthSession = ({ token, email, name, phone, country, isAdmin }) => {
  if (!isBrowser || !token) return

  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  if (email) sessionStorage.setItem(USER_EMAIL_KEY, email)
  if (typeof name === 'string') sessionStorage.setItem(USER_NAME_KEY, name)
  if (typeof phone === 'string') sessionStorage.setItem(USER_PHONE_KEY, phone)
  if (typeof country === 'string') sessionStorage.setItem(USER_COUNTRY_KEY, country)
  if (typeof isAdmin !== 'undefined') sessionStorage.setItem(USER_IS_ADMIN_KEY, String(isAdmin))
}

export const hasValidSession = () => !!getStoredAuthPayload()

export { AUTH_TOKEN_KEY, USER_EMAIL_KEY, USER_NAME_KEY, USER_PHONE_KEY, USER_COUNTRY_KEY, USER_IS_ADMIN_KEY }
