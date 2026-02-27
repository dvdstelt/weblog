---
id: 20260229
author: Dennis van der Stelt
title: Autonomous mode and a git push I almost missed
description: Two fixes after the series - letting Claude run without interruptions inside Docker, and a git-wtadd bug that was silently pushing commits to main
pubDate: '2026-02-27T01:00:00'
image: /images/2026/autonomous-mode-and-a-git-push-i-almost-missed.png
tags:
  - ai
  - docker
  - coding
  - git
---
*This is part 6 of the [AI coding agents in Docker](/2026/02/25/ai-coding-agents-in-docker/) series.*

Two things happened after I published the series. The first was a minor irritation I'd been tolerating without fixing: Claude Code asking permission for every file read and write, even inside a container I control. The second was a proper bug: a silent push from inside a worktree that ended up on `main`. That one was not minor.

## Stopping the permission prompts

Claude Code is cautious by default. Before it reads a file, it asks. Before it runs a command, it asks. When you're working interactively and want to stay in control, that's fine. When you're inside an isolated Docker container and have given the agent a clear task, the constant interruptions become friction.

Claude Code has a flag for this: `--dangerously-skip-permissions`. Pass it and Claude stops asking and just does the work. The problem is the container: Docker containers typically run as root, and Claude refuses to start with `--dangerously-skip-permissions` as root:

```
--dangerously-skip-permissions cannot be used when running as root.
```

The reasoning makes sense in a general-purpose context. Running as root is already elevated access; skipping all permission prompts on top of that is a combination that warrants caution outside of a controlled environment. But a Docker container *is* a controlled environment. It's ephemeral, isolated, and specifically designed for this kind of work.

The solution is `IS_SANDBOX=1`. Setting this environment variable tells Claude it's running inside a sandbox, which changes how it evaluates the risk. With it set, `--dangerously-skip-permissions` is allowed even as root, because the "dangerous" part is scoped to an environment that's meant to be disposable.

I added `IS_SANDBOX=1` to the `docker-run` scripts so every container gets it automatically. And rather than having to type the full flag name, there's a `--risk` shorthand in the launchers:

```bat
if /i "%~1"=="--risk" ( set "CLAUDE_FLAGS=%CLAUDE_FLAGS% --dangerously-skip-permissions" & goto arg_next )
```

So now `cc --risk` starts a fully autonomous Claude session. `ccc --risk` does the same but reattaches to the previous session. The default `cc` still prompts for permissions; `--risk` is explicitly opt-in.

Use it when you have a clear, scoped task and trust the setup. Don't use it when you want oversight on what the agent is doing.

## A git push that nearly went to main

When you use `git-wtadd` to create a worktree, the typical workflow is to branch off `main`:

```bash
git-wtadd /workspace/project@feature-x feature-x
```

Internally, git creates `feature-x` as a new local branch. Because it was created from `origin/main`, git records the tracking configuration inherited from the base branch. Specifically, it sets:

```
branch.feature-x.merge = refs/heads/main
```

This tells git that `feature-x` tracks `main` on the remote. The consequence: `git push` from inside the worktree doesn't create a new `feature-x` branch on the remote. It pushes to `main`.

The git CLI does warn about this when the local and remote branch names don't match. But I use [GitKraken](https://www.gitkraken.com/) as my visual git client, and GitKraken did not warn me. It saw a branch with an upstream configured and pushed. To `main`. I've reported this to GitKraken so they can investigate, but in the meantime I wasn't going to wait.

The fix lives in `git-wtadd`. After creating the worktree, the script now checks whether the upstream branch name matches the local branch name. If it doesn't, it strips the upstream configuration entirely:

```bash
CURRENT_BRANCH=$(git -C "$WORKTREE_PATH" branch --show-current)
UPSTREAM_MERGE=$(git -C "$WORKTREE_PATH" config --get "branch.$CURRENT_BRANCH.merge" 2>/dev/null || true)
UPSTREAM_BRANCH="${UPSTREAM_MERGE#refs/heads/}"

if [ -n "$UPSTREAM_MERGE" ] && [ "$UPSTREAM_BRANCH" != "$CURRENT_BRANCH" ]; then
    git -C "$WORKTREE_PATH" branch --unset-upstream
    echo "  Upstream tracking cleared (was pointing to $UPSTREAM_MERGE)."
fi
```

With no upstream set, `git push` now fails clearly:

```
fatal: The current branch feature-x has no upstream branch.
To push the current branch and set the remote as upstream, use
    git push --set-upstream origin feature-x
```

That's the behavior you want. An explicit error that forces you to be deliberate about where the push goes, rather than silently sending commits somewhere they don't belong. You push with `git push -u origin HEAD` the first time, and after that the branch tracks the correct remote branch.

The check handles any base branch, not just `main`. If you create a worktree from `release/1.0` and the local branch is `fix/something`, the same logic applies.

## Checking existing worktrees

If you were already using `git-wtadd` before this fix, pull the latest version from the repository and check your existing worktrees:

```bash
git branch -vv
```

If any feature branch shows `[origin/main: ...]` in the output, the tracking is pointing at the wrong place. Fix it:

```bash
git branch --unset-upstream
```

Then push to the correct remote explicitly:

```bash
git push -u origin HEAD
```

After the first explicit push, git tracks the right branch and everything works as expected from there.
