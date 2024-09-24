import { defineConfig } from 'tsup';
import { utimes } from 'fs/promises';
import { version } from './package.json';
const PROD = process.env.ENV === 'PROD';
const BANNER = [
  '/**',
  '* SPX ~ Single Page XHR | https://spx.js.org',
  '*',
  '* @license CC BY-NC-ND 4.0',
  `* @version ${version}`,
  '* @copyright 2024 Nikolas Savvidis',
  '*/'
];

export default defineConfig({
  entry: [
    './src/index.ts'
  ],
  format: [ 'esm' ],
  clean: false,
  outDir: './',
  minify: PROD,
  outExtension: () => ({ js: '.js' }),
  platform: 'browser',
  keepNames: false, // Possible breaks may need to use true in v1
  splitting: false,
  target: 'es2017',
  globalName: 'spx',
  treeshake: 'smallest',
  banner: () => ({ js: BANNER.join('\n') }),
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
        utimes('./test/views/base.liquid', time, time)
      ]);

    }
  }
});
