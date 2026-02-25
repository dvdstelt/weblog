---
id: 20260225
author: Dennis van der Stelt
title: AI coding agents in Docker
description: A series on running AI coding tools in a containerized development environment on Windows
pubDate: '2026-02-25T01:00:00'
image: /images/2026/ai-coding-agents-in-docker.png
tags:
  - ai
  - docker
  - coding
---
This is the index for a series of posts about running AI coding agents inside Docker containers. It started with Claude Code and a clean-machine obsession, then grew into something more general: a portable, tool-agnostic setup that works for any AI coding agent.

If you're new here, start at the top and work your way down. Each post builds on the previous one.

## The series

<div class="series-entry">
  <div class="series-entry__image">
    <a href="/2026/02/19/claude-code-in-docker/"><img src="/images/2026/claude-code-in-docker.png" alt="Running Claude Code in Docker" /></a>
  </div>
  <div class="series-entry__text">
    <h3>1. Running Claude Code in Docker</h3>
    <p>The foundation. A Dockerfile with every tool you might need, launcher scripts that let you type <code>cc</code> from any project folder, and volume mounts that make it all work.</p>
    <a class="series-read-link" href="/2026/02/19/claude-code-in-docker/">Read post &rarr;</a>
  </div>
</div>

<div class="series-entry">
  <div class="series-entry__image">
    <a href="/2026/02/20/claude-code-worktrees-and-configuration/"><img src="/images/2026/claude-code-worktrees-and-configuration.png" alt="Worktrees and configuration" /></a>
  </div>
  <div class="series-entry__text">
    <h3>2. Worktrees and configuration</h3>
    <p>Teaching an AI agent your conventions. Cross-platform git worktrees with <code>git-wtadd</code>, parallel agents on different branches, plugin path fixes, and an <code>AGENTS.md</code> file that works like onboarding documentation.</p>
    <a class="series-read-link" href="/2026/02/20/claude-code-worktrees-and-configuration/">Read post &rarr;</a>
  </div>
</div>

<div class="series-entry">
  <div class="series-entry__image">
    <a href="/2026/02/26/adding-opencode-to-the-docker-toolbox/"><img src="/images/2026/adding-opencode-to-the-docker-toolbox.png" alt="Adding OpenCode to the Docker toolbox" /></a>
  </div>
  <div class="series-entry__text">
    <h3>3. Adding OpenCode to the Docker toolbox</h3>
    <p>The setup wasn't as portable as I thought. Extracting shared launcher infrastructure, making the entrypoint tool-agnostic, and working around OpenCode's terminal quirks.</p>
    <a class="series-read-link" href="/2026/02/26/adding-opencode-to-the-docker-toolbox/">Read post &rarr;</a>
  </div>
</div>

<div class="series-entry">
  <div class="series-entry__image">
    <a href="/2026/02/27/from-claude-specific-to-agent-agnostic/"><img src="/images/2026/from-claude-specific-to-agent-agnostic.png" alt="From Claude-specific to agent-agnostic" /></a>
  </div>
  <div class="series-entry__text">
    <h3>4. From Claude-specific to agent-agnostic</h3>
    <p>Ergonomic fixes, smarter worktrees, terminal key conflicts, and the design principle behind all of it: build infrastructure for the category, not a single tool.</p>
    <a class="series-read-link" href="/2026/02/27/from-claude-specific-to-agent-agnostic/">Read post &rarr;</a>
  </div>
</div>

## The repository

All scripts, the Dockerfile, and the documentation live in a single repository. Each post references specific files and commits from it, so you can follow along or just grab what you need.
