import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Ensures `dist/` works when served from subpaths (e.g., VS Code Live Server)
  base: './',
  plugins: [react()],
  server: {
    port: 5173
  }
});

