import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env': {},
  },
  server: {
    host: true,
    port: 5173
  },
  envDir: '.',
  envPrefix: 'VITE_'
});