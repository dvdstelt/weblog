---
id: 20260520
author: Dennis van der Stelt
title: Compilable code snippets in this blog
description: How this blog now pulls snippets from real source files at build time, with a CI check that fails when an example stops compiling and a per-snippet link straight to GitHub.
pubDate: '2026-05-20T01:00:00'
tags:
  - meta
  - astro
  - dotnet
---

A series of posts is on the way, and they lean heavily on code. Long enough that pasting every line into each article would bury the point, and detailed enough that I'd rather readers not have to reverse-engineer what surrounds a snippet just to get it running on their own machine. So before any of those posts go out, the plumbing for it: code in articles is now pulled from real source files that live in this repo, and every snippet links straight back to its source on GitHub.

The mechanics are simple. Under [samples/](https://github.com/dvdstelt/weblog/tree/main/samples) there are real projects, with `.csproj` files, scripts, and configs, whatever a given article happens to need. When a post shows a few interesting lines, those lines come straight out of one of those files at build time, not from my copy-paste. Readers who want the using statements, the imports, the wiring up, or the bits I trimmed for brevity, can click the GitHub icon in the corner of any code block and land on the exact lines, inside a project they can clone and run.

## What it looks like in a post

Here's the `Greet` method from a tiny `HelloWorld` project that lives in this repo:

```csharp file="samples/compilable-code-snippets/HelloWorld/Program.cs" region="Greet"
```

And the matching `Main`:

```csharp file="samples/compilable-code-snippets/HelloWorld/Program.cs" region="Main"
```

Both blocks come from the same [Program.cs](https://github.com/dvdstelt/weblog/blob/main/samples/compilable-code-snippets/HelloWorld/Program.cs). Each rendered code block has a little GitHub icon in the top-right corner, next to the existing copy button. Hovering shows "Improve this code". Clicking takes you to the exact lines in the source file, so anyone who spots a smell or a missing edge case can open a PR without leaving the page.

## How a post references code

Posts are still plain Markdown. The new bit is the info string on the fence:

````markdown
```csharp file="samples/compilable-code-snippets/HelloWorld/Program.cs" region="Greet"
```
````

Two attributes do all the work:

- `file=` — path from the repo root to a real file checked into the repo.
- `region=` — optional. The name of a region inside that file. Omit it to embed the whole file.

The fence body stays empty. A small `remark` plugin walks the Markdown AST at build time, finds fences with `file=`, reads the file, extracts the region, and replaces the block's content. Shiki then highlights the result like it had been typed inline. Posts written before this change keep working unchanged, because fences without `file=` are left alone.

## Region markers

C# has native `#region` / `#endregion` directives, which Roslyn and every IDE already understand. The plugin recognises a handful of other comment styles too, so I can do the same trick in shell scripts, Dockerfiles, Compose files, and so on:

| Comment style    | Start                     | End                  | Used in                                          |
|------------------|---------------------------|----------------------|--------------------------------------------------|
| `#` line         | `# region Setup`          | `# endregion`        | shell, Dockerfile, YAML, TOML, Python            |
| `//` line        | `// region Setup`         | `// endregion`       | JS, TS, C, C++, Go, Rust, JSONC                  |
| C# native        | `#region Setup`           | `#endregion`         | C#                                               |
| `<!-- -->` block | `<!-- region Setup -->`   | `<!-- endregion -->` | HTML, XML, `.csproj`                             |
| `/* */` block    | `/* region Setup */`      | `/* endregion */`    | CSS, SCSS                                        |
| `--` line        | `-- region Setup`         | `-- endregion`       | SQL, Lua                                         |

The marker lines themselves are stripped from the rendered snippet, and the common leading whitespace is dedented so a region nested four levels deep doesn't show up flush with the margin of the article.

JSON has no comment syntax at all, so for JSON I either embed the whole file or rename it to `.jsonc` and use `//` markers.

## What "compiles in CI" actually means

The repo grew a [samples/](https://github.com/dvdstelt/weblog/tree/main/samples) folder. Each post that ships code gets a subfolder, and that subfolder can be whatever shape it needs: a full `.csproj`, a couple of scripts, a Dockerfile. The C# projects all share an aggregate solution at `samples/Samples.slnx`, pinned to .NET 10 via a `global.json`.

A new GitHub Actions workflow watches `samples/**` and runs `dotnet build` with warnings-as-errors:

```yaml file=".github/workflows/samples.yml" region="Build"
```

That's it. If I add a region tomorrow that won't compile, the workflow goes red on the PR before I merge.

The site build does its share too. If I write a post that references a file that no longer exists, or a region name I typoed, the remark plugin throws and `astro build` exits non-zero. The Azure Static Web Apps deploy step never runs against a broken post.

## The GitHub icon next to every snippet

This is the part I'm most pleased with. The plugin doesn't just inline the code; it also emits an `<a class="code-source-link">` right before the fence in the AST. A tiny bit of client-side script in the post layout finds that link and slides it into the `.code-block-wrapper` alongside the copy button. CSS pins it to the top-right corner.

For region-based snippets the link includes a line-range fragment (`#L10-L15`), so GitHub jumps straight to the lines you're looking at, not the top of the file. That removes the friction of "open the file, scroll, find the method" and turns a casual reader into a potential contributor with one click.

The CTA reads "Improve this code". The phrasing is deliberate. It's not "view source", it's an invitation.

## What I left out

A few things I deliberately did not build yet:

- **MDX migration.** The plugin works on plain Markdown. Astro 5 makes MDX painless, but every existing post is `.md` and I see no reason to churn them.
- **Line-range selection.** Tempting, but line numbers shift the moment you edit the file. Named regions survive renames and refactors as long as I leave the marker comments in place. Roslyn even tracks them through extract-method.
- **Pulling samples from a separate repo.** It would keep the weblog folder leaner, but every additional repo is another moving piece for readers. Keeping everything in one place wins.
- **`shellcheck` / `hadolint` jobs.** Cheap to add, but I want at least one real shell sample first.

The full implementation lives in [astro.config.mjs](https://github.com/dvdstelt/weblog/blob/main/astro.config.mjs) and is small enough to read in one sitting. If you spot a sharp edge, the icon in the corner of this paragraph's code blocks knows where to send you.
