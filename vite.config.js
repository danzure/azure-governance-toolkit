import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-core': ['react', 'react-dom', 'react-router-dom'],
                    'icons': ['lucide-react']
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'node'
    }
})
