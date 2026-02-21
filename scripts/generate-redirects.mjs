/**
 * Generates public/staticwebapp.config.json for Azure Static Web Apps.
 *
 * All old redirect_from paths follow one of two patterns:
 *   /dennis/<slug>              (short URL)
 *   /blogs/dennis/archive/<…>   (.aspx legacy URL)
 *
 * Rather than listing 1,150 individual rules (which blows Azure SWA's 20 KB
 * config-file limit), we emit two wildcard rules that cover both prefixes.
 */
import { writeFileSync } from 'fs';

const OUT_FILE = new URL('../public/staticwebapp.config.json', import.meta.url).pathname;

const config = {
  routes: [
    { route: '/dennis/*', redirect: '/*', statusCode: 301 },
    { route: '/blogs/dennis/archive/*', redirect: '/*', statusCode: 301 },
  ],
  navigationFallback: {
    rewrite: '/404.html',
  },
};

writeFileSync(OUT_FILE, JSON.stringify(config, null, 2) + '\n');
console.log('Generated wildcard redirect rules -> public/staticwebapp.config.json');
