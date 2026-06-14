/**
 * article controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'vm';

export default factories.createCoreController(
  'api::article.article',
  ({ strapi }) => ({
    async findArticles(ctx: Context) {
      try {
        // Extract query parameters with defaults
        const pageSize = parseInt(ctx.query.ps as string, 10) || 10;
        let pageIndex = parseInt(ctx.query.pi as string, 10) || 0;
        const locale = ctx.query.locale as string;
        pageIndex = Math.max(0, pageIndex - 1); // 1-based for frontend
        const keyword =
          typeof ctx.query.kw === 'string' ? ctx.query.kw.trim() : '';

        // Build filters for keyword search
        const filters = keyword
          ? {
              $or: [
                {
                  title: { $containsi: keyword },
                  locale,
                },
                {
                  description: { $containsi: keyword },
                  locale,
                },
              ],
            }
          : {};

        // Calculate pagination
        const start = pageIndex * pageSize;
        const limit = pageSize;

        // Query frames with pagination and filters
        const [entries, total] = await Promise.all([
          strapi.documents('api::article.article').findMany({
            where: filters,
            offset: start,
            limit,
            orderBy: { id: 'asc' },
            populate: {
              cover: {
                fields: ['url', 'formats', 'alternativeText'],
              },
            },
          }),
          strapi.documents('api::article.article').count({ filters }),
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / pageSize);

        // Return response
        ctx.body = {
          data: entries,
          meta: {
            pagination: {
              page: pageIndex + 1,
              pageSize,
              pageCount: totalPages,
              total,
            },
          },
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to fetch articles');
      }
    },
    async findArticleBySlug(ctx: Context) {
      const { slug } = ctx.params;
      const locale = ctx.query.locale as string;

      const article = await strapi.documents('api::article.article').findFirst({
        where: { slug, locale },
        populate: {
          localizations: {
            populate: ['seo', 'cover', 'article_category', 'author', 'tags'],
            fields: ['locale', 'slug'],
          },
          seo: { populate: '*' },
          cover: {
            fields: [
              'name',
              'alternativeText',
              'caption',
              'width',
              'height',
              'formats',
              'url',
            ],
          },
          article_category: {
            fields: ['name', 'slug'],
          },
          author: {
            fields: ['name'],
          },
          tags: { fields: ['name', 'slug'] },
        },
      });
      return { data: article };
    },
  })
);
