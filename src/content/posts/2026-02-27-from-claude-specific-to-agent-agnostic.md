---
id: 20260227
author: Dennis van der Stelt
title: From Claude-specific to agent-agnostic
description: Container naming, terminal quirks, smarter worktrees, and the principle behind it all
pubDate: '2026-02-27T01:00:00'
image: /images/2026/from-claude-specific-to-agent-agnostic.png
tags:
  - ai
  - docker
  - coding
  - git
---
*This is part 4 of the [AI coding agents in Docker](/2026/02/25/ai-coding-agents-in-docker/) series.*

Over the past few posts I've built up a Docker-based setup for running AI coding agents. It started as a Claude Code wrapper and gradually turned into something more general. This post covers the smaller changes that accumulated along the way: ergonomic fixes, terminal quirks, and a worktree improvement. Individually they're minor. Together they shaped a design principle I didn't set out to follow but ended up appreciating: build for the category, not the tool.

## Container naming

The original launcher created containers named `claude-weblog`, `claude-omnomnom`, and so on. When OpenCode entered the picture, this became awkward. An OpenCode session for the same project would need a different name, but `opencode-weblog` felt like I was encoding tool choice into infrastructure that should be neutral.

I settled on `ai-` as the prefix: `ai-weblog`, `ai-omnomnom`. It's short, it's clear, and it doesn't tie the container to any specific tool. The naming is derived from the folder name, with one extra bit of sanitization: the `@` character (used in worktree folder names like `weblog@feature-x`) is replaced with a hyphen, because Docker container names don't allow `@`.

```bat
set "CONTAINER_NAME=ai-%FOLDER_NAME:@=-%"
```

A small change, but it removes a whole class of "wait, which tool was this container for?" confusion.

There's a practical benefit too. Because the container name is project-based rather than tool-based, I can have Claude, OpenCode, and a plain bash terminal all running inside the same `ai-weblog` container at the same time. Each one is just another `docker exec` session into the same environment. With a tool-specific name like `ccd` or `claude-weblog`, you'd end up with a separate container per tool and lose that sharing.

## Port mapping

The early versions of the launcher used a hardcoded port. That works until you run two containers at the same time and the second one fails to start because the port is already in use. The fix: pick a random host port every time.

```bat
set /a "HOST_PORT=(%random% %% 10000) + 20000"
```

Each container maps a random port in the 20000-52767 range to container port 1337. When you need to access a web server running inside the container (a dev server, a test UI, whatever), a helper script called `portnumber` tells you which host port to use:

```bash
$ portnumber
Container port 1337 is mapped to host port 34521
Access from Windows: http://localhost:34521
```

The script reads Docker's port mapping from inside the container using environment variables. No need to remember which port you assigned to which project.

## The Ctrl+P problem

This one was subtle. Docker reserves `Ctrl+P Ctrl+Q` as the key sequence to detach from an interactive container without stopping it. The problem: Docker intercepts `Ctrl+P` on the first keypress and waits to see if `Q` follows. If you press `Ctrl+P` for any other reason, like a keyboard shortcut inside Claude Code or OpenCode, there's a noticeable delay, and sometimes the keystroke gets swallowed entirely.

The fix is to change Docker's detach key sequence to something you'll never accidentally press:

```bat
set "DETACH_KEYS=ctrl-],ctrl-q"
```

This is passed as `--detach-keys` to both `docker run` and `docker exec`. After this change, `Ctrl+P` works instantly inside the container, and you can still detach with `Ctrl+]` followed by `Ctrl+Q` if you ever need to.

## Smarter worktrees

The `git-wtadd` script from the [worktrees post](/2026/02/20/claude-code-worktrees-and-configuration/) got a small but meaningful improvement. Originally, if you asked it to create a worktree for a branch that didn't exist, it would fail:

```bash
$ git-wtadd /workspace/project@new-feature new-feature
fatal: invalid reference: new-feature
```

You'd have to manually pass `-b` to create the branch. That's one of those things that's fine when you're typing commands yourself, but annoying when an AI agent hits it mid-workflow and has to recover.

The updated script checks whether the branch exists (locally or as a remote tracking branch) and automatically adds `-b` if it doesn't:

```bash
if [ -n "$BRANCH" ] && ! git show-ref --verify --quiet "refs/heads/$BRANCH" \
                     && ! git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
    git worktree add -b "$BRANCH" "$WORKTREE_PATH" "${REMAINING[@]}"
else
    git worktree add "$WORKTREE_PATH" "$@"
fi
```

If the branch exists, it checks it out. If it doesn't, it creates it. No flags needed either way. It's the kind of change that saves maybe two seconds each time, but it removes a failure mode that would otherwise interrupt flow.

## From CLAUDE.md to AGENTS.md

In the [second post](/2026/02/20/claude-code-worktrees-and-configuration/) I talked about `CLAUDE.md`, a file that Claude Code reads for standing instructions. It's a great mechanism: you write down your conventions once and the agent follows them every session.

When I added OpenCode, I realized the instructions in that file weren't Claude-specific at all. "Never push to main." "Use `git-wtadd` for worktrees." "Commit after each logical change." These are conventions for any AI coding agent, not just Claude Code.

It turns out `AGENTS.md` is the standard filename that AI coding agents read by default. It's not a personal convention: it's what the tools expect. So I renamed `CLAUDE.md` to `AGENTS.md`.

Claude Code supports both filenames, so nothing breaks. The instructions are already there and already tool-agnostic, which is exactly what the standard is designed for.

The content changed too. References to "Claude" became references to "the agent." Tool-specific setup instructions (like how to configure Claude Code's status line) moved into their own files. What remained in `AGENTS.md` is purely about conventions and workflow, things that apply regardless of which tool is doing the work.

## The principle

Looking back at these changes, there's a pattern. Every decision that seemed small at the time, the `ai-` prefix, the shared `docker-run` scripts, the `AGENT_CMD` env var, the `AGENTS.md` rename, was a step toward the same thing: making the infrastructure care about what the tool *does*, not what it's *called*.

AI coding agents are proliferating. Claude Code, OpenCode, Cursor, Windsurf, Aider, and more are appearing regularly. The landscape will keep shifting. Building a setup that's tightly coupled to one tool means rebuilding it when you want to try another. Building for the category means a new tool slots in with a three-line launcher script and inherits everything: the Docker image, the worktrees, the conventions, the port mapping, the terminal fixes.

The setup is [on GitHub](https://github.com/dvdstelt/ai-agents) if you want to grab any of it. If you've been running AI coding agents directly on your host machine and are tired of the mess, containerizing the whole thing is worth the initial setup time. And if you're already using Docker for this, I hope some of the cross-platform worktree tricks and terminal fixes save you a few hours of debugging.
