import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/jeep-sqlite/dist/jeep-sqlite/*',
          dest: 'assets'
        }
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['jeep-sqlite']
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      external: ['sqlite3', 'sqlite'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@iconify')) {
            return 'iconify';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
