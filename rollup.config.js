import { terser } from 'rollup-plugin-terser'
import noderesolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'

export default {
  input: 'src/index.js',
  context: 'window',
  output: [
    {
      format: 'iife',
      name: 'Pjax',
      file: 'package/pjax.min.js',
      sourcemap: false,
      plugins: [
        process.env.prod ? terser({
          compress: {
            passes: 2
          }
        }) : null
      ]
    },
    {
      format: 'es',
      file: 'package/pjax.esm.js',
      sourcemap: false,
      preferConst: true,
      plugins: []
    },
    {
      format: 'es',
      file: 'package/pjax.esm.min.js',
      sourcemap: false,
      preferConst: true,
      plugins: [
        process.env.prod ? terser({
          compress: {
            passes: 2
          }
        }) : null
      ]
    }
  ],
  plugins: [
    noderesolve(),
    commonjs(),
    filesize()
  ]
}
