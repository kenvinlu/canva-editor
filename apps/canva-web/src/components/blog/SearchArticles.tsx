'use client';

import { Article } from '@canva-web/src/models/cms.model';
import Pagination from '../base/pagination/Pagination';
import Search from '../base/search/Search';
import TopPageCard from '../card/top-card/TopPageCard';
import { BlogCard } from './BlogCard';
import { BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Props = {
  articles: Article[];
  totalItems: number;
  limit: number;
};

export default function SearchArticles({
  articles = [],
  totalItems,
  limit,
}: Props) {
  const t = useTranslations('blog');
  const searchParams = useSearchParams();
  const hasSearch = searchParams.get('kw');
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <section className="mb-16 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TopPageCard
          title={t('listTitle')}
          subTitle={t('listSubtitle')}
          searchBox={<Search placeholder={t('searchPlaceholder')} />}
        />
        
        {articles.length > 0 ? (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mt-8 mb-6">
              <div className="flex items-center gap-2">
                {hasSearch ? (
                  <>
                    <Sparkles className="w-5 h-5 text-primary" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('resultsFound', { count: totalItems })}
                    </p>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('resultsAvailable', { count: totalItems })}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Articles grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((article: Article) => (
                <BlogCard key={article.id} blog={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination totalPages={totalPages} />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 mb-6 shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {t('emptyTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              {hasSearch 
                ? t('emptyDescriptionWithSearch')
                : t('emptyDescriptionNoSearch')}
            </p>
            {hasSearch && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>{t('emptySuggestionsTitle')}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{t('emptySuggestion1')}</li>
                  <li>{t('emptySuggestion2')}</li>
                  <li>{t('emptySuggestion3')}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
