import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Tunneling (localtunnel/ngrok/etc) changes the Host header.
    // `true` avoids dev server 400s due to host allow-list checks.
    // Safe enough for local dev; don't use this for a public-facing deployment.
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
})
