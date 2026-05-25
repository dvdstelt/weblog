---
name: blogpost
description: Write a blog post for Dennis van der Stelt's blog "BloggingAbout.NET" (bloggingabout.net). Use when the user wants to draft, write, or expand a new blog post from a plan or outline, especially when they reference a plan file or say things like "write a blog post about X". Handles the Jekyll frontmatter, file naming, and worktree setup for this repo.
---

# Write a blog post

You are writing a blog post for Dennis van der Stelt's blog "BloggingAbout.NET" (bloggingabout.net). Dennis is a developer, international speaker, and coach/trainer who works at Particular Software on NServiceBus. He writes about distributed systems, messaging, microservices, software architecture, and occasionally personal topics.

## Writing voice and style

Dennis's writing voice, tone, structure, and things-to-avoid live in `~/.claude/writing-style.md`. **Read that file before drafting** — it covers voice, structural patterns, technical content conventions, and example openings. This skill only covers the repo-specific mechanics below.

## Instructions

The user may provide a path to a markdown plan file as an argument (e.g. `/blogpost plan.md`). This file contains the idea, outline, key points, or rough structure for the blog post. If no argument is provided, look for a `plan.md` in the current working directory.

### Step 1: Read the plan

Read the plan file to understand what the blog post should cover. The plan may contain:
- A topic or title idea
- Key points or arguments to make
- An outline or structure
- References, links, or sources to include
- Notes on tone or angle

After reading the plan, briefly summarize what you understood and confirm the direction with the user before writing. Ask clarifying questions if the plan is ambiguous.

### Step 2: Create a worktree

Before writing, create a git worktree for this blog post. Derive a branch name from the blog post topic (e.g. `blogpost/saga-patterns-beat-orchestration`).

```
cd /workspace/weblog
git-wtadd /workspace/weblog@<branch-name> <branch-name>
```

All file creation and editing happens in the worktree, not in the main checkout.

### Step 3: Write the blog post

Write the blog post in the worktree following the voice and style described in `~/.claude/writing-style.md`. Output the full markdown file including frontmatter. Save it to `_posts/{YYYY}-{MM}-{DD}-{slug}.md` inside the worktree.

### Step 4: Review with the user

After writing, present the post to the user for feedback. Iterate based on their input. Commit the result when the user is satisfied.

## Frontmatter format

```yaml
---
layout: post
id: {YYYYMMDD from the post date}
author: Dennis van der Stelt
image: '/images/{year}/{slug}/header.jpg'
date: {YYYYMMDD} 010000
title: {title}
description: {one sentence, conversational summary}
tags:
  - {tag1}
  - {tag2}
---
```

- The `id` is the date portion formatted as YYYYMMDD
- The `date` field format is `YYYYMMDD HHMMSS` (no dashes, no colons)
- The `image` path uses the year and a slugified version of the title
- Tags are lowercase, use spaces not hyphens (e.g. "distributed systems", not "distributed-systems")
- The description is brief and conversational, sometimes witty

## File naming

The file should be saved as `_posts/{YYYY}-{MM}-{DD}-{slug}.md` where the slug is lowercase, hyphen-separated, derived from the title.

## Markdown conventions (this repo)

- Images: `![alt text](/images/{year}/{slug}/filename.png)` or `![](\images\...)` — Dennis uses both forward and backslash styles
- YouTube embeds: `<iframe src="https://www.youtube.com/embed/{id}" frameborder="0" allowfullscreen></iframe>`
- Links: standard markdown `[text](url)`
- Code blocks: triple backtick with language identifier (e.g. ```csharp)
- Emphasis: *italics* for terms and concepts, **bold** for key points
