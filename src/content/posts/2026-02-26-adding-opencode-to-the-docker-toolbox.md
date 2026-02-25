---
id: 20260226
author: Dennis van der Stelt
title: Adding OpenCode to the Docker toolbox
description: When a second AI tool exposes every assumption baked into your launcher scripts
pubDate: '2026-02-26T01:00:00'
image: /images/2026/adding-opencode-to-the-docker-toolbox.png
tags:
  - ai
  - docker
  - coding
---
*This is part 3 of the [AI coding agents in Docker](/2026/02/25/ai-coding-agents-in-docker/) series.*

After two posts about running Claude Code in Docker, I had a setup I was genuinely happy with. Launcher scripts, worktrees, persistent auth, a configuration file that teaches the agent my conventions. Everything worked.

Then I wanted to try [OpenCode](https://opencode.ai/).

OpenCode is another AI coding agent, similar in spirit to Claude Code but with a different <abbr data-tooltip="Terminal User Interface: a text-based app with panels, menus, and keyboard shortcuts, rendered in your terminal instead of a graphical window">TUI</abbr> and its own opinions about configuration. I figured adding it would be straightforward: install it in the Docker image, write an `oc` launcher script, done.

It was not that straightforward.

## The easy part

Installing OpenCode in the Docker image is one line:

```dockerfile
RUN npm install -g opencode-ai
```

That part was easy. The interesting part was everything around it.

## The launcher problem

My `cc.bat` script had Claude Code assumptions baked in everywhere. The container name started with `claude-`. The entrypoint ran `claude` directly. The env vars, volume mounts, and port mapping logic were all inline. To add OpenCode, I could have copied `cc.bat` to `oc.bat` and changed the Claude-specific bits. That would have worked, and it would have been a maintenance headache the moment I wanted to change how port mapping works or add a new volume mount.

Instead, I extracted all the shared Docker logic into a central script pair: `docker-run.bat` and `docker-run.ps1`. These handle everything that's the same regardless of which tool you're launching:

```bat
REM docker-run.bat (simplified)
set "TOOL_CMD=%~1"
shift

set "CONTAINER_NAME=ai-%FOLDER_NAME%"

docker run -it ^
    --name %CONTAINER_NAME% ^
    -e AGENT_CMD=%TOOL_CMD% ^
    -e HOST_WORKSPACE=%cd% ^
    -e CONTAINER_WORKDIR=/workspace/%FOLDER_NAME% ^
    -p %HOST_PORT%:1337 ^
    -v "%USERPROFILE%\.claude:/root/.claude" ^
    -v "%USERPROFILE%\.config:/root/.config" ^
    %EXTRA_VOLUMES% ^
    -v "%PARENT_DIR%:/workspace" ^
    -w "/workspace/%FOLDER_NAME%" ^
    claude-code %EXTRA_ARGS%
```

The first argument is the tool command to run inside the container. Container naming, volume mounts, port mapping, env file loading, and the `--continue` flow for reattaching to sessions: all handled here once.

The actual launcher scripts became one-liners:

```bat
@echo off
call "%~dp0docker-run.bat" claude %*
```

```bat
@echo off
set "EXTRA_VOLUMES=-v "%USERPROFILE%\.local\share\opencode:/root/.local/share/opencode""
call "%~dp0docker-run.bat" opencode %*
```

The OpenCode launcher sets one extra volume mount (more on that in a moment) and delegates everything else. Adding a third tool someday would be another three-line script.

## Making the entrypoint tool-agnostic

The old entrypoint ended with `exec claude "$@"`. That obviously won't work when the container needs to start OpenCode instead. The fix: read the tool command from an environment variable.

```bash
exec "${AGENT_CMD:-claude}" "$@"
```

The launcher passes `-e AGENT_CMD=opencode` (or `claude`) into the container. The entrypoint does its setup work (fixing plugin paths, configuring git, disabling gc) and then starts whatever tool was requested. If `AGENT_CMD` isn't set, it defaults to `claude` for backward compatibility.

## OpenCode's configuration persistence

Claude Code stores its config in `~/.claude` and `~/.config`, both of which I was already mounting from the host. OpenCode stores its configuration in `~/.local/share/opencode/`. Without mounting that directory, OpenCode would ask you to authenticate every single time you start a new container.

That's why the `oc` launcher has that extra volume mount:

```bat
set "EXTRA_VOLUMES=-v "%USERPROFILE%\.local\share\opencode:/root/.local/share/opencode""
```

The `EXTRA_VOLUMES` variable is picked up by `docker-run.bat` and injected into the `docker run` command. This pattern keeps tool-specific concerns out of the shared infrastructure.

One subtlety worth noting: `EXTRA_VOLUMES` has to be a plain `set` variable, not a parameter passed on the command line. Batch file parameters strip the inner quotes from values like `-v "%USERPROFILE%\...:/root/..."`, which breaks the `docker run` command. Setting it as an environment variable before calling the shared script sidesteps that quoting problem entirely.

## The copy-paste trap

This one was painful to debug. During first-time setup, OpenCode asks you to paste an API key or visit an authentication URL. Normally you'd copy text from the terminal, open a browser, paste, done. In my case this came up when authenticating with Claude MAX: copying the URL, log in, paste the code, done. Except it wasn't done, because copy & paste had stopped working.

OpenCode's TUI has a feature where selecting text automatically copies it to the clipboard. In a chain of Windows Terminal, Docker, and bash, this breaks spectacularly during the authentication part.

The fix is an environment variable:

```
-e OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT=true
```

This disables the auto-copy behavior so that the standard terminal copy-paste works during setup. The `docker-run` scripts set this on every run because it causes no harm during normal use and prevents the clipboard issue from ever surfacing.

## Freeing Ctrl+O

After getting OpenCode running, I noticed something odd: `Ctrl+O` wasn't working. OpenCode uses it for one of its commands, but pressing it did nothing.

The culprit: the terminal's "discard output" control character. In Unix terminals, `Ctrl+O` is mapped to the `discard` function by default, which tells the terminal to discard output from a running process. Most people have never heard of it because most people have never needed it. But it silently intercepts the keystroke before OpenCode ever sees it.

The fix goes in the entrypoint, before any tool starts:

```bash
stty discard undef 2>/dev/null || true
```

This unbinds `Ctrl+O` from the discard function, freeing it for OpenCode (or whatever else might want it). The `2>/dev/null || true` is there because `stty` will fail if there's no TTY attached, like during Docker image builds.

## First-time setup for both tools

Setting up authentication for both Claude Code and OpenCode happens in a single session. You start a temporary container with bash:

```cmd
docker run -it --name ai-setup ^
    -v "%USERPROFILE%\.claude:/root/.claude" ^
    -v "%USERPROFILE%\.config:/root/.config" ^
    -e OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT=true ^
    -w "/workspace/temp" ^
    --entrypoint /bin/bash claude-code
```

Inside that shell, you run `claude` to authenticate Claude Code, exit, then run `opencode` to authenticate OpenCode, exit. Then from the host:

```cmd
docker commit --change "ENTRYPOINT [\"entrypoint.sh\"]" ai-setup claude-code
docker rm ai-setup
```

The `--change` flag is important. Because the setup container was started with `--entrypoint /bin/bash`, Docker remembers that override. Without `--change`, committing the container bakes `/bin/bash` as the permanent entrypoint, and your `cc` and `oc` commands would drop you into a bash shell instead of starting the tool.

## The result

The full set of commands now looks like this:

| Command | What it does |
|---|---|
| `cc` | Start a new Claude Code session |
| `ccc` | Continue a previous Claude Code session |
| `oc` | Start a new OpenCode session |
| `occ` | Continue a previous OpenCode session |
| `ccd` | Open bash in a running container |

Both tools share the same Docker image, the same worktree infrastructure, the same git identity setup, and the same entrypoint. The only differences are the tool command and OpenCode's extra config volume. Adding a third tool would mean one more line in the Dockerfile and a three-line launcher script.

## What doesn't transfer

The shared infrastructure works well, but not everything carries over. Claude Code supports a global `CLAUDE.md` and custom skills: reusable prompt fragments you can invoke by name. I use these heavily. My global setup documents conventions like how to use `git-wtadd` for worktrees, and skills let me invoke complex workflows with a short command.

OpenCode doesn't read any of that. It has its own configuration mechanisms, and I haven't explored them fully yet, but the immediate consequence is that anything I want both tools to know has to be duplicated. The shared `AGENTS.md` in each repository handles the project-level conventions, but the global stuff, the cross-project habits and shortcuts, needs to live somewhere OpenCode can find it. For now that means maintaining two separate global configurations, which is exactly the kind of friction that makes a tool feel like more work than it saves.

The setup went from "a Claude Code wrapper" to "an AI coding agent launcher." That shift in thinking, from building for one tool to building for the category, turned out to be the most useful change. The [next post](/2026/02/26/from-claude-specific-to-agent-agnostic/) is about the rest of that journey: the ergonomic fixes, the terminal quirks, and the design principle that ties it all together.
