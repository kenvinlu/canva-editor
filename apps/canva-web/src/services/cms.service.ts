import { $nextFetch } from './base-request.service';
import { Article, Page } from '@canva-web/src/models/cms.model';
import type { BlogHome } from '@canva-web/src/models/blogHome.model';

async function fetchArticles(page = 1, limit = 10, keyword = '', locale: string) {
  return $nextFetch<Article[]>(`/cms/search-articles?pi=${page}&ps=${limit}&kw=${keyword}&locale=${locale}`);
}

async function fetchArticleBySlug(slug: string, locale: string) {
  return $nextFetch<Article>(`/cms/article/${slug}?locale=${locale}`);
}

async function fetchPageBySlug(slug: string, locale: string) {
  return $nextFetch<Page>(`/cms/page/${slug}?locale=${locale}`);
}

async function fetchBlogHome(locale: string) {
  return $nextFetch<BlogHome>(`/cms/blog-home?locale=${locale}`);
}

export { fetchArticles, fetchArticleBySlug, fetchPageBySlug, fetchBlogHome };
