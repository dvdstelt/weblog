// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGithubAlerts from 'remark-github-alerts';
import { visit } from 'unist-util-visit';

const REPO_ROOT = path.dirname(fileURLToPath(import.meta.url));
const IS_BUILD = process.argv.includes('build');

function failHard(message) {
  if (IS_BUILD) {
    console.error(message);
    process.exit(1);
  }
  throw new Error(message);
}

const REGION_STYLES = [
  { start: /^\s*#\s*region\s+(\S+)\s*$/, end: /^\s*#\s*endregion\b/ },
  { start: /^\s*\/\/\s*#?region\s+(\S+)\s*$/, end: /^\s*\/\/\s*#?endregion\b/ },
  { start: /^\s*<!--\s*region\s+(\S+)\s*-->\s*$/, end: /^\s*<!--\s*endregion\s*-->\s*$/ },
  { start: /^\s*\/\*\s*region\s+(\S+)\s*\*\/\s*$/, end: /^\s*\/\*\s*endregion\s*\*\/\s*$/ },
  { start: /^\s*--\s*region\s+(\S+)\s*$/, end: /^\s*--\s*endregion\b/ },
];

function parseMeta(meta) {
  const result = {};
  if (!meta) return result;
  const re = /(\w+)=(?:"([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(meta))) {
    result[m[1]] = m[2] ?? m[3];
  }
  return result;
}

function dedent(lines) {
  const nonEmpty = lines.filter(l => l.trim().length);
  if (!nonEmpty.length) return lines.join('\n');
  const indents = nonEmpty.map(l => l.match(/^[ \t]*/)[0].length);
  const min = Math.min(...indents);
  return min ? lines.map(l => l.slice(min)).join('\n') : lines.join('\n');
}

function extractRegion(source, regionName, fileRel) {
  const lines = source.split('\n');
  let style = null;
  let startIdx = -1;
  for (let i = 0; i < lines.length && !style; i++) {
    for (const s of REGION_STYLES) {
      const m = s.start.exec(lines[i]);
      if (m && m[1] === regionName) {
        style = s;
        startIdx = i;
        break;
      }
    }
  }
  if (!style) {
    failHard(`[remark-code-region] region "${regionName}" not found in ${fileRel}`);
  }
  let endIdx = -1;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (style.end.test(lines[i])) { endIdx = i; break; }
  }
  if (endIdx === -1) {
    failHard(`[remark-code-region] unterminated region "${regionName}" in ${fileRel}`);
  }
  return dedent(lines.slice(startIdx + 1, endIdx));
}

/** @type {() => import('unified').Plugin} */
function remarkCodeRegion() {
  return (tree, file) => {
    visit(tree, 'code', (node) => {
      const meta = parseMeta(node.meta);
      if (!meta.file) return;
      const abs = path.resolve(REPO_ROOT, meta.file);
      if (!abs.startsWith(REPO_ROOT + path.sep)) {
        failHard(`[remark-code-region] refusing to read outside repo: ${meta.file} (from ${file.path ?? 'unknown post'})`);
      }
      if (!fs.existsSync(abs)) {
        failHard(`[remark-code-region] file not found: ${meta.file} (from ${file.path ?? 'unknown post'})`);
      }
      const source = fs.readFileSync(abs, 'utf8');
      node.value = meta.region
        ? extractRegion(source, meta.region, meta.file)
        : source.replace(/\n$/, '');
    });
  };
}

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
    remarkPlugins: [remarkCodeRegion, remarkGithubAlerts],
    rehypePlugins: [rehypeImageLayout],
  },
  integrations: [
    sitemap(),
  ],
});
