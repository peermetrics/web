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
      external: ['wretch', 'vue', 'chart.js'],
      output: {
        globals: {
          'wretch': 'wretch',
          'vue': 'Vue',
          'chart.js': 'Chart',
        },
        entryFileNames: `index.min.js`,
        format: 'iife',
      },
      input: `static/js/${target}/index.vue`,
    },
    sourcemap: !isProd
  }
});