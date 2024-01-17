import { defineConfig } from 'tsup';
import { utimes } from 'node:fs/promises';

export default defineConfig({
  entry: [
    './src/index.ts'
  ],
  format: [ 'esm' ],
  clean: false,
  outDir: './',
  minify: process.env.production ? 'terser' : false,
  minifyIdentifiers: true,
  minifySyntax: true,
  treeshake: 'smallest',
  esbuildOptions (options) {
    options.mangleProps = /^\$[a-z]/;
  },
  terserOptions: {
    ecma: 2016,
    keep_classnames: false,
    compress: {
      passes: 50
    }
  },
  async onSuccess () {
    const time = new Date();
    await utimes('./docs/src/app/index.ts', time, time);
    return undefined;
  }
});
