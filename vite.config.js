import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenvExpand from 'dotenv-expand';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  dotenvExpand.expand({ parsed: env });
  return {
    plugins: [react(), tailwindcss()],
    server: {
      hmr: {
        overlay: true,
      },
    },
  };
});