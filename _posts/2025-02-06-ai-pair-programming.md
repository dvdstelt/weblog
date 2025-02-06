---
layout: post
id: 20250206
author: Dennis van der Stelt
image: '/images/2025/ai-pair-programming/header.jpg'
date: 20250206 010000
title: AI pair programming
description: Look at me, being all enthusiastic about AI
tags:
  - ai
  - coding
---
I've been coding for decades, but the past few months have transformed my development workflow. I was initially skeptical about AI coding assistants. But after using it for some time, I'm consistently impressed by how [Claude AI](https://claude.ai/) augments my development process.

## Real-World Applications

Let me share some concrete examples. My son recently got an assignment at school to create a website with login capabilities and an administrative screen. PHP isn't my daily driver - I'm primarily in the .NET ecosystem. Usually, this would mean context-switching between PHP docs, session management details, and more. Instead, AI helped implement a secure authentication flow in about 15 minutes. Clean code, proper password hashing, session handling - everything.

## Beyond Basic Code Generation

It's just so much fun creating code with AI. I decided to create an NServiceBus implementation of Edwin van Wijk's [TrafficControl demo](https://github.com/EdwinVW/dapr-traffic-control). You'll read more about my version of the demo in future blog posts. I needed to simulate traffic patterns - generating license plates, car brands and models, and zone timestamps. Rather than spending time crafting simulation logic, I outlined the requirements to Claude.

Within minutes, I had a robust implementation handling:

- Randomized vehicle generation with realistic distributions
- Valid license plate formatting
- Configurable time windows for zone passages
- Proper state management for vehicle tracking

The system needed email notifications, so I asked how to implement Razor templates in a console app. Claude provided an implementation using the [RazorLight NuGet package](https://github.com/toddams/RazorLight), complete with proper DI setup, logging, and everything. I was first looking for a name randomizer myself. Eventually, I decided to ask Claude what package it suggested, and it came up with [Bogus](https://github.com/bchavez/Bogus) instead, which I had not used before, but was a far better library than what I had found until then.

## Architectural Insights

But Claude AI provided even more interesting solutions further down. I was implementing license plate lookups against an external HTTP service. I ran the approach by Claude, without giving away too many details on the solution I was thinking of. Instead, I wanted to hear what Claude had in mind. Instead of just implementing what I asked for, it flagged potential issues - specifically around service load and resilience. That went further than what I expected.

The suggested is a thread-safe caching layer:

```csharp
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

It even included message handlers that I kept out of this post, but which you might find in the final solution that I'll talk about in future blog posts.

This implementation handles, according to Claude AI:

- Concurrent access patterns using `SemaphoreSlim`
- Failure handling with stale data preservation
- Configurable refresh intervals
- Proper cancellation support

## Development Flow

The entire experience runs smoothly in [JetBrains Rider](https://www.jetbrains.com/rider/). Direct IDE integration means I can maintain my normal development flow while leveraging AI assistance. In other words, I don't have to `ALT`+`TAB` all the time and copy and paste code around. And I can select various models like OpenAI GPT-4o, but also Anthropic Claude 3.5 Sonnet, which is currently my favorite. It's producing the best results and feels like it's actually reasoning about your questions and code. And [JetBrains Rider is free for non-commercial use](https://blog.jetbrains.com/blog/2024/10/24/webstorm-and-rider-are-now-free-for-non-commercial-use-2/), which is excellent, although the AI plugin obviously isn't.

## Looking Forward

After 20+ years of development, I've seen many tools and technologies come and go. AI assistance feels different. It's not just another IDE feature or code generator. It's a fundamental shift in approaching problem-solving in software development.

For experienced developers, it means less time on boilerplate and more focus on architecture and business logic. For learning developers (like my son), it means having a patient mentor who can explain concepts and provide working examples. But remember to ask it to be a coach and provide guidance, not answers!

The key isn't to fear or resist this change - it's to understand how to leverage it effectively. Good developers will always be essential. We need to understand system design, recognize potential issues, and validate generated solutions. But now, we have a powerful tool that accelerates our ability to turn those insights into working code.

Far from making developers obsolete, AI is making us more effective than ever. And personally I'm excited to see where this goes next. At least it's a ton of fun working with it!
