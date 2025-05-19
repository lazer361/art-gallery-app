import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const repoName = 'art-gallery-app'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',

  plugins: [
    vue(),
    Components({
      dts: true,
      dirs: ['src/components'],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/]
    }),
    process.env.NODE_ENV === 'analyze'
      ? visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'bundle-analysis.html'
        })
      : undefined
  ].filter(Boolean),

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Игнорирует предупреждения о deprecated API
        logger: {
          warn: () => [] // Полностью отключает предупреждения Sass
        }
      }
    }
  },

  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vendor: ['axios', 'lodash-es']
        }
      }
    },
    target: 'esnext'
  }
})
