import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import yaml from 'js-yaml';

const SRC = new URL('../_posts', import.meta.url).pathname;
const DEST = new URL('../src/content/posts', import.meta.url).pathname;

mkdirSync(DEST, { recursive: true });

/**
 * Convert Jekyll date "20031021 022700" -> "2003-10-21T02:27:00"
 */
function convertDate(raw) {
  const str = String(raw).trim();
  // Expected format: YYYYMMDD HHMMSS
  const [datePart, timePart = '000000'] = str.split(' ');
  const year  = datePart.slice(0, 4);
  const month = datePart.slice(4, 6);
  const day   = datePart.slice(6, 8);
  const hour  = timePart.slice(0, 2);
  const min   = timePart.slice(2, 4);
  const sec   = timePart.slice(4, 6);
  return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
}

/**
 * Split a Jekyll post file into { frontmatter, body }.
 * Returns null if the file does not start with ---.
 */
function splitFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  return {
    frontmatter: content.slice(3, end).trim(),
    body: content.slice(end + 4).trimStart(),
  };
}

const files = readdirSync(SRC).filter(f => f.endsWith('.md'));
let ok = 0, skipped = 0;

for (const file of files) {
  const raw = readFileSync(join(SRC, file), 'utf8');
  const parts = splitFrontmatter(raw);
  if (!parts) { console.warn(`SKIP (no frontmatter): ${file}`); skipped++; continue; }

  // Escape bare YAML alias markers (*) in scalar values so js-yaml doesn't
  // misinterpret titles like "title: *chirp" as YAML anchors.
  const safeFrontmatter = parts.frontmatter.replace(
    /^(\s*\w[\w -]*:\s)(\*.+)$/gm,
    (_, key, val) => `${key}'${val.replace(/'/g, "''")}'`
  );
  const fm = yaml.load(safeFrontmatter);

  // Convert date
  const pubDate = convertDate(fm.date);

  // Merge categories + tags into a single tags array
  const cats = Array.isArray(fm.categories) ? fm.categories : [];
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  const merged = [...new Set([...cats, ...tags])];

  // Build new frontmatter object (field order is cosmetic but keep it readable)
  const newFm = {
    id: fm.id,
    author: fm.author,
    title: fm.title,
    description: fm.description,
    pubDate,
    ...(fm.image ? { image: fm.image } : {}),
    ...(merged.length ? { tags: merged } : {}),
    ...(fm.redirect_from ? { redirect_from: fm.redirect_from } : {}),
  };

  const newContent = `---\n${yaml.dump(newFm, { lineWidth: -1 })}---\n${parts.body}`;
  writeFileSync(join(DEST, file), newContent, 'utf8');
  ok++;
}

console.log(`Migrated ${ok} posts, skipped ${skipped}.`);
