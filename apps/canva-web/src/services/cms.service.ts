import { $nextFetch } from './base-request.service';
import { Article } from '@canva-web/src/models/cms.model';

async function fetchArticles(page = 1, limit = 10, keyword = '', locale: string) {
  return $nextFetch<Article[]>(`/cms/search-articles?pi=${page}&ps=${limit}&kw=${keyword}&locale=${locale}`);
}

  async function fetchArticleBySlug(slug: string, locale: string) {
  return $nextFetch<Article>(`/cms/article/${slug}?locale=${locale}`);
}

export { fetchArticles, fetchArticleBySlug };
