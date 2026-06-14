/**
 * product controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params as { slug?: string };

    if (!slug) {
      ctx.status = 400;
      return { error: 'Slug parameter is required' };
    }

    const products = await strapi.entityService.findMany('api::product.product', {
      filters: { slug: { $eq: slug } },
      populate: { images: true },
      publicationState: 'live',
    });

    return { data: Array.isArray(products) ? products : [products] };
  },
}));
