/**
 * Fix internal links in migrated posts.
 *
 * Patterns handled:
 *   1. https://bloggingabout-linux.azurewebsites.net/YYYY/MM/DD/slug[/]
 *      → /YYYY/MM/DD/slug/
 *
 *   2. https://bloggingabout.net/YYYY/MM/DD/slug   (non-numeric slug only)
 *      → /YYYY/MM/DD/slug/
 *
 *   3. /blogs/dennis/archive/YYYY/MM/DD/slug[.aspx]
 *      → /YYYY/MM/DD/slug/
 *
 *   4. /dennis/archive/YYYY/MM/DD/slug[.aspx]
 *      → /YYYY/MM/DD/slug/
 *
 * Patterns intentionally left alone:
 *   - bloggingabout-linux.azurewebsites.net links to UserFiles, wp-content, blogs/<other>, ControlPanel, etc.
 *   - bloggingabout.net links with purely numeric post IDs (community-era posts by other authors)
 *   - redirect_from frontmatter (those /dennis/ and /blogs/dennis/ entries are config, not body links)
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const POSTS_DIR = new URL('../src/content/posts/', import.meta.url).pathname;

// Match the date-path segment: /YYYY/MM/DD/slug  (slug must contain at least one non-digit char)
const DATE_PATH = String.raw`\/(\d{4})\/(\d{2})\/(\d{2})\/([\w][^)\s"'<>]*)`;

const REPLACEMENTS = [
  // 1. Old Azure domain — date-path URLs only
  {
    pattern: new RegExp(
      `https://bloggingabout-linux\\.azurewebsites\\.net${DATE_PATH}`,
      'g'
    ),
    replace: (_match, y, m, d, slug) => {
      // Skip if slug looks like an asset path (contains a file extension after the last segment)
      const last = slug.split('/').pop();
      if (last && /\.\w{2,5}$/.test(last)) return _match; // has extension → not a post URL
      const cleanSlug = slug.replace(/\/$/, '').replace(/\.aspx$/, '');
      return `/${y}/${m}/${d}/${cleanSlug}/`;
    },
  },

  // 2. bloggingabout.net — date-path URLs with non-numeric slug
  {
    pattern: new RegExp(
      `https://bloggingabout\\.net${DATE_PATH}`,
      'g'
    ),
    replace: (_match, y, m, d, slug) => {
      const cleanSlug = slug.replace(/\/$/, '').replace(/\.aspx$/, '');
      // Skip purely numeric post IDs — those are old community-blog posts by other authors
      if (/^\d+$/.test(cleanSlug.split('/')[0])) return _match;
      // Skip if slug contains an asset extension
      const last = cleanSlug.split('/').pop();
      if (last && /\.\w{2,5}$/.test(last)) return _match;
      return `/${y}/${m}/${d}/${cleanSlug}/`;
    },
  },

  // 3. /blogs/dennis/archive/YYYY/MM/DD/slug[.aspx]
  {
    pattern: /\/blogs\/dennis\/archive\/(\d{4})\/(\d{2})\/(\d{2})\/([^)"'\s<>]+)/g,
    replace: (_match, y, m, d, slug) => {
      const cleanSlug = slug.replace(/\.aspx$/, '').replace(/\/$/, '');
      return `/${y}/${m}/${d}/${cleanSlug}/`;
    },
  },

  // 4. /dennis/archive/YYYY/MM/DD/slug[.aspx]  (without /blogs/ prefix)
  {
    pattern: /\/dennis\/archive\/(\d{4})\/(\d{2})\/(\d{2})\/([^)"'\s<>]+)/g,
    replace: (_match, y, m, d, slug) => {
      const cleanSlug = slug.replace(/\.aspx$/, '').replace(/\/$/, '');
      return `/${y}/${m}/${d}/${cleanSlug}/`;
    },
  },
];

async function processFile(filePath) {
  const original = await readFile(filePath, 'utf8');

  // Split into frontmatter and body so we never touch redirect_from entries
  const fmMatch = original.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!fmMatch) return 0;

  const [, frontmatter, body] = fmMatch;

  let updated = body;
  for (const { pattern, replace } of REPLACEMENTS) {
    updated = updated.replace(pattern, replace);
  }

  if (updated === body) return 0;

  await writeFile(filePath, frontmatter + updated, 'utf8');
  return 1;
}

async function main() {
  const files = (await readdir(POSTS_DIR)).filter(f => f.endsWith('.md'));
  let changed = 0;
  let checked = 0;

  for (const file of files) {
    checked++;
    const n = await processFile(join(POSTS_DIR, file));
    if (n) {
      changed++;
      console.log(`  fixed  ${file}`);
    }
  }

  console.log(`\nDone. Checked ${checked} posts, updated ${changed}.`);
}

main().catch(err => { console.error(err); process.exit(1); });
