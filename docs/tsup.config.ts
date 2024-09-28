import { defineConfig } from 'tsup';

export default defineConfig(
  {
    entry: {
      'bundle.min': './src/app/bundle.ts',
      'iframe.min': './src/app/iframe.ts'
    },
    outDir: './public',
    outExtension: () => ({ js: '.js' }),
    clean: false,
    treeshake: false,
    splitting: false,
    minify: false,
    target: 'es2017',
    platform: 'browser',
    format: [
      'iife'
    ]
  }
);
