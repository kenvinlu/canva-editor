import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.canvaclone.com';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${APP_URL}/sitemap.xml`;

  return {
    rules: [
      // Temporarily disallow Googlebot from the site
      // {
      //   userAgent: 'Googlebot',
      //   disallow: '/',
      // },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: sitemapUrl,
    host: APP_URL.replace(/\/+$/, ''),
  };
}
