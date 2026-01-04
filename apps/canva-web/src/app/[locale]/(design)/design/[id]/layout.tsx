// import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './index.css';
import { TranslationProvider } from '@canva-web/src/providers/TranslateProvider';
import { getMessages } from 'next-intl/server';
import AppProvider from '@canva-web/src/providers/AppProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Relivator Next.js Template',
  description: 'Relivator Next.js Template',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Be careful adding more calls here, it can reduce the performance of the application
  const [messages] = await Promise.all([getMessages()]);
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png+xml" href="/logo.png" />
        <title>Canva Editor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Canva Clone - Canva Editor" />
        <meta
            property="og:description"
            content="Canva clone, Graphic design tool, Online design software, React design app, Canva alternative, Responsive design, Drag-and-drop design, Collaboration in design, User-friendly design tool, SEO-friendly design, Social media graphics tool, JavaScript design tool, Canva-like editor, Canva-inspired design, Canva-style graphics, Canva alternative for React"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="http://localhost:4000/fonts/css" rel="stylesheet" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider locale={locale} messages={messages}>
            <AppProvider>
              <div className="flex min-h-screen flex-col">{children}</div>
            </AppProvider>
        </TranslationProvider>
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
