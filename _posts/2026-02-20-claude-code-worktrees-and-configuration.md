---
layout: post
id: 20260220
author: Dennis van der Stelt
image: '/images/2026/claude-code-worktrees-and-configuration/header.jpg'
date: 20260220 010000
title: Claude Code - Worktrees and configuration
description: Teaching an AI agent your conventions so it can actually follow them
tags:
  - ai
  - docker
  - coding
  - git
---

In my [previous post](/2026/02/19/claude-code-in-docker/) I explained how I run Claude Code inside a Docker container with a full development environment. The basics are there: a Dockerfile with all the tools, launcher scripts to start sessions from any folder, and volume mounts to share files and authentication. But there are a few more pieces that make this setup genuinely pleasant to work with.

## The parent directory trick

You might have noticed something odd in the launcher script. Instead of mounting the current project folder as `/workspace`, I mount its *parent directory*:

```bat
for %%I in ("%cd%\..") do set "PARENT_DIR=%%~fI"

docker run -it ^
    -v "%PARENT_DIR%:/workspace" ^
    -w "/workspace/%FOLDER_NAME%" ^
    claude-code
```

If I run `cc` from `D:\git\dvdstelt\weblog`, the mount is `D:\git\dvdstelt` to `/workspace`. Claude's working directory is set to `/workspace/weblog`, so from its perspective nothing changes. But it also has access to sibling folders under `/workspace`.

Why does that matter? Because of worktrees.

## Git worktrees across the boundary

[Git worktrees](https://git-scm.com/docs/git-worktree) let you check out multiple branches of the same repository simultaneously, each in its own directory. Instead of stashing your work to switch branches, you create a worktree and have both branches open side by side.

In my setup, worktrees are created as siblings of the project:

```
/workspace/weblog/                          # main checkout
/workspace/weblog@blogpost-claude-in-docker # worktree for this blog post
```

Because the parent directory is mounted, these worktrees are visible both inside the container *and* on the Windows host. On the Windows side, they show up as:

```
D:\git\dvdstelt\weblog\
D:\git\dvdstelt\weblog@blogpost-claude-in-docker\
```

There's a catch, though. Git worktrees store absolute paths internally -- the worktree's `.git` file points back to the main repository's `.git/worktrees/` directory, and vice versa. A path like `/workspace/weblog/.git/worktrees/...` is meaningless on the Windows host, and `D:\git\dvdstelt\weblog\.git\worktrees\...` is meaningless inside the container.

## git-wtadd: the cross-platform fix

To solve this, I wrote a small bash script called `git-wtadd` that creates worktrees with relative paths:

```bash
#!/bin/bash
set -e

WORKTREE_PATH="$1"
shift

# Create the worktree normally
git worktree add "$WORKTREE_PATH" "$@"

# Resolve absolute paths
WORKTREE_ABS=$(realpath "$WORKTREE_PATH")
WORKTREE_NAME=$(basename "$WORKTREE_ABS")
MAIN_GIT_DIR=$(git rev-parse --git-dir)
MAIN_GIT_ABS=$(realpath "$MAIN_GIT_DIR")
WORKTREE_GITDIR="$MAIN_GIT_ABS/worktrees/$WORKTREE_NAME"

# Rewrite the .git file to use a relative path
REL_TO_MAIN=$(realpath --relative-to="$WORKTREE_ABS" "$WORKTREE_GITDIR")
echo "gitdir: $REL_TO_MAIN" > "$WORKTREE_ABS/.git"

echo "Worktree created with relative paths: $WORKTREE_PATH"
```

After `git worktree add` does its thing, the script rewrites the `.git` file in the worktree to use a relative path instead of an absolute one. Since the relative path from `weblog@feature-x` back to `weblog/.git/worktrees/...` is the same regardless of whether you're looking from `/workspace/` or `D:\git\dvdstelt\`, both the Linux container and the Windows host can resolve it.

The script is baked into the Docker image via the Dockerfile, so it's always available as `git-wtadd`.

## Fixing plugin paths on startup

Sharing the `.claude` directory between Windows and the container creates another path problem. Claude Code stores plugin configurations with absolute paths. On Windows, that looks like `C:\Users\dvdst\.claude\plugins\cache\...`. Inside the container, that path doesn't exist -- it should be `/root/.claude/plugins/cache/...`.

The entrypoint script runs a Python fix on every container start:

```python
def fix_paths(filepath):
    with open(filepath) as f:
        content = f.read()

    original = content
    def replace_path(m):
        rest = m.group(1).replace("\\\\", "/")
        return "/root/.claude/" + rest

    content = re.sub(
        r'C:\\\\Users\\\\[^"\\]+\\\\.claude\\\\([^"]*)',
        replace_path,
        content,
    )

    if content != original:
        with open(filepath, "w") as f:
            f.write(content)
```

It scans the plugin configuration files for Windows-style paths and rewrites them to Linux paths. It's idempotent -- if the paths are already Linux-style, it does nothing. This runs via `entrypoint.sh` before Claude Code starts, so by the time you interact with Claude, all plugins work correctly.

The entrypoint also sets up your git identity if it's not already configured, so you never have to think about that either:

```bash
#!/bin/bash
python3 /usr/local/bin/fix-plugin-paths.py 2>/dev/null

if ! git config --global user.name &>/dev/null; then
    git config --global user.email "dvdstelt@gmail.com"
    git config --global user.name "Dennis van der Stelt"
fi

exec claude "$@"
```

## Teaching Claude your conventions

Here's where it gets interesting. Claude Code reads a `CLAUDE.md` file (if present) at the start of every session. This file is like a set of standing instructions -- you write down your conventions and preferences, and Claude follows them without you having to repeat yourself.

My global `CLAUDE.md` includes things like:

- **Git workflow rules:** never push to `main`, always work on feature branches, commit after each logical change
- **Commit message conventions:** emoji prefixes to categorize commits (a bug fix gets a different emoji than a new feature)
- **Worktree conventions:** always use `git-wtadd`, create worktrees as siblings under `/workspace` with the `@` separator
- **Technology preferences:** .NET 10, semantic versioning, which NuGet feeds to use

For example, this is the section about worktrees:

```markdown
## Worktrees

Use `git worktree` to enable parallel work on the same repo.
Worktrees are created as sibling directories under `/workspace/`
using `@` as separator:

/workspace/NServiceBus/              # main checkout
/workspace/NServiceBus@feature-x/    # worktree for feature-x branch

**Always use `git-wtadd`** instead of `git worktree add`.
```

This means when I ask Claude to work on something, it already knows to create a worktree, use the right naming convention, and keep the main checkout clean. I don't have to explain this every time. It's like onboarding a new team member -- you write it down once, and they follow the house rules.

You can also have project-specific instruction files that complement the global one. My blog has its own with a skill definition for writing blog posts in my voice and style. Different repositories have different conventions, and the configuration files let you express that.

## Tracking what Claude does

One more thing that turned out to be useful: a `usage.md` file that gets automatically updated with what Claude has been working on. It's a lightweight log of sessions, what was accomplished, what tools were used. Nothing fancy, but when you come back to a project after a week, it's nice to have a trail of what happened.

## The full picture

Let me put all the pieces together. When I want to work on something:

1. I open a terminal in my project folder
2. I type `cc`
3. The launcher script creates a Docker container with every tool I might need
4. The entrypoint fixes plugin paths and sets up git
5. Claude Code starts, reads my global and project-specific configuration files
6. Claude knows my conventions: worktree naming, commit messages, branching rules
7. If it needs to work on a feature, it creates a worktree with `git-wtadd`
8. Everything it writes is visible on my Windows machine in real-time

My machine stays clean. Claude has full access to everything it needs. The worktrees work on both sides of the container boundary. And the configuration files mean I don't have to re-explain my preferences every session.

Is it a perfect setup? No -- there are no solutions, only trade-offs. Docker adds a layer of indirection, rebuilding the image takes a few minutes, and occasionally you'll install something in a container and forget to add it to the Dockerfile. But compared to the alternative of cluttering my host machine with every tool under the sun, I'll take it.
