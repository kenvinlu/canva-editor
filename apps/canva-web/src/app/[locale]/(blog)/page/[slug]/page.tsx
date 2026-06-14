import RenderMdx from '@canva-web/src/components/blog/RenderMdx';
import { ShareButtons } from '@canva-web/src/components/blog/ShareButtons';
import { ReadingProgress } from '@canva-web/src/components/blog/ReadingProgress';
import siteMetadata from '@canva-web/src/utils/blog/siteMetaData';
import { fetchPageBySlug } from '@canva-web/src/services/cms.service';
import Breadcrumb from '@canva-web/src/components/base/breadcrumb/Breadcrumb';
import PageTitle from '@canva-web/src/components/blog/PageTitle';
import { getLocale } from 'next-intl/server';
import NotFoundContent from '@canva-web/src/components/NotFoundContent';
import { defaultLocale } from '@canva-web/src/i18n/config';
import "@canva-web/src/styles/ck-content.scss";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const result = await fetchPageBySlug(slug, locale);
  let page = result?.data;
  let pageLocale = locale;

  // Fallback: if no page for current locale and current isn't default, retry with default locale
  if (!page && locale !== defaultLocale) {
    const fallbackResult = await fetchPageBySlug(slug, defaultLocale);
    page = fallbackResult?.data;
    if (page) {
      pageLocale = defaultLocale;
    }
  }

  if (!page) {
    return;
  }

  const publishedAt = page.publishedAt;
  const modifiedAt = page.updatedAt || page.publishedAt;

  const imageList = [siteMetadata.socialBanner];
  const ogImages = imageList.map((img) => {
    return { url: img.includes('http') ? img : siteMetadata.siteUrl + img };
  });

  const metaTitle = page.seo?.metaTitle || page.title;
  const metaDescription = page.seo?.metaDescription || '';

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteMetadata.siteUrl + page.slug,
      siteName: siteMetadata.title,
      locale: pageLocale,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImages,
    },
  };
}

export default async function PageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([
    params,
    getLocale(),
  ]);
  const result = await fetchPageBySlug(slug, locale);
  let page = result?.data;

  // Fallback: if no page for current locale and current isn't default, retry with default locale
  if (!page && locale !== defaultLocale) {
    const fallbackResult = await fetchPageBySlug(slug, defaultLocale);
    page = fallbackResult?.data;
  }

  if (!page) {
    return <NotFoundContent />;
  }

  const imageList = [siteMetadata.socialBanner];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    headline: page.title,
    description: page.seo?.metaDescription || '',
    image: imageList,
    datePublished: page.publishedAt,
    dateModified: page.updatedAt || page.publishedAt,
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="my-8">
        <Breadcrumb
          breadcrumbs={[
            { label: 'Page', href: '/page' },
            {
              label: page.title,
              href: `/page/${slug}`,
            },
          ]}
        />
      </div>
      
      <article className="mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <PageTitle className="mb-4 text-2xl sm:text-3xl md:text-4xl">
            {page.title}
          </PageTitle>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Page Content */}
          <div className="flex-1">
            <div className="prose-wrapper">
              <RenderMdx blog={page} />
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <ShareButtons
                url={`/page/${slug}`}
                title={page.title}
                description={page.seo?.metaDescription || ''}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
