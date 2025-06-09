import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Only change this if your site is hosted in a subfolder
  plugins: [react()],
  assetsInclude: ['/*.glsl'], // Removed *.html to avoid misbehavior
  server: {
    host: true,
    port: 5177,
  },
});