# Authoring a post

Everything this blog can do that plain markdown cannot. Written to be skimmed when you have forgotten the syntax, which is the normal case.

- [Creating a post](#creating-a-post)
- [Callouts](#callouts)
- [Images](#images)
- [Code from this repo](#code-from-this-repo)
- [Code from another repo](#code-from-another-repo)
- [Showing part of a file](#showing-part-of-a-file)
- [Highlighting lines](#highlighting-lines)
- [Diagrams](#diagrams)
- [Running the site](#running-the-site)
- [Things that will bite you](#things-that-will-bite-you)

---

## Creating a post

One file: `src/content/posts/YYYY-MM-DD-slug.md`. The filename decides the URL, not the frontmatter, so `2026-08-05-four-order-classes.md` is served at `/2026/08/05/four-order-classes/`.

```yaml
---
id: 20260805                      # required, numeric, the date as YYYYMMDD
author: Dennis van der Stelt      # required
title: Four Order classes         # required
description: One sentence.        # required, shown on cards and in the feed
pubDate: '2026-08-05T01:00:00'    # required
image: /images/2026/my-post.jpg   # optional header image
topic: omnomnom                   # optional, joins the post to a series
tags:                             # optional
  - distributed systems
redirect_from:                    # optional, old URLs to redirect
  - /old/path/
sources:                          # optional, see "Code from another repo"
  omnomnom: 35920e4d…
---
```

Schema lives in `src/content/config.ts`; anything not listed there is rejected at build time.

**Series.** `topic: omnomnom` links the post to `src/content/series/omnomnom.md`, which carries the series title, description and `order`. Add the series file once, then set `topic` on each post.

**Header image.** Goes in `public/images/<year>/`. The hero is locked to a **2:1** aspect ratio (`padding-top: 50%` on `.image-box`) and uses `object-fit: cover`, so anything else is centre-cropped. A dark gradient covers the lower 75% for the title, so keep important detail in the upper part. Existing series headers are 1774x887.

---

## Callouts

GitHub-style alerts, via `remark-github-alerts`. Blockquote, marker on its own line, content on following lines.

```markdown
> [!NOTE]
> Useful information the reader should know.
```

Five types, all styled: `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`.

Multi-paragraph works as long as every line keeps the `>`:

```markdown
> [!WARNING]
> First paragraph.
>
> Second paragraph.
```

Styling is in `src/styles/3-modules/_alerts.scss`.

---

## Images

Normal markdown, with the file under `public/images/<year>/<post-slug>/`:

```markdown
![Alt text](/images/2026/my-post/screenshot.png)
```

**Layout keywords go in the title slot**, which is the quoted string after the path. `rehypeImageLayout` strips it and wraps the image in a `<figure>`:

```markdown
![Alt text](/images/2026/my-post/diagram.png "right medium")
```

| Keyword | Effect |
|---|---|
| `left` | floats left, text wraps to the right |
| `right` | floats right, text wraps to the left |
| `small` | 33% column width |
| `medium` | 50% column width |

Combine one float with one size, as above. Anything else in the title is ignored and the image renders normally. Floats collapse to full width on mobile.

---

## Code from this repo

For code that has no other home, keep a real compilable file under `samples/<year>/<post-slug>/` and embed from it. The build inserts the content, so it cannot go stale silently.

````markdown
```csharp file="samples/2026/my-post/Demo/Program.cs"
```
````

**The fence body stays empty.** The build fills it. Paths resolve from the repo root.

To embed part of a file, wrap it in region markers in the source and name the region:

````markdown
```csharp file="samples/2026/my-post/Demo/Program.cs" region="Setup"
```
````

| Comment style | Start | End |
|---|---|---|
| `#` line, and C# native | `# region Setup` / `#region Setup` | `# endregion` / `#endregion` |
| `//` line | `// region Setup` | `// endregion` |
| `<!-- -->` | `<!-- region Setup -->` | `<!-- endregion -->` |
| `/* */` | `/* region Setup */` | `/* endregion */` |
| `--` line | `-- region Setup` | `-- endregion` |

Marker lines are stripped and common indentation is removed, so a deeply nested region renders flush left. JSON has no comments: embed the whole file, or rename to `.jsonc` and use `//`.

New `.csproj` files need adding to the samples solution so CI builds them:

```bash
dotnet sln samples/Samples.slnx add samples/<year>/<post-slug>/<Project>/<Project>.csproj
```

---

## Code from another repo

For code that already lives in a public repo, do **not** copy it into `samples/`. Embed it directly, so the snippet and the real project cannot drift apart.

Pin the commit once in the post's frontmatter:

```yaml
sources:
  omnomnom: 35920e4d1d1f43c3b54a7174348c13e7295ff170
```

Then reference files with `repo=`:

````markdown
```csharp repo="omnomnom" file="src/Catalog.Data/Models/Order.cs"
```
````

The GitHub icon on the block links to that file at that commit.

**The ref must be a full 40-character SHA.** Branch names are rejected on purpose: a published snippet must not change under a post that describes it. Use a commit that is actually pushed, or readers get a 404.

Known repo keys live in `REMOTE_SOURCES` in `astro.config.mjs`. Currently:

| Key | Repo |
|---|---|
| `omnomnom` | `dvdstelt/OmNomNom` |

Add a key there to embed from somewhere new. Post metadata cannot point the build at an arbitrary host.

---

## Showing part of a file

Works for both local and remote files. Either a named region, as above, or a line range:

````markdown
```csharp repo="omnomnom" file="src/Finance.Data/Models/Order.cs" lines="23-38"
```
````

Inclusive and 1-based. `lines="12"` for a single line. The source link gains a `#L23-L38` fragment, so the icon scrolls to and highlights that range on GitHub. Note it does not *hide* the rest of the file there; nothing can.

`region=` and `lines=` are mutually exclusive.

Prefer `region=` for `samples/` files, where markers survive edits. `lines=` is for external repos you would rather not add markers to, and is only safe there because the commit is pinned. Against a moving branch a range would silently start quoting the wrong code.

---

## Highlighting lines

````markdown
```csharp repo="omnomnom" file="src/Finance.Data/Models/Order.cs" lines="23-38" highlight="29,37"
```
````

Single lines, ranges, or a mix: `highlight="3,12-14"`.

**Line numbers are the source file's, not the snippet's.** The same numbering as `lines=` and as GitHub. So adjusting `lines=` does not silently move your highlights, and you never have to count within a trimmed block. A highlight outside the shown range fails the build and tells you the valid range.

---

## Diagrams

Authored in [D2](https://d2lang.com). The `d2` CLI must be on `PATH`; it is not an npm dependency. CI installs it.

**Inline**, rendered at build time and inlined as SVG:

````markdown
```d2
a -> b
```
````

Defaults are `--sketch --theme=4 -l elk`. Flags go in the info string, in any order:

| Flag | Effect |
|---|---|
| `small` | caps the figure at 320px |
| `medium` | caps the figure at 480px |
| `theme=200` | different d2 theme id (default 4) |
| `hide-class-markers` | strips the `+`/`-`/`#` glyphs from `shape: class` boxes |

`**bold**` inside class field labels is honoured; the plugin post-processes the SVG since d2 has no per-row font weight.

**Pre-rendered**, for diagrams you want to keep as source:

```bash
d2 --sketch --theme=4 -l elk \
   samples/<year>/<post-slug>/<name>.d2 \
   public/images/<year>/<post-slug>/<name>.svg
```

Then reference `/images/<year>/<post-slug>/<name>.svg` as a normal image.

---

## Running the site

```bash
npm run dev -- --host --port 1337      # dev server, no search
npm run build                          # full build + Pagefind index
npm run preview -- --host --port 1337  # serve the production build
```

There are no tests. `npm run build` is the check.

---

## Things that will bite you

**A new post not appearing.** Astro's content cache can miss a newly added file, and the build succeeds without it. Clear it:

```bash
rm -rf node_modules/.astro .astro && npm run build
```

**Search not working in dev.** Pagefind indexes after a full build. Use `npm run preview` to test search.

**An empty code block.** A fence with `file=` must have an empty body. If you paste code in as well, it is overwritten. If you forget `file=`, the block renders as-is.

**Build failures from snippets are deliberate.** A missing file, unknown region, out-of-range lines, a non-SHA ref, or a 404 all stop the build rather than rendering something wrong. The message names the post and the file.

**Two `error` matches in build output are usually post slugs.** Two old posts have "error" in their filename. Grep for `[remark-code-region]` or check the exit code instead.
