import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          if (
            id.includes('src/data/assessment_matrix.json') ||
            id.includes('src/data/missions.json')
          ) {
            return 'data-missions'
          }
          if (id.includes('src/lib/i18n/locales/')) {
            return 'i18n-locales'
          }
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
