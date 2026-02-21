---
id: 20260217
author: Dennis van der Stelt
title: Why saga patterns beat orchestration for long-running processes
description: Orchestration looks great on a whiteboard until your orchestrator becomes the single point of everything
pubDate: '2026-02-17T01:00:00'
image: /images/2026/why-saga-patterns-beat-orchestration.png
tags:
  - distributed systems
  - sagas
  - messaging
  - microservices
---
Imagine you're organizing a wedding. You could hire a wedding planner who personally drives to the florist, waits for the flowers, drives to the bakery, waits for the cake, drives to the venue, sets everything up, and then picks up the guests. One person, doing everything, in sequence, waiting at every stop. If the bakery is running late, the whole wedding is on hold. If the wedding planner gets sick, nobody knows what's happening anymore.

Or, you could give every vendor their own responsibilities. The florist knows when to deliver. The bakery knows the date and the flavor. The venue knows the guest count. Each vendor does their work independently, and if the bakery runs late, the florist isn't standing around waiting.

This is essentially the difference between orchestration and choreography in distributed systems. And sagas are the mechanism that make choreography work for long-running processes.

## The appeal of orchestration

I get why orchestration is popular. It's easy to understand. Think of a conductor in front of an orchestra: there's a central component, the *orchestrator*, that instructs every other component what to do and when to do it. You can look at a single place in your codebase and see the entire flow. It reads almost like a script, step by step, top to bottom.

```csharp
public async Task PlanWedding(WeddingRequest request)
{
    var flowers = await floristService.OrderArrangement(request);
    var cake = await bakeryService.OrderCake(request);
    var venue = await venueService.ReserveDate(request);
    await invitationService.SendInvitations(request);
}
```

Four lines. Clean. Readable. And absolutely riddled with problems that aren't visible in those four lines. What happens when `OrderCake` succeeds but `ReserveDate` fails because the venue is no longer available? What if `OrderArrangement` times out and you can't tell if the flowers were actually ordered or not? What if the wedding planner crashes between ordering the cake and reserving the venue?

The orchestrator pattern hides the [fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing) behind what looks like simple method calls. We've [been here before](/2021/07/01/distributed-monolith/) with webservices and later with microservices doing thousands of HTTP requests. Making distributed calls look like local method calls is a pattern that keeps coming back, and it keeps causing the same problems.

## Orchestration versus choreography

It's important to be precise here, because these terms get mixed up a lot. Orchestration uses commands and responses. There's a conductor that is a core part of the runtime flow, instructing the various actors as to what to do and when to do it. It typically involves quite a bit fewer events, because the orchestrator drives everything through commands.

Choreography is fundamentally different. There is no live conductor. The players themselves play off of and react to each other. When one actor does X, another reacts by doing Y. The coordination emerges from each participant knowing its own responsibilities, not from a central authority dictating the flow.

Orchestration makes sense when components are logically coupled, when they share data and have sequential dependencies. The issue is that many teams reach for orchestration by default, even when their services should be autonomous and decoupled. They end up with a conductor that knows every note of every instrument, and needs to change whenever any instrument changes its part.

## What sagas actually are

A saga is the mechanism that makes choreography work for long-running business processes. It's not just "events flying around". A saga maintains state across a series of events and makes decisions based on what has happened so far.

Let's go back to our wedding. When a couple gets engaged, a `WeddingAnnounced` event is published. The florist reacts by preparing an arrangement. The bakery independently starts on the cake. The saga tracks which of these steps have completed. When both `FlowersArranged` and `CakeOrdered` have arrived, the saga knows it can proceed to send out invitations. Each vendor only knows about the events it cares about. The bakery has no idea that the florist exists.

This is different from a simple chain of events where A triggers B triggers C. A saga is stateful. It can wait for multiple events to arrive in any order. It can implement timeouts. If the bakery hasn't confirmed within a reasonable time, the saga can take action, perhaps by finding an alternative bakery or adjusting the plans.

```csharp
public class WeddingSaga : Saga<WeddingSagaData>,
    IAmStartedByMessages<WeddingAnnounced>,
    IHandleMessages<VenueReserved>,
    IHandleMessages<FlowersArranged>,
    IHandleMessages<CakeOrdered>,
    IHandleTimeouts<VenueDeadlineExpired>
{
    public async Task Handle(WeddingAnnounced message, IMessageHandlerContext context)
    {
        Data.WeddingId = message.WeddingId;
        await RequestTimeout<VenueDeadlineExpired>(context, TimeSpan.FromDays(14));
    }

    public async Task Handle(VenueReserved message, IMessageHandlerContext context)
    {
        Data.VenueConfirmed = true;
        await CheckIfReadyToSendInvitations(context);
    }

    public async Task Handle(FlowersArranged message, IMessageHandlerContext context)
    {
        Data.FlowersConfirmed = true;
        await CheckIfReadyToSendInvitations(context);
    }

    public async Task Handle(CakeOrdered message, IMessageHandlerContext context)
    {
        Data.CakeConfirmed = true;
        await CheckIfReadyToSendInvitations(context);
    }

    public async Task Timeout(VenueDeadlineExpired timeout, IMessageHandlerContext context)
    {
        if (!Data.VenueConfirmed)
            await context.Publish(new WeddingPostponed { WeddingId = Data.WeddingId });
    }

    async Task CheckIfReadyToSendInvitations(IMessageHandlerContext context)
    {
        if (Data.VenueConfirmed && Data.FlowersConfirmed && Data.CakeConfirmed)
            await context.Publish(new ReadyToSendInvitations { WeddingId = Data.WeddingId });
    }
}
```

Notice what this saga *doesn't* do. It doesn't call out to the florist, the bakery, or the venue. It doesn't send commands telling vendors what to do. It reacts to events and publishes new events. The saga coordinates by tracking state, not by orchestrating actions. And if the venue hasn't confirmed within two weeks, the timeout kicks in and the wedding gets postponed. No thread sitting around waiting for a phone call.

## Thin events and data ownership

Something I can't stress enough: events should be *thin*. A `WeddingAnnounced` event should contain a wedding identifier, not the full guest list, the couple's dietary preferences, the color scheme, and the Spotify playlist. Fat events are often a sign of logical coupling disguised as decoupling. If the bakery needs the entire guest list from your event, the question becomes: are these vendors really that decoupled from each other?

Each component should own its own data. If the bakery needs to know the number of guests to size the cake, it should already have that information, perhaps because it received an event earlier when the guest list was finalized. The identifier in the event is enough to correlate. And identifiers are the least volatile thing in your system, the least likely to change.

But what if the guest list wasn't finalized yet? The bakery could have its own saga. It received the `WeddingAnnounced` event, so it knows a cake will be needed. But it can't determine the size until it knows the number of guests. So the bakery's saga waits for a `GuestListFinalized` event. It also sets a timeout, because if the guest count hasn't arrived a few weeks before the wedding date, the bakery needs to act. Maybe it publishes a `GuestCountRequired` event to let the wedding planner know that time is running out. The bakery doesn't need to know *why* the guest list is late. It just knows it can't do its job without it and that there's a deadline approaching. That's autonomy.

I've [written before](/2024/03/14/share-database-of-course-not/) about why shared databases create coupling. The same principle applies to events. Stuffing an event full of data is just another way of sharing a schema between services.

## Handling failure requires domain knowledge

Here's something that often goes wrong with both orchestration and poorly designed sagas. Developers think about compensating actions as a purely technical concern. Service A did something, so if things go wrong, we need to undo what A did. But understanding what compensation actually means requires talking to your domain experts.

Consider our wedding: the flowers have been ordered but the venue cancels. The technical instinct is to immediately cancel the flowers too. But what does the couple actually want? Maybe they'd prefer to find a different venue that works with the same flowers. Maybe they want to postpone rather than cancel. Maybe the florist can hold the arrangement for a week while alternatives are explored. These are decisions the couple should make, not the wedding planner's software.

The saga is the right place for this logic precisely because it lives close to the business process. But only if you involve the business in designing it. Too many developers design compensating actions based on assumptions without consulting domain experts about the actual race conditions and edge cases that can occur.

## Long-running processes

The word "long-running" is where orchestration really starts to fall apart. What if the process takes days? Weeks? A mortgage application, an insurance claim, a multi-step approval workflow. Is the orchestrator supposed to keep state for weeks while waiting for a human to approve something?

Sagas are designed for exactly this. The saga state is persisted. When an event arrives days later saying `DocumentApproved`, the saga wakes up, checks its state, and decides what to do next. There's no thread sitting somewhere waiting. There's no connection being held open. The process can take as long as it needs.

## There are no solutions, only trade-offs

I'd be dishonest if I said sagas have no downsides. They require you to think in events rather than sequential steps, which takes getting used to. Debugging a flow across multiple services requires proper tooling, though tools like [ServicePulse](https://particular.net/servicepulse) can extract and visualize the actual message flows from your running system, which often reveals more truth than any diagram on a whiteboard. ServicePulse replaced the previous Windows-only WPF tool ServiceInsight with a web UI, which makes it convenient to debug message flow on any platform.

As always, it depends. Really look at the details of what's going on. If components are truly logically coupled and share sequential dependencies, maybe orchestration within that boundary is fine. The key word is *within that boundary*. Don't orchestrate across service boundaries that should be autonomous.

But for long-running business processes that span autonomous services, sagas give you something orchestration can't: services that can be developed, deployed, and scaled independently, a system that's resilient to partial failures, and a design where changes are local rather than rippling through a central coordinator.

If your orchestrator is becoming the component that everyone has to change whenever anything in the system changes, it might be time to reconsider the approach. Your services were supposed to be autonomous. Let them be.
