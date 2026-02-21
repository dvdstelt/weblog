/**
 * Generates public/staticwebapp.config.json for Azure Static Web Apps.
 *
 * Azure SWA redirect rules do not support variable substitution in the
 * redirect destination, so individual per-post rules (575 posts x 2 patterns
 * = 1,150 rules) exceed the 20 KB config-file limit and wildcard rules cannot
 * strip path prefixes or suffixes dynamically.
 *
 * Legacy URL patterns are therefore handled client-side by the 404 page:
 *   /dennis/YYYY/MM/DD/slug          -> /YYYY/MM/DD/slug/
 *   /dennis/YYYY/MM/DD/slug.aspx     -> /YYYY/MM/DD/slug/
 *   /blogs/dennis/archive/.../slug.aspx -> /YYYY/MM/DD/slug/
 *   /YYYY/MM/DD/slug.aspx            -> /YYYY/MM/DD/slug/
 *
 * This script only emits the navigationFallback so unmatched paths are served
 * the 404 page (which carries the redirect logic).
 */
import { writeFileSync } from 'fs';

const OUT_FILE = new URL('../public/staticwebapp.config.json', import.meta.url).pathname;

const config = {
  navigationFallback: {
    rewrite: '/404.html',
  },
};

writeFileSync(OUT_FILE, JSON.stringify(config, null, 2) + '\n');
console.log('Written public/staticwebapp.config.json');
