'use client';

import { createContext, useContext, useMemo } from 'react';

export type TranslationMessages = Record<string, any>;

export type TranslateFunction = (key: string, value?: string, params?: Record<string, any>) => string;

export type TranslationContextType = {
  messages: TranslationMessages;
  translate: TranslateFunction;
};

const defaultTranslate: TranslateFunction = (key: string, value?: string) => value || key;

const defaultContext: TranslationContextType = {
  messages: {},
  translate: defaultTranslate,
};

export const TranslationContext = createContext<TranslationContextType>(defaultContext);

/**
 * Custom hook to access translations in canva-editor components
 * @returns A translate function that can be used to translate keys
 * @example
 * const t = useTranslate();
 * const text = t('editor.save'); // Returns translated text or the key if not found
 */
export function useTranslate(): TranslateFunction {
  const { translate } = useContext(TranslationContext);
  return translate;
}

/**
 * Hook to get the raw messages object (for advanced use cases)
 */
export function useTranslationMessages(): TranslationMessages {
  const { messages } = useContext(TranslationContext);
  return messages;
}

/**
 * Creates a translate function from messages object
 * Supports nested keys with dot notation (e.g., 'editor.save' or 'editor.actions.delete')
 */
export function createTranslateFunction(
  messages: TranslationMessages
): TranslateFunction {
  return (key: string, fallbackValue?: string, params?: Record<string, any>): string => {
    // Support nested keys with dot notation
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Key not found, return fallback or the original key
        return fallbackValue || key;
      }
    }

    // If value is a string, apply parameter substitution
    if (typeof value === 'string') {
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }
      return value;
    }

    // If value is not a string, return the key
    return fallbackValue || key;
  };
}

