import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The Spring Boot backend runs on :8080. Proxying /v1 through Vite keeps the
// browser on a single origin, so the JSESSIONID session cookie just works
// (no CORS configuration needed on the backend).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/v1': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
