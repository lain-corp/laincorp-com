import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from 'path';

export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        declarations: path.resolve('./src/declarations'), // <-- Adjust path to match frontend context
        '@': path.resolve('./src'),
      },
    },
    optimizeDeps: {
      include: [
        '@dfinity/agent',
        '@dfinity/principal',
        '@dfinity/candid',
      ],
    },
    build: {
      rollupOptions: {
        external: ['@dfinity/agent'], // No externalization
      },
    },
  },
});
