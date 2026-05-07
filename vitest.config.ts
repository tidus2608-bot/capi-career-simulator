import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}', 'functions/**/*.{test,spec}.{ts,js}'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx,js,jsx}', 'functions/**/*.{ts,js}'],
      exclude: ['**/*.test.*', '**/*.spec.*', 'src/data/**', 'src/main.*'],
    },
  },
})
