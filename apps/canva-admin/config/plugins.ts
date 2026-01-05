export default ({ env }) => ({
  email: {
    config: {
    //   provider: 'nodemailer',
    //   providerOptions: {
    //     host: env('SMTP_HOST'),
    //     port: env('SMTP_PORT'),
    //     secure: true,
    //     debug: true, // Enable SMTP logs
    //     logger: true,
    //     auth: {
    //       type: 'OAuth2',
    //       user: env('SMTP_USERNAME'),
    //       clientId: env('GOOGLE_CLIENT_ID'),
    //       clientSecret: env('GOOGLE_CLIENT_SECRET'),
    //       // Get Google refresh token:
    //       // 1. Go to http://localhost:1337/api/auth/gmail
    //       // 2. Open authUrl in browser
    //       // 3. Copy refresh token from browser console
    //       // Remember add URI (Authorized redirect URIs) in Google Cloud Console: http://localhost:1337/api/auth/gmail/callback
    //       refreshToken: env('GOOGLE_REFRESH_TOKEN'),
    //     },
    //     tls: {
    //       rejectUnauthorized: true,
    //       minVersion: 'TLSv1.2',
    //     },
    //     // Connection timeout settings for Railway and production environments
    //     connectionTimeout: 60000, // 60 seconds
    //     greetingTimeout: 30000, // 30 seconds
    //     socketTimeout: 60000, // 60 seconds
    //     // Connection pool settings
    //     pool: true,
    //     maxConnections: 5,
    //     maxMessages: 100,
    //     rateDelta: 1000,
    //     rateLimit: 5,
    //   },

    //   settings: {
    //     defaultFrom: env('FROM_EMAIL'),
    //     defaultReplyTo: env('REPLY_EMAIL'),
    //   },
    // },
      provider: 'mailer-api',
      providerOptions: {
        // Next.js API URL - should point to your Next.js app's API
        // For production: use your Next.js app URL (e.g., 'https://your-nextjs-app.com/api')
        // For development: use 'http://localhost:3000/api' (adjust port if different)
        apiUrl: env('NEXTJS_API_URL', 'http://localhost:3000/api'),
        // Secret API key to authenticate requests from Strapi to Next.js
        // This should match EMAIL_API_KEY in your Next.js .env
        apiKey: env('EMAIL_API_KEY', 'no-key-set'),
      },

      settings: {
        defaultFrom: env('FROM_EMAIL'),
        defaultReplyTo: env('REPLY_EMAIL'),
      },
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['firstName', 'lastName', 'phone', 'email', 'username', 'password'],
      },
    },
  },
  'preview-button': {
    config: {
      contentTypes: [
        {
          uid: 'api::page.page',
          draft: {
            url: `/page/{slug}`,
          },
          published: {
            url: `/page/{slug}`,
          },
        },
        {
          uid: 'api::article.article',
          draft: {
            url: `/blog/{slug}`,
          },
          published: {
            url: `/blog/{slug}`,
          },
        }
      ],
    },
  },
  ckeditor5: {
    enabled: true
  },
  seo: {
    enabled: true,
  },
  comments: {
    enabled: true,
    config: {
      badWords: false,
      moderatorRoles: ['Authenticated', 'Administrator'],
      approvalFlow: ['api::article.article'],
      entryLabel: {
        '*': ['Title', 'title', 'Name', 'name', 'Subject', 'subject'],
      },
      reportReasons: {
        MY_CUSTOM_REASON: 'MY_CUSTOM_REASON',
      },
      gql: {
        auth: false,
      },
    },
  },
});
