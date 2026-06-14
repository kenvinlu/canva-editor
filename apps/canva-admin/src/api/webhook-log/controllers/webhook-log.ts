/**
 * webhook-log controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::webhook-log.webhook-log', ({ strapi }) => ({
  /**
   * Create webhook log - the lifecycle hook will automatically process it
   * This endpoint allows manual triggering of webhooks when Gumroad cannot call directly
   * The lifecycle hook (afterCreate) will automatically process Gumroad webhooks
   * @param ctx
   * @returns
   */
  async createAndTrigger(ctx) {
    try {
      const webhookData = ctx.request.body;
      
      if (!webhookData) {
        return ctx.badRequest('Webhook payload is required');
      }

      // Create webhook log entry
      // The lifecycle hook (afterCreate) will automatically process Gumroad webhooks
      const webhookLog = await strapi.documents('api::webhook-log.webhook-log').create({
        data: {
          provider: 'gumroad',
          event_type: 'sale',
          payload: webhookData,
          status: 'processing',
        },
      });

      console.log('✓ Webhook log created:', webhookLog.documentId);
      console.log('→ Lifecycle hook will automatically process the webhook');

      // Return the webhook log
      // The lifecycle will handle the processing asynchronously
      return ctx.send({
        success: true,
        message: 'Webhook log created - processing will be handled automatically by lifecycle hook',
        data: {
          webhookLogId: webhookLog.documentId,
          webhookLog: webhookLog,
        },
      });
    } catch (error) {
      console.error('Error creating webhook log:', error);
      ctx.throw(500, error.message || 'Failed to create webhook log');
    }
  },
}));
