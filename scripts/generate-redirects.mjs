import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const POSTS_DIR = new URL('../src/content/posts', import.meta.url).pathname;
const OUT_FILE  = new URL('../public/staticwebapp.config.json', import.meta.url).pathname;

/**
 * Derive the canonical Astro URL from a post filename.
 * "2003-10-21-first-post.md" -> "/2003/10/21/first-post/"
 */
function postUrl(filename) {
  const slug = filename.replace(/\.md$/, '');
  const m = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!m) return null;
  return `/${m[1]}/${m[2]}/${m[3]}/${m[4]}/`;
}

/**
 * Split frontmatter from file content.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  return yaml.load(content.slice(3, end).trim());
}

const routes = [];

for (const file of readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))) {
  const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
  const fm  = parseFrontmatter(raw);
  if (!fm?.redirect_from) continue;

  const target = postUrl(file);
  if (!target) continue;

  for (const from of fm.redirect_from) {
    // Ensure the source path starts with /
    const source = from.startsWith('/') ? from : `/${from}`;
    routes.push({ route: source, redirect: target, statusCode: 301 });
  }
}

routes.sort((a, b) => a.route.localeCompare(b.route));

const config = {
  routes,
  navigationFallback: {
    rewrite: '/404.html',
  },
};

writeFileSync(OUT_FILE, JSON.stringify(config, null, 2) + '\n');
console.log(`Generated ${routes.length} redirect rules -> public/staticwebapp.config.json`);
