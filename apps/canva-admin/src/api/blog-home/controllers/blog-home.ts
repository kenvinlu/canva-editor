/**
 * blog-home controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'vm';

export default factories.createCoreController(
  'api::blog-home.blog-home',
  ({ strapi }) => ({
    async find(ctx: Context) {
      try {
        const locale = (ctx.query.locale as string) || 'en';

        // Fetch the blog-home single type with deep population
        const blogHome = await strapi.documents('api::blog-home.blog-home').findFirst({
          where: { locale },
          populate: {
            seo: {
              populate: '*',
            },
            sections: {
              on: {
                'sections.hero-slideshow': {
                  populate: {
                    articles: {
                      populate: {
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
                      },
                      fields: [
                        'id',
                        'documentId',
                        'title',
                        'description',
                        'slug',
                        'createdAt',
                        'updatedAt',
                        'publishedAt',
                        'locale',
                      ],
                    },
                  },
                },
                'sections.card-slider': {
                  populate: {
                    articles: {
                      populate: {
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
                        }
                      },
                      fields: [
                        'id',
                        'documentId',
                        'title',
                        'description',
                        'slug',
                        'createdAt',
                        'updatedAt',
                        'publishedAt',
                        'locale',
                      ],
                    },
                  },
                },
                'sections.column-list': {
                  populate: {
                    articles: {
                      populate: {
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
                        }
                      },
                      fields: [
                        'id',
                        'documentId',
                        'title',
                        'description',
                        'slug',
                        'createdAt',
                        'updatedAt',
                        'publishedAt',
                        'locale',
                      ],
                    },
                  },
                },
              },
            },
          },
        });

        if (!blogHome) {
          return ctx.notFound('Blog home not found');
        }

        ctx.body = {
          data: blogHome,
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to fetch blog home');
      }
    },
  })
);

