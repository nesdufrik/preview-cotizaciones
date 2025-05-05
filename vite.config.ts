import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    Components({
      dirs: ['src/components'],
      dts: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})