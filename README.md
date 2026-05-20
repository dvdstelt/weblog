# BloggingAbout.NET

The source for my weblog at **[bloggingabout.net](https://bloggingabout.net)**.

I write about .NET, distributed systems, and the tools I use day-to-day. The posts and the code that goes with them all live here.

## Repository layout

```
src/
  content/posts/   Posts in Markdown. Filename pattern: YYYY-MM-DD-slug.md
  components/      Astro components used by layouts
  layouts/         Page templates (Post, Page, Base)
  pages/           Route entry points (index, tag, [year]/[month]/[day]/[slug])
  styles/          SCSS, organised as tools / base / modules / layouts
  lib/             Small helpers (post URL, reading time, tag slug)
public/            Static assets (favicons, post images)
samples/           Compilable source files that posts embed snippets from
.github/workflows/ CI: site deploy + samples build
astro.config.mjs   Astro config, including a small custom remark plugin
```

The `samples/` folder contains the working code behind any post that ships code. Posts reference it by file path, and every rendered snippet has a GitHub icon in the corner that links to the source. The mechanics are described in [Compilable code snippets in this blog](https://bloggingabout.net/2026/05/20/compilable-code-snippets/).

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/, Pagefind index built after
npm run preview  # serve the built site
```

A site build will fail loud if a post references a sample file or region that doesn't exist. The samples themselves are built separately by [.github/workflows/samples.yml](.github/workflows/samples.yml) with `dotnet build -warnaserror`, so a sample that stops compiling blocks the PR before merge.

## Issues and PRs

If you spot something wrong in a post, in a code sample, or anywhere in the site itself, the share section at the bottom of every article and the GitHub icon next to every code block both link back to the right file. Issues and PRs are welcome.
