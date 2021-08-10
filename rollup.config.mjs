import { defineConfig as Rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import noderesolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

const { prod } = process.env;

export default Rollup({
  input: 'src/index.ts',
  output: [
    {
      format: 'es',
      name: 'Pjax',
      file: 'package/pjax.esm.js',
      sourcemap: false,
      preferConst: true,
      plugins: prod ? [
        terser(
          {
            compress: {
              passes: 2
            }
          }
        )
      ] : null

    },
    {
      format: 'umd',
      name: 'Pjax',
      file: 'package/pjax.umd.js',
      sourcemap: false,
      preferConst: true,
      plugins: prod ? [
        terser(
          {
            compress: {
              passes: 2
            }
          }
        )
      ] : null
    }
  ],
  plugins: [
    replace(
      {
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
      }
    ),
    noderesolve(
      {
        browser: true,
        extensions: [
          '.ts',
          '.js'
        ]
      }
    ),
    ts(
      {
        check: false,
        useTsconfigDeclarationDir: true,
        typescript
      }
    ),
    commonjs(
      {
        extensions: [
          '.ts',
          '.js'
        ]
      }
    ),
    filesize()
  ]
});
