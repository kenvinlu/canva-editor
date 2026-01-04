import type { AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

export const defaultLocale = 'en' as const;
export const RTL_LANGUAGES = ['ar', 'he'] as const;
export const LTR_LANGUAGES = ['en', 'es', 'ru', 'fr', 'vi'] as const;
export const supportedLocales = [...LTR_LANGUAGES, ...RTL_LANGUAGES] as const;

// Type for supported locales
export type SupportedLocale = (typeof supportedLocales)[number];

// Type guard to check if a locale is supported
function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (supportedLocales as readonly string[]).includes(locale);
}

// Type-safe locale loader function
async function loadLocaleMessages(
  locale: string
): Promise<AbstractIntlMessages> {
  // Validate locale is supported before importing
  if (!isSupportedLocale(locale)) {
    throw new Error(`Locale "${locale}" is not supported`);
  }

  // Type-safe dynamic import - TypeScript will validate the locale at compile time
  // for known locales, but we still need runtime validation
  const messages = await import(
    `@canva-web/public/locales/${locale}/translations.json`
  );
  return messages.default;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = (await requestLocale) || defaultLocale;
  
  // Validate and normalize locale to ensure it's supported
  const locale = isSupportedLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  try {
    // Lazy load translations from the shared-utils library
    const messages = await loadLocaleMessages(locale);
    return { locale, messages };
  } catch (error) {
    console.error(
      `Error loading translations for locale "${locale}":`,
      error
    );

    // Fallback to default locale if current locale fails
    if (locale !== defaultLocale) {
      try {
        const fallbackMessages = await loadLocaleMessages(defaultLocale);
        return { locale: defaultLocale, messages: fallbackMessages };
      } catch (fallbackError) {
        console.error(
          `Error loading fallback translations for locale "${defaultLocale}":`,
          fallbackError
        );
        // Return empty messages as last resort
        return { locale: defaultLocale, messages: {} };
      }
    }

    // If default locale also fails, return empty messages
    return { locale: defaultLocale, messages: {} };
  }
});
