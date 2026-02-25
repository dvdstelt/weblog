---
id: 20260225
author: Dennis van der Stelt
title: AI coding agents in Docker
description: A series on running AI coding tools in a containerized development environment on Windows
pubDate: '2026-02-25T01:00:00'
tags:
  - ai
  - docker
  - coding
---
This is the index for a series of posts about running AI coding agents inside Docker containers. It started with Claude Code and a clean-machine obsession, then grew into something more general: a portable, tool-agnostic setup that works for any AI coding agent.

If you're new here, start at the top and work your way down. Each post builds on the previous one.

## The series

1. **[Running Claude Code in Docker](/2026/02/19/claude-code-in-docker/)** - The foundation. A Dockerfile with every tool you might need, launcher scripts that let you type `cc` from any project folder, and volume mounts that make it all work.

2. **[Worktrees and configuration](/2026/02/20/claude-code-worktrees-and-configuration/)** - Teaching an AI agent your conventions. Cross-platform git worktrees with `git-wtadd`, parallel agents on different branches, plugin path fixes, and a `CLAUDE.md` file that works like onboarding documentation.

3. **[Adding OpenCode to the Docker toolbox](/2026/02/26/adding-opencode-to-the-docker-toolbox/)** - The setup wasn't as portable as I thought. Extracting shared launcher infrastructure, making the entrypoint tool-agnostic, and working around OpenCode's terminal quirks.

4. **[From Claude-specific to agent-agnostic](/2026/02/27/from-claude-specific-to-agent-agnostic/)** - Ergonomic fixes, smarter worktrees, terminal key conflicts, and the design principle behind all of it: build infrastructure for the category, not a single tool.

## The repository

All scripts, the Dockerfile, and the documentation live in a single repository. Each post references specific files and commits from it, so you can follow along or just grab what you need.
