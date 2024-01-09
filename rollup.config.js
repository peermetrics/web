import resolve from '@rollup/plugin-node-resolve'
import commonJS from '@rollup/plugin-commonjs'

import builtins from 'rollup-plugin-node-builtins'
import { terser } from 'rollup-plugin-terser'
import vue from "rollup-plugin-vue";

const isProd = process.env.BUILD === 'production'

const globals = {
  'wretch': 'wretch',
  'vue': 'Vue',
  'highcharts': 'Highcharts'
}

const external = ['vue', 'Highcharts', 'wretch']

const plugins = [
  builtins(),
  resolve(),
  commonJS({
    include: "node_modules/**"
  }),
  vue()
]

// if in prod mode, also minify the file
if (isProd) {
  plugins.push(terser())
}

export default [
  {
    input: "static/js/participant/index.vue",
    output: {
      file: "static/js/participant/index.js",
      format: "iife",
      sourcemap: !isProd,
      globals
    },
    external,
    plugins
  },
  {
    input: "static/js/conference/index.vue",
    output: {
      file: "static/js/conference/index.js",
      format: "iife",
      sourcemap: !isProd,
      globals
    },
    external,
    plugins
  },
  {
    input: "static/js/profile/index.vue",
    output: {
      file: "static/js/profile/index.js",
      format: "iife",
      sourcemap: !isProd,
      globals
    },
    external,
    plugins
  },
  {
    input: "static/js/app-dashboard/index.vue",
    output: {
      file: "static/js/app-dashboard/index.js",
      format: "iife",
      sourcemap: !isProd,
      globals
    },
    external,
    plugins
  }
];
