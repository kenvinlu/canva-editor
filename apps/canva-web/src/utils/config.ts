import {
  getApiUrl,
  getDefaultLocale,
  getSecretCookiePassword,
  getNodeEnv,
  getGoogleOneTapClientId,
  getGoogleAnalyticsId,
  getNextApiUrl,
  getUnsplashAccessKey,
} from '@canva-web/config/Env';

const serverRuntimeConfig = {
  nodeEnv: getNodeEnv(),
  secretCookiePassword: getSecretCookiePassword(),
  apiUrl: getApiUrl(),
};

const publicRuntimeConfig = {
  nextApiUrl: getNextApiUrl(),
  defaultLocale: getDefaultLocale(),
  googleOneTapClientId: getGoogleOneTapClientId(),
  measurementId: getGoogleAnalyticsId(),
  unsplashAccessKey: getUnsplashAccessKey(),
};

export const {
  apiUrl,
  nextApiUrl,
  secretCookiePassword,
  defaultLocale,
  nodeEnv,
  googleOneTapClientId,
  measurementId,
  unsplashAccessKey
} = {
  ...serverRuntimeConfig,
  ...publicRuntimeConfig,
};

export const KEYS = {
  AUTH_COOKIE_KEY: 'user-session',
  USER_ID_KEY: 'user-id',
  AUTH_HEADER_TOKEN_KEY: 'Authorization',
};
