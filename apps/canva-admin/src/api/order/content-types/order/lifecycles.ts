/**
 * order lifecycles
 */

import { env } from '@strapi/utils';

export default {
  /**
   * Lifecycle hook that runs after an order is created
   * Sends a thank you email to the customer
   */
  async afterCreate(event) {
    const { result } = event;

    // Only send email if order has an email address
    if (!result.email) {
      console.log('Order created without email, skipping thank you email');
      return;
    }

    try {
      // Populate products if not already populated
      let order = result;
      if (!order.products || order.products.length === 0) {
        order = await strapi.documents('api::order.order').findOne({
          documentId: result.documentId,
          populate: ['products'],
        });
      }

      // Prepare email content
      const orderTotal = order.total ? `$${parseFloat(order.total).toFixed(2)}` : 'N/A';
      const productNames = order.products && order.products.length > 0
        ? order.products.map((p: any) => p.name || 'Product').join(', ')
        : 'your products';

      // Send thank you email
      await strapi.plugins['email'].services.email.send({
        to: 'canvaclone@yopmail.com', // TODO: result.email,
        from: env('FROM_EMAIL','no-reply@canvaclone.com'),
        subject: 'Thank You for Your Order!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Thank You for Your Order!</h2>
            <p>Dear Customer,</p>
            <p>We wanted to take a moment to thank you for your purchase. Your order has been received and is being processed.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.documentId}</p>
              <p style="margin: 5px 0;"><strong>Order Total:</strong> ${orderTotal}</p>
              <p style="margin: 5px 0;"><strong>Products:</strong> ${productNames}</p>
              <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.payment_status || 'Pending'}</p>
            </div>

            ${order.payment_status === 'completed' 
              ? '<p>Your payment has been confirmed. You will receive a separate email with download links for your digital products.</p>'
              : '<p>Once your payment is confirmed, you will receive an email with download links for your digital products.</p>'
            }

            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
            
            <p>Best regards,<br>The Team</p>
          </div>
        `,
        text: `
Thank You for Your Order!

Dear Customer,

We wanted to take a moment to thank you for your purchase. Your order has been received and is being processed.

Order Details:
- Order ID: ${order.documentId}
- Order Total: ${orderTotal}
- Products: ${productNames}
- Payment Status: ${order.payment_status || 'Pending'}

${order.payment_status === 'completed' 
  ? 'Your payment has been confirmed. You will receive a separate email with download links for your digital products.'
  : 'Once your payment is confirmed, you will receive an email with download links for your digital products.'
}

If you have any questions or need assistance, please don't hesitate to reach out to our support team.

Best regards,
The Team
        `,
      });

      console.log(`✓ Thank you email sent to ${result.email} for order ${order.documentId}`);
    } catch (error) {
      // Log error but don't throw - we don't want to fail order creation if email fails
      console.error(`✗ Failed to send thank you email for order ${result.documentId}:`, error);
      strapi.log.error('Thank you email error:', error);
    }
  },
};

