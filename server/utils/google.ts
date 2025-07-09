import { google } from 'googleapis'

export function useGoogleOAuth() {
  const config = useRuntimeConfig(useEvent())
  const auth = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUrl
  )

  return auth
}
