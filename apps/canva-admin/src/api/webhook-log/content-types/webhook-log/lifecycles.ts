/**
 * webhook-log lifecycles
 */

import { env } from '@strapi/utils';
import {
  getPasswordResetEmail,
  getProductNotFoundEmail,
  getPurchaseConfirmationEmail,
  getInboxMessage,
} from '../../utils/email-templates';

export default {
  /**
   * Lifecycle hook that runs after a webhook log is created
   * Processes Gumroad webhooks automatically when a log is created
   * Processing is done asynchronously to avoid blocking the HTTP response
   */
  async afterCreate(event) {
    const { result } = event;

    // Only process Gumroad webhooks with status "processing"
    if (result.provider !== 'gumroad' || result.status !== 'processing') {
      return;
    }

    const webhookLog = result;
    const webhookData = result.payload;

    if (!webhookData) {
      console.error('Webhook log created without payload');
      return;
    }

    // Process webhook asynchronously to avoid blocking the HTTP response
    // This allows the controller to return immediately
    setImmediate(async () => {
      try {
        await processWebhook(webhookLog, webhookData);
      } catch (error) {
        console.error('Error in async webhook processing:', error);
        // Update webhook log with failed status if processing fails
        try {
          await strapi.documents('api::webhook-log.webhook-log').update({
            documentId: webhookLog.documentId,
            data: {
              status: 'failed',
              error_message: error.message || 'Unknown error in async processing',
            },
          });
        } catch (updateError) {
          console.error('Failed to update webhook log after async error:', updateError);
        }
      }
    });
  },
};

/**
 * Process Gumroad webhook asynchronously
 * This function handles all the webhook processing logic
 */
async function processWebhook(webhookLog: any, webhookData: any) {
  try {
    console.log('Processing Gumroad webhook from lifecycle:', webhookLog.documentId);

      // Extract relevant data from Gumroad webhook
      const {
        email,
        product_id,
        permalink,
        product_name,
        price,
        sale_id,
        full_name,
        order_number,
        sale_timestamp,
        test,
        refunded,
        disputed,
        currency,
        quantity,
        gumroad_fee,
      } = webhookData;

      const buyerEmail = email?.toLowerCase();

      if (!buyerEmail) {
        throw new Error('Email is required');
      }

      // Check for refunded or disputed sales
      if (refunded === 'true' || disputed === 'true') {
        console.log('⚠ Sale is refunded or disputed, skipping processing');

        await strapi.documents('api::webhook-log.webhook-log').update({
          documentId: webhookLog.documentId,
          data: {
            status: 'failed',
            error_message: `Sale ${refunded === 'true' ? 'refunded' : 'disputed'} - skipped processing`,
          },
        });

        return;
      }

      // Log test purchases
      if (test === 'true') {
        console.log('⚠ This is a TEST purchase');
      }

      // 1. Find or create user
      let user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: buyerEmail },
      });

      const defaultPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        // Get default authenticated role
        const defaultRole = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: 'authenticated' } });

        // Create new user with default password
        const username = full_name
          ? full_name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()
          : buyerEmail.split('@')[0] + '_' + Date.now();

        user = await strapi.query('plugin::users-permissions.user').create({
          data: {
            username,
            email: buyerEmail,
            password: defaultPassword,
            confirmed: true,
            blocked: false,
            role: defaultRole.id,
          },
        });

        console.log('✓ New user created:', user.email, full_name ? `(${full_name})` : '');

        // Send password reset link
        try {
          // Generate random token following Strapi pattern
          const crypto = require('crypto');
          const resetPasswordToken = crypto.randomBytes(64).toString('hex');

          // Update user with reset password token
          const getService = (name) => {
            return strapi.plugins['users-permissions'].service(name);
          };
          await getService('user').edit(user.id, { resetPasswordToken });

          // Build reset password URL
          const resetUrl = `${env('FRONTEND_URL')}/reset-password?code=${resetPasswordToken}`;

          // Get email template
          const passwordResetEmail = getPasswordResetEmail({ resetUrl });

          // Send email
          await strapi.plugins['email'].services.email.send({
            to: user.email,
            from: env('FROM_EMAIL', 'no-reply@canvaclone.com'),
            subject: passwordResetEmail.subject,
            html: passwordResetEmail.html,
          });

          console.log('✓ Password reset email sent to:', user.email);
        } catch (emailError) {
          console.error('✗ Error sending password reset email:', emailError);
        }
      } else {
        console.log('✓ Existing user found:', user.email);
      }

      // 2. Handle "Upgrade to Advanced" product logic
      let actualProductSlug = permalink;
      let product = null;

      // If product is "Upgrade to Advanced", determine which product to assign
      if (permalink && permalink.toLowerCase().includes('upgrade-to-canva-clone')) {
        console.log('🔍 Processing "Upgrade to Advanced" purchase');
        
        // Check if user has a completed order with "Canva Editor"
        const canvaEditorProduct = await strapi.documents('api::product.product').findFirst({
          filters: { slug: { $eq: 'canva-editor' } },
        });

        if (canvaEditorProduct) {
          // Check if user has a completed order with Canva Editor
          const existingOrders = await strapi.documents('api::order.order').findMany({
            filters: {
              user: { id: { $eq: user.id } },
              payment_status: { $eq: 'completed' },
              products: { documentId: { $eq: canvaEditorProduct.documentId } },
            },
          });

          if (existingOrders && existingOrders.length > 0) {
            // User has Canva Editor, assign Canva Clone
            actualProductSlug = 'canva-clone';
            console.log('✓ User has Canva Editor, assigning Canva Clone');
          } else {
            // User doesn't have Canva Editor, assign Canva Editor
            actualProductSlug = 'canva-editor';
            console.log('✓ User does not have Canva Editor, assigning Canva Editor');
          }
        } else {
          // Canva Editor product not found in system, default to Canva Editor
          actualProductSlug = 'canva-editor';
          console.log('⚠ Canva Editor product not found in system, defaulting to Canva Editor');
        }
      }

      // Find product by actual product name
      if (actualProductSlug) {
        product = await strapi.documents('api::product.product').findFirst({
          filters: { slug: { $eq: actualProductSlug } },
        });
      }

      if (product) {
        console.log('✓ Product found:', product.name);
      } else {
        const productNotFoundEmail = getProductNotFoundEmail({
          productName: product_name,
          permalink: permalink || '',
          productId: product_id || '',
        });

        strapi.plugins['email'].services.email.send({
          to: env('ADMIN_EMAIL', 'admin@canvaclone.com'),
          from: env('FROM_EMAIL', 'no-reply@canvaclone.com'),
          subject: productNotFoundEmail.subject,
          html: productNotFoundEmail.html,
        });
        console.log('⚠ Product not found, creating order without product link');
      }

      // 3. Create order
      // Convert price from cents to dollars
      const priceInDollars = price ? parseFloat(price) / 100 : 0;
      const feeInDollars = gumroad_fee ? parseFloat(gumroad_fee) / 100 : 0;

      const order = await strapi.documents('api::order.order').create({
        data: {
          user: user.id,
          products: product ? [product.documentId] : [],
          email: buyerEmail,
          total: priceInDollars,
          payment_status: 'completed',
          payment_intent_id: sale_id || `gumroad_${Date.now()}`,
          metadata: {
            provider: 'gumroad',
            order_number,
            sale_timestamp,
            currency: currency || 'usd',
            quantity: quantity ? parseInt(quantity) : 1,
            gumroad_fee: feeInDollars,
            is_test: test === 'true',
            full_name,
          },
        },
      });

      console.log('✓ Order created:', order.documentId, `(${currency?.toUpperCase() || 'USD'} $${priceInDollars})`);

      // 4. Generate download link
      const downloadUrl = `${env('FRONTEND_URL')}/api/orders/${order.documentId}/download`;

      // 4.5. Get zip password based on product slug
      const productSlug = product?.slug || actualProductSlug || null;
      let zipPassword: string | undefined;
      if (productSlug === 'canva-editor') {
        zipPassword = env('CANVA_EDITOR_ZIP_PWD');
      } else if (productSlug === 'canva-clone') {
        zipPassword = env('CANVA_CLONE_ZIP_PWD');
      }

      // 5. Send purchase confirmation email with download link
      try {
        const displayProductName = product?.name || product_name || 'N/A';
        const purchaseConfirmationEmail = getPurchaseConfirmationEmail({
          orderId: order.documentId,
          productName: displayProductName,
          productSlug: productSlug || undefined,
          total: priceInDollars,
          currency: currency?.toUpperCase() || 'USD',
          downloadUrl,
          isNewUser,
          zipPassword,
        });

        await strapi.plugins['email'].services.email.send({
          to: user.email,
          from: env('FROM_EMAIL', 'no-reply@canvaclone.com'),
          subject: purchaseConfirmationEmail.subject,
          html: purchaseConfirmationEmail.html,
        });

        console.log('✓ Purchase confirmation email sent to:', user.email);
      } catch (emailError) {
        console.error('✗ Error sending purchase confirmation email:', emailError);
      }

      // 6. Create inbox message for support with download link
      const displayProductNameMsg = product?.name || product_name || 'N/A';
      const inboxMessage = getInboxMessage({
        orderId: order.documentId,
        productName: displayProductNameMsg,
        productSlug: productSlug || undefined,
        total: priceInDollars,
        currency: currency?.toUpperCase() || 'USD',
        downloadUrl,
        isNewUser,
        zipPassword,
      });

      await strapi.documents('api::message.message').create({
        data: {
          subject: inboxMessage.subject,
          content: inboxMessage.content,
          messageStatus: 'unread',
          userId: user.id.toString(),
          userName: user.username,
          userEmail: user.email,
        },
      });

      console.log('✓ Support message created for user:', user.email);

      // 7. Update webhook log with success status
      await strapi.documents('api::webhook-log.webhook-log').update({
        documentId: webhookLog.documentId,
        data: {
          status: 'success',
          order_id: order.documentId,
          user_id: user.id.toString(),
        },
      });

      console.log('✓ Webhook log updated successfully!');
      console.log('✅ All steps completed successfully!');
    } catch (error) {
      console.error('Gumroad webhook processing error:', error);

      // Update webhook log with failed status
      try {
        await strapi.documents('api::webhook-log.webhook-log').update({
          documentId: webhookLog.documentId,
          data: {
            status: 'failed',
            error_message: error.message || 'Unknown error',
          },
        });
      } catch (logError) {
        console.error('Failed to update webhook log:', logError);
      }
    }
}

