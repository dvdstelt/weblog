---
layout: post
id: 20240128
author: Dennis van der Stelt
image: '/images/2024/how-to-migrate-to-jekyll/header.jpg'
date: 20240127 090000
title: How to migrate from WordPress to Jekyll
description: In this article I explain how I converted my weblog from WordPress to Jekyll
tags:
  - jekyll
---

In this article I'm going to describe how I converted my WordPress blog to Jekyll static pages using custom C#. I initially tried to find some tool or WordPress plugin that did the trick. But due to various reasons [I wrote about before](https://bloggingabout.net/2024/01/17/jekyll-update/), I had to create my own tool.

## Why Jekyll

I've migrated from platform to platform in the past, but in recent years I've started to love markdown so much, that I really have a feeling this is going to be the last time I actually migrate/convert all my posts into another format for the last time. Next time I can just use another template or another platform, but the markdown stays the same.

So I needed a static site generator that converts my markdown into static web pages, that I could then host in [GitHub docs](https://docs.github.com/) or a [Azure static web app](https://azure.microsoft.com/en-us/products/app-service/static). Two of the most popular seem to be [Jekyll](https://jekyllrb.com/) and [Hugo](https://gohugo.io/) at the moment, but Jekyll seems to be the more used, have more templates, plugins, etc. So I decided to use Jekyll.

## Hosting Jekyll locally on Windows

I really wanted to run Jekyll locally, especially while testing. I need to be able to have a look at the generated markdown from my tool, but also the generated static pages, until I'm happy with the end result. But having it available while writing new posts (like this one) isn't bad either.

Normally I'm not that happy about installing tools and runtimes like Ruby and others, but I decided I'd just have to go for it. I used the easiest way according to the docs and installed Ruby and Jekyll using the [RubyInstaller](https://jekyllrb.com/docs/installation/windows/#installation-via-rubyinstaller).

After installing everything, you can simple run the following command to convert the markdown into static webpages and host them locally.

```xml
jekyll servce --incremental
```

The incremental parameter is so that when you updated only a single markdown file, the page based on that markdown file is regenerated, but all other pages aren't. But if you start modifying templates or even configuration, you'll most likely have to restart the entire generation again. Either way, the more pages you have, the more time it takes to generate all pages. So from time to time I deleted most pages and had my WordPressConverter convert only one or two markdown files again. That worked pretty solid.

## Accessing WordPress data

I started using [WordpressPCL](https://www.nuget.org/packages/WordPressPCL) NuGet package to access the data of my weblog. It allows me to go through every single post or a bunch of posts and paging through the entire list. I already knew I had to do a lot of converting to markdown. I'll get back to that later, but I wanted to try and convert a single post at a time so I could make adjustments and test again if it came out alright.

If you haven't started yet, [Andrew Lock](https://andrewlock.net/) described a great way to keep track of where you are in the migration process. He basically downloaded all his posts first. Then when he starts the migration, he keeps track of where he is and [stores the checkpoint locally](https://andrewlock.net/migrating-comments-from-dsqus-to-giscus/#checkpointing). The result is that the code can figure out by itself if it should convert something. The reason is he started posting comments to GitHub discussions and the throttling in GitHub makes that process stop quite a few times. I already wrote 95% of all code by the time I started posting comments to GitHub and didn't feel like implementing this checkpointing, as I also had other options. Not as elegant as his checkpoints, but mine worked as well.

Anyway, here's the code to start reading from Wordpress and loop through all the posts.

```csharp
var wordPressClient = new WordPressClient("https://bloggingabout.net/wp-json/");
await DoOnePost(578616); // Title of weblog post with specific conversion requirements

async Task DoOnePost(int postId)
{
    var post = await wordPressClient.Posts.GetByIDAsync(postId);
    await ProcessPost(post);
}

async Task DoAllPosts()
{
  var page = 1;

  while (true)
  {
    var queryBuilder = new PostsQueryBuilder();
    queryBuilder.PerPage = 10;
    queryBuilder.Page = page;
    var posts = await wordPressClient.Posts.QueryAsync(queryBuilder);

    foreach (var post in posts)
    {
        ProcessPost(post);
    }

    if (posts.Count() < 10)
        return;

    page++;
}
```

This way I could ask it to generate specific posts using the `DoOnePost` method or generate the markdown for all posts using the `DoAllPosts` method. Going through all of them was quite easy, until I started migrating my comments. At that point the `ProcessPost` would verify if a markdown file already existed and skip the file. And I'd manually increase the page number of where the process would crash. That way I didn't have to redo everything from the start all the time.

## Converting HTML to Markdown

This was a rather tedious process. I first load the content into an `HtmlDocument`. Then I convert some HTML so the markdown converter can do it's job better. Or simple because I could easier search and replace certain things in HTML than the much cleaner markdown. I then offer it to a markdown converter to create the markdown, but then load it into the `HtmlDocument` again and do more conversions, download images and more. Then I create a `StringBuilder`, add all the content of the page and Jekyll specific headers and store the file to disk.

Beware: this is some of the ugliest code I've written in my life. It was for a one time job and it did the job. That's all I needed. Only reason I describe it here is so possibly others might be helped.

```csharp
async Task ProcessPost(Post post)
{
  var markdownConverter = new Converter();
  var doc = new HtmlDocument(); 
  doc.LoadHtml(post.Content.Rendered);
  
  // Perform tons of conversions 

  var markdown = markdownConverter.Convert(doc.DocumentNode.OuterHtml);
  doc.LoadHtml(markdown);
  
  // Do more conversions
  
  markdown = doc.DocumentNode.OuterHtml;

  var sb = new StringBuilder();
  sb.AppendLine("---");
  sb.AppendLine("layout: post");
  sb.AppendLine($"id: {post.Id}");
  sb.AppendLine("---");
  sb.AppendLine(markdown);

  var filename = post.Date.ToString("yyyy-MM-dd") + "-" + post.Slug + ".md";
  await using var outputFile = new StreamWriter(Path.Combine(physicalPostsPath, filename));
  await outputFile.WriteAsync(sb.ToString());
}
```

The code above shows the `ProcessPost` method that takes a single post, which is a WordPress specific object. It loads the HTML that was downloaded and starts performing the conversions. It then creates the actual markdown, but that's still littered with HTML. Especially some lists didn't make sense as there were too many empty lines and more. That's why it loads the markdown into the `HtmlDocument` again and performs more conversions. Then it takes the `OuterHtml` again and starts creating the `StringBuilder` object. There's more headers and stuff, which I kept out for clarity.

It then stores the file on disk and Jekyll can start generating the static web pages based on the markdown.

## Conclusion

It was quite an adventure migrating everything over and at some points I couldn't really find the enthusiasm to continue the effort of migrating everything. I had way too many tabs open in Chrome comparing my current weblog with the newly generated one and figuring out what HTML to convert and why some markdown wasn't converted as I expected it to.

Some of those adventures about certain conversions I'll post in another article, including one on migrating the comments, which I tried to do with Disqus and almost gave up migrating my weblog entirely. More on that later.

You can find the entire source code for the [weblog converter here on GitHub](https://github.com/dvdstelt/WeblogConverter).
