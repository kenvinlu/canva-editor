import { MetadataRoute } from "next";

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
  return 'https://github.com/kenvinlu/canva-editor';
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

export const getGoogleAnalyticsId = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';
};

// =========================PUBLIC ENVS==============================
export const getDefaultLocale = (): string => {
  return process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';
};

export const getUnsplashAccessKey = (): string => {
  return process.env.NEXT_PUBLIC_UNSPLASH_KEY || '';
};

export const getManifest = (icons: MetadataRoute.Manifest["icons"] = []): MetadataRoute.Manifest => {
  return {
    name: process.env.MANIFEST_NAME || "Canva Clone",
    short_name: process.env.MANIFEST_SHORT_NAME || "Canva Clone",
    description: process.env.MANIFEST_DESCRIPTION || "Canva Clone, Graphic design tool, Online design software, React design app, Canva alternative, Responsive design, Drag-and-drop design, Collaboration in design, User-friendly design tool, SEO-friendly design, Social media graphics tool, JavaScript design tool, Canva-like editor, Canva-inspired design, Canva-style graphics, Canva alternative for React",
    start_url: process.env.MANIFEST_START_URL || "/",
    display: (process.env.MANIFEST_DISPLAY as MetadataRoute.Manifest["display"]) || "standalone",
    background_color: process.env.MANIFEST_BACKGROUND_COLOR || "#ffffff",
    theme_color: process.env.MANIFEST_THEME_COLOR || "#000000",
    icons: icons,
    scope: "/",
    orientation: "portrait",
  };
};
