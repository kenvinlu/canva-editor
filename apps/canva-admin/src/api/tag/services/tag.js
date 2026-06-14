'use strict';

/**
 * tag service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tag.tag', ({ strapi }) => ({
  async find(params) {
    const { results, pagination } = await super.find(params);
    return { results, pagination };
  },

  async findOne(id, params) {
    const result = await super.findOne(id, params);
    return result;
  },

  async create(data) {
    const result = await super.create(data);
    return result;
  },

  async update(id, data) {
    const result = await super.update(id, data);
    return result;
  },

  async delete(id) {
    const result = await super.delete(id);
    return result;
  }
})); 