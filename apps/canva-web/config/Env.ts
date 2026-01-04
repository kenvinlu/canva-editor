export const getApiUrl = (): string => {
  return process.env.API_URL || '';
};
export const getNextApiUrl = (): string => {
  return (process.env.NEXT_PUBLIC_APP_URL || '') + '/api';
};
export const getSecretCookiePassword = (): string => {
  return process.env.SECRET_COOKIE_PASSWORD || '';
};

export const getHost = (): string => {
  return process.env.HOST || 'localhost';
};

export const getPort = (): number => {
  return parseInt(process.env.PORT || '3000', 10);
};

export const getNodeEnv = (): string => {
  return process.env.NODE_ENV || 'development';
};

export const getGithubUrl = (): string => {
  return 'https://github.com/canva-clone/canva-clone';
};

export const getDemoCredentials = (): { email: string; password: string } => {
  return {
    email: process.env.AUTH_DEMO_USERNAME || '',
    password: process.env.AUTH_DEMO_PASSWORD || '',
  };
};

export const getGoogleOneTapClientId = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT_ID || '';
};

export const getStripeSecretKey = (): string => {
  return process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '';
};

export const getStripePublishableKey = (): string => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
};

// =========================PUBLIC ENVS==============================
export const getDefaultLocale = (): string => {
  return process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';
};
