import { terser } from 'rollup-plugin-terser';
import noderesolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import replace from '@rollup/plugin-replace';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import inject from '@rollup/plugin-inject';

const { prod } = process.env;

const plugins = [
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  noderesolve({ browser: true }),
  commonjs()
];

export default [
  {
    input: 'src/index.js',
    output: [
      {
        format: 'es',
        name: 'Pjax',
        file: 'package/pjax.esm.js',
        sourcemap: false,
        preferConst: true,
        plugins: [
          prod ? terser({
            compress: {
              passes: 2
            }
          }) : null
        ]
      },
      {
        format: 'umd',
        name: 'Pjax',
        file: 'package/pjax.umd.js',
        sourcemap: false,
        preferConst: true,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true
          }),
          prod ? terser({
            compress: {
              passes: 2
            }
          }) : null
        ]
      }
    ],
    plugins: [
      ...plugins,
      babel({
        babelHelpers: 'runtime',
        presets: [
          [
            '@babel/preset-env', {
              targets: {
                esmodules: true
              }
            }
          ]
        ],
        plugins: [
          [ '@babel/plugin-transform-runtime' ],
          [ '@babel/plugin-syntax-dynamic-import' ],
          [ '@babel/plugin-proposal-class-properties' ]
        ]
      }),
      filesize()
    ]
  },
  {
    input: 'src/index.js',
    context: 'window',
    external: [ /@babel\/runtime/ ],
    output: {
      format: 'umd',
      name: 'Pjax',
      file: 'package/pjax.es5.js',
      sourcemap: false,
      plugins: [
        getBabelOutputPlugin({
          allowAllFormats: true,
          presets: [
            [
              '@babel/preset-env',
              {
                corejs: 3,
                useBuiltIns: 'entry'
              }
            ]
          ]
        })
        /* prod ? terser({
          ecma: 5,
          compress: {
            passes: 2
          }
        }) : null */
      ]
    },
    plugins: [
      inject({
        IntersectionObserver: [ 'intersection-observer', '*' ]
      }),
      ...plugins,
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        sourceMaps: true,
        retainLines: true,
        compact: true,
        plugins: [
          [ '@babel/plugin-transform-runtime', { absoluteRuntime: true } ],
          [ '@babel/plugin-transform-property-mutators' ],
          [ '@babel/plugin-syntax-dynamic-import' ],
          [ '@babel/plugin-proposal-class-properties' ]
        ]
      }),
      filesize()
    ]
  }
];
