import { defineRouting } from 'next-intl/routing';
import { supportedLocales, defaultLocale } from './config';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLocales as readonly string[],
  
  // Used when no locale matches
  defaultLocale: defaultLocale,
  
  // Only show locale prefix when needed (for default locale)
  localePrefix: 'as-needed'
});

