import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from 'path';

export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        declarations: path.resolve('../../declarations'), // ✅ point to correct folder
        '@': path.resolve('./src'),
      },
    },
  },
});
