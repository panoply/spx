import { defineConfig } from 'tsup';
import { utimes } from 'fs/promises';

const PROD = process.env.ENV === 'PROD';

export default defineConfig({
  entry: [
    './src/index.ts'
  ],
  format: [ 'esm' ],
  clean: false,
  outDir: './',
  minify: PROD,
  minifyIdentifiers: PROD,
  minifySyntax: PROD,
  minifyWhitespace: PROD,
  terserOptions: {
    compress: {
      passes: 10,
      module: true
    }
  },
  platform: 'browser',
  keepNames: false,
  splitting: false,
  target: 'es2017',
  globalName: 'spx',
  treeshake: 'recommended',
  esbuildOptions (options) {
    if (PROD) {
      options.mangleQuoted = false;
      options.mangleProps = /^\$[a-z]/;
    }
  },
  async onSuccess () {
    if (!PROD) {
      const time = new Date();
      await utimes('./docs/src/app/index.ts', time, time);
      await utimes('./test/assets/bundle.ts', time, time);
      await utimes('./test/pages/index.liquid', time, time);
    }
  }
});
