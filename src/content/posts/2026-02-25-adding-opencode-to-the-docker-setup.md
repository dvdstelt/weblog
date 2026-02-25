---
id: 20260225
author: Dennis van der Stelt
title: Claude Code - Adding OpenCode to the Docker setup
description: How I added a second AI coding agent to the same Docker image and cleaned up the launcher scripts in the process
pubDate: '2026-02-25T01:00:00'
tags:
  - ai
  - docker
  - coding
---

In the [previous posts](/2026/02/19/claude-code-in-docker/) I covered how I run Claude Code inside a Docker container and how worktrees work across the container boundary. That setup has been humming along nicely, but I've been curious about [OpenCode](https://opencode.ai/) as an alternative terminal-based AI coding agent. Rather than maintaining a separate environment for it, I wanted both tools available in the same image so I could switch between them without thinking about it.

This is what that looked like in practice.

## Adding OpenCode to the image

The Dockerfile change was the easy part. Claude Code is installed as a global npm package, and OpenCode is too:

```dockerfile
# ── Claude Code ──
RUN npm install -g @anthropic-ai/claude-code

# ── OpenCode ──
RUN npm install -g opencode-ai
```

One line. Both tools are now in the image. The harder part was making the rest of the setup work for both.

## Making the entrypoint tool-agnostic

The original entrypoint ended with `exec claude "$@"`. That's fine when you only have one tool, but now I need to launch either `claude` or `opencode` depending on how the container was started. The fix is an environment variable:

```bash
exec "${AGENT_CMD:-claude}" "$@"
```

`AGENT_CMD` is set by the launcher script before `docker run`. If it's not set, it defaults to `claude`, so the existing `cc` and `ccc` scripts keep working without any changes.

## The launcher scripts were becoming a mess

Here's where the interesting refactoring happened. When I added OpenCode, I started by copying `cc.bat` to `oc.bat` and changing `claude` to `opencode`. That gave me a working `oc` command, but now the full Docker logic lived in three places: `cc.bat`, `oc.bat`, and any future tool I might add.

The Docker invocation is not short. It sets detach keys, builds a container name from the folder, picks a random port, checks for a `.env` file, mounts volumes, and handles `--continue` and `/bin/bash` as special cases. Duplicating all of that for every tool is a maintenance problem waiting to happen.

So I extracted it into a shared `docker-run.bat` (and `docker-run.ps1` for PowerShell). The launcher scripts themselves became trivially thin wrappers:

```bat
@echo off
call "%~dp0docker-run.bat" claude %*
```

```bat
@echo off
set "EXTRA_VOLUMES=-v "%USERPROFILE%\.local\share\opencode:/root/.local/share\opencode""
call "%~dp0docker-run.bat" opencode %*
```

`cc.bat` is two lines. `oc.bat` is three - it adds an extra volume mount before delegating. `ccc`, `occ`, `ccd` are all the same pattern. The actual Docker logic lives in one place, and adding a third tool in the future means writing a two-line wrapper.

The `EXTRA_VOLUMES` variable is how the OpenCode launcher adds its config mount without needing to touch `docker-run`. `docker-run` picks it up if it's set, ignores it if it's not.

## Persisting OpenCode configuration

OpenCode stores its configuration at `~/.local/share/opencode` inside the container. Without a volume mount, that configuration - provider settings, authentication, preferences - disappears when the container exits. The OpenCode launcher adds this before calling `docker-run`:

```bat
set "EXTRA_VOLUMES=-v "%USERPROFILE%\.local\share\opencode:/root/.local/share/opencode""
```

This maps the same folder from the Windows host into every OpenCode container, the same way `%USERPROFILE%\.claude` is mapped for Claude Code. Log in once, and it persists.

## Container naming

With two tools sharing the same infrastructure, I changed the container naming scheme. Previously it was `claude-<folder>`. That felt wrong when the container might be running OpenCode instead. The new scheme is `ai-<folder>`:

```bat
set "CONTAINER_NAME=ai-%FOLDER_NAME%"
```

So `cc` and `oc` started from `D:\git\dvdstelt\weblog` both use the container name `ai-weblog`. They never run simultaneously (the new `cc` removes the old container first), so one name per folder is fine.

## Fixing Ctrl+P (Docker's detach sequence)

Docker's default detach sequence is `Ctrl+P Ctrl+Q`. That means if you press `Ctrl+P` inside a container - which OpenCode uses for navigation - Docker intercepts the first keypress and waits. You have to press `Ctrl+P` twice for it to reach the app.

The fix is to change Docker's detach key sequence to something you'd never accidentally type:

```bat
set "DETACH_KEYS=ctrl-],ctrl-q"
```

This is set inside `docker-run` and passed to every `docker run` and `docker exec` call via `--detach-keys`. Both tools now get `Ctrl+P` uninterrupted.

## First-run setup for both tools

One thing that surprised me: you can't just run OpenCode's interactive setup through a regular `docker run` that immediately hands control to the TUI. The initial authentication flow needs to happen in a bash shell first, so you have control over what you're doing.

The setup flow is to start a temporary container with `--entrypoint /bin/bash`:

```cmd
docker run -it --name ai-setup ^
    -v "%USERPROFILE%\.claude:/root/.claude" ^
    -v "%USERPROFILE%\.config:/root/.config" ^
    -v "D:\temp\claude:/workspace/temp" ^
    -e OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT=true ^
    -w "/workspace/temp" ^
    --entrypoint /bin/bash ^
    claude-code
```

From that shell you run `claude` to set up Claude Code, then `opencode` to set up OpenCode. Once both are configured, you exit and commit the container back to the image:

```cmd
docker commit --change "ENTRYPOINT [\"entrypoint.sh\"]" ai-setup claude-code
docker rm ai-setup
```

The `--change` flag is important. Because you started with `--entrypoint /bin/bash`, committing without it would bake `/bin/bash` as the entrypoint into the image permanently. The flag overrides that and restores the correct `entrypoint.sh`.

The `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT` environment variable is worth calling out. OpenCode's TUI tries to copy selected text to the clipboard. In a Windows Terminal to Docker to bash chain, this breaks the terminal entirely and prevents you from pasting the authentication URL. Setting this env var disables that behavior so setup works normally.

## The result

After all this, the usage is straightforward. Navigate to any project folder:

| Command | What it does |
|---|---|
| `cc` | Start a new Claude Code session |
| `ccc` | Continue the previous Claude Code session |
| `oc` | Start a new OpenCode session |
| `occ` | Continue the previous OpenCode session |

Both tools are in the same image, use the same container naming scheme, share the same infrastructure scripts, and persist their configuration on the Windows host. Switching between them is as simple as typing `cc` or `oc`.

The [next post](/2026/02/25/claude-code-refinements-and-fixes/) covers a handful of smaller improvements that accumulated alongside this work: random port mapping, an improvement to `git-wtadd`, and how Ctrl+O was being swallowed by the terminal.
