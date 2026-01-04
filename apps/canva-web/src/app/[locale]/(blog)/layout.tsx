import { Inter, Manrope } from 'next/font/google';
import '../../../styles/globals.css';
import siteMetadata from '@canva-web/src/utils/blog/siteMetaData';
import { cx } from '@canva-web/src/utils/blog';
import { TranslationProvider } from '@canva-web/src/providers/TranslateProvider';
import { getMessages } from 'next-intl/server';
import { Footer } from '@canva-web/src/components/Footer';
import { Header } from '@canva-web/src/components/Header';
import { getSession } from '@canva-web/src/core/actions/session';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-in',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mr',
});

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title, // a default is required when creating a template
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    images: [siteMetadata.socialBanner],
  },
};

const RootBlogLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const [messages, userSession] = await Promise.all([getMessages(), getSession()]);

  return (
    <html>
      <body
        className={cx(
          inter.variable,
          manrope.variable,
          'font-mr bg-light dark:bg-dark'
        )}
      >
        <TranslationProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header isDemo={!!userSession?.isDemo} />
            <main className="flex-1 container mx-auto max-w-7xl">
              {children}
            </main>
            <Footer />
          </div>
        </TranslationProvider>
      </body>
    </html>
  );
};

export default RootBlogLayout;
