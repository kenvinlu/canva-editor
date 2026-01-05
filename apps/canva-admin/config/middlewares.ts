export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
      rateLimit: {
        enabled: true,
        interval: 60000, // 1 minute
        max: 100, // Max requests per IP
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'https://localhost:3000',
        'https://localhost:3001',
        // Add your production domains here
        // 'https://yourdomain.com',
        // 'https://www.yourdomain.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      headers: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Cache-Control',
        'X-Pathname',
        'X-Nonce'
      ],
      credentials: true,
      maxAge: 86400,
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  // 'global::stripe-raw-body',
  {
		name: "strapi::body",
		config: {
			includeUnparsed: true,
		}
	},
  // 'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
