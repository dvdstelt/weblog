---
layout: post
id: 20260219
author: Dennis van der Stelt
image: '/images/2026/claude-code-in-docker/header.jpg'
date: 20260219 010000
title: Running Claude Code in Docker
description: How I keep my Windows machine clean by stuffing all development tools into a Docker container
tags:
  - ai
  - docker
  - coding
---

This website is generated from Markdown to static HTML using [Jekyll](https://jekyllrb.com/). To run that locally on Windows, I need Ruby with DevKit, Node, Yarn, Jekyll, and what feels like half the internet. Every time an installer spews thousands of lines of text across my console, I get the creeps. It's like watching someone dump a bag of Lego bricks onto a freshly cleaned floor.

I've always liked clean machines. Ask anyone who's seen my desktop -- it has zero icons. Not one. So the idea of installing Ruby, Python, .NET SDK, Node, and all their friends directly onto my Windows box? That doesn't sit well.

## Docker to the rescue

A much better approach: put everything into a Docker container. Install all the tools there, map a volume to my project files, and connect to the container whenever I need to work. My Windows machine stays pristine, the container has everything, and if something goes sideways I just rebuild the image.

When I [wrote about AI pair programming](/2025/02/06/ai-pair-programming/) last year, I was using Claude inside JetBrains Rider. That worked well, but Claude Code -- the CLI-based agent -- is a different beast. It can read your entire codebase, run commands, create files, and essentially act as a pair programmer that lives in your terminal. The thing is, it needs access to tools. Build tools, test runners, package managers. And I don't want those on my host.

So I created a Docker image that has *everything* pre-installed, including Claude Code itself.

## What's in the box

The Dockerfile starts from `node:lts-slim` and layers on everything I might need:

```dockerfile
FROM node:lts-slim

# Core utilities
RUN apt-get update && apt-get install -y \
    bash curl wget git jq tree unzip zip tar \
    openssh-client ca-certificates gnupg sudo \
    build-essential procps findutils diffutils libicu-dev

# Python
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv

# .NET SDK
RUN curl -fsSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin \
    --channel LTS --install-dir /usr/share/dotnet

# Ruby + Jekyll
RUN apt-get update && apt-get install -y ruby-full ruby-bundler

# Static site generators
RUN npm install -g astro hugo-extended @11ty/eleventy

# Claude Code itself
RUN npm install -g @anthropic-ai/claude-code
```

I trimmed some lines for readability, but you get the idea. Python for scripting, .NET for my day job, Ruby for this blog's Jekyll setup, and Astro, Hugo, and Eleventy because I work on different projects that use different generators. One image to rule them all.

The key insight is that Claude Code now has access to every tool it could possibly need. When it decides to run `dotnet build` or `bundle exec jekyll serve`, those commands just work. No "please install Ruby first" errors.

## The launcher scripts

Having a Docker image is great, but typing a 10-line `docker run` command every time is not. So I wrote launcher scripts -- `cc.bat` for CMD and `cc.ps1` for PowerShell -- and put them on my `PATH`.

The idea is simple: navigate to any project folder and type `cc`. That's it. The script figures out the rest:

```bat
@echo off
for %%I in ("%cd%") do set "FOLDER_NAME=%%~nxI"
set "CONTAINER_NAME=claude-%FOLDER_NAME%"
for %%I in ("%cd%\..") do set "PARENT_DIR=%%~fI"

docker run -it ^
    --name %CONTAINER_NAME% ^
    -e HOST_WORKSPACE=%cd% ^
    -e CONTAINER_WORKDIR=/workspace/%FOLDER_NAME% ^
    -v "%USERPROFILE%\.claude:/root/.claude" ^
    -v "%USERPROFILE%\.config:/root/.config" ^
    -v "%PARENT_DIR%:/workspace" ^
    -w "/workspace/%FOLDER_NAME%" ^
    claude-code %*
```

A few things happen here. The script derives a container name from the folder you're in -- so running `cc` from `D:\git\dvdstelt\weblog` creates a container called `claude-weblog`. It passes two environment variables and mounts three volumes:

- **`HOST_WORKSPACE`** is set to the current Windows directory (e.g. `D:\git\dvdstelt\weblog`). Inside the container, things like the status bar and worktree tooling use this to show and record the real Windows path instead of the Linux container path.
- **`CONTAINER_WORKDIR`** is the corresponding path inside the container (e.g. `/workspace/weblog`). Together with `HOST_WORKSPACE`, this lets scripts translate between the two.
- **`%USERPROFILE%\.claude`** maps to `/root/.claude` inside the container. This is where Claude stores its authentication, settings, and plugin configuration. By mounting this from the host, you only need to log in once and that auth persists across all containers.
- **`%USERPROFILE%\.config`** maps to `/root/.config` for general application configuration.
- **The parent directory** of your project maps to `/workspace`. This is a deliberate choice and I'll explain why in the next post when I talk about worktrees.

The container name matters because of `ccc` -- a shortcut for `cc --continue`. If a container named `claude-weblog` already exists, `ccc` reattaches to it instead of starting fresh. Your conversation history, any packages Claude installed mid-session, all preserved. And there's `ccd`, which opens a bash shell in the running container for when you want to poke around yourself.

## Environment variables

If your projects need API keys or secrets, you drop a `.env` file in the `claude-master` folder. The launcher scripts detect it automatically:

```bat
if exist "%~dp0.env" (
    set "ENV_FLAG=--env-file %~dp0.env"
)
```

One `.env` file, shared across all containers. No more copy-pasting keys into every project.

## Adding it to PATH

To make `cc`, `ccc`, and `ccd` available from any folder, you add the `claude-master` directory to your Windows `PATH`:

1. Open **Start** and search for *Edit environment variables for your account*
2. Edit the `Path` variable
3. Add the path to your `claude-master` folder (e.g. `D:\git\dvdstelt\claude-master`)
4. Restart your terminal

After that, you can `cd` into any project and just type `cc` to start a Claude Code session with your full development environment ready to go.

## Multiple projects at once

Because each container gets a unique name based on the folder, you can run multiple Claude sessions simultaneously. One container working on your blog, another on an NServiceBus project, a third on a side project. They're fully isolated from each other, but they all share the same tooling and authentication.

## What's next

This covers the basics of the Docker setup. In the [next post](/2026/02/20/claude-code-worktrees-and-configuration/), I'll go into how git worktrees work across the container boundary, how a custom script fixes the cross-platform path problem, and how a global configuration file teaches Claude Code the conventions for working in this setup.
