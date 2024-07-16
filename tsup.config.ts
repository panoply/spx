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
  platform: 'browser',
  keepNames: true,
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

      await Promise.all([
        utimes('./docs/src/app/bundle.ts', time, time),
        utimes('./docs/src/app/iframe.ts', time, time),
        utimes('./test/asset/suite.ts', time, time),
        utimes('./test/views/index.liquid', time, time)
      ]);

    }
  }
});
