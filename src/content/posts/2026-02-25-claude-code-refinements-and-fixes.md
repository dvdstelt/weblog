---
id: 20260226
author: Dennis van der Stelt
title: Claude Code - Refinements and fixes
description: Smaller improvements to the Docker setup - random port mapping, smarter git-wtadd, and freeing Ctrl+O for OpenCode
pubDate: '2026-02-25T02:00:00'
tags:
  - ai
  - docker
  - coding
  - git
---

While [adding OpenCode to the Docker setup](/2026/02/25/adding-opencode-to-the-docker-setup/), a few smaller improvements came together as well. None of them are big enough to warrant their own post, but together they make the setup noticeably smoother.

## Random port mapping

The previous setup had no port mapping at all. If you wanted to run a dev server inside the container and access it from Windows, you had to manually add `-p` flags to the `docker run` command each time.

The new setup maps a randomly chosen host port to container port **1337** on every container start:

```bat
set /a "HOST_PORT=(%random% %% 10000) + 20000"
```

The range is 20000-30000, which keeps it well clear of commonly used ports. The port number is passed into the container as the `HOST_PORT` environment variable, and a small helper script called `portnumber` reads it back out:

```bash
$ portnumber
Container port 1337 is mapped to host port 24521
Access from Windows: http://localhost:24521
```

Inside the container, you always bind to port 1337 regardless of which host port it maps to. The tooling in this blog's `AGENTS.md` reflects this:

```
npm run dev -- --host --port 1337
```

Because each container gets a random host port, you can run multiple containers simultaneously without port conflicts. One container serving this blog, another running a .NET API, no manual coordination required.

## git-wtadd auto-creates branches

The original `git-wtadd` script required the branch to already exist before you called it. If the branch didn't exist, you'd get a cryptic error from `git worktree add` and have to create the branch manually first.

The updated script detects whether the branch exists and adds `-b` automatically if it doesn't:

```bash
if [ -n "$BRANCH" ] && ! git show-ref --verify --quiet "refs/heads/$BRANCH" \
                     && ! git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
    git worktree add -b "$BRANCH" "$WORKTREE_PATH" "${REMAINING[@]}"
else
    git worktree add "$WORKTREE_PATH" "$@"
fi
```

It checks both local branches and remote-tracking branches. If neither exists, it creates the branch as part of the worktree creation. If the branch already exists (locally or as a remote), it checks it out as before.

This means you can just run:

```bash
git-wtadd /workspace/my-project@feature-x feature-x
```

...and it works whether `feature-x` exists or not. One less thing to think about.

## Freeing Ctrl+O for OpenCode

OpenCode uses `Ctrl+O` for opening files. On many Linux terminals, `Ctrl+O` is bound to the `discard` control character, which flushes pending terminal output. In practice, pressing `Ctrl+O` in OpenCode would either do nothing or behave erratically.

The fix is one line in the entrypoint:

```bash
stty discard undef 2>/dev/null || true
```

`stty discard undef` removes the terminal's binding for the discard character, freeing `Ctrl+O` for applications to use as they please. The `2>/dev/null || true` ensures the container still starts cleanly if `stty` isn't available or the terminal doesn't support it.

This runs before the agent starts, so both Claude Code and OpenCode get it regardless of which one is launched.

## A note on the AGENTS.md rename

One small housekeeping change worth mentioning: the configuration file was renamed from `CLAUDE.md` to `AGENTS.md`.

The reasoning is straightforward. The file contains instructions for AI coding agents in general - conventions, workflow rules, tool preferences. Calling it `CLAUDE.md` implies it's Claude-specific, but the same instructions are useful for any agent working in the repository, including OpenCode. `AGENTS.md` is the more accurate name, and it's the convention that tools like Claude Code and others are starting to converge on.

The contents didn't change, just the name.

## The full picture

These are the pieces that have accumulated since the [original Docker post](/2026/02/19/claude-code-in-docker/):

- Random host port mapping, always on port 1337 inside the container
- `git-wtadd` that creates branches automatically when needed
- `Ctrl+O` freed for OpenCode's file opener
- `Ctrl+P` freed from Docker's detach sequence
- Shared `docker-run` logic across all launcher scripts
- Both Claude Code and OpenCode in the same image
- Container naming changed to `ai-<folder>` to be tool-agnostic

The [series index](/2026/02/25/claude-code-series/) has links to all posts if you want to read from the beginning.
