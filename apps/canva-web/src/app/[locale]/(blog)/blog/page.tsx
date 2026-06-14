import PageContainer from '@canva-web/src/components/PageContainer';
import { getLocale } from 'next-intl/server';
import { fetchBlogHome } from '@canva-web/src/services/cms.service';
import { HeroSlideshow } from '@canva-web/src/components/blog/sections/HeroSlideshow';
import { CardSlider } from '@canva-web/src/components/blog/sections/CardSlider';
import { ColumnList } from '@canva-web/src/components/blog/sections/ColumnList';
import { BookOpen } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import TopPageCard from '@canva-web/src/components/card/top-card/TopPageCard';
import Search from '@canva-web/src/components/base/search/Search';

export default async function BlogHomePage() {
  const locale = await getLocale();
  const response = await fetchBlogHome(locale);
  const t = await getTranslations('blog');
  const blogHome = response.data;

  return (
    <PageContainer>
      <div className="container mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <TopPageCard
          title={t('listTitle')}
          subTitle={t('listSubtitle')}
          searchBox={<Search placeholder={t('searchPlaceholder')} />}
        />
        {blogHome ? (
          (blogHome.sections || []).map((section) => {
            switch (section.__component) {
              case 'sections.hero-slideshow':
                return <HeroSlideshow key={section.id} section={section} />;
              case 'sections.card-slider':
                return <CardSlider key={section.id} section={section} />;
              case 'sections.column-list':
                return <ColumnList key={section.id} section={section} />;
              default:
                return null;
            }
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 mb-6 shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {t('emptyTitle')}
            </h3>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
