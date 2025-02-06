---
layout: post
id: 20250206
author: Dennis van der Stelt
image: '/images/2024/share-database/header.jpg'
date: 20250206 010000
title: AI pair programming
description: What is so bad about shared databases with microservices?
tags:
  - ai
  - coding
---
I've been coding for decades, but the past few months have genuinely transformed my development workflow. I was initially skeptical about AI coding assistants. Now? I'm finding myself consistently impressed by how Claude augments my development process.

## Real-World Applications

Let me share some concrete examples. My son recently got an assignment at school to create a website with login capabilities and an administrative screen. PHP isn't my daily driver - I'm primarily in the .NET ecosystem. Normally, this would mean context-switching between PHP docs, session management details and more. Instead, Claude helped implement a secure authentication flow in about 15 minutes. Clean code, proper password hashing, session handling - everything.

## Beyond Basic Code Generation

It's just so much fun creating code with AI. I decided to create an NServiceBus implementation of Edwin van Wijk's TrafficControl demo. I needed to simulate traffic patterns - generating realistic vehicle data, license plates, and zone timestamps. Rather than spending time crafting simulation logic, I outlined the requirements to Claude.

Within minutes, I had a robust implementation handling:

- Randomized vehicle generation with realistic distributions
- Valid license plate formatting
- Configurable time windows for zone passages
- Proper state management for vehicle tracking

The system needed email notifications, so I asked about implementing Razor templates in a console app. Claude provided a clean implementation using the `RazorLight` engine, complete with proper DI setup, logging and everything.

## Architectural Insights

Here's where it gets interesting. I was implementing license plate lookups against an external HTTP service. Before coding, I ran the approach by Claude. I didn't want to give it all details, I really wanted to hear what it had in mind. Instead of just implementing my request, it flagged potential issues - specifically around service load and resilience.
The suggested solution? A thread-safe caching layer:

```
public class RegisteredPlatesCache
{
    private readonly HttpClient httpClient;
    private readonly ILogger<RegisteredPlatesCache> logger;
    private HashSet<string> registeredPlates;
    private readonly SemaphoreSlim syncLock = new(1, 1);
    private DateTime lastUpdate = DateTime.MinValue;
    private readonly TimeSpan refreshInterval = TimeSpan.FromMinutes(15);

    public RegisteredPlatesCache(HttpClient httpClient, ILogger<RegisteredPlatesCache> logger)
    {
        this.httpClient = httpClient;
        this.logger = logger;
        this.registeredPlates = new HashSet<string>();
    }

    public async Task<bool> IsPlateRegistered(string licensePlate)
    {
        await RefreshCacheIfNeeded();
        return registeredPlates.Contains(licensePlate);
    }

    private async Task RefreshCacheIfNeeded()
    {
        if (DateTime.UtcNow - lastUpdate < refreshInterval) return;

        await syncLock.WaitAsync();
        try
        {
            if (DateTime.UtcNow - lastUpdate < refreshInterval) return;

            var plates = await FetchRegisteredPlates();
            registeredPlates = new HashSet<string>(plates, StringComparer.OrdinalIgnoreCase);
            lastUpdate = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to refresh registered plates cache");
        }
        finally
        {
            syncLock.Release();
        }
    }

    private async Task<IEnumerable<string>> FetchRegisteredPlates()
    {
        var response = await httpClient.GetFromJsonAsync<List<string>>("api/police/registered-plates");
        return response ?? Enumerable.Empty<string>();
    }
}
```

It even included message handlers and, again, everything...

This implementation elegantly handles:

- Concurrent access patterns using SemaphoreSlim
- Graceful failure handling with stale data preservation
- Configurable refresh intervals
- Proper cancellation support

## Development Flow

The entire experience runs smoothly in [JetBrains Rider](https://www.jetbrains.com/rider/). Having direct IDE integration means I can maintain my normal development flow while leveraging AI assistance. And I can select various models like OpenAI GPT-4o, but also Anthropic Claude 3.5 Sonnet, which is currently my favorite. It's producing the best results and feels like it's actually reasoning about your code. And [JetBrains Rider is free for non-commercial use](https://blog.jetbrains.com/blog/2024/10/24/webstorm-and-rider-are-now-free-for-non-commercial-use-2/), which is excellent, although the AI plugin isn't.

## Looking Forward

After 20+ years of development, I've seen many tools and technologies come and go. AI assistance feels different. It's not just another IDE feature or code generator. It's a fundamental shift in how we can approach problem-solving in software development.

For experienced developers, it means less time on boilerplate and more focus on architecture and business logic. For learning developers (like my son), it means having a patient mentor that can explain concepts and provide working examples. But remember to ask it to be a coach and provide guidance, not answers!

The key isn't to fear or resist this change - it's to understand how to leverage it effectively. Good developers will always be essential. We need to understand system design, recognize potential issues, and validate generated solutions. But now we have a powerful tool that accelerates our ability to turn those insights into working code.

Far from making developers obsolete, AI is making us more effective than ever. And personally? I'm excited to see where this goes next.
