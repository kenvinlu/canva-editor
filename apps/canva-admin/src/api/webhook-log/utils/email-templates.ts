/**
 * Email templates for webhook processing
 */

interface PasswordResetEmailParams {
  resetUrl: string;
}

interface ProductNotFoundEmailParams {
  productName: string;
  permalink: string;
  productId: string;
}

interface PurchaseConfirmationEmailParams {
  orderId: string;
  productName: string;
  productSlug?: string;
  total: number;
  currency: string;
  downloadUrl: string;
  isNewUser: boolean;
  zipPassword?: string;
}

interface InboxMessageParams {
  orderId: string;
  productName: string;
  productSlug?: string;
  total: number;
  currency: string;
  downloadUrl: string;
  isNewUser: boolean;
  zipPassword?: string;
}

/**
 * Base email wrapper template for consistent styling
 */
function getEmailWrapper(content: string): string {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>CanvaClone</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5; overflow: hidden;">
          <!-- Email Header -->
          <tr>
            <td style="background-color: #ffffff; padding: 20px 30px; border-bottom: 1px solid #e5e5e5;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 5px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">From: CanvaClone Support</p>
                    <p style="margin: 0; color: #666666; font-size: 12px;">${currentDate}</p>
                  </td>
                  <td align="right">
                    <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">CanvaClone</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">Need help? Reply to this email or contact our support team.</p>
              <p style="margin: 0; color: #999999; font-size: 12px;">© ${new Date().getFullYear()} CanvaClone. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate password reset email template
 */
export function getPasswordResetEmail(params: PasswordResetEmailParams): {
  subject: string;
  html: string;
} {
  const { resetUrl } = params;

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #f5f5f5; border: 2px solid #1a1a1a; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">🔐</span>
      </div>
      <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Welcome to CanvaClone!</h2>
      <p style="margin: 0; color: #666666; font-size: 16px;">Thank you for your purchase. Your account has been created.</p>
    </div>
    
    <div style="background-color: #fafafa; border-left: 3px solid #1a1a1a; padding: 20px; margin: 30px 0;">
      <p style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Set Your Password</p>
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">Click the button below to set your password and access your account. This link will expire in 24 hours.</p>
    </div>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${resetUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 600; font-size: 16px;">Set Your Password</a>
    </div>
    
    <div style="margin-top: 30px; padding-top: 25px; border-top: 1px solid #e5e5e5;">
      <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; text-align: center;">Or copy and paste this link into your browser:</p>
      <p style="margin: 0; text-align: center;">
        <a href="${resetUrl}" style="color: #1a1a1a; text-decoration: underline; font-size: 13px; word-break: break-all;">${resetUrl}</a>
      </p>
    </div>
    
    <div style="margin-top: 25px; padding: 15px; background-color: #fafafa; border-left: 3px solid #666666; border-top: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5;">
      <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.5;">
        <strong style="color: #1a1a1a;">Security Notice:</strong> This link expires in 24 hours. If you didn't request this, please ignore this email.
      </p>
    </div>
  `;

  return {
    subject: 'Welcome! Set Your Password',
    html: getEmailWrapper(content),
  };
}

/**
 * Generate product not found admin notification email template
 */
export function getProductNotFoundEmail(params: ProductNotFoundEmailParams): {
  subject: string;
  html: string;
} {
  const { productName, permalink, productId } = params;

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #f5f5f5; border: 2px solid #1a1a1a; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">⚠️</span>
      </div>
      <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Product Not Found</h2>
      <p style="margin: 0; color: #666666; font-size: 16px;">An order was created without a product link.</p>
    </div>
    
    <div style="background-color: #fafafa; border: 1px solid #e5e5e5; padding: 25px; margin: 30px 0;">
      <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">Product Information</h3>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
            <strong style="color: #1a1a1a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">Product Name</strong>
            <span style="color: #666666; font-size: 15px;">${productName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
            <strong style="color: #1a1a1a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">Product Permalink</strong>
            <span style="color: #666666; font-size: 15px; word-break: break-all;">${permalink}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0;">
            <strong style="color: #1a1a1a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">Product ID</strong>
            <span style="color: #1a1a1a; font-size: 15px; font-family: monospace; background-color: #f5f5f5; padding: 4px 8px; display: inline-block;">${productId}</span>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #fafafa; border-left: 3px solid #1a1a1a; padding: 20px; margin-top: 25px;">
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Action Required:</strong> Please verify this product exists in the system and update the order accordingly.
      </p>
    </div>
  `;

  return {
    subject: 'Product not found, creating order without product link',
    html: getEmailWrapper(content),
  };
}

/**
 * Generate purchase confirmation email template
 */
export function getPurchaseConfirmationEmail(
  params: PurchaseConfirmationEmailParams
): {
  subject: string;
  html: string;
} {
  const { orderId, productName, total, currency, downloadUrl, isNewUser, zipPassword } = params;

  const subject = isNewUser
    ? `Welcome! Your Purchase is Ready - Order #${orderId}`
    : `Your Purchase is Ready - Order #${orderId}`;

  // Generate zip password section if password is provided
  const zipPasswordSection = zipPassword ? `
    <div style="background-color: #fafafa; border: 1px solid #e5e5e5; padding: 25px; margin: 30px 0;">
      <div style="text-align: center; margin-bottom: 15px;">
        <p style="margin: 0 0 12px 0; color: #1a1a1a; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Zip File Password</p>
      </div>
      <div style="background-color: #ffffff; border: 1px solid #e5e5e5; padding: 18px; margin: 15px 0; text-align: center;">
        <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 20px; color: #1a1a1a; font-weight: 700; letter-spacing: 2px; word-break: break-all;">${zipPassword}</p>
      </div>
      <p style="margin: 15px 0 0 0; color: #666666; font-size: 13px; text-align: center;">You will need this password to extract the zip file after downloading.</p>
    </div>
  ` : '';

  const welcomeSection = isNewUser ? `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #f5f5f5; border: 2px solid #1a1a1a; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">🎉</span>
      </div>
      <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 28px; font-weight: 600;">Welcome to CanvaClone!</h2>
      <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.6;">Thank you for your purchase! Your account has been created and your order is ready.</p>
    </div>
  ` : `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background-color: #f5f5f5; border: 2px solid #1a1a1a; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">✅</span>
      </div>
      <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 28px; font-weight: 600;">Thank You for Your Purchase!</h2>
      <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.6;">Your order has been confirmed and is ready for download.</p>
    </div>
  `;

  const content = `
    ${welcomeSection}
    
    <div style="background-color: #fafafa; padding: 25px; margin: 30px 0; border: 1px solid #e5e5e5;">
      <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">Order Details</h3>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
            <strong style="color: #1a1a1a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Order ID</strong>
            <span style="color: #666666; font-size: 16px; font-weight: 600; font-family: monospace;">#${orderId}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
            <strong style="color: #1a1a1a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Product</strong>
            <span style="color: #666666; font-size: 16px; font-weight: 500;">${productName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0;">
            <strong style="color: #1a1a1a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Total</strong>
            <span style="color: #1a1a1a; font-size: 20px; font-weight: 700;">${currency.toUpperCase()} $${total.toFixed(2)}</span>
          </td>
        </tr>
      </table>
    </div>
    
    ${zipPasswordSection}
    
    <div style="background-color: #fafafa; padding: 25px; margin: 30px 0; text-align: center; border: 1px solid #e5e5e5;">
      <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">Download Your Product</h3>
      <p style="margin: 0 0 25px 0; color: #666666; font-size: 15px;">Click the button below to download your purchase</p>
      <div style="margin-bottom: 20px;">
        <a href="${downloadUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 16px 40px; font-weight: 600; font-size: 16px;">
          Download Now
        </a>
      </div>
      <p style="margin: 20px 0 0 0; color: #666666; font-size: 13px;">Or copy this link:</p>
      <p style="margin: 10px 0 0 0;">
        <a href="${downloadUrl}" style="color: #1a1a1a; text-decoration: underline; font-size: 13px; word-break: break-all;">${downloadUrl}</a>
      </p>
    </div>
    
    ${isNewUser ? `
    <div style="background-color: #fafafa; border-left: 3px solid #1a1a1a; padding: 20px; margin-top: 25px;">
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Note:</strong> You must be logged in to download. If you haven't set your password yet, please check your welcome email.
      </p>
    </div>
    ` : `
    <div style="background-color: #fafafa; border-left: 3px solid #1a1a1a; padding: 20px; margin-top: 25px;">
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Note:</strong> You must be logged in to download your purchase.
      </p>
    </div>
    `}
    
    ${zipPassword ? `
    <div style="background-color: #fafafa; border-left: 3px solid #1a1a1a; padding: 20px; margin-top: 20px;">
      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
        <strong style="color: #1a1a1a;">Important:</strong> The zip file is password-protected. Use the password shown above to extract the files after downloading.
      </p>
    </div>
    ` : ''}
  `;

  return { subject, html: getEmailWrapper(content) };
}

/**
 * Generate inbox message for support
 */
export function getInboxMessage(params: InboxMessageParams): {
  subject: string;
  content: string;
} {
  const { orderId, productName, total, currency, downloadUrl, isNewUser, zipPassword } = params;

  const subject = isNewUser
    ? `Welcome & Support - ${productName}`
    : `Order Confirmation & Support - Order #${orderId}`;

  // Generate zip password section if password is provided
  const zipPasswordSection = zipPassword ? `
🔒 Zip File Password: <strong style="font-family: monospace; font-size: 16px; color: #4CAF50;">${zipPassword}</strong>

You will need this password to extract the zip file after downloading.
` : '';

  const content = isNewUser
    ? `Thank you for your purchase! Your account has been created. 

Order Details:
- Order ID: ${orderId}
- Product: ${productName}
- Total: ${currency.toUpperCase()} $${total.toFixed(2)}

${zipPasswordSection}
Download your product: <a href="${downloadUrl}">${downloadUrl}</a>

${zipPassword ? 'Important: The zip file is password-protected. Use the password shown above to extract the files.\n\n' : ''}If you need any help with your order or product, please reply to this message.`
    : `Thank you for your purchase!

Order Details:
- Order ID: ${orderId}
- Product: ${productName}
- Total: ${currency.toUpperCase()} $${total.toFixed(2)}

${zipPasswordSection}
Download your product: <a href="${downloadUrl}">${downloadUrl}</a>

${zipPassword ? 'Important: The zip file is password-protected. Use the password shown above to extract the files.\n\n' : ''}If you need any help with your order or product, please reply to this message.`;

  return { subject, content };
}

