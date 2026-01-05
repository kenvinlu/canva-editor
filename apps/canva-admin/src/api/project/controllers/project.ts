/**
 * project controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::project.project',
  ({ strapi }) => ({
    async findProjects(ctx: Context) {
      try {
        // Extract query parameters with defaults
        const pageSize = parseInt(ctx.query.ps as string, 10) || 10;
        let pageIndex = parseInt(ctx.query.pi as string, 10) || 0;
        pageIndex = Math.max(0, pageIndex - 1); // 1-based for frontend
        const keyword =
          typeof ctx.query.kw === 'string' ? ctx.query.kw.trim() : '';

        // Build filters for keyword search
        const filters = keyword ? { desc: { $containsi: keyword } } : {};

        // Calculate pagination
        const start = pageIndex * pageSize;
        const limit = pageSize;

        // Query frames with pagination and filters
        const [entries, total] = await Promise.all([
          strapi.entityService.findMany('api::project.project', {
            where: filters,
            offset: start,
            limit,
            orderBy: { id: 'asc' },
            populate: ['img'],
          }),
          strapi.entityService.count('api::project.project', { filters }),
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
        ctx.throw(500, (error as Error).message || 'Failed to fetch templates');
      }
    },
    async findMyProjects(ctx: Context) {
      try {
        // Get user from token
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized('User not authenticated');
        }

        // Extract query parameters with defaults
        const pageSize = parseInt(ctx.query.ps as string, 10) || 10;
        let pageIndex = parseInt(ctx.query.pi as string, 10) || 0;
        pageIndex = Math.max(0, pageIndex - 1);
        const keyword =
          typeof ctx.query.kw === 'string' ? ctx.query.kw.trim() : '';

        // Build filters for keyword search and user
        const filters = {
          ...(keyword ? { desc: { $containsi: keyword } } : {}),
          user: user.id,
        };

        // Calculate pagination
        const start = pageIndex * pageSize;
        const limit = pageSize;

        // Query projects with pagination and filters
        const [entries, total] = await Promise.all([
          strapi.documents('api::project.project').findMany({
            filters,
            start,
            limit,
            sort: { id: 'asc' },
            populate: {
              img: true
            },
          }),
          strapi.documents('api::project.project').count({ filters }),
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
        ctx.throw(
          500,
          (error as Error).message || 'Failed to fetch user templates'
        );
      }
    },
    create: async (ctx) => {
      try {
        // Get authenticated user
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized('Authentication required');
        }

        // Get master template ID from request body
        const { templateId } = ctx.request.body;
        if (!templateId) {
          return ctx.badRequest('Master template ID is required');
        }

        // Fetch master template
        const masterTemplate = await strapi.entityService.findOne(
          'api::master-template.master-template',
          templateId,
          {
            populate: {
              img: {
                fields: ['id']
              },
            },
          }
        );

        if (!masterTemplate) {
          return ctx.notFound('Master template not found');
        }

        // Extract img ID (adjust based on Strapi version)
        const imgId = (masterTemplate as any)?.img?.id;

        if (!imgId) {
          console.warn('No img ID found in masterTemplate');
        }
        // Create new project with template data
        const project = await strapi.entityService.create(
          'api::project.project',
          {
            data: {
              templateId: masterTemplate.id,
              img: imgId,
              desc: masterTemplate.desc,
              data: masterTemplate.data,
              user: user.id,
              pages: masterTemplate.pages,
              publishedAt: new Date(),
            },
          }
        );

        return {
          data: project,
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to create project');
      }
    },
    async findUserProjectById(ctx: Context) {
      try {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized('Authentication required');
        }

        const { id } = ctx.params;
        const project: any = await strapi.entityService.findOne(
          'api::project.project',
          id,
          {
            populate: {
              user: true,
              img: true
            },
          }
        );
        console.log('project', project, user.id);
        if (project.user?.id !== user.id) {
          return ctx.forbidden(
            'You do not have permission to update this project'
          );
        }
        delete project.user;
        return { data: project };
      } catch (error) {
        ctx.throw(
          500,
          (error as Error).message || 'Failed to fetch user projects'
        );
      }
    },
    async findUserProjectByDocumentId(ctx: Context) {
      try {
        const user = ctx.state.user as { id: number };
        if (!user) {
          return ctx.unauthorized('Authentication required');
        }
    
        const { documentId } = ctx.params;
        // Validate documentId (Document Service uses string IDs, so less strict validation)
        if (!documentId) {
          return ctx.badRequest('Invalid Document ID: Must be provided');
        }
    
        // Query project using Document Service API
        const project = await strapi.documents('api::project.project').findOne({
          documentId,
          populate: { user: true, img: true },
        });
    
        if (!project) {
          return ctx.notFound('Project not found');
        }
    
        if (project.user?.id !== user.id) {
          return ctx.forbidden('You do not have permission to access this project');
        }
    
        // Remove sensitive user data
        const sanitizedProject = { ...project };
        delete sanitizedProject.user;
    
        return {
          data: sanitizedProject,
        };
      } catch (error) {
        strapi.log.error('Error in findUserProjectByDocumentId:', error);
        return ctx.internalServerError('An error occurred while fetching the project');
      }
    },
    async updateUserProjectById(ctx: Context) {
      try {
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized('Authentication required');
        }

        const { id } = ctx.params;
        const { title, data } = ctx.request.body;

        if (!title && !data) {
          return ctx.badRequest('Title or data is required');
        }

        const project: any = await strapi.entityService.findOne(
          'api::project.project',
          id,
          {
            populate: ['user'],
          }
        );

        if (!project) {
          return ctx.notFound('Project not found');
        }

        // Check if the project is associated with the authenticated user
        if (project.user?.id !== user.id) {
          return ctx.forbidden(
            'You do not have permission to update this project'
          );
        }

        const payload: {
          title?: string;
          data?: any;
          pages?: number;
        } = {};

        if (title) {
          payload.title = title;
        }

        if (data) {
          payload.data = data;
          payload.pages = data.length;
        }

        const updatedProject = await strapi.entityService.update(
          'api::project.project',
          id,
          {
            data: payload,
          }
        );
        return { data: updatedProject };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to update project');
      }
    },
  })
);
