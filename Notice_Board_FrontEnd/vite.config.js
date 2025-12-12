import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    }
  },
  build: {
    // 1. Minify using 'esbuild' (Fastest & smallest)
    minify: 'esbuild',
    // 2. Manual Chunk Split (The Network Optimization)
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep React core separate (cached longer)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Keep Firebase separate (it's heavy)
          'firebase-vendor': ['firebase/app', 'firebase/auth'],
          // Keep UI icons separate
          'ui-vendor': ['lucide-react']
        }
      }
    }
  }
})