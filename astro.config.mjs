// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGithubAlerts from 'remark-github-alerts';
import { visit } from 'unist-util-visit';

/** @type {() => import('unified').Plugin} */
function rehypeImageLayout() {
  const VALID_KEYWORDS = new Set(['left', 'right', 'small', 'medium']);
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img') return;
      const title = node.properties?.title ?? '';
      if (!title) return;
      const keywords = String(title).toLowerCase().split(/\s+/).filter(k => VALID_KEYWORDS.has(k));
      if (!keywords.length) return;
      delete node.properties.title;
      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: { className: keywords.map(k => `img-${k}`) },
        children: [node],
      };
      parent.children.splice(index, 1, figure);
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://bloggingabout.net',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
    rehypePlugins: [rehypeImageLayout],
  },
  integrations: [
    sitemap(),
  ],
});
