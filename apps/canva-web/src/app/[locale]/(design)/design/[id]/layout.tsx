// import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './index.css';
import { TranslationProvider } from '@canva-web/src/providers/TranslateProvider';
import { getMessages } from 'next-intl/server';
import AppProvider from '@canva-web/src/providers/AppProvider';
import { GoogleAnalytics } from '@next/third-parties/google';
import { measurementId } from '@canva-web/src/utils/config';
import { ThemeProvider } from 'next-themes';
import { fetchConfiguration } from '@canva-web/src/services/configuration.service';
import { getSession } from '@canva-web/src/core/actions/session';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Canva Clone - Canva Editor',
  description: 'Canva Editor is a sleek design tool crafted with React, TypeScript, and Vite. Empower your creativity with a fast, intuitive, and versatile design experience.',
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
  const [messages, userSession, configuration] = await Promise.all([getMessages(), getSession(), fetchConfiguration()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <title>Canva Clone</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Canva Clone - Canva Editor" />
        <meta
          property="og:description"
          content="Canva clone, Graphic design tool, Online design software, React design app, Canva alternative, Responsive design, Drag-and-drop design, Collaboration in design, User-friendly design tool, SEO-friendly design, Social media graphics tool, JavaScript design tool, Canva-like editor, Canva-inspired design, Canva-style graphics, Canva alternative for React"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://www.canva-clone.com/fonts/css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider userSession={{ token: userSession?.token || '' }} configuration={configuration || null}>
              <div className="flex min-h-screen flex-col">{children}</div>
            </AppProvider>
          </ThemeProvider>
        </TranslationProvider>
        {/* <SpeedInsights /> */}
      </body>

      {measurementId && <GoogleAnalytics gaId={measurementId} />}
    </html>
  );
}
