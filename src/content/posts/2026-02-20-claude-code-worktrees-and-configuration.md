---
id: 20260220
author: Dennis van der Stelt
title: Claude Code - Worktrees and configuration
description: Teaching an AI agent your conventions so it can actually follow them
pubDate: '2026-02-20T01:00:00'
image: /images/2026/claude-code-worktrees-and-configuration.png
tags:
  - ai
  - docker
  - coding
  - git
---
*This is part 2 of the [AI coding agents in Docker](/2026/02/25/ai-coding-agents-in-docker/) series.*

In my [previous post](/2026/02/19/claude-code-in-docker/) I explained how I run Claude Code inside a Docker container with a full development environment. The basics are there: a Dockerfile with all the tools, launcher scripts to start sessions from any folder, and volume mounts to share files and authentication. But there are a few more pieces that make this setup genuinely pleasant to work with.

## The parent directory trick

You might have noticed something odd in the launcher script. Instead of mounting the current project folder as `/workspace`, I mount its *parent directory*:

```bat
for %%I in ("%cd%\..") do set "PARENT_DIR=%%~fI"

docker run -it ^
    -v "%PARENT_DIR%:/workspace" ^
    -w "/workspace/%FOLDER_NAME%" ^
    claude-code
```

If I run `cc` from `C:\projects\omnomnom`, the mount is `C:\projects` to `/workspace`. Claude's working directory is set to `/workspace/omnomnom`, so from its perspective nothing changes. But it also has access to sibling folders under `/workspace`.

Why does that matter? Because of worktrees.

## Git worktrees across the boundary

[Git worktrees](https://git-scm.com/docs/git-worktree) let you check out multiple branches of the same repository simultaneously, each in its own directory. Instead of stashing your work to switch branches, you create a worktree and have both branches open side by side.

I could use it this way with [OmNomNom](https://github.com/dvdstelt/omnomnom), a demo project for a talk I give on service boundaries. It has multiple branches representing different stages of the demo, and I often want to work on two of them at the same time. In my setup, worktrees are created as siblings of the project:

```
/workspace/omnomnom/              # main checkout
/workspace/omnomnom@location      # worktree for the location branch
```

Because the parent directory is mounted, these worktrees are visible both inside the container *and* on the Windows host. On the Windows side, they show up as:

```
C:\projects\omnomnom\
C:\projects\omnomnom@location\
```

There's a catch, though. Git worktrees store absolute paths internally. The worktree's `.git` file points back to the main repository's `.git/worktrees/` directory, and vice versa. A path like `/workspace/omnomnom/.git/worktrees/...` is meaningless on the Windows host, and `C:\projects\omnomnom\.git\worktrees\...` is meaningless inside the container.

## git-wtadd: the cross-platform fix

To solve this, I wrote a bash script called `git-wtadd` that creates worktrees with paths that work on both sides:

```bash
#!/bin/bash
set -e

WORKTREE_PATH="$1"
shift

# Create the worktree normally
git worktree add "$WORKTREE_PATH" "$@"

# Resolve absolute paths
WORKTREE_ABS=$(realpath "$WORKTREE_PATH")
WORKTREE_NAME=$(basename "$WORKTREE_ABS")
MAIN_GIT_DIR=$(git rev-parse --git-dir)
MAIN_GIT_ABS=$(realpath "$MAIN_GIT_DIR")
WORKTREE_GITDIR="$MAIN_GIT_ABS/worktrees/$WORKTREE_NAME"

# Rewrite the .git file in the worktree to use a relative path
REL_TO_MAIN=$(realpath --relative-to="$WORKTREE_ABS" "$WORKTREE_GITDIR")
echo "gitdir: $REL_TO_MAIN" > "$WORKTREE_ABS/.git"

# Rewrite the gitdir pointer in the main repo to use the Windows host path
if [ -n "$HOST_WORKSPACE" ] && [ -n "$CONTAINER_WORKDIR" ]; then
    HOST_WS=$(echo "$HOST_WORKSPACE" | tr '\\' '/')
    HOST_PARENT=$(dirname "$HOST_WS")
    CONTAINER_PARENT=$(dirname "$CONTAINER_WORKDIR")

    LINUX_GITDIR=$(cat "$WORKTREE_GITDIR/gitdir")
    WIN_GITDIR="${LINUX_GITDIR/#$CONTAINER_PARENT/$HOST_PARENT}"

    echo "$WIN_GITDIR" > "$WORKTREE_GITDIR/gitdir"
    echo "Worktree created: $WORKTREE_PATH"
    echo "  Host gitdir: $WIN_GITDIR"
fi
```

There are two separate path problems to fix, and the script handles both.

The first is the `.git` file inside the new worktree directory. By default, git writes an absolute Linux path there. Rewriting it to a relative path solves this. The relative path from `omnomnom@location` back to `omnomnom/.git/worktrees/...` is identical whether you're looking from `/workspace/` or `C:\projects\`, so both sides can resolve it.

The second problem is subtler. Git also maintains a `gitdir` file inside the main repo at `.git/worktrees/<name>/gitdir`. This points back to the worktree's `.git` file, and it's what `git worktree list` and Windows tools like [GitKraken](https://www.gitkraken.com/) read to discover worktrees. By default it contains a Linux container path, which is completely meaningless on Windows.

The script uses `HOST_WORKSPACE` and `CONTAINER_WORKDIR` (those env vars passed in by the launcher) to translate the container path to the Windows host path before writing it. After this, `git worktree list` works on the host, GitKraken shows the worktrees, and nothing needs to know it's also a Linux path somewhere else.

The script is baked into the Docker image via the Dockerfile, so it's always available as `git-wtadd`.

> [!WARNING]
> A bug was discovered in `git-wtadd` after this post was published. When creating a worktree from a branch that tracks `origin/main`, git inherits the tracking configuration, which causes `git push` to silently target `main` instead of creating a new remote branch. The bug is fixed in the latest version of the repository. See [part 6](/2026/02/27/autonomous-mode-and-a-git-push-i-almost-missed/) for the full story and how to check your existing worktrees.

## Parallel agents, zero stashing

Once a worktree exists on disk, you can open a terminal in it and type `cc` just like you would in the main checkout. The launcher creates a fresh container with a name derived from the worktree folder, so `omnomnom@location` becomes a container called `claude-omnomnom-location`. That container runs its own Claude session, tracking its own branch, with no connection to whatever is happening in the main checkout container.

This means you can have several things running at the same time. The main branch humming along in one terminal. A feature branch in another. A quick experiment in a third. Each one is a separate worktree, a separate container, a separate Claude instance. You can switch between them instantly, because there is nothing to switch: everything stays exactly where it was. No stashing work-in-progress, no losing track of which branch had what, no "wait, what was I doing here?"

This is particularly useful when you want Claude agents working in parallel. Ask one to build out a feature while another writes tests for a different area. They operate on different branches and never step on each other. When the work is ready, you bring it together: open the main checkout, point Claude at both branches, and let it handle the merge. Merge conflicts in code are not the scary beast they used to be when an agent can read both sides and reason about the intent behind each change.

## Fixing plugin paths on startup

Sharing the `.claude` directory between Windows and the container creates another path problem. Claude Code stores plugin configurations with absolute paths. On Windows, that looks like `C:\Users\dvdst\.claude\plugins\cache\...`. Inside the container, that path doesn't exist -- it should be `/root/.claude/plugins/cache/...`.

The entrypoint script runs a Python fix on every container start:

```python
def fix_paths(filepath):
    with open(filepath) as f:
        content = f.read()

    original = content
    def replace_path(m):
        rest = m.group(1).replace("\\\\", "/")
        return "/root/.claude/" + rest

    content = re.sub(
        r'C:\\\\Users\\\\[^"\\]+\\\\.claude\\\\([^"]*)',
        replace_path,
        content,
    )

    if content != original:
        with open(filepath, "w") as f:
            f.write(content)
```

It scans the plugin configuration files for Windows-style paths and rewrites them to Linux paths. It's idempotent; if the paths are already Linux-style, it does nothing. This runs via `entrypoint.sh` before Claude Code starts, so by the time you interact with Claude, all plugins work correctly.

The entrypoint also sets up your git identity if it's not already configured, and disables automatic git garbage collection:

```bash
#!/bin/bash
python3 /usr/local/bin/fix-plugin-paths.py 2>/dev/null

if ! git config --global user.name &>/dev/null; then
    git config --global user.email "dvdstelt@gmail.com"
    git config --global user.name "Dennis van der Stelt"
fi

git config --global gc.auto 0

exec claude "$@"
```

The `gc.auto 0` line is there specifically because of the worktree setup. The `gitdir` files I mentioned above now contain Windows host paths. If git ran automatic garbage collection inside the container, it would try to resolve those Windows paths to check whether the worktrees are still valid, fail, and incorrectly prune them. Disabling gc inside the container is safe: it's an ephemeral environment and gc isn't needed there. The Windows host can handle gc perfectly well on its own.

## Teaching Claude your conventions

Here's where it gets interesting. Claude Code reads a `CLAUDE.md` file (if present) at the start of every session. This file is like a set of standing instructions. You write down your conventions and preferences, and Claude follows them without you having to repeat yourself.

My global `CLAUDE.md` includes things like:

- **Git workflow rules:** never push to `main`, always work on feature branches, commit after each logical change
- **Worktree conventions:** always use `git-wtadd`, create worktrees as siblings under `/workspace` with the `@` separator
- **Technology preferences:** .NET 10, semantic versioning, which NuGet feeds to use

For example, this is the section about worktrees:

```markdown
## Worktrees

Use `git worktree` to enable parallel work on the same repo.
Worktrees are created as sibling directories under `/workspace/`
using `@` as separator:

/workspace/NServiceBus/              # main checkout
/workspace/NServiceBus@feature-x/    # worktree for feature-x branch

**Always use `git-wtadd`** instead of `git worktree add`.
```

This means when I ask Claude to work on something, it already knows to create a worktree, use the right naming convention, and keep the main checkout clean. I don't have to explain this every time. It's like onboarding a new team member. You write it down once, and they follow the house rules.

You can also have project-specific instruction files that complement the global one. I have one that can clean up the git commit history; OmNomNom has one describing the service boundary conventions used in the demo. Different repositories have different conventions, and the configuration files let you express that without polluting the global one.

## A useful status bar

One thing I added later: a custom status line at the bottom of the Claude Code terminal. Claude Code lets you configure a command that runs continuously and outputs whatever you want displayed there. Mine shows three things: the model and version currently running, the current working directory, and the context window usage percentage.

The context percentage is the one I actually watch. When it starts climbing past 50% or 60%, it's a signal that the conversation has grown long enough that Claude might start losing track of details from early in the session. At that point I'll usually wrap up what I'm doing and start fresh.

The working directory display uses `HOST_WORKSPACE` (the same env var the launcher injects) so instead of showing `/workspace/omnomnom` it shows `C:\projects\omnomnom`. A small thing, but it means the status bar reflects where I actually am on disk rather than where the container thinks it is.

The status line is configured in `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "sh /root/.claude/statusline-command.sh"
  }
}
```

And the script itself is a short shell script that reads the JSON Claude pipes to it via stdin, extracts the model name, current directory, and context percentage with `jq`, then prints them with ANSI colors. Because `~/.claude` is mounted from the Windows host, setting this up once means it's available in every container automatically.

One side effect: when Claude Code starts, it sometimes prints a long informational message. With a custom status line active, that message causes the status bar to wrap across twenty or more lines, which makes the terminal nearly unusable. The fix is one environment variable in the entrypoint:

```bash
export DISABLE_INSTALLATION_CHECKS=1
```

This suppresses those startup messages. The status line stays on one line, and the terminal stays clean.

## The full picture

Let me put all the pieces together. When I want to work on something:

1. I open a terminal in my project folder
2. I type `cc`
3. The launcher script creates a Docker container with every tool I might need, passing in `HOST_WORKSPACE` and `CONTAINER_WORKDIR`
4. The entrypoint fixes plugin paths, sets up git identity, and disables gc
5. Claude Code starts, reads my global and project-specific configuration files
6. The status bar shows the model, my real Windows path, and context usage
7. Claude knows my conventions: worktree naming, commit messages, branching rules
8. If it needs to work on a feature, it creates a worktree with `git-wtadd` and paths will work on both sides
9. Everything it writes is visible on my Windows machine in real-time

My machine stays clean. Claude has full access to everything it needs. The worktrees work on both sides of the container boundary. And the configuration files mean I don't have to re-explain my preferences every session.

Is it a perfect setup? No, but a trade off I can live with. Docker adds a layer of indirection, rebuilding the image takes a few minutes, and occasionally you'll install something in a container and forget to add it to the Dockerfile. But compared to the alternative of cluttering my host machine with every tool under the sun, I'll take it.

In the [next post](/2026/02/26/adding-opencode-to-the-docker-toolbox/), I add a second AI coding tool to the same setup and discover that my launcher scripts weren't as portable as I thought.
