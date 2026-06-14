/**
 * otp controller
 */

import { factories } from '@strapi/strapi';
import { randomInt } from 'crypto';
import { addMinutes } from 'date-fns';
import utils from '@strapi/utils';
import { Totp } from 'time2fa';

const { ValidationError, ApplicationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

export default factories.createCoreController('api::otp.otp', ({ strapi }) => ({
  async register(ctx, next) {
    // Call the register function from users-permissions plugin
    // It will handle the response with JWT and user data via ctx.send()
    await strapi.controllers['plugin::users-permissions.auth'].register(
      ctx,
      next
    );
    
    // The register function already sent the response with JWT and user data
    // Check if response was already sent (ctx.body or ctx.response.body is set)
    // If not, it means there was an error, so we don't need to do anything
    // The register function handles errors via ctx.badRequest() which also sends a response
  },

  async login(ctx, next) {
    const provider = ctx.params.provider || 'local';

    // Run default Strapi authentication
    await strapi.controllers['plugin::users-permissions.auth'].callback(
      ctx,
      next
    );

    if (provider === 'local') {
      try {
        const { data } = ctx.body as { data: { user: any; jwt: string } };
        const { user, jwt } = data;

        if (!user) {
          return ctx.badRequest('auth.apiMessages.userNotFound');
        }

        let verifyType = null;

        // Check if TOTP is enabled and secret exists
        if (user.enableTotp) {
          verifyType = 'totp';

          // Query user to get private fields like totpSecret
          const userWithSecret = await strapi
            .documents('plugin::users-permissions.user')
            .findOne({ documentId: user.documentId });

          if (!userWithSecret && !user.totpSecret) {
            return ctx.badRequest('auth.apiMessages.totpSecretNotFound');
          }
        } else if (user.enableOtp) {
          verifyType = 'otp';
          // Check for existing valid OTP
          const existingOtp = await strapi.db.query('api::otp.otp').findOne({
            where: {
              user: user.id,
              expiresAt: { $gte: new Date().toISOString() },
            },
          });

          if (existingOtp) {
            // Reuse existing OTP
            return ctx.send({
              error: {
                details: {
                  email: user.email,
                  verifyType,
                },
                message: 'auth.apiMessages.otpAlreadySent',
              },
            });
          }
          // Generate secure 6-digit OTP
          const code = randomInt(100000, 999999).toString();
          const expiresAt = addMinutes(new Date(), 30).toISOString();

          // Store OTP
          const otpEntry = await strapi.documents('api::otp.otp').create({
            data: {
              code,
              expiresAt,
              user: user.id,
            },
          });

          if (!otpEntry) {
            return ctx.badRequest('auth.apiMessages.otpGenerationFailed');
          }

          // Send OTP via email
          await strapi
            .plugin('email')
            .service('email')
            .send({
              to: user.email,
              from: 'noreply@canvaclone.com', // Replace with valid email
              subject: 'Login OTP',
              text: `Your login OTP is: ${code}. It expires in 30 minutes.`,
            });
        } else {
          // No 2FA required, return default response
          return ctx.send({ data: { jwt, user } });
        }

        // Return response indicating 2FA is required
        return ctx.send({
          data: {
            email: user.email,
            verifyType,
            message: `Please verify using ${verifyType}`,
          },
        });
      } catch (err) {
        strapi.log.error('Login error:', err);
        return ctx.badRequest('auth.apiMessages.loginFailed');
      }
    }
  },

  async verifyCode(ctx) {
    const { code, email, type } = ctx.request.body;

    try {
      // Validate input
      if (!code || !email || !type) {
        return ctx.badRequest('auth.apiMessages.missingRequiredFields');
      }

      // Find user
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { email } });

      if (!user) {
        return ctx.badRequest('auth.apiMessages.codeVerificationFailed');
      }

      let isValid = false;

      if (type === 'totp') {
        isValid = await strapi
          .service('api::otp.otp')
          .verifyTotp(code, user.totpSecret);
      } else if (type === 'otp') {
        isValid = await strapi.service('api::otp.otp').verifyOtp(email, code);
      } else {
        return ctx.badRequest('auth.apiMessages.invalidVerificationType');
      }

      if (!isValid) {
        return ctx.badRequest('auth.apiMessages.codeVerificationFailed');
      }

      // Sanitize user output
      const sanitizedUser = await sanitizeUser(user, ctx);

      // Generate JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      ctx.send({ data: { jwt, user: sanitizedUser } });
    } catch (err) {
      strapi.log.error('Code verification error:', err);
      return ctx.badRequest('auth.apiMessages.codeVerificationFailed');
    }
  },

  async generateTotpSecret(ctx) {
    if (!ctx.state.user) {
      throw new ApplicationError('auth.apiMessages.authenticationRequired');
    }

    try {
      const data = Totp.generateKey({
        issuer: 'CanvaClone',
        user: ctx.state.user.email,
      });
      console.log(data);
      ctx.send({
        data: { email: data.user, secret: data.secret, url: data.url },
      });
    } catch (error) {
      console.log(error);
      ctx.send({ error: { message: error.message } });
    }
  },

  async saveTotpSecret(ctx) {
    try {
      if (!ctx.state.user) {
        throw new ApplicationError('auth.apiMessages.authenticationRequired');
      }

      const { secret, code } = ctx.request.body;
      const success = Totp.validate({ passcode: code, secret });

      if (!success) {
        throw new ValidationError(
          'auth.apiMessages.totpSecretValidationFailed'
        );
      }

      await strapi.plugins['users-permissions'].services.user.edit(
        ctx.state.user.id,
        {
          totpSecret: secret,
          enableTotp: true,
        }
      );

      ctx.send({ data: { success } });
    } catch (error) {
      ctx.send({ error: { message: error.message } });
    }
  },

  async totpEnabled(ctx) {
    const user = await strapi
      .documents('plugin::users-permissions.user')
      .findOne({ documentId: ctx.state.user.documentId });

    const enabled = user.enableTotp && user.totpSecret;

    if (enabled) {
      ctx.send({ data: { success: true } });
      return;
    }
    const data = Totp.generateKey({
      issuer: 'CanvaClone',
      user: ctx.state.user.email,
    });
    
    ctx.send({
      data: { email: data.user, secret: data.secret, url: data.url },
    });
  },

  async enableTwoFactor(ctx) {
    const { password, totpCode } = ctx.request.body;

    try {
      const user = await strapi
        .documents('plugin::users-permissions.user')
        .findOne({ documentId: ctx.state.user.documentId });

      if (!user) {
        throw new ApplicationError('User not found');
      }

      // Verify password using Strapi's password validation service
      const isValidPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(password, user.password);

      if (!isValidPassword) {
        throw new ApplicationError('auth.apiMessages.invalidPassword');
      }

      if (user.enableTotp) {
        throw new ApplicationError('auth.apiMessages.twoFactorAlreadyEnabled');
      }

      await strapi.plugins['users-permissions'].services.user.edit(
        ctx.state.user.id,
        {
          enableOtp: false,
          enableTotp: true,
          totpSecret: totpCode,
        }
      );

      ctx.send({ data: { success: true } });
    } catch (error) {
      ctx.send({ error: { message: error.message } });
    }
  },

  async disableTwoFactor(ctx) {
    const { password } = ctx.request.body;

    try {
      const user = await strapi
        .documents('plugin::users-permissions.user')
        .findOne({ documentId: ctx.state.user.documentId });

      if (!user) {
        throw new ApplicationError('auth.apiMessages.userNotFound');
      }

      // Verify password using Strapi's password validation service
      const isValidPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(password, user.password);

      if (!isValidPassword) {
        throw new ApplicationError('auth.apiMessages.invalidPassword');
      }

      if (!user.enableTotp) {
        throw new ApplicationError('auth.apiMessages.twoFactorNotEnabled');
      }

      await strapi.plugins['users-permissions'].services.user.edit(
        ctx.state.user.id,
        {
          enableTotp: false,
          totpSecret: null,
        }
      );

      ctx.send({ data: { success: true } });
    } catch (error) {
      ctx.send({ error: { message: error.message } });
    }
  },

  async enableOTP(ctx) {
    const { password } = ctx.request.body;

    try {
      const user = await strapi
        .documents('plugin::users-permissions.user')
        .findOne({ documentId: ctx.state.user.documentId });

      if (!user) {
        throw new ApplicationError('auth.apiMessages.userNotFound');
      }

      // Verify password using Strapi's password validation service
      const isValidPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(password, user.password);

      if (!isValidPassword) {
        throw new ApplicationError('auth.apiMessages.invalidPassword');
      }

      if (user.enableOtp) {
        throw new ApplicationError('auth.apiMessages.otpAlreadyEnabled');
      }

      await strapi.plugins['users-permissions'].services.user.edit(
        ctx.state.user.id,
        {
          enableOtp: true,
          totpSecret: null,
          enableTotp: false,
        }
      );

      ctx.send({ data: { success: true } });
    } catch (error) {
      ctx.send({ error: { message: error.message } });
    }
  },

  async disableOTP(ctx) {
    const { password } = ctx.request.body;

    try {
      const user = await strapi
        .documents('plugin::users-permissions.user')
        .findOne({ documentId: ctx.state.user.documentId });

      if (!user) {
        throw new ApplicationError('auth.apiMessages.userNotFound');
      }

      // Verify password using Strapi's password validation service
      const isValidPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(password, user.password);

      if (!isValidPassword) {
        throw new ApplicationError('auth.apiMessages.invalidPassword');
      }

      if (!user.enableOtp) {
        throw new ApplicationError('auth.apiMessages.otpNotEnabled');
      }

      await strapi.plugins['users-permissions'].services.user.edit(
        ctx.state.user.id,
        {
          enableOtp: false,
        }
      );

      ctx.send({ data: { success: true } });
    } catch (error) {
      ctx.send({ error: { message: error.message } });
    }
  },
}));
