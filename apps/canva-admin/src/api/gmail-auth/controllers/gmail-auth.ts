/**
 * gmail-auth controller
 * Handles Gmail OAuth2 authentication to obtain refresh token
 */

'use strict';

const { google } = require('googleapis');

module.exports = ({ strapi }) => ({
  async getAuthUrl(ctx) {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:1337/api/auth/gmail/callback'
      );

      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://mail.google.com/'],
        prompt: 'consent',
      });

      return ctx.send({
        status: 'success',
        authUrl,
      });
    } catch (error) {
      strapi.log.error('Error generating auth URL:', error);
      ctx.throw(500, 'Failed to generate auth URL');
    }
  },

  async callback(ctx) {
    const { code } = ctx.query;

    if (!code) {
      return ctx.badRequest('No code provided');
    }

    try {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:1337/api/auth/gmail/callback'
      );

      const { tokens } = await oAuth2Client.getToken(code);

      return ctx.send({
        status: 'success',
        refreshToken: tokens.refresh_token,
      });
    } catch (error) {
      strapi.log.error('Error exchanging code for token:', error);
      ctx.throw(500, 'Failed to obtain refresh token');
    }
  },
});