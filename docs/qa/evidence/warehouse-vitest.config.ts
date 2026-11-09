import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
export default defineConfig({
  cacheDir: './.audit-vite-cache',
  resolve: { alias: { '#': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'jsdom', globals: true, restoreMocks: true, pool: 'threads', maxWorkers: 1 },
})
