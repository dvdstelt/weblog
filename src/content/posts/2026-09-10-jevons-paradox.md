---
id: 20260910
author: Dennis van der Stelt
title: Is AI another dot-com bubble, about to burst?
description: AI may be in a bubble, but Jevons' paradox suggests cheaper intelligence will make usage and infrastructure demand explode anyway.
pubDate: '2026-09-08T01:00:00'
image: /images/2026/jevons-paradox/header.webp
tags:
  - ai
---
I currently spend around $100 a month on AI. One argument I regularly hear is that this cannot last. AI is incredibly expensive to run, companies are spending hundreds of billions on GPUs and datacenters, and eventually someone has to pay for all of that. So subscriptions will get more expensive. $20 becomes $50, $100 becomes $200, and at some point people decide it simply isn't worth it anymore.

That may sound logical, but it assumes that we'll continue using roughly the same amount of AI. I don't think we will. There is an economic idea from the 19th century that offers a very different way of looking at this: Jevons' paradox. I'm certainly not the first to apply Jevons' paradox to AI, but the more I looked into it, the more it helped me understand not only why AI usage may keep growing, but also why companies are currently investing such ridiculous amounts of money in it.

## Making something cheaper can make us use more of it

[William Stanley Jevons](https://en.wikipedia.org/wiki/William_Stanley_Jevons) was studying coal consumption in England. Steam engines were becoming more efficient, so you might expect that less coal would be needed. Instead, coal consumption increased. More efficient engines made steam power economical for more purposes, so even though each individual machine needed less coal to do the same work, there were many more machines doing much more work.

That's [Jevons paradox](https://en.wikipedia.org/wiki/Jevons_paradox). It doesn't mean every efficiency improvement automatically causes total consumption to increase, but it does mean that the savings you expect from greater efficiency can be partly or completely offset by increased usage.

AI seems like a particularly good candidate for this effect. Suppose a useful AI operation costs ten cents worth of compute today. Hardware improves, models get smaller and smarter, quantization gets better and inference software becomes more efficient. Eventually, the same operation costs one cent. You could conclude that running AI just became 90% cheaper, but that only works if we continue doing the same things with it.

As AI gets cheaper, existing users can simply use more of it. At the same time, people and businesses that previously couldn't justify the cost can start using it, while entirely new applications become economical because the cost of doing the work has dropped far enough. That last category is probably the most interesting, because it means we're not merely doing today's work more cheaply. We're starting to do work that nobody bothered doing before.

## I don't really want cheaper AI

What I really want is more AI. A few years ago, using AI mostly meant opening a chat window, asking a question and getting an answer. I still remember *[Tay](https://en.wikipedia.org/wiki/Tay_(chatbot))*, the Microsoft chatbot that survived less than a day before the internet taught it all sorts of things Microsoft probably hadn't included in the product requirements. We've come quite a long way since then.

Today I regularly give AI much larger tasks. I ask it to investigate something, read several documents, compare approaches, review code, search for additional information, challenge its own conclusions and try again. The amount of work happening behind what feels like a single request is already increasing.

Agents can push this much further. Imagine I ask, "Should we support this new technology in our software?" Today I might have a conversation with an AI about it. Soon that same question could start several agents. One investigates the technology, another searches GitHub, another looks at competitors, another investigates customer demand, one builds a prototype and another reviews it. Finally, another model combines the results into something I can read.

From my perspective, I still asked one question. For the AI provider, that question might have triggered thousands of model calls. If inference becomes ten times cheaper but I start consuming fifty times as much of it, the provider actually needs five times as much compute to serve me.

Of course my $100 subscription can't magically cover unlimited usage. If serving me eventually costs more than the subscription, the provider needs further efficiency improvements, usage limits, more expensive tiers, consumption-based pricing or some other way to make the economics work. Jevons' paradox doesn't make those costs disappear. What it suggests is that making AI cheaper doesn't necessarily reduce total AI consumption or even total spending on AI. It can create enough additional demand that the market becomes much larger.

## We're already seeing the beginning of this

Investment certainly isn't slowing down as AI becomes more efficient. [Stanford's 2026 AI Index](https://hai.stanford.edu/ai-index/2026-ai-index-report) reports that global corporate AI investment reached $581.69 billion in 2025, almost 130% more than the previous year. Private investment alone accounted for $344.66 billion.

At the same time, consumption is growing at a rather silly rate. At [Google I/O in 2025](https://blog.google/innovation-and-ai/technology/ai/io-2025-keynote/), Sundar Pichai said Google had gone from processing 9.7 trillion tokens per month to more than 480 trillion in a single year, roughly fifty times as much. A year later, Google reported more than 3.2 quadrillion tokens per month. In two years, its token consumption had increased by more than 300 times.

That doesn't prove Jevons' paradox caused all of that growth. Models have also become much better, more products now include AI and vastly more people are using it. But that is sort of the point. Falling costs, improving capabilities and new applications reinforce each other. Cheaper inference doesn't automatically mean fewer GPUs. It can mean we find so many new things to do with AI that we need even more of them.

## AI doesn't have to be the product

There is another part of the economics that's easy to overlook. Companies don't necessarily need to sell AI itself to make money from investing in it.

Take Meta. If AI improves its recommendation systems, people may spend more time on Facebook and Instagram. Better AI can improve advertising, content ranking and content creation. Meta doesn't need to send someone an invoice containing the line item "AI: $29.95". The value appears in the business it already has.

The same applies elsewhere. Suppose a company has 100 developers and AI makes them 20% more productive. That could be worth millions to the company, while paying a few thousand dollars per month for the AI is almost irrelevant. If spending twice as much on AI makes those developers even more productive, there is no particular reason for the company to stop at the cheaper option.

The important comparison therefore isn't always how much an AI query costs compared with last year. For a business, the much more interesting question is how much the work would cost without AI. And even that only describes work we're already doing.

## Cheap intelligence is a very large market

We've seen this pattern before with other forms of computing. Storage became cheap, so instead of carefully deciding what to keep, we started storing ridiculous amounts of data. Bandwidth became cheap, so instead of downloading small web pages, we started streaming 4K video. Computing became cheap, so we put processors in cars, televisions, watches, thermostats, doorbells and toothbrushes, because apparently even our toothbrushes were suffering from a lack of computing power. And I can't even use that last one as a joke anymore, because Dyson just released a $499 toothbrush with a camera, machine learning and AI.

Anyway, we didn't respond to cheaper computing by spending less on computing. We found more things to compute.

AI is interesting because it makes a certain kind of intelligence cheaper. Not human intelligence in every sense, obviously, but things such as reading, summarizing, translating, recognizing patterns, generating text, writing code, analyzing information and increasingly performing longer sequences of work all become cheaper.

There may also be unusually little natural ceiling on the demand for that kind of work. A factory only needs so much heat and a car can only burn so much fuel, but there is almost always another question a company could investigate, another implementation it could test, another customer interaction it could analyze, another document it could review or another process it could monitor. Most companies have enormous backlogs of things they could do if doing them were cheap enough.

Imagine a task creates $10 of value for a business but costs $50 in someone's time. Nobody does it. If AI can eventually perform that task for $1, it suddenly makes sense to do it. The business hasn't saved $49 on work it was already doing, because the work wasn't being done at all. Cheaper intelligence has created an entirely new piece of economically worthwhile activity.

Now multiply that by millions of businesses and billions of potential tasks.

There's another effect as well. Once one company starts doing these things, its competitors may have to follow. If your competitor can analyze every support conversation, create twenty prototypes before choosing one, test every release in thousands of scenarios and personalize every customer interaction, you can't necessarily pocket the efficiency savings from AI and carry on exactly as before.

The expected level of output changes. What started as an efficiency improvement becomes the new competitive baseline. Customers get used to the additional service, competitors follow, and yesterday's extravagant use of AI becomes tomorrow's normal way of doing business. That's another reason why cheaper AI can result in more consumption rather than merely lower costs.

That is precisely where Jevons becomes interesting.

![](/images/2026/jevons-paradox/jevons-paradox-in-time.webp)

## Remember the dot-com bubble bursting?

The current AI boom is regularly compared with the dot-com bubble. Hundreds of billions are being invested, valuations are enormous, and eventually, the argument goes, something has to burst. That comparison isn't necessarily wrong, but I think we sometimes draw the wrong conclusion from it.

The dot-com bubble didn't burst because the internet turned out to be useless. Quite the opposite. Internet usage subsequently exploded and the internet became far more important to the economy than most people in the late 1990s could have imagined.

What went wrong was the investment side of the equation. Investors paid extraordinary prices for companies that sometimes had little more than a website and an idea. Businesses were funded without a sustainable path to profitability, while telecom companies spent enormous amounts building infrastructure for demand that didn't arrive quickly enough. Investors could be completely right about the internet and still be spectacularly wrong about the company they invested in.

AI could follow exactly the same pattern.

Jevons gives us a reason to believe that cheaper AI could lead to vastly more AI usage. If inference becomes ten times cheaper and that lower price makes fifty times as many uses economically worthwhile, we're consuming fifty times as much AI. That sounds wonderful if you're investing in AI, but it still doesn't tell you who actually makes the money.

Someone investing directly in a model company such as Anthropic is making a relatively straightforward bet. The AI market can become enormous, but Anthropic still needs to capture enough of that market to justify the price the investor paid. Claude might become extremely popular while models simultaneously become increasingly interchangeable and margins collapse. In that scenario, the investor could have been completely right about AI and still wrong about Anthropic.

Infrastructure is a different bet. If AI consumption grows fiftyfold, someone has to provide the chips, memory, datacenters, electricity and networking required to perform all those calculations. The price of an individual unit of compute can fall dramatically while total revenue still increases, provided that consumption grows faster than the price falls.

Companies such as Microsoft, Amazon, Google and Meta are making yet another kind of investment. Much of what they spend isn't an investment in an external AI startup at all. They're putting money into businesses they already own. Microsoft and Amazon can sell additional compute, while Google can use AI across Search, advertising and Cloud. Meta can use it to improve recommendations and advertising. They have multiple ways to benefit if AI consumption keeps increasing.

This is why my $100 subscription isn't a particularly useful measure of the eventual size of the AI market. Consumer subscriptions may remain relatively cheap because competition prevents providers from continually raising prices. Heavy users can move into higher tiers, businesses can pay according to consumption, APIs can be metered and AI can disappear into other products where its value is captured indirectly.

The investment thesis therefore isn't that my $100 subscription eventually becomes $1,000. It's that making intelligence cheaper causes the total amount of intelligence purchased and consumed throughout the economy to become enormous.

The internet provides a useful precedent. Bandwidth became dramatically cheaper, but we didn't simply continue visiting the same websites while enjoying a smaller internet bill. Cheap bandwidth made YouTube, Netflix, cloud computing, video conferencing, online gaming and countless other services economical. We ended up consuming vastly more bandwidth because new things became possible once bandwidth was cheap.

AI could follow the same path. Cheap inference may make it worthwhile to analyze every customer interaction, continuously review software for problems, investigate hundreds of alternatives, generate personalized material for each individual customer or let agents work for hours on questions that currently receive ten minutes of someone's attention.

That's the big investment thesis. AI doesn't have to remain expensive for today's enormous investments to make sense. In fact, it may need to become much cheaper. Investors are betting that cheap intelligence creates so much additional demand that the total market keeps growing even while the cost of each individual task collapses.

We're already seeing companies invest on the assumption that demand will keep increasing. Microsoft [ended fiscal 2026](https://news.microsoft.com/source/2026/07/29/microsoft-cloud-and-ai-strength-fuels-fourth-quarter-results-4/) with $678 billion in commercial remaining performance obligations, up 84% year over year, while Azure revenue grew 43%. That $678 billion obviously isn't all AI, but it does demonstrate the scale of contracted demand Microsoft is already seeing while it continues pouring money into cloud and AI infrastructure.

That makes the investment understandable, but not necessarily safe.

## There's another reason to keep investing

For companies such as Microsoft, Google, Meta and Amazon, there is another reason to spend enormous amounts of money: they may not have much choice.

Imagine you run a business worth a trillion dollars and believe there is a meaningful chance that AI fundamentally changes your industry. Waiting for certainty isn't necessarily the conservative option. If you invest heavily and AI turns out to be less important than expected, you may waste tens of billions. If you don't invest and AI does transform your industry, someone else may undermine a business worth hundreds of billions.

Google cannot afford to discover after the fact that AI changed search. Microsoft cannot afford to discover that another company owns the interface through which businesses perform knowledge work. Amazon cannot simply assume that the way companies consume computing will remain unchanged, while Meta can't ignore something that may fundamentally improve advertising and recommendations.

From that perspective, at least some AI spending starts looking less like a conventional investment and more like insurance. These companies may strongly believe in the economic opportunity, but even if they're uncertain, sitting out the race could be the riskier choice. They're spending because they expect AI to create a huge market, but they're also making sure that if AI really is as important as it currently appears, they aren't the company that somehow managed to miss it.

## That still doesn't mean there is no bubble

None of this proves that today's valuations make sense. Jevons' paradox tells us something about consumption: if AI becomes cheaper, we may use much more of it. It doesn't tell us anything about margins, competition or which company eventually captures the resulting revenue.

AI usage could increase a thousandfold while some of today's AI companies still turn out to be terrible investments. This is where the dot-com comparison becomes useful again. Investors in the late 1990s were right that the internet would become enormous, but that didn't mean they were right to invest in every internet company at any price.

The same could happen with AI. Investors may correctly predict an explosion in demand for compute, agents and AI-enabled software while still paying too much for individual companies. Datacenters may be built faster than demand arrives. Model providers may discover that competition drives prices down faster than usage grows. Hardware margins may shrink, and much of the economic value may ultimately be captured by companies using AI rather than the companies producing it.

So there are really two separate questions. Will cheap AI lead to vastly more AI usage? Jevons gives us a compelling reason to believe it might. Whether the companies receiving hundreds of billions of dollars today will capture enough of that value to justify what investors are paying is a much harder question.

The first can be true while the second turns out to be spectacularly wrong.

## The price of intelligence

I started thinking about all of this because of my $100 monthly AI bill. Will it become $200? Maybe, but I no longer think that's the most interesting question.

Imagine inference becomes one hundred times cheaper over the next decade. I might still spend roughly $100, but instead of having conversations with an AI, that subscription could buy agents continuously reading, researching, writing, coding, testing and monitoring things for me. The amount of compute required to serve me could actually be much higher than it is today, despite every individual operation being vastly cheaper.

Providers will obviously still have to make the economics work through greater efficiency, usage limits, tiers or different forms of pricing. But from my perspective, I'm receiving enormously more useful work for approximately the same money.

Now multiply that by billions of people and millions of businesses. Add all the work that isn't being performed today because it's simply too expensive, and then add the competitive pressure that turns yesterday's optional AI usage into tomorrow's minimum expectation. Suddenly all those billions being invested in AI infrastructure start looking rather different.

The argument for all those datacenters isn't necessarily that AI will remain expensive. It might be exactly the opposite: they may be necessary because AI becomes incredibly cheap.

That doesn't tell us whether today's AI companies are worth their valuations, which investors will eventually make money or whether every datacenter being built today will turn out to have been a good investment. But if Jevons was right, falling AI costs aren't necessarily the thing that pops the AI bubble.

They might be the reason we need so much compute in the first place.
