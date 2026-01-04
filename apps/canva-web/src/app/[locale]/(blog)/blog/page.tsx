import PageContainer from "@canva-web/src/components/PageContainer";
import SearchArticles from "@canva-web/src/components/blog/SearchArticles";
import { fetchArticles } from "@canva-web/src/services/cms.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ page?: string, kw?: string }> }) {
  const { page, kw } = await searchParams;
  const locale = await getLocale();
  console.log('locale', locale);
  const limit = 8;
  const articles = await fetchArticles(parseInt(page || '1', 10), limit, kw || '', locale);
  if (!articles?.data) {
    return notFound();
  }
  
  return (
    <PageContainer>
      <Suspense fallback={
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }>
        <SearchArticles articles={articles.data} totalItems={articles?.meta?.pagination?.total || 0} limit={limit} />
      </Suspense>
    </PageContainer>
  );
}