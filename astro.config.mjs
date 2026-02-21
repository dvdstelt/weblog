// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGithubAlerts from 'remark-github-alerts';

// https://astro.build/config
export default defineConfig({
  site: 'https://bloggingabout.net',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
  },
  integrations: [
    sitemap(),
  ],
});
