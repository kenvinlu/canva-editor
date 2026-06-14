'use strict';

/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    const { results, pagination } = await strapi.service('api::category.category').find(query);
    
    // Add custom logic here if needed
    return { results, pagination };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const entity = await strapi.service('api::category.category').findOne(id, query);
    
    // Add custom logic here if needed
    return entity;
  },

  async create(ctx) {
    const { data } = ctx.request.body;
    const entity = await strapi.service('api::category.category').create({ data });
    
    // Add custom logic here if needed
    return entity;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const entity = await strapi.service('api::category.category').update(id, { data });
    
    // Add custom logic here if needed
    return entity;
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.service('api::category.category').delete(id);
    
    // Add custom logic here if needed
    return entity;
  }
})); 