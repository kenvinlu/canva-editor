import BlogInfo from '@canva-web/src/components/blog/BlogInfo';
import RenderMdx from '@canva-web/src/components/blog/RenderMdx';
import Tag from '@canva-web/src/components/blog/Tag';
import { CommentSection } from '@canva-web/src/components/blog/CommentSection';
import { ShareButtons } from '@canva-web/src/components/blog/ShareButtons';
import { ReadingProgress } from '@canva-web/src/components/blog/ReadingProgress';
import siteMetadata from '@canva-web/src/utils/blog/siteMetaData';
import Image from 'next/image';
import { fetchArticleBySlug } from '@canva-web/src/services/cms.service';
import Breadcrumb from '@canva-web/src/components/base/breadcrumb/Breadcrumb';
import PageTitle from '@canva-web/src/components/blog/PageTitle';
import { getLocale, getTranslations } from 'next-intl/server';
import NotFoundContent from '@canva-web/src/components/NotFoundContent';
import { defaultLocale } from '@canva-web/src/i18n/config';
export const dynamic = 'force-dynamic';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const result = await fetchArticleBySlug(slug, locale);
  let blog = result?.data;
  let blogLocale = locale;

  // Fallback: if no blog for current locale and current isn't default, retry with default locale
  if (!blog && locale !== defaultLocale) {
    const fallbackResult = await fetchArticleBySlug(slug, defaultLocale);
    blog = fallbackResult?.data;
    if (blog) {
      blogLocale = defaultLocale;
    }
  }

  if (!blog) {
    return;
  }

  const publishedAt = blog.publishedAt;
  const modifiedAt = blog.updatedAt || blog.publishedAt;

  let imageList = [siteMetadata.socialBanner];
  if (blog.cover) {
    imageList = [blog.cover.url];
  }
  const ogImages = imageList.map((img) => {
    return { url: img.includes('http') ? img : siteMetadata.siteUrl + img };
  });

  const authors = blog?.author ? [blog.author.name] : siteMetadata.author;

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: siteMetadata.siteUrl + blog.slug,
      siteName: siteMetadata.title,
      locale: blogLocale,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: ogImages,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale, t] = await Promise.all([
    params,
    getLocale(),
    getTranslations('blog'),
  ]);
  const result = await fetchArticleBySlug(slug, locale);
  let blog = result?.data;
  let blogLocale = locale;

  // Fallback: if no blog for current locale and current isn't default, retry with default locale
  if (!blog && locale !== defaultLocale) {
    const fallbackResult = await fetchArticleBySlug(slug, defaultLocale);
    blog = fallbackResult?.data;
    if (blog) {
      blogLocale = defaultLocale;
    }
  }

  if (!blog) {
    return <NotFoundContent />;
  }

  let imageList = [siteMetadata.socialBanner];
  if (blog.cover) {
    imageList = [blog.cover.url];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: blog.title,
    description: blog.description,
    image: imageList,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    author: [
      {
        '@type': 'Person',
        name: blog?.author ? [blog.author] : siteMetadata.author,
        url: siteMetadata.twitter,
      },
    ],
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
            { label: 'Blog', href: '/blog' },
            {
              label: blog.title,
              href: `/blog/${slug}`,
            },
          ]}
        />
      </div>
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
            {blog.cover?.url && (
              <Image
                src={blog.cover.url}
                placeholder="blur"
                blurDataURL={blog.cover.url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <PageTitle className="text-white mb-4 text-3xl sm:text-4xl md:text-5xl">
                {blog.title}
              </PageTitle>
              {blog.description && (
                <p className="text-lg sm:text-xl text-gray-200 mb-4 max-w-3xl">
                  {blog.description}
                </p>
              )}
              <BlogInfo blog={blog} className="text-white/90 [&_*]:text-white/90" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Content */}
          <div className="flex-1">
            <div className="prose-wrapper">
              <RenderMdx blog={blog} />
            </div>

            {/* Tags and Share */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              {blog.tags && blog.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('tagsLabel')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Tag
                        key={tag.id}
                        name={tag.name}
                        link={`/blog/tag/${tag.slug}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <ShareButtons
                url={`/blog/${slug}`}
                title={blog.title}
                description={blog.description}
              />
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <CommentSection slug={slug} locale={blogLocale} />
      </div>
    </>
  );
}
