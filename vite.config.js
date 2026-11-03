import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@core': path.resolve(__dirname, './src/core'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@features': path.resolve(__dirname, './src/features')
        }
    },
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
