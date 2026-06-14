/**
 * order controller
 */

import { factories } from '@strapi/strapi';
import { env } from '@strapi/utils';

export default factories.createCoreController(
  'api::order.order',
  ({ strapi }) => ({
    /**
     * Handle Gumroad webhook for post-purchase
     * @param ctx
     * @returns
     */
    async handleGumroadWebhook(ctx) {
      let webhookLog = null;

      try {
        const webhookData = ctx.request.body;
        console.log('Gumroad webhook received:', webhookData);

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

        // Create initial webhook log
        try {
          webhookLog = await strapi.documents('api::webhook-log.webhook-log').create({
            data: {
              provider: 'gumroad',
              event_type: 'sale',
              payload: webhookData,
              status: 'processing',
            },
          });
          console.log('✓ Webhook log created:', webhookLog.documentId, 'with status:', webhookLog.status);
        } catch (logError) {
          console.error('Failed to create webhook log:', logError);
          console.error('Log error details:', logError.message);
          // Continue processing even if log creation fails
        }

        if (!buyerEmail) {
          throw new Error('Email is required');
        }

        // Check for refunded or disputed sales
        if (refunded === 'true' || disputed === 'true') {
          console.log('⚠ Sale is refunded or disputed, skipping processing');

          if (webhookLog?.documentId) {
            await strapi.documents('api::webhook-log.webhook-log').update({
              documentId: webhookLog.documentId,
              data: {
                status: 'failed',
                error_message: `Sale ${refunded === 'true' ? 'refunded' : 'disputed'} - skipped processing`,
              },
            });
          }

          ctx.send({
            success: true,
            message: 'Webhook skipped - sale refunded or disputed',
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
            const resetPasswordToken = await strapi
              .plugins['users-permissions']
              .service('user')
              .createResetPasswordToken(user.id);

            const resetUrl = `${env('FRONTEND_URL')}/reset-password?code=${resetPasswordToken}`;

            await strapi.plugins['email'].services.email.send({
              to: 'canvaclone@yopmail.com', // TODO: user.email,
              from: env('FROM_EMAIL', 'no-reply@canvaclone.com'),
              subject: 'Welcome! Set Your Password',
              html: `
                <h2>Welcome to CanvaClone!</h2>
                <p>Thank you for your purchase. Your account has been created.</p>
                <p>Please click the link below to set your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't make this purchase, please ignore this email.</p>
              `,
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
          const emailSubject = isNewUser
            ? `Welcome! Your Purchase is Ready - Order #${order.documentId}`
            : `Your Purchase is Ready - Order #${order.documentId}`;

          // Generate zip password section if password is provided
          const zipPasswordSection = zipPassword ? `
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                <p style="margin: 5px 0; font-weight: bold; color: #333;">🔒 Zip File Password:</p>
                <p style="margin: 5px 0; font-family: monospace; font-size: 16px; color: #4CAF50; font-weight: bold; letter-spacing: 1px;">${zipPassword}</p>
                <p style="margin: 10px 0 5px 0; font-size: 14px; color: #666;">You will need this password to extract the zip file after downloading.</p>
              </div>
            ` : '';

          const emailContent = isNewUser
            ? `
              <h2>Welcome to CanvaClone!</h2>
              <p>Thank you for your purchase! Your account has been created and your order is ready.</p>
              <p><strong>Order Details:</strong></p>
              <ul>
                <li>Order ID: ${order.documentId}</li>
                <li>Product: ${displayProductName}</li>
                <li>Total: ${currency?.toUpperCase() || 'USD'} $${priceInDollars.toFixed(2)}</li>
              </ul>
              ${zipPasswordSection}
              <p><strong>Download your product:</strong></p>
              <p><a href="${downloadUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Now</a></p>
              <p>Or copy this link: <a href="${downloadUrl}">${downloadUrl}</a></p>
              <p><em>Note: You must be logged in to download. If you haven't set your password yet, please check your welcome email.</em></p>
              ${zipPassword ? '<p><strong>Important:</strong> The zip file is password-protected. Use the password shown above to extract the files.</p>' : ''}
              <p>If you need any help, please reply to this email or contact our support team.</p>
            `
            : `
              <h2>Thank You for Your Purchase!</h2>
              <p>Your order has been confirmed and is ready for download.</p>
              <p><strong>Order Details:</strong></p>
              <ul>
                <li>Order ID: ${order.documentId}</li>
                <li>Product: ${displayProductName}</li>
                <li>Total: ${currency?.toUpperCase() || 'USD'} $${priceInDollars.toFixed(2)}</li>
              </ul>
              ${zipPasswordSection}
              <p><strong>Download your product:</strong></p>
              <p><a href="${downloadUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Now</a></p>
              <p>Or copy this link: <a href="${downloadUrl}">${downloadUrl}</a></p>
              <p><em>Note: You must be logged in to download.</em></p>
              ${zipPassword ? '<p><strong>Important:</strong> The zip file is password-protected. Use the password shown above to extract the files.</p>' : ''}
              <p>If you need any help, please reply to this email or contact our support team.</p>
            `;

          await strapi.plugins['email'].services.email.send({
            to: 'canvaclone@yopmail.com', // TODO: user.email,
            from: env('FROM_EMAIL', 'no-reply@canvaclone.com'),
            subject: emailSubject,
            html: emailContent,
          });

          console.log('✓ Purchase confirmation email sent to:', user.email);
        } catch (emailError) {
          console.error('✗ Error sending purchase confirmation email:', emailError);
        }

        // 6. Create inbox message for support with download link
        const displayProductName = product?.name || product_name || 'N/A';
        const messageSubject = isNewUser
          ? `Welcome & Support - Order #${order.documentId}`
          : `Order Confirmation & Support - Order #${order.documentId}`;

        // Generate zip password section if password is provided
        const zipPasswordSection = zipPassword ? `
🔒 Zip File Password: <strong style="font-family: monospace; font-size: 16px; color: #4CAF50;">${zipPassword}</strong>

You will need this password to extract the zip file after downloading.
` : '';

        const messageContent = isNewUser
          ? `Thank you for your purchase! Your account has been created. 

Order Details:
- Order ID: ${order.documentId}
- Product: ${displayProductName}
- Total: ${currency?.toUpperCase() || 'USD'} $${priceInDollars.toFixed(2)}

${zipPasswordSection}
Download your product: <a href="${downloadUrl}">${downloadUrl}</a>

${zipPassword ? 'Important: The zip file is password-protected. Use the password shown above to extract the files.\n\n' : ''}If you need any help with your order or product, please reply to this message.`
          : `Thank you for your purchase!

Order Details:
- Order ID: ${order.documentId}
- Product: ${displayProductName}
- Total: ${currency?.toUpperCase() || 'USD'} $${priceInDollars.toFixed(2)}

${zipPasswordSection}
Download your product: <a href="${downloadUrl}">${downloadUrl}</a>

${zipPassword ? 'Important: The zip file is password-protected. Use the password shown above to extract the files.\n\n' : ''}If you need any help with your order or product, please reply to this message.`;

        await strapi.documents('api::message.message').create({
          data: {
            subject: messageSubject,
            content: messageContent,
            messageStatus: 'unread',
            userId: user.id.toString(),
            userName: user.username,
            userEmail: user.email,
          },
        });

        console.log('✓ Support message created for user:', user.email);

        // 5. Update webhook log with success status - IMPORTANT: Do this last
        console.log('DEBUG: webhookLog exists?', !!webhookLog, 'documentId?', webhookLog?.documentId);

        if (webhookLog && webhookLog.documentId) {
          try {
            console.log('→ Updating webhook log status to success:', webhookLog.documentId);
            console.log('→ Order ID:', order.documentId);
            console.log('→ User ID:', user.id);

            const updatedLog = await strapi.documents('api::webhook-log.webhook-log').update({
              documentId: webhookLog.documentId,
              data: {
                status: 'success',
                order_id: order.documentId,
                user_id: user.id.toString(),
              },
            });

            console.log('✓ Webhook log updated successfully!');
            console.log('✓ Final status:', updatedLog.status);
            console.log('✓ Final order_id:', updatedLog.order_id);
            console.log('✓ Final user_id:', updatedLog.user_id);
          } catch (logUpdateError) {
            console.error('✗ Failed to update webhook log to success:', logUpdateError);
            console.error('✗ Error message:', logUpdateError.message);
            console.error('✗ Error details:', JSON.stringify(logUpdateError, null, 2));
            // Don't throw error - webhook processing was successful
          }
        } else {
          console.warn('⚠ Webhook log not found or missing documentId');
          console.warn('⚠ webhookLog:', webhookLog);
        }

        console.log('✅ All steps completed successfully!');

        // Send success response
        ctx.send({
          success: true,
          message: 'Webhook processed successfully',
          data: {
            orderId: order.documentId,
            userId: user.id,
            isNewUser,
            webhookLogId: webhookLog?.documentId,
          },
        });
      } catch (error) {
        console.error('Gumroad webhook error:', error);

        // Update webhook log with failed status
        if (webhookLog) {
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

        ctx.throw(500, error.message);
      }
    },

    /**
     * Download product file from order
     * Requires authentication and validates user owns the order
     * @param ctx
     * @returns
     */
    async download(ctx) {
      try {
        // 1. Check authentication
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized('Authentication required');
        }

        // 2. Get order ID from params
        const { id } = ctx.params;
        if (!id) {
          return ctx.badRequest('Order ID is required');
        }

        // 3. Find order with populated products and user
        const order = await strapi.documents('api::order.order').findOne({
          documentId: id,
          populate: {
            products: true,
            user: true,
          },
        });

        if (!order) {
          return ctx.notFound('Order not found');
        }

        // 4. Validate user owns the order
        const orderUserId = typeof order.user === 'object' ? order.user.id : order.user;
        if (orderUserId !== user.id) {
          return ctx.forbidden('You do not have permission to download this order');
        }

        // 5. Validate payment status
        if (order.payment_status !== 'completed') {
          return ctx.badRequest('Order payment is not completed');
        }

        // 6. Check if order has products
        const products = Array.isArray(order.products) ? order.products : [order.products];
        if (!products || products.length === 0) {
          return ctx.badRequest('Order has no products');
        }

        // 7. Get download URL from the first product
        const firstProduct = products[0];
        
        if (!firstProduct.download_url) {
          return ctx.badRequest('Product does not have a download file');
        }

        if (!firstProduct.download_url) {
          return ctx.notFound('Download file not found');
        }

        // 8. Increment download count
        const currentDownloadCount = order.download_count || 0;
        await strapi.documents('api::order.order').update({
          documentId: id,
          data: {
            download_count: currentDownloadCount + 1,
          },
        });

        // 9. Get the file URL
        // For private files, we need to use Strapi's upload service to get the file
        const fileUrl = firstProduct.download_url;
        
        // If the URL is relative, make it absolute
        const baseUrl = ctx.request.origin || '';
        const absoluteUrl = fileUrl.startsWith('http') 
          ? fileUrl 
          : `${baseUrl}${fileUrl}`;

        // 10. Redirect to the file URL
        // Note: For private files, Strapi handles authentication through the upload plugin
        // The file URL should be accessible if the user is authenticated
        ctx.redirect(absoluteUrl);
      } catch (error) {
        console.error('Download error:', error);
        ctx.throw(500, error.message || 'Failed to process download');
      }
    },
  })
);
