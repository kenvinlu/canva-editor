/**
 * page controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'vm';

export default factories.createCoreController(
  'api::page.page',
  ({ strapi }) => ({
    async findPageBySlug(ctx: Context) {
      const { slug } = ctx.params;
      const locale = ctx.query.locale as string;

      const page = await strapi.documents('api::page.page').findFirst({
        where: { slug, locale },
        populate: {
          localizations: {
            populate: ['seo'],
            fields: ['locale', 'slug'],
          },
          seo: { populate: '*' },
        },
      });
      return { data: page };
    },
  })
);
