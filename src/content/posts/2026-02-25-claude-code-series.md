---
id: 20260227
author: Dennis van der Stelt
title: Claude Code in Docker - Series index
description: All posts in the series about running Claude Code and OpenCode inside Docker on Windows
pubDate: '2026-02-25T03:00:00'
tags:
  - ai
  - docker
  - coding
  - git
---

This is an index of all posts in the series about running AI coding agents inside Docker on Windows. The setup keeps the host machine clean while giving Claude Code and OpenCode access to every development tool they might need.

## The posts

### [Running Claude Code in Docker](/2026/02/19/claude-code-in-docker/)

Where it started. The Docker image, the `cc` launcher scripts, volume mounts, and why mounting the parent directory instead of the project folder is a deliberate choice.

### [Claude Code - Worktrees and configuration](/2026/02/20/claude-code-worktrees-and-configuration/)

Git worktrees work across the container boundary thanks to `git-wtadd`, a small script that rewrites worktree paths so they resolve on both Linux and Windows. Also covers the entrypoint, plugin path fixes, and how `AGENTS.md` teaches the agent your conventions.

### [Adding OpenCode to the Docker setup](/2026/02/25/adding-opencode-to-the-docker-setup/)

How I added OpenCode alongside Claude Code in the same image, made the entrypoint tool-agnostic with `AGENT_CMD`, refactored the launcher scripts into a shared `docker-run` to avoid duplication, and handled first-run setup for both tools.

### [Refinements and fixes](/2026/02/25/claude-code-refinements-and-fixes/)

Smaller improvements: random host port mapping so multiple containers don't clash, `git-wtadd` auto-creating branches when they don't exist, freeing `Ctrl+O` from the terminal so OpenCode can use it, and why the configuration file was renamed from `CLAUDE.md` to `AGENTS.md`.

## The repository

All scripts, the Dockerfile, and helper tools are in [claude-master](https://github.com/dvdstelt/claude-master) on GitHub.
