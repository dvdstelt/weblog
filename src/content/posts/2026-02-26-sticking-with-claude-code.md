---
id: 20260228
author: Dennis van der Stelt
title: Sticking with Claude Code
description: OpenCode looked great on paper. After a week of daily use, I'm going back to Claude Code.
pubDate: '2026-02-26T01:02:00'
image: /images/2026/sticking-with-claude-code.png
tags:
  - ai
  - docker
  - coding
---
*This is part 5 of the [AI coding agents in Docker](/2026/02/25/ai-coding-agents-in-docker/) series.*

After all the work to make the Docker setup tool-agnostic, it felt only right to actually use another tool. So I ran OpenCode for a week, doing the same kinds of tasks I normally do with Claude Code: writing code, refactoring, exploring unfamiliar codebases, drafting blog posts.

My initial reaction was positive. The TUI looks polished. The layout is different from Claude Code and takes some getting used to, but it feels like a finished product. I was genuinely optimistic.

That optimism faded over the week.

## It just felt slower

This is hard to quantify but impossible to ignore. Typing in OpenCode felt sluggish. Not catastrophically, but enough to notice, and once you notice you can't stop noticing. It wasn't specific to one terminal: I tried Windows Terminal, PowerShell, and Tabby. Same feeling across all three.

Response latency was also inconsistent. Sometimes things moved quickly. Other times there was a noticeable pause before anything happened, the kind of pause where you're not sure if something went wrong or if it's just thinking.

## Multiline input didn't work

In Claude Code, you can start a new line mid-prompt with `\` followed by Enter. It's a small thing but I use it constantly for longer instructions.

In OpenCode, I couldn't get this to work at all in my setup. The keystroke either submitted the prompt or did nothing useful. I tried working around it, but there's a rhythm to writing longer prompts with line breaks and losing it made the whole interaction feel clunkier.

## It refused more often

This is the one that really stuck with me. OpenCode would occasionally tell me it couldn't perform a task because it was "primarily a coding assistant" or something to that effect. I never get that from Claude Code. Not once.

It happened most often with tasks that weren't pure code: writing documentation, thinking through a design decision, drafting an explanation. These are things I do regularly alongside the coding work, and Claude Code handles them without complaint.

The explanation is the system prompt. Both tools use the same underlying models, but each tool wraps every API call in its own system prompt before your message even arrives. OpenCode apparently tells the model it's a coding assistant, which nudges it toward refusing anything outside that frame. Claude Code's system prompt is clearly broader. So it's not the model behaving differently: it's the tool putting the model in a narrower box. Same engine, different instructions.

## The output quality surprised me

I ran the same prompts through both tools using the same models: Claude Opus 4.6 and Sonnet 4.6. I expected the results to be identical, or close enough not to matter. They weren't.

I consistently preferred the Claude Code output. The responses felt more on point. Once you understand the system prompt difference, this makes sense too: a model told it's a coding assistant will approach every prompt through that lens, even when it does engage. Claude Code's broader framing lets the model bring its full range to the response.

## Configuration doesn't transfer

Claude Code has a global `CLAUDE.md` and a skills system: reusable prompt fragments you invoke by name. I use both extensively. My global setup documents cross-project conventions like how to use `git-wtadd` for worktrees, and skills let me trigger complex workflows with a short command.

None of that is visible to OpenCode. It has its own configuration mechanisms that I haven't fully explored, but the immediate effect is that anything I want both tools to know needs to exist in two places. The per-repository `AGENTS.md` covers project conventions, but global habits and shortcuts have to be maintained separately for each tool. That's friction that compounds over time, and it's friction that doesn't exist when you're only running one tool.

A concrete example: my global `CLAUDE.md` documents the worktrees workflow and references the `git-wtadd` skill by name. OpenCode has no idea any of that exists, so worktree creation just didn't work the way I expected. I've since added that documentation to OpenCode's configuration as well, and it works better now. But that's exactly the duplication problem: every convention I've taught Claude Code globally has to be taught again, separately, to every other tool I want to support.

Those global configuration files aren't in the GitHub repository. They're personal, cross-project, and evolve constantly. That's probably fine. But it's worth being aware of if you're considering this kind of setup: the repository gives you the Docker infrastructure, the launcher scripts, and the per-project `AGENTS.md` convention. The global muscle memory that makes it all feel smooth is something you build yourself over time, and right now it doesn't transfer between tools automatically.

## The setup was worth it anyway

None of this makes the Docker work a waste. The tool-agnostic setup is still the right approach. OpenCode slots in cleanly, the shared infrastructure works, and if OpenCode improves, trying it again is a three-line launcher script and five minutes of my time. I'm keeping OpenCode in the repository for now, though I might remove it eventually if I don't find myself reaching for it.

It might also just be a matter of personal fit. My workflow leans heavily on tasks that aren't purely about writing code, and Claude Code handles that mix better for me. Someone with a different workflow might find the opposite.

For now: back to Claude Code.
