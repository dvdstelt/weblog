// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGithubAlerts from 'remark-github-alerts';
import { visit } from 'unist-util-visit';

const REPO_ROOT = path.dirname(fileURLToPath(import.meta.url));
const IS_BUILD = process.argv.includes('build');
const GITHUB_BLOB_URL = 'https://github.com/dvdstelt/weblog/blob/main';

// Repositories, other than this one, that posts may embed code from. A post
// opts in per code block with repo="<key>" and pins the commit once in its
// frontmatter under `sources`. Keys are whitelisted here so post metadata can
// never point the build at an arbitrary host.
const REMOTE_SOURCES = {
  omnomnom: { owner: 'dvdstelt', repo: 'OmNomNom' },
};

// Fetched files are immutable (always addressed by full commit SHA), so the
// cache never needs invalidating. Lives in node_modules so it is disposable
// and already gitignored.
const REMOTE_CACHE_DIR = path.join(REPO_ROOT, 'node_modules', '.cache', 'remote-code');

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
  return {
    text: dedent(lines.slice(startIdx + 1, endIdx)),
    startLine: startIdx + 2,
    endLine: endIdx,
  };
}

// Read a file from a whitelisted external repository at a pinned commit.
// Refuses anything that is not a full 40-character SHA: a branch or tag would
// let the rendered snippet drift away from the prose describing it, which is
// the whole problem this is meant to avoid.
async function readRemote(sourceKey, ref, fileRel, postPath) {
  const source = REMOTE_SOURCES[sourceKey];
  if (!source) {
    failHard(`[remark-code-region] unknown repo "${sourceKey}" (from ${postPath}). Known: ${Object.keys(REMOTE_SOURCES).join(', ')}`);
  }
  if (!ref) {
    failHard(`[remark-code-region] repo="${sourceKey}" needs a commit in the post frontmatter: sources: { ${sourceKey}: <40-char sha> } (from ${postPath})`);
  }
  if (!/^[0-9a-f]{40}$/.test(ref)) {
    failHard(`[remark-code-region] sources.${sourceKey} must be a full 40-character commit SHA, got "${ref}" (from ${postPath}). Branches and tags move; snippets must not.`);
  }
  if (fileRel.includes('..')) {
    failHard(`[remark-code-region] invalid path "${fileRel}" (from ${postPath})`);
  }

  const cached = path.join(REMOTE_CACHE_DIR, sourceKey, ref, fileRel);
  if (fs.existsSync(cached)) return fs.readFileSync(cached, 'utf8');

  const url = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${ref}/${fileRel}`;
  const response = await fetch(url);
  if (!response.ok) {
    failHard(`[remark-code-region] ${response.status} fetching ${url} (from ${postPath})`);
  }
  const text = await response.text();
  fs.mkdirSync(path.dirname(cached), { recursive: true });
  fs.writeFileSync(cached, text);
  return text;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sourceLinkHtml(href, label = 'Improve this code on GitHub') {
  return `<a class="code-source-link" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer" title="${escapeAttr(label)}" aria-label="${escapeAttr(label)}"><i class="ion ion-logo-github" aria-hidden="true"></i></a>`;
}

/** @type {() => import('unified').Plugin} */
function remarkCodeRegion() {
  return async (tree, file) => {
    const postPath = file.path ?? 'unknown post';
    const pins = file.data?.astro?.frontmatter?.sources ?? {};
    const targets = [];
    visit(tree, 'code', (node, index, parent) => {
      const meta = parseMeta(node.meta);
      if (!meta.file) return;
      targets.push({ node, index, parent, meta });
    });

    const insertions = [];
    for (const { node, index, parent, meta } of targets) {
      let source;
      let href;
      let label;

      if (meta.repo) {
        const ref = pins[meta.repo];
        source = await readRemote(meta.repo, ref, meta.file, postPath);
        const { owner, repo } = REMOTE_SOURCES[meta.repo];
        href = `https://github.com/${owner}/${repo}/blob/${ref}/${meta.file}`;
        label = `View this code in ${repo} on GitHub`;
      } else {
        const abs = path.resolve(REPO_ROOT, meta.file);
        if (!abs.startsWith(REPO_ROOT + path.sep)) {
          failHard(`[remark-code-region] refusing to read outside repo: ${meta.file} (from ${postPath})`);
        }
        if (!fs.existsSync(abs)) {
          failHard(`[remark-code-region] file not found: ${meta.file} (from ${postPath})`);
        }
        source = fs.readFileSync(abs, 'utf8');
        href = `${GITHUB_BLOB_URL}/${meta.file}`;
      }

      if (meta.region) {
        const { text, startLine, endLine } = extractRegion(source, meta.region, meta.file);
        node.value = text;
        href += `#L${startLine}-L${endLine}`;
      } else {
        node.value = source.replace(/\n$/, '');
      }
      insertions.push({ parent, index, html: sourceLinkHtml(href, label) });
    }

    for (const ins of insertions.reverse()) {
      ins.parent.children.splice(ins.index, 0, { type: 'html', value: ins.html });
    }
  };
}

/** @type {() => import('unified').Plugin} */
function remarkD2() {
  return (tree, file) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'd2') return;
      const tokens = (node.meta ?? '').split(/\s+/).filter(Boolean);
      const flags = new Set(tokens);
      const themeToken = tokens.find(t => /^theme=\d+$/.test(t));
      const theme = themeToken ? themeToken.slice('theme='.length) : '4';
      let svg;
      try {
        svg = execFileSync(
          'd2',
          ['--sketch', `--theme=${theme}`, '-l', 'elk', '-', '-'],
          { input: node.value, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
        );
      } catch (err) {
        failHard(`[remark-d2] failed to render diagram in ${file.path ?? 'unknown post'}: ${err.stderr || err.message}`);
        return;
      }
      svg = svg.replace(/^<\?xml[^?]*\?>\s*/, '').trim();
      // Opt-in: drop UML class visibility glyphs (+/-/#). d2 hard-codes their
      // color to the theme accent and offers no styling hook, so empty-row
      // compartments (`" ": ""`) otherwise show a stray marker.
      if (flags.has('hide-class-markers')) {
        svg = svg.replace(/<text\b[^>]*>\s*[+\-#]\s*<\/text>/g, '');
      }
      // Markdown-style **bold** marker inside class field text. d2's
      // `shape: class` has no per-row font-weight, so we wrap the field name
      // in ** in the d2 source, d2 emits the asterisks literally, and this
      // pass strips them and visually bolds the matching <text> element.
      //
      // The embedded d2 mono font has no real bold weight, so font-weight
      // alone produces a barely-visible synthesized bold. To make the
      // emphasis actually readable, we also stroke the glyph in the same
      // colour as its fill using d2's existing `stroke-NX` classes (which
      // mirror each `fill-NX`), with `paint-order="stroke"` so the stroke
      // sits behind the fill. The net effect is a visibly heavier glyph
      // regardless of font weight support.
      svg = svg.replace(
        /<text\b([^>]*)>([^<]*?)<\/text>/g,
        (match, attrs, body) => {
          if (!body.includes('**')) return match;
          const stripped = body.replace(/\*\*([^*]+)\*\*/g, '$1');
          if (stripped === body) return match;
          if (/\bfont-weight=/.test(attrs)) return match.replace(body, stripped);
          const fillClass = attrs.match(/\bfill-([A-Za-z0-9]+)\b/)?.[1];
          let newAttrs = attrs;
          if (fillClass && /class="[^"]*"/.test(attrs)) {
            newAttrs = attrs.replace(
              /class="([^"]*)"/,
              (_, classes) => `class="${classes} stroke-${fillClass}"`,
            );
          }
          return `<text${newAttrs} font-weight="bold" paint-order="stroke" stroke-width="1.0">${stripped}</text>`;
        },
      );
      // Optional size modifiers (`small`, `medium`) cap the rendered figure
      // width. Mirrors the image keyword pattern in rehypeImageLayout.
      const sizeClass = flags.has('small')
        ? ' d2-small'
        : flags.has('medium')
          ? ' d2-medium'
          : '';
      parent.children.splice(index, 1, {
        type: 'html',
        value: `<figure class="d2-diagram${sizeClass}">${svg}</figure>`,
      });
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
    remarkPlugins: [remarkCodeRegion, remarkD2, remarkGithubAlerts],
    rehypePlugins: [rehypeImageLayout],
  },
  integrations: [
    sitemap(),
  ],
});
