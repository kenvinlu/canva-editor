/**
 * SEO Utility - Centralized SEO Management
 * 
 * This utility provides a centralized way to manage SEO metadata across the application.
 * SEO content is managed through i18n translations for multi-language support.
 * 
 * Usage in Layouts:
 * ```tsx
 * import { generateMetadataByPathname } from '@canva-web/src/utils/seo';
 * import { headers } from 'next/headers';
 * import { getLocale, getTranslations } from 'next-intl/server';
 * 
 * export async function generateMetadata() {
 *   const headersList = await headers();
 *   const pathname = headersList.get('x-pathname') || '/';
 *   const locale = await getLocale();
 *   const t = await getTranslations('seo');
 *   return generateMetadataByPathname(pathname, { locale, translations: t });
 * }
 * ```
 * 
 * Usage in Pages (with custom overrides):
 * ```tsx
 * import { generateMetadataByPathname } from '@canva-web/src/utils/seo';
 * import { getTranslations } from 'next-intl/server';
 * 
 * export async function generateMetadata() {
 *   const pathname = '/pricing';
 *   const t = await getTranslations('seo');
 *   return generateMetadataByPathname(pathname, {
 *     locale: 'en',
 *     translations: t,
 *     customTitle: 'Custom Title', // optional override
 *   });
 * }
 * ```
 */

import type { Metadata } from 'next';
import siteMetadata from '@canva-web/src/utils/blog/siteMetaData';
import { supportedLocales } from '@canva-web/src/i18n/config';

export interface SEOConfig {
  translationKey: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

// Pathname to translation key mapping
const pathnameToTranslationKey: Record<string, SEOConfig> = {
  // Home page
  '/': {
    translationKey: 'pages.home',
    ogType: 'website',
  },
  
  // Pricing
  '/pricing': {
    translationKey: 'pages.pricing',
    ogType: 'website',
  },
  
  // Templates
  '/templates': {
    translationKey: 'pages.templates',
    ogType: 'website',
  },
  
  // Projects
  '/projects': {
    translationKey: 'pages.projects',
    ogType: 'website',
    noindex: true, // User-specific content
  },
  
  // Docs
  '/docs': {
    translationKey: 'pages.docs',
    ogType: 'website',
  },
  
  // Blog
  '/blog': {
    translationKey: 'pages.blog',
    ogType: 'website',
  },
  
  // Auth pages
  '/sign-in': {
    translationKey: 'pages.signIn',
    ogType: 'website',
    noindex: true,
  },
  
  '/sign-up': {
    translationKey: 'pages.signUp',
    ogType: 'website',
    noindex: true,
  },
  
  // Dashboard
  '/dashboard': {
    translationKey: 'pages.dashboard',
    ogType: 'website',
    noindex: true, // User-specific content
  },
  
  // Inbox
  '/inbox': {
    translationKey: 'pages.inbox',
    ogType: 'website',
    noindex: true, // User-specific content
  },
  
  // Product pages (dynamic)
  '/product': {
    translationKey: 'pages.product',
    ogType: 'website',
  },
  
  // Template detail pages (dynamic)
  '/templates/detail': {
    translationKey: 'pages.templatesDetail',
    ogType: 'website',
  },
};

/**
 * Remove locale prefix from pathname if present
 * Handles both cases:
 * - With locale prefix: /vi/pricing -> /pricing
 * - Without locale prefix (default locale): /pricing -> /pricing
 */
function removeLocalePrefix(pathname: string): string {
  // Normalize pathname - ensure it starts with /
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  // Split pathname into segments
  const segments = normalizedPath.split('/').filter(Boolean);
  
  // Check if first segment is a supported locale
  if (segments.length > 0) {
    const firstSegment = segments[0];
    
    // Check if it matches any supported locale (exact match)
    const isSupportedLocale = (supportedLocales as readonly string[]).includes(firstSegment);
    if (isSupportedLocale) {
      // Remove the locale segment and reconstruct path
      const pathWithoutLocale = '/' + segments.slice(1).join('/');
      return pathWithoutLocale || '/';
    }
  }
  
  // No locale prefix found, return original path
  return normalizedPath || '/';
}

/**
 * Get SEO configuration for a given pathname
 * Supports pattern matching for dynamic routes
 */
function getSEOConfig(pathname: string): SEOConfig | null {
  // Remove locale prefix if present (e.g., /vi/pricing -> /pricing)
  // For default locale without prefix (e.g., /pricing), it stays as /pricing
  const cleanPath = removeLocalePrefix(pathname);
  
  // Exact match first
  if (pathnameToTranslationKey[cleanPath]) {
    return pathnameToTranslationKey[cleanPath];
  }
  
  // Pattern matching for dynamic routes
  if (cleanPath.startsWith('/product/')) {
    return pathnameToTranslationKey['/product'];
  }
  
  if (cleanPath.startsWith('/templates/') && cleanPath !== '/templates') {
    return pathnameToTranslationKey['/templates/detail'];
  }
  
  if (cleanPath.startsWith('/docs/')) {
    return pathnameToTranslationKey['/docs'];
  }
  
  // Default fallback
  return pathnameToTranslationKey['/'] || null;
}

/**
 * Generate Next.js Metadata object from pathname
 * Uses i18n translations for localized SEO content
 */
type Translations = (key: string) => string;

export async function generateMetadataByPathname(
  pathname: string,
  options?: {
    locale?: string;
    translations?: Translations; // next-intl translations function
    customTitle?: string;
    customDescription?: string;
    customImage?: string;
    customUrl?: string;
  }
): Promise<Metadata> {
  const config = getSEOConfig(pathname);
  const locale = options?.locale || 'en';
  const t = options?.translations;
  
  // Get translated SEO content
  let title = options?.customTitle;
  let description = options?.customDescription;
  let keywords: string | undefined;
  
  if (config?.translationKey && t) {
    // Use translations if available
    title = title || t(`${config.translationKey}.title`);
    description = description || t(`${config.translationKey}.description`);
    keywords = t(`${config.translationKey}.keywords`);
  } else {
    // Fallback to default if translations not available
    title = title || siteMetadata.title;
    description = description || siteMetadata.description;
  }
  
  const ogImage = options?.customImage || config?.ogImage || siteMetadata.socialBanner;
  const ogType = config?.ogType || 'website';
  const canonical = options?.customUrl || config?.canonical || `${siteMetadata.siteUrl}${pathname}`;
  
  // Process image URL
  const imageUrl = ogImage.includes('http') ? ogImage : `${siteMetadata.siteUrl}${ogImage}`;
  
  // Build robots config
  const robots = config?.noindex || config?.nofollow
    ? {
        index: !config.noindex,
        follow: !config.nofollow,
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      };
  
  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      template: `%s | ${siteMetadata.title}`,
      default: title,
    },
    description: description || '',
    keywords: keywords || undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteMetadata.title,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale.replace('-', '_'),
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots,
  };
}

/**
 * Get default metadata for the main layout
 */
export async function getDefaultMetadata(translations?: Translations): Promise<Metadata> {
  return generateMetadataByPathname('/', { translations });
}

