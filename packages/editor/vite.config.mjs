import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import EsLint from 'vite-plugin-linter';
import * as packageJson from './package.json';

const { EsLinter, linterPlugin } = EsLint;

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    dts({ include: 'src', insertTypesEntry: true }),
    tsconfigPaths(),
    libInjectCss(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
  ],
  optimizeDeps: {
    include: ['esm-dep'],
  },
  build: {
    // do not copy the contents of the public folder to the dist folder
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      // this is the file that exports our components
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CanvaEditor',
      fileName: (format) => `canva-editor.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        }
      },
    },
    commonjsOptions: {
      exclude: ['canva-editor'],
    }
  }
}));
