"use client";

import React from "react";
import _ from "lodash";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, supportedLocales } from "@canva-web/src/i18n/config";

export function TranslationProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  // Validate and normalize locale to ensure it's supported
  const validatedLocale = supportedLocales.includes(locale as any)
    ? locale
    : defaultLocale;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <NextIntlClientProvider
      timeZone={timeZone}
      onError={(error) => {
        // Suppress INVALID_MESSAGE errors during SSR/hydration
        // These can occur when locale context isn't fully initialized
        if (error.code === 'INVALID_MESSAGE') {
          console.warn('Translation error (suppressed):', error.message);
          return;
        }
        console.error('Translation error:', error);
      }}
      getMessageFallback={({ error, key, namespace }) => {
        const nestedMessages = _.get(messages, namespace ?? "");

        if (!nestedMessages) {
          return key; // fallback to key if namespace is missing
        }

        // Handle INVALID_MESSAGE error (locale information issue)
        if ((error.code as string) === "INVALID_MESSAGE") {
          return nestedMessages[key] ?? key; // fallback to key if message not found
        }

        // Return a default if message is missing
        if ((error.code as string) === "MISSING_MESSAGE") {
          return nestedMessages.default ?? key; // fallback to key if default is also missing
        }

        return nestedMessages[key] ?? key; // fallback to key if specific key not found
      }}
      locale={validatedLocale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}
