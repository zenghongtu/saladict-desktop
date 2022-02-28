import { join } from 'path'
import { builtinModules } from 'module'
import { defineConfig } from 'vite'

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, '../src/emulator'),
  build: {
    outDir: '../../dist/saladict',
    lib: {
      entry: 'background/index.js',
      formats: ['cjs'],
      fileName: 'background',
    },

    minify: process.env.NODE_ENV === 'production',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/browser-polyfill.min.js',
      },
    },
    emptyOutDir: true,
  },
  publicDir: join(__dirname, '../src/saladict'),
  resolve: {
    alias: {
      '@src': join(__dirname, '../src'),
    },
  },
})
