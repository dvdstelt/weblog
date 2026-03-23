---
id: 20260323
author: Dennis van der Stelt
title: Introducing HyperHawk
description: I built a GitHub Action that checks links in pull requests, including links to private repositories.
pubDate: '2026-03-23T01:00:00'
image: /images/2026/introducing-hyperhawk.png
tags:
  - github
  - open source
  - tooling
---
Every now and then I end up on the Wayback Machine. You know how it goes: you're reading something, you click a link, and it's dead. So you copy the URL, paste it into [web.archive.org](https://web.archive.org), and hope someone, somewhere, thought to preserve it. I've been doing this for years. There are even very old snapshots of this very blog available, back when it still looked like [a proper 2008 website](https://web.archive.org/web/20080723022508/http://bloggingabout.net/), complete with blogrolls and tag clouds.

Broken links are annoying on a personal blog. But they're a real problem when they're in documentation that people rely on to do their work.

## Writing things down

At [Particular Software](https://particular.net), we work fully remote. Different time zones, different schedules. The way we make that work is by writing things down. Everything. Design decisions, onboarding guides, architecture overviews, troubleshooting docs. It's all in markdown, spread across repositories on GitHub.

That approach works well, until links start to rot. Someone renames a file. A repository gets restructured. A document moves to a different folder. The content is still there, but the links pointing to it quietly break. Nobody notices until someone follows a link and lands on a 404.

I wanted a tool that could catch these broken links automatically, ideally as part of pull request reviews. So I went looking.

## The gap in existing tools

There are plenty of link checkers out there. Some run as CLI tools, some as GitHub Actions. They work fine for external URLs and for links within the same repository. But they all fall short in one specific scenario: links pointing to other private repositories within the same GitHub organization.

That's exactly the pattern we have. Our documentation frequently links between repositories. A guide in one repo references an architecture document in another. An onboarding page links to setup instructions in a third. These are all private repositories, visible to everyone in the organization, but invisible to any tool that only knows how to make HTTP requests.

The thing is, the GitHub API can verify these links. You can check whether a file exists at a specific path in a specific repository, even a private one, as long as the token has the right permissions. None of the existing tools used this approach. They either skipped same-org links entirely or treated them as external URLs and got 404s back.

So I built my own.

## HyperHawk

[HyperHawk](https://github.com/dvdstelt/hyperhawk) is a GitHub Action that scans markdown files in pull requests for broken links. It classifies every link it finds into one of three categories and checks each one differently.

Internal links, the ones pointing to files within the same repository, are verified by checking if the file exists on disk. External links get an HTTP request. And same-org links, the ones pointing to other repositories in your GitHub organization, are verified through the GitHub API.

That last category is what makes HyperHawk different. When it encounters a link like `https://github.com/your-org/some-private-repo/blob/main/docs/setup.md`, it doesn't just fire off an HTTP request that will fail because the repo is private. Instead, it calls the GitHub API to check whether that file actually exists at that path. If the repo is private and the token doesn't have access, HyperHawk is smart enough to distinguish "this is a private repo I can't see" from "this repo doesn't exist" and avoids false positives.

## Suggestions, not just complaints

Finding broken links is useful. Helping fix them is better. When HyperHawk finds a broken internal link, it doesn't just say "this is broken." It looks at all the files in the repository and tries to find what you probably meant. It does exact filename matching first, then falls back to fuzzy matching using edit distance. The result shows up as a GitHub suggestion block in the PR review, so you can accept the fix with a single click.

It also catches a few other things. If a link works but redirects, it suggests updating the URL to the final destination. If you're using a full GitHub URL to reference a file in your own repository, it suggests converting it to a relative path. If a same-org link references a branch that no longer exists, it suggests the default branch instead.

## Non-blocking by default

One thing I was deliberate about is that HyperHawk posts review comments but never blocks a merge. Broken links are worth knowing about, but they shouldn't prevent you from shipping a critical fix. If you want stricter behavior, there's a `strict` mode you can enable, but the default is to inform, not obstruct.

## It scratched an itch

I looked for a tool like this for a long time. The combination of private repository support, smart suggestions, and clean PR integration just didn't exist. Building it myself turned out to be the only way to get what I needed. HyperHawk is open source and available on the [GitHub Marketplace](https://github.com/marketplace/actions/hyperhawk-link-checker). If you work in an organization with lots of cross-linked documentation across private repositories, give it a try.
