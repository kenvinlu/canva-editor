import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../../../styles/globals.css';
import { ThemeProvider } from '../../../components/ThemeProvider';
import { TranslationProvider } from '@canva-web/src/providers/TranslateProvider';
import { getMessages, getLocale } from 'next-intl/server';
import AppProvider from '@canva-web/src/providers/AppProvider';
import { Header } from '@canva-web/src/components/Header';
import { Footer } from '@canva-web/src/components/Footer';
import { MessageLoader } from '@canva-web/src/components/MessageLoader';
import { TopMessage } from '@canva-web/src/components/TopMessage';
import { Toaster } from '@canva-web/src/components/toast';
import { getSession } from '@canva-web/src/core/actions/session';
import { GoogleAnalytics } from '@next/third-parties/google';
import { measurementId } from '@canva-web/src/utils/config';
import { generateMetadataByPathname } from '@canva-web/src/utils/seo';
import { headers } from 'next/headers';
import { fetchConfiguration } from '@canva-web/src/services/configuration.service';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const locale = await getLocale();
  const { getTranslations } = await import('next-intl/server');
  const t = await getTranslations('seo');

  return generateMetadataByPathname(pathname, { locale, translations: t });
}

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
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Canva Clone" />
        <meta property="og:description" content="Canva Clone, Graphic design tool, Online design software, React design app, Canva alternative, Responsive design, Drag-and-drop design, Collaboration in design, User-friendly design tool, SEO-friendly design, Social media graphics tool, JavaScript design tool, Canva-like editor, Canva-inspired design, Canva-style graphics, Canva alternative for React" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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
            <AppProvider userSession={{ token: userSession?.token || '' }} configuration={configuration || null} >
              <MessageLoader />
              <Toaster />
              <div className="flex min-h-screen flex-col">
                <TopMessage />
                <Header isDemo={!!userSession?.isDemo} />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </AppProvider>
          </ThemeProvider>
        </TranslationProvider>
      </body>
      {measurementId && (
        <GoogleAnalytics gaId={measurementId} />
      )}
    </html>
  );
}
