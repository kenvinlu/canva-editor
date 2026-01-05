/**
 * text controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa';

export default factories.createCoreController('api::text.text', ({ strapi }) => ({
    async findTexts(ctx: Context) {
      try {
        // Extract query parameters with defaults
        const pageSize = parseInt(ctx.query.ps as string, 10) || 10;
        const pageIndex = parseInt(ctx.query.pi as string, 10) || 0;
        const keyword = typeof ctx.query.kw === 'string' ? ctx.query.kw.trim() : '';
  
        // Build filters for keyword search
        const filters = keyword ? { desc: { $containsi: keyword } } : {};
  
        // Calculate pagination
        const start = pageIndex * pageSize;
        const limit = pageSize;
  
        // Query frames with pagination and filters
        const [entries, total] = await Promise.all([
          strapi.documents('api::text.text').findMany({
            where: filters,
            offset: start,
            limit,
            orderBy: { id: 'asc' },
            populate: ['img'],
          }),
          strapi.documents('api::text.text').count({ filters }),
        ]);
  
        // Calculate pagination metadata
        const totalPages = Math.ceil(total / pageSize);
  
        // Return response
        ctx.body = {
          data: entries,
          meta: {
            pagination: {
              page: pageIndex + 1, // 1-based for frontend
              pageSize,
              pageCount: totalPages,
              total,
            },
          },
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to fetch templates');
      }
    },
  }));
