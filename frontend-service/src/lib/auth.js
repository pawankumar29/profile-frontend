const USER_EMAIL_KEY = 'chat_user_email'
const USER_NAME_KEY = 'chat_user_name'
const USER_PHONE_KEY = 'chat_user_phone'
const USER_COUNTRY_KEY = 'chat_user_country'
const USER_IS_ADMIN_KEY = 'chat_user_is_admin'
const USER_AUTH_TOKEN_KEY = 'chat_auth_token'

const isBrowser = typeof window !== 'undefined'

export const storeAuthSession = ({ email, name, phone, country, isAdmin, authToken }) => {
  if (!isBrowser) return

  if (email) sessionStorage.setItem(USER_EMAIL_KEY, email)
  if (typeof name === 'string') sessionStorage.setItem(USER_NAME_KEY, name)
  if (typeof phone === 'string') sessionStorage.setItem(USER_PHONE_KEY, phone)
  if (typeof country === 'string') sessionStorage.setItem(USER_COUNTRY_KEY, country)
  if (typeof isAdmin !== 'undefined') sessionStorage.setItem(USER_IS_ADMIN_KEY, String(isAdmin))
  if (authToken) sessionStorage.setItem(USER_AUTH_TOKEN_KEY, authToken)
}

export const getStoredAuthToken = () => {
  if (!isBrowser) return ''
  return sessionStorage.getItem(USER_AUTH_TOKEN_KEY) || ''
}

export const hasStoredUserSession = () => {
  if (!isBrowser) return false
  return !!sessionStorage.getItem(USER_EMAIL_KEY) && !!getStoredAuthToken()
}

export {
  USER_EMAIL_KEY,
  USER_NAME_KEY,
  USER_PHONE_KEY,
  USER_COUNTRY_KEY,
  USER_IS_ADMIN_KEY,
  USER_AUTH_TOKEN_KEY,
}
