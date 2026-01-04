//@ts-check

import { getApiUrl } from "./config/Env";

const { composePlugins, withNx } = require('@nx/next');
const nextIntlPlugin = require('next-intl/plugin');
// Next.js 16 with Turbopack: must use relative path (not absolute)
const withNextIntl = nextIntlPlugin('./src/i18n/config.ts');

// Conditionally apply withNx plugin - skip if project graph is not available (e.g., in CI)
// When NX_DAEMON is false or in CI, skip the withNx plugin to avoid project graph errors
const shouldSkipNxPlugin = process.env.NX_DAEMON === 'false' || process.env.CI || process.env.VERCEL;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nxPlugin = shouldSkipNxPlugin ? ((config: any) => config) : withNx;

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  reactStrictMode: false,
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  poweredByHeader: false,
  // Next.js 16: turbopack is now at top level (not experimental.turbopack)
  turbopack: {
    resolveAlias: {
      'react': '../../node_modules/react',
      'react-dom': '../../node_modules/react-dom',
      '@emotion/react': '../../node_modules/@emotion/react',
      '@emotion/styled': '../../node_modules/@emotion/styled',
      'styled-components': '../../node_modules/styled-components',
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    qualities: [100],
  },
  serverExternalPackages: [
    'canva-editor',
    '@emotion/react',
    '@emotion/styled',
    '@emotion/css',
    'styled-components'
  ],
  async rewrites() {
    return [
      {
        source: "/api/auth/connect/:provider",
        destination: `${getApiUrl()}/connect/:provider`,
      },
      {
        source: "/api/auth/:provider/callback",
        destination: `${getApiUrl()}/auth/:provider/callback`,
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  nxPlugin,
  withNextIntl,
];
// const withTM = require('next-transpile-modules')(['canva-editor']); // pass the modules you would like to see transpiled

module.exports = composePlugins(...plugins)(nextConfig);
