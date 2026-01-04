import {
  getApiUrl,
  getDefaultLocale,
  getSecretCookiePassword,
  getNodeEnv,
  getGoogleOneTapClientId,
  getStripeSecretKey,
  getStripePublishableKey,
  getNextApiUrl,
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
  stripeSecretKey: getStripeSecretKey(),
  stripePublishableKey: getStripePublishableKey(),
};

export const {
  apiUrl,
  nextApiUrl,
  secretCookiePassword,
  defaultLocale,
  nodeEnv,
  googleOneTapClientId,
  stripePublishableKey,
} = {
  ...serverRuntimeConfig,
  ...publicRuntimeConfig,
};

export const KEYS = {
  AUTH_COOKIE_KEY: 'user-session',
  USER_ID_KEY: 'user-id',
  AUTH_HEADER_TOKEN_KEY: 'Authorization',
};
