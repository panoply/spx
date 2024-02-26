import { defineConfig } from 'tsup';
import { utimes } from 'node:fs/promises';

export default defineConfig({
  entry: [
    './src/index.ts'
  ],
  format: [ 'esm' ],
  clean: false,
  outDir: './',
  minify: !!process.env.production,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  platform: 'browser',
  keepNames: false,
  splitting: false,
  target: 'es2018',
  globalName: 'spx',
  treeshake: 'smallest',
  esbuildOptions (options) {
    options.mangleProps = /^\$[a-z]/;
  },
  async onSuccess () {
    if (!process.env.production) {
      const time = new Date();
      await utimes('./docs/src/app/index.ts', time, time);
      await utimes('./test/assets/bundle.ts', time, time);
      await utimes('./test/pages/index.liquid', time, time);
      return undefined;
    }
  }
});
