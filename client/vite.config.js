import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'team-task-manager-client-production-4432.up.railway.app',
      'localhost'
    ]
  }
})