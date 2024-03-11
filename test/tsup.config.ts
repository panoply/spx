import { defineConfig } from 'tsup';

export default defineConfig(
  {
    entry: {
      bundle: './assets/bundle.ts',
      'fragments-valid': './assets/options/fragments/valid.ts',
      'fragments-error': './assets/options/fragments/error.ts'
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
