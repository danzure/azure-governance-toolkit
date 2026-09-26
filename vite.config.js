import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/azureUpdates': {
                target: 'https://www.microsoft.com',
                changeOrigin: true,
                rewrite: () => '/releasecommunications/api/v2/azure/rss'
            }
        }
    },
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
