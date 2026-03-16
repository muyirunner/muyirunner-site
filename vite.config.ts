import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: '杨汶川 - 个人主页',
        short_name: '杨汶川',
        description: '杨汶川个人简历网站 - C++后台开发 / 算法工程师',
        theme_color: '#a855f7',
        background_color: '#0a0e1a',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // 排除非静态资源
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],

  // 部署基础路径（根路径部署使用 '/'）
  base: '/',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  build: {
    // 输出目录
    outDir: 'dist',

    // 静态资源目录
    assetsDir: 'assets',

    // 构建目标
    target: 'es2015',

    // 使用 esbuild 压缩（比 terser 快，不需要额外依赖）
    minify: 'esbuild',

    // CSS 代码分割
    cssCodeSplit: true,

    // 构建时清空输出目录
    emptyOutDir: true,

    // 生成 source map（可选，生产环境建议关闭）
    sourcemap: false,

    // chunk 大小警告限制（KB）
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: {
          'vue': ['vue'],
          // 如果有其他大型库，可以继续分离
          // 'vendor': ['some-large-library']
        },

        // 静态资源文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },

  // 开发服务器配置
  server: {
    port: 5174,
    host: true,
    open: false,
    strictPort: false
  },

  // 预览服务器配置
  preview: {
    port: 4173,
    host: true,
    strictPort: false
  }
})
