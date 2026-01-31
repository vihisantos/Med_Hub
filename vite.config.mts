/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: '.',
    base: '/Med_Hub/',
    publicDir: 'public',
    build: {
        outDir: 'dist',
    },
    server: {
        host: true
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
    }
})
