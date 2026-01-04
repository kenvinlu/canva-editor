import type { MetadataRoute } from 'next';
import { supportedLocales, defaultLocale } from '../i18n/config';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.canvaclone.com';

// Helper to build a localized URL respecting `localePrefix: 'as-needed'`
function getLocalizedUrl(path: string, locale: string): string {
  const cleanPath = path === '' ? '' : path.startsWith('/') ? path : `/${path}`;

  // Default locale without prefix
  if (locale === defaultLocale) {
    return `${APP_URL}${cleanPath || '/'}`;
  }

  // Other locales with prefix
  return `${APP_URL}/${locale}${cleanPath || ''}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Define base pages (paths without locale)
  const pageConfigs = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/pricing', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/templates', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/projects', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/docs', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.5 },
    { path: '/sign-in', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/sign-up', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/inbox', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/dashboard', changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  // For each base page, create one <url> entry per supported locale
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const config of pageConfigs) {
    for (const locale of supportedLocales) {
      sitemapEntries.push({
        url: getLocalizedUrl(config.path, locale),
        lastModified: now,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      });
    }
  }

  return sitemapEntries;
}


