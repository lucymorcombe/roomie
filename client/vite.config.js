import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/db_test': 'http://localhost:3000',
      '/listings': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
    }
  }
});