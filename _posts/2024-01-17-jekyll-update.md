---
layout: post
id: 202401171
author: Dennis van der Stelt
image: '/images/2024/jekyll/header.jpg'
date: 20240117 090000
title: BloggingAbout.NET migrated to Jekyll
description: A long awaited goal is finally here
categories:
    - BloggingAbout.NET
tags:
  - Jekyll
---

It's been exactly 10 years that BloggingAbout.NET switched to Wordpress from, if I recall correctly, Community Server. First as a community and multi-site installation, but later I removed every weblog but my own. But to be honest, I've never really been happy with Wordpress. One of the reasons was that I wanted to keep costs down. For a long time, I ran the site on a cheap virtual machine in Azure. It was dog slow. So I converted to Wordpress and MySql hosted in Azure. And that didn't help, it was still dog slow.

So for a while I've been using Wordpress to write and publish posts. But I started disliking the slowness and way of writing more and more. As a result, I didn't even write a single post in 2022 and only a single post in 2023. While I did keep paying roughly 25 USD per month for hosting the website. Didn't really make sense.

I finally had enough of it a couple of months ago and started looking around for ways to convert from Wordpress to a static website. And quickly came to the conclusion this was not an easy task. There was so much HTML crap inside, like code that used syntaxhighlighting in HTML, images that used HTML tags for size and positioning, links that weren't properly converted when migrating from Community Server or multi-site Wordpress installation, lists that didn't make sense that needed stripping, notes that needed to be converted into quotes, images that couldn't be found and more. And when all was finally converted into markdown, I needed lots of regular expressions to fix even more markdown.

 <div class="gallery-box">
    <div class="gallery">
      <img src="/images/2024/jekyll/2004-frontpage.png">
      <img src="/images/2024/jekyll/2006-frontpage.png">
      <img src="/images/2024/jekyll/2008-frontpage.png">
      <img src="/images/2024/jekyll/2015-frontpage-small.png">
      <img src="/images/2024/jekyll/2021-frontpage.png">
      <img src="/images/2024/jekyll/2024-frontpage.png">
    </div>
    <em>BloggingAbout.NET over the years</em>
  </div>

There was not a single plugin that could handle this. I started searching for code from others and couldn't even find anything there. So I started from scratch and wrote C# to read posts from the Wordpress API and converted them into markdown. The markdown is then read by Jekyll to create static HTML pages.

## Comments

Another thing were the comments. I first tried to make use of Disqus, a service that many weblogs use for free comments. In the past it was even better without ads and stuff. But these days I think it's too bloated. Worse even, I couldn't migrate the comments the way I wanted to. I wanted to post comments made by me under my name, but everything else as anonymous comments with an author name, etc. But no matter how much I tried, I could not get the anonymous comments to post. I've gone through various errors and more, until I read [this post about converting to Disgus](https://andrewlock.net/migrating-comments-from-dsqus-to-giscus/) by Andrew Lock. It demonstrated how to use GitHub discussions for comments. The result was much cleaner and I could throw out another resource (Disqus) and use more of GitHub its features. The only downside is that you need to have a GitHub account to comment on my weblog, but I don't care. Most of my audience should have an account by now.

## Hosting

Hosting this in GitHub and as an Azure Static Site was literally a breeze, which I was quite happy about after all the work converting the posts. And it's completely free as well! Couldn't get any better.

The only problem I had was making sure I had a local copy of Wordpress and MySql for BloggingAbout.NET. By default, Azure setup process creates a private virtual network in Azure where the AppService and MySql database are inside. And I couldn't figure out how to connect my machine to this network and copy over everything. That's when again the benefits of Wordpress and all its plugins came to light, as there was a plugin that helped me properly back up eveything and then restore it again locally.

## Conclusion

When writing this, I still need to make some minor changes, like contact and about pages, but other than that, the DNS changes can be made to move over BloggingAbout.NET to this new format. And turn of the Wordpress and MySql

I'll also be writing more about my challenges and the code to migrate to markdown and Jekyll.