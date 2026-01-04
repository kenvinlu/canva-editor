// @ts-nocheck
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { EsLinter, linterPlugin } from 'vite-plugin-linter';
import * as packageJson from './package.json';
import { fileURLToPath, URL } from 'url';

// Define alias mappings
const aliasMappings = {
  'components': './src/components',
  'utils': './src/utils',
  'types': './src/types',
  'layers': './src/layers',
  'hooks': './src/hooks',
  'layout': './src/layout',
  'icons': './src/icons',
  'color-picker': './src/color-picker',
  'drag-and-drop': './src/drag-and-drop',
  'search-autocomplete': './src/search-autocomplete',
  'tooltip': './src/tooltip',
};

// Generate aliases
const aliases = Object.entries(aliasMappings).map(([key, path]) => {
  const alias = {
    find: `canva-editor/${key}`,
    replacement: fileURLToPath(new URL(path, import.meta.url)),
  };
  // console.log(`Alias: ${alias.find} -> ${alias.replacement}`);
  return alias;
});

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    dts({ include: 'src', insertTypesEntry: true }),
    tsconfigPaths(),
    libInjectCss(),
    // Only enable linter in development mode
    ...(configEnv.mode === 'development' ? [
      linterPlugin({
        include: ['./src/**/*.{ts,tsx}'],
        linters: [
          new EsLinter({
            configEnv,
            failOnError: false,
            failOnWarning: false,
          }),
        ],
      })
    ] : []),
  ],
  optimizeDeps: {
    include: ['esm-dep'],
  },
  build: {
    // do not copy the contents of the public folder to the dist folder
    emptyOutDir: true,
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      // this is the file that exports our components
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CanvaEditor',
      fileName: (format) => `canva-editor.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        '@emotion/react',
        '@emotion/styled',
        'styled-components',
        ...Object.keys(packageJson.peerDependencies || {})
      ],
      output: {
        // banner: '"use client";',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          'styled-components': 'styled'
        },
        exports: 'named'
      },
    },
    commonjsOptions: {
      exclude: ['canva-editor'],
    },
  },
  resolve: {
    alias: aliases,
  },
}));
