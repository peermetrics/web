import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

const isProd = process.env.BUILD === 'production'
const target = process.env.BUILD_TARGET;
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    outDir: `static/js/${target}`,
    emptyOutDir: false,
    rollupOptions: {
      external: ['vue', 'Highcharts', 'wretch'],
      output: {
        globals: {
          wretch: 'wretch',
          vue: 'Vue',
          highcharts: 'Highcharts'
        },
        entryFileNames: `index.js`,
        format: 'iife',
        sourcemap: !isProd
      },
      input: `static/js/${target}/index.vue`,
    }
  }
});