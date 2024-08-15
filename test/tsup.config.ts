import { defineConfig } from 'tsup';

export default defineConfig(
  {
    entry: {
      bundle: './asset/suite.ts'
    },
    outDir: './public',
    outExtension: () => ({ js: '.js' }),
    clean: false,
    treeshake: false,
    minify: false,
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false,
    splitting: false,
    platform: 'browser',
    format: [
      'iife'
    ]
  }
);
