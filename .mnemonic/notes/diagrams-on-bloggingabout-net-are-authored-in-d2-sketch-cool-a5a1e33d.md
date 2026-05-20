---
title: >-
  Diagrams on bloggingabout.net are authored in D2 (sketch + Cool classics, ELK
  layout)
tags:
  - weblog
  - diagrams
  - d2
  - tooling
  - convention
lifecycle: permanent
createdAt: '2026-05-20T16:54:23.267Z'
updatedAt: '2026-05-20T16:54:23.267Z'
role: decision
alwaysLoad: false
project: https-github-com-dvdstelt-weblog
projectName: weblog
memoryVersion: 1
---
All architecture and flow diagrams in the weblog repo are authored in [D2](https://d2lang.com) and rendered to SVG. The convention:

- **Source:** `samples/<post-slug>/<name>.d2`
- **Output:** `public/images/<year>/<post-slug>/<name>.svg` (referenced by posts as `/images/<year>/<post-slug>/<name>.svg`)
- **Render command:** `d2 --sketch --theme=4 -l elk <in.d2> <out.svg>`
  - `--sketch` is the hand-drawn renderer
  - `--theme=4` is "Cool classics"
  - `-l elk` uses ELK layout (cleaner than the default Dagre for architecture diagrams)
- **Binary install:** download the tarball from the [D2 releases page](https://github.com/terrastruct/d2/releases) and drop `bin/d2` on `PATH` (e.g. `~/.local/bin/d2`). Not an npm dependency, not committed. CI does not render diagrams — the SVG that ships is the committed one.
- **AGENTS.md** has the canonical version of this under the "Diagrams" subsection.

**Why this combination:** evaluated against plain mermaid (looks generic), themed mermaid (better but still generic), Excalidraw (no text source). D2 sketch + Cool classics gives a hand-drawn, personality-carrying look while preserving a text source that diffs cleanly in git. Decision made 2026-05-20 in the Keycloak OIDC tutorial series.

**Do not propose mermaid** for diagrams in this repo unless the user explicitly asks; D2 is the standing choice.
