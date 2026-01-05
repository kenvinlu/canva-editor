/**
 * master-template controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa';

export default factories.createCoreController('api::master-template.master-template', ({ strapi }) => ({
    async findMasterTemplates(ctx: Context) {
      try {
        // Extract query parameters with defaults
        const pageSize = parseInt(ctx.query.ps as string, 10) || 10;
        let pageIndex = parseInt(ctx.query.pi as string, 10) || 0;
        pageIndex = Math.max(0, pageIndex - 1); // 1-based for frontend
        const keyword = typeof ctx.query.kw === 'string' ? ctx.query.kw.trim() : '';
  
        // Build filters for keyword search
        const filters = keyword ? { desc: { $containsi: keyword } } : {};
  
        // Calculate pagination
        const start = pageIndex * pageSize;
        const limit = pageSize;
  
        // Query frames with pagination and filters
        const [entries, total] = await Promise.all([
          strapi.documents('api::master-template.master-template').findMany({
            where: filters,
            offset: start,
            limit,
            orderBy: { id: 'asc' },
            populate: {
              img: true,
            },
          }),
          strapi.documents('api::master-template.master-template').count({ filters }),
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
        ctx.throw(500, (error as Error).message || 'Failed to fetch master templates');
      }
    },
    async findMasterTemplateByDocumentId(ctx: Context) {
      try {
        const documentId = ctx.params.documentId;
        const template = await strapi.documents('api::master-template.master-template').findOne({
          documentId,
          populate: { img: true },
        });
        ctx.body = { data: template };
      } catch (error) { 
        ctx.throw(500, (error as Error).message || 'Failed to fetch master template');
      }
    },
    async updateVoteCount(ctx: Context) {
      try {
        const documentId = ctx.params.documentId;
        const { voteCount } = ctx.request.body;
        const template = await strapi.documents('api::master-template.master-template').update({
          documentId,
          data: { vote: voteCount },
        });
        ctx.body = { data: template };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to update vote count');
      }
    }
}));
