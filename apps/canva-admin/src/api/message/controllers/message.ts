/**
 * message controller
 */

import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController(
  'api::message.message',
  ({ strapi }) => ({
    // Get messages list with filtering
    async find(ctx: Context) {
      try {
        // Get authenticated user from context
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('You must be authenticated to view messages');
        }

        const page = Number.parseInt(ctx.query.page as string, 10) || 1;
        const pageSize = Number.parseInt(ctx.query.pageSize as string, 10) || 10;
        const status = ctx.query.status as string;

        // Build filters - ALWAYS filter by authenticated user's ID
        const filters: any = {
          userId: String(user.id),
        };

        if (status) {
          filters.messageStatus = status;
        }

        // Calculate pagination
        const start = (page - 1) * pageSize;
        const limit = pageSize;

        // Query messages with pagination and populate replies
        const [entries, total] = await Promise.all([
          strapi.documents('api::message.message').findMany({
            where: filters,
            offset: start,
            limit,
            orderBy: { createdAt: 'desc' }
          }),
          strapi.documents('api::message.message').count({ filters }),
        ]);

        // Return response
        ctx.body = {
          data: {
            messages: entries,
            total,
            page,
            pageSize,
          }
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to fetch messages');
      }
    },

    // Create a new message
    async create(ctx: Context) {
      try {
        // Get authenticated user from context
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('You must be authenticated to send messages');
        }

        const { subject, content } = ctx.request.body;

        if (!subject || !content) {
          return ctx.badRequest('Subject and content are required');
        }

        // Use authenticated user's information
        const message = await strapi.documents('api::message.message').create({
          data: {
            subject,
            content,
            userId: String(user.id),
            userName: user.username || user.email,
            userEmail: user.email,
            messageStatus: 'unread',
          },
        });

        ctx.body = {
          success: true,
          data: message,
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to create message');
      }
    },

    // Update message (mark as read/unread)
    async update(ctx: Context) {
      try {
        // Get authenticated user from context
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('You must be authenticated to update messages');
        }

        const { id } = ctx.params;
        const { messageStatus } = ctx.request.body;

        if (!id) {
          return ctx.badRequest('Message ID is required');
        }

        // First, verify the message belongs to the authenticated user
        const messages = await strapi.documents('api::message.message').findMany({
          where: { documentId: id, userId: String(user.id) },
          limit: 1,
        });

        if (!messages || messages.length === 0) {
          return ctx.notFound('Message not found or you do not have permission to update it');
        }

        const message = await strapi.documents('api::message.message').update({
          documentId: id,
          data: { messageStatus },
        });

        ctx.body = {
          success: true,
          messageId: id,
          data: message,
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to update message');
      }
    },

    // Delete a message
    async delete(ctx: Context) {
      try {
        // Get authenticated user from context
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('You must be authenticated to delete messages');
        }

        const { id } = ctx.params;

        if (!id) {
          return ctx.badRequest('Message ID is required');
        }

        // First, verify the message belongs to the authenticated user
        const messages = await strapi.documents('api::message.message').findMany({
          where: { documentId: id, userId: String(user.id) },
          limit: 1,
        });

        if (!messages || messages.length === 0) {
          return ctx.notFound('Message not found or you do not have permission to delete it');
        }

        await strapi.documents('api::message.message').delete({
          documentId: id,
        });

        ctx.body = {
          success: true,
          messageId: id,
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to delete message');
      }
    },

    // Get a single message with replies
    async findOne(ctx: Context) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('You must be authenticated to view messages');
        }

        const { id } = ctx.params;

        if (!id) {
          return ctx.badRequest('Message ID is required');
        }

        // Find message and verify it belongs to the authenticated user
        const messages = await strapi.documents('api::message.message').findMany({
          where: { documentId: id, userId: String(user.id) },
          limit: 1,
          populate: ['replies'],
        });

        if (!messages || messages.length === 0) {
          return ctx.notFound('Message not found or you do not have permission to view it');
        }

        ctx.body = {
          data: messages[0],
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to fetch message');
      }
    },

    // Add a reply to a message
    async addReply(ctx: Context) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('You must be authenticated to send replies');
        }

        const { id } = ctx.params;
        const { content } = ctx.request.body;

        if (!id) {
          return ctx.badRequest('Message ID is required');
        }

        if (!content || !content.trim()) {
          return ctx.badRequest('Reply content is required');
        }

        // First, verify the message exists and belongs to the authenticated user
        const messages = await strapi.documents('api::message.message').findMany({
          where: { documentId: id, userId: String(user.id) },
          limit: 1,
          populate: ['replies'],
        });

        if (!messages || messages.length === 0) {
          return ctx.notFound('Message not found or you do not have permission to reply to it');
        }

        const message = messages[0];

        // Determine if the reply is from admin or user
        // In content API, users are authenticated users (not admin panel users)
        // For now, set isAdmin to false - admins would reply through admin panel
        // TODO: Add admin reply support if needed through a separate endpoint or role check
        const isAdmin = false;

        // Create the reply component data
        const replyData = {
          content: content.trim(),
          senderName: isAdmin ? 'Admin' : (user.username || user.email),
          senderEmail: user.email,
          isAdmin: isAdmin,
        };

        // Get existing replies or initialize empty array
        const existingReplies = (message?.replies || []) as any;

        // Add the new reply
        const updatedMessage = await strapi.documents('api::message.message').update({
          documentId: id,
          data: {
            replies: [...existingReplies, replyData],
            // Mark as read when a reply is added
            messageStatus: 'read',
          },
          populate: ['replies'],
        });

        ctx.body = {
          success: true,
          data: updatedMessage,
        };
      } catch (error) {
        ctx.throw(500, (error as Error).message || 'Failed to add reply');
      }
    },
  })
);
