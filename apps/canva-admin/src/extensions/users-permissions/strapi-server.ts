import { validateYupSchema } from '@strapi/utils';
import _ from 'lodash';

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

// Helper function to create welcome message for new users
const createWelcomeMessage = async (user) => {
  try {
    await strapi.documents('api::message.message').create({
      data: {
        subject: `Welcome to CanvaClone!`,
        content: `Welcome ${
         user.firstName || user.username || 'there'
        }! <br/>Thank you for signing up. If you have any questions or need assistance, feel free to reply to this message. We're here to help!<br />Or purchase a product to start a conversation with us.`,
        messageStatus: 'unread',
        userId: user.id.toString(),
        userName: user.username || user.firstName || user.email.split('@')[0],
        userEmail: user.email,
      },
    });
    console.log('✓ Welcome message created for new user:', user.email);
  } catch (messageError) {
    console.error('✗ Error creating welcome message:', messageError);
    // Don't throw error - message creation failure shouldn't block user creation
  }
};

module.exports = (plugin) => {
  const getService = (name) => {
    return strapi.plugins['users-permissions'].service(name);
  };
  const rawAuth = plugin.controllers.auth({ strapi });

  const auth = ({ strapi }) => {
    return {
      ...rawAuth,
      callback: async (ctx) => {
        const provider = ctx.params.provider || 'local';
        const params = ctx.request.body;

        try {
          const store = strapi.store({
            type: 'plugin',
            name: 'users-permissions',
          });
          const grantSettings = await store.get({ key: 'grant' });

          const grantProvider = provider === 'local' ? 'email' : provider;

          if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
            return ctx.badRequest('auth.apiMessages.loginFailed');
          }

          if (provider === 'local') {
            await validateYupSchema(params);

            const { identifier, password } = params;

            if (!identifier || !password) {
              console.log(
                'identifier or password not found',
                identifier);
              return ctx.badRequest('auth.apiMessages.invalidPassword');
            }

            // Check if the user exists.
            // Use db.query to get private fields like password
            const user = await strapi.db
              .query('plugin::users-permissions.user')
              .findOne({
                where: {
                  $or: [
                    { email: identifier.toLowerCase() },
                    { username: identifier },
                  ],
                },
              });

            if (!user) {
              console.log('user not found');
              return ctx.badRequest('auth.apiMessages.invalidPassword');
            }

            // Check if user has a password (OAuth users might not have one)
            if (!user.password) {
              console.log('user has no password (likely OAuth user)');
              return ctx.badRequest('auth.apiMessages.invalidPassword');
            }

            const validPassword = await getService('user').validatePassword(
              params.password,
              user.password
            );

            if (!validPassword) {
              console.log('invalidPassword', validPassword);
              return ctx.badRequest('auth.apiMessages.invalidPassword');
            }

            const advancedSettings = await store.get({ key: 'advanced' });
            const requiresConfirmation = _.get(
              advancedSettings,
              'email_confirmation'
            );

            if (requiresConfirmation && user.confirmed !== true) {
              return ctx.badRequest('auth.apiMessages.loginFailed');
            }

            if (user.blocked === true) {
              return ctx.badRequest('auth.apiMessages.loginFailed');
            }

            return ctx.send({
              data: {
                jwt: getService('jwt').issue({ id: user.id }),
                user: await sanitizeUser(user, ctx),
              },
            });
          }
          // Connect the user with the third-party provider.
          let isNewUser = false;

          // Check if user exists before connecting
          const existingUser = await strapi
            .query('plugin::users-permissions.user')
            .findOne({
              where: { email: ctx.query.email?.toLowerCase() },
            });

          if (!existingUser) {
            isNewUser = true;
          }

          const user = await getService('providers').connect(
            provider,
            ctx.query
          );

          // Create welcome message for new OAuth users
          if (isNewUser && user) {
            await createWelcomeMessage(user);
          }

          return ctx.send({
            data: {
              jwt: getService('jwt').issue({ id: user.id }),
              user: await sanitizeUser(user, ctx),
            },
          });
        } catch (error) {
          console.log(error);
          return ctx.badRequest('auth.apiMessages.loginFailed');
        }
      },
      googleOneTapCallback: async (ctx) => {
        const profile = ctx.request.body;

        const email = _.toLower(profile.email);

        // We need at least the mail.
        if (!email) {
          throw new Error('auth.apiMessages.missingRequiredFields');
        }

        const { firstName, lastName } = profile;

        // We need at least the mail.
        if (!firstName || !lastName) {
          throw new Error('auth.apiMessages.missingRequiredFields');
        }

        const users = await strapi
          .query('plugin::users-permissions.user')
          .findMany({
            where: { email },
          });

        const advancedSettings = await strapi
          .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
          .get();

        const user = _.find(users, { provider: 'google' });

        if (_.isEmpty(user) && !advancedSettings.allow_register) {
          throw new Error('Register action is actually not available.');
        }

        if (!_.isEmpty(user)) {
          const requiresConfirmation = _.get(
            advancedSettings,
            'email_confirmation'
          );

          if (requiresConfirmation && user.confirmed !== true) {
            return ctx.badRequest('auth.apiMessages.loginFailed');
          }

          if (user.blocked === true) {
            return ctx.badRequest('auth.apiMessages.loginFailed');
          }

          return ctx.send({
            data: {
              jwt: getService('jwt').issue({ id: user.id }),
              user: await sanitizeUser(user, ctx),
            },
          });
        }

        if (users.length && advancedSettings.unique_email) {
          throw new Error('auth.apiMessages.loginFailed');
        }

        // Retrieve default role.
        const defaultRole = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: advancedSettings.default_role } });

        // Create the new user.
        const newUser = {
          ...profile,
          email, // overwrite with lowercased email
          provider: 'google',
          role: defaultRole.id,
          confirmed: true,
        };

        try {
          const createdUser = await strapi
            .query('plugin::users-permissions.user')
            .create({ data: newUser });

          // Create welcome message for the new user
          await createWelcomeMessage(createdUser);

          return ctx.send({
            data: {
              jwt: getService('jwt').issue({ id: createdUser.id }),
              user: await sanitizeUser(createdUser, ctx),
            },
          });
        } catch (error) {
          void error;
          return ctx.badRequest('auth.apiMessages.loginFailed');
        }
      },
      register: async (ctx) => {
        const params = ctx.request.body;
        console.log('register', params);
        try {
          const store = strapi.store({
            type: 'plugin',
            name: 'users-permissions',
          });
          const grantSettings = await store.get({ key: 'grant' });
          const advancedSettings = await store.get({ key: 'advanced' });

          const grantProvider = 'email';

          if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
            return ctx.badRequest('auth.apiMessages.registerDisabled');
          }

          if (!advancedSettings.allow_register) {
            return ctx.badRequest('auth.apiMessages.registerDisabled');
          }

          await validateYupSchema(params);

          const { email, username, password } = params;

          if (!email || !password) {
            return ctx.badRequest('auth.apiMessages.missingRequiredFields');
          }

          // Check if the user already exists
          const existingUser = await strapi
            .query('plugin::users-permissions.user')
            .findOne({
              where: {
                $or: [
                  { email: email.toLowerCase() },
                  { username: username || email },
                ],
              },
            });

          if (existingUser) {
            return ctx.badRequest('auth.apiMessages.emailAlreadyTaken');
          }

          // Retrieve default role
          const defaultRole = await strapi
            .query('plugin::users-permissions.role')
            .findOne({ where: { type: advancedSettings.default_role } });

          if (!defaultRole) {
            return ctx.badRequest('auth.apiMessages.registerFailed');
          }

          // Create the new user
          const newUser = {
            ...params,
            email: email.toLowerCase(),
            username: username || email.toLowerCase(),
            password: password,
            provider: 'local',
            role: defaultRole.id,
            confirmed: !advancedSettings.email_confirmation,
          };

          // Use entity service to create the user
          const createdUser = await strapi.entityService.create(
            'plugin::users-permissions.user',
            {
              data: newUser,
            }
          );
          console.log('createdUser', createdUser);
          // Create welcome message for the new user
          await createWelcomeMessage(createdUser);

          return ctx.send({
            data: {
              jwt: getService('jwt').issue({ id: createdUser.id }),
              user: await sanitizeUser(createdUser, ctx),
            },
          });
        } catch (error) {
          console.log('Register error:', error);
          return ctx.badRequest('auth.apiMessages.registerFailed');
        }
      },
    };
  };

  plugin.controllers.auth = auth;
  plugin.routes['content-api'].routes.unshift({
    method: 'POST',
    path: '/auth/google-one-tap-callback',
    handler: 'auth.googleOneTapCallback',
    config: {
      prefix: '',
      auth: false,
    },
  });

  return plugin;
};
