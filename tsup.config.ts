import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    './src/index.ts'
  ],
  format: [ 'esm' ],
  clean: false,
  watch: true,
  outDir: '.',
  minify: 'terser',
  terserOptions: {
    ecma: 2016
  }
});
