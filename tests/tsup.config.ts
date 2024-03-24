import { defineConfig } from 'tsup';

export default defineConfig(
  {
    entry: {
      bundle: './bundle.ts',
      'fragments-valid': './cases/options-fragments/bundle/valid.ts',
      'fragments-error': './cases/options-fragments/bundle/error.ts'
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
