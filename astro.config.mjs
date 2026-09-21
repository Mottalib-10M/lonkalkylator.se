// @ts-check
import { defineConfig } from 'astro/config';
import trustKit from './src/integrations/trust-kit.mjs';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://lonefterskatt.se',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    trustKit({ lang: 'sv', siteUrl: 'https://lonefterskatt.se', siteName: 'Lön Efter Skatt', founded: '2026-06-27', about: '/om-oss/', method: '/metod/' }), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
