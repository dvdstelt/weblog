# Samples

Real, compilable source files that posts embed snippets from.

## Why

Inline code in blog posts rots. By keeping examples here as actual files, the
compiler (or shellcheck, or hadolint) tells us when a sample stops working.
A post references a region by file path + region name, and the Astro build
inlines it at render time. If the file or region is missing, the build fails
loudly — no silent empty blocks.

## Layout

Grouped by year of post publication, then by post slug:

```
samples/
  <year>/
    <post-slug>/
      README.md            # back-link to the post; brief notes per region
      <Project>/<Project>.csproj
      <Project>/Program.cs
      docker/Dockerfile
      scripts/deploy.sh
```

The year folder keeps the top-level browsable as the blog grows. New samples
land under the year their host post is published in.

`samples/Samples.slnx` aggregates every `.csproj` for the
`.github/workflows/samples.yml` build, which runs `dotnet build -warnaserror`
on changes to `samples/**`. Add new projects with
`dotnet sln samples/Samples.slnx add samples/<year>/<post-slug>/<Project>/<Project>.csproj`.

## Authoring a snippet in a post

In any post under `src/content/posts/`, write a fenced block with `file=` and
optionally `region=` on the info line. The fence body stays empty — the build
fills it in.

````markdown
```csharp file="samples/2026/messaging-intro/Publisher/Program.cs" region="Setup"
```
````

Paths resolve from the repo root.

## Region marker conventions

The marker line itself is stripped from the rendered snippet.

| Comment style    | Start                     | End                  | Used in                                                  |
|------------------|---------------------------|----------------------|----------------------------------------------------------|
| `#` line         | `# region Setup`          | `# endregion`        | shell, Dockerfile, YAML, TOML, Python, .editorconfig     |
| `//` line        | `// region Setup`         | `// endregion`       | JS, TS, C, C++, Go, Rust, JSONC                          |
| C# native        | `#region Setup`           | `#endregion`         | C# (also matches the `#`-line rule above)                |
| `<!-- -->` block | `<!-- region Setup -->`   | `<!-- endregion -->` | HTML, XML, .csproj/.props, Razor                         |
| `/* */` block    | `/* region Setup */`      | `/* endregion */`    | CSS, SCSS                                                |
| `--` line        | `-- region Setup`         | `-- endregion`       | SQL, Lua                                                 |

**JSON has no comment syntax.** Either embed the whole file (omit `region=`) or
rename to `.jsonc` and use `//` markers.

Common leading whitespace inside a region is stripped at extraction time, so a
region nested several levels deep renders flush-left.
