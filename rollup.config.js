import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'assets/src/main.js',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: `assets/dist/bundle.js`
  },
  plugins: [
    postcss(),
    replace({
        "process.env.NODE_ENV": JSON.stringify(!production? "development" : 'production')
    }),
    json(),
    resolve({ preferBuiltins: true, browser: true }),
    buble({
      jsx: 'h',objectAssign: 'Object.assign', transforms: { asyncAwait: false }
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    // postcss({ extract: true }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('assets/dist/'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false
  }
}