import { defineConfig } from 'tsup';

export default defineConfig(
  {
    entry: {
      'bundle.min': './src/app/index.ts',
      'spx.min': './src/app/spx.ts'
    },
    outDir: './public',
    outExtension: () => ({
      js: '.js'
    }),
    clean: false,
    treeshake: false,
    splitting: false,
    minify: false,
    minifyIdentifiers: false,
    minifyWhitespace: false,
    minifySyntax: false,
    platform: 'browser',
    format: [
      'iife'
    ]
  }
);
