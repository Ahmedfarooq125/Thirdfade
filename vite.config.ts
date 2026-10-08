import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { contactApi } from './server/contact-api.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','TURNSTILE_HOSTNAME','SUPABASE_URL','SUPABASE_SECRET_KEY','RESEND_API_KEY','CONTACT_FROM_EMAIL','CONTACT_EMAIL','CONTACT_PHONE']) if (env[key]) process.env[key] = env[key];
  return {
    base: './',
    plugins: [react(), tailwindcss(), { name: 'thirdfade-contact', configureServer(server) { server.middlewares.use(contactApi); }, configurePreviewServer(server) { server.middlewares.use(contactApi); } }],
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  };
});
