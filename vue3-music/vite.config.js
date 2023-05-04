import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import devServerPlugin from './plugin/devServer.js'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue(),viteCommonjs(),devServerPlugin()],
  resolve:{
    alias:{
      '@':fileURLToPath(new URL('./src',import.meta.url))
    }
  },
  define:{
    'process.env':{}
  },
  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {
        // 这里是全局引入变量和mixin
        additionalData: '@import "@/assets/scss/variable.scss"; @import "@/assets/scss/mixin.scss";'
      }
    }
  },

})
