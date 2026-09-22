// @ts-check
import { defineConfig } from 'astro/config';
import trustKit from './src/integrations/trust-kit.mjs';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://lonefterskatt.se',
  /*
   * Pages consolidees le 2026-09-22 : vingt-deux communes dont le texte ne
   * differait que par un nom et un taux, 555 paires relevees trop proches.
   * Leur taux et leur net figurent dans le tableau de /kommun/, qui permet
   * en plus de les comparer entre elles.
   */
  redirects: {
    '/kommun/boras/': '/kommun/',
    '/kommun/eskilstuna/': '/kommun/',
    '/kommun/falun/': '/kommun/',
    '/kommun/gavle/': '/kommun/',
    '/kommun/halmstad/': '/kommun/',
    '/kommun/huddinge/': '/kommun/',
    '/kommun/jonkoping/': '/kommun/',
    '/kommun/kalmar/': '/kommun/',
    '/kommun/karlstad/': '/kommun/',
    '/kommun/kristianstad/': '/kommun/',
    '/kommun/lulea/': '/kommun/',
    '/kommun/lund/': '/kommun/',
    '/kommun/nacka/': '/kommun/',
    '/kommun/norrkoping/': '/kommun/',
    '/kommun/ostersund/': '/kommun/',
    '/kommun/sodertalje/': '/kommun/',
    '/kommun/solna/': '/kommun/',
    '/kommun/sundsvall/': '/kommun/',
    '/kommun/taby/': '/kommun/',
    '/kommun/trollhattan/': '/kommun/',
    '/kommun/umea/': '/kommun/',
    '/kommun/vaxjo/': '/kommun/',
  },

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
