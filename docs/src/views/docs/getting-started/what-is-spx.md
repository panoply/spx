---
permalink: '/what-is-spx/index.html'
layout: base.liquid
title: 'What is SPX?'
anchors:
  - What is SPX?
  - Why use SPX?
  - Who uses SPX?
---

# What is SPX?

SPX is a lightweight ({{ meta.gzipSize }} gzip) JavaScript framework designed to enhance static, SaaS, and server-side powered websites by transforming them into rapidly rendered web applications that perform instantaneous navigations. The module provides an advanced incremental component system, efficient over-the-wire prefetching during idle states, and a precise per-page element-specific morph render tactic.

{% include 'include/comparison' %}

The name "SPX" stands for **Single Page XHR**, derived from terminologies used to describe JavaScript paradigms such as **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The concept utilized by SPX is otherwise known as **PJAX** (Push state Ajax), which intercepts clicks made on link elements and fetches pages over the wire instead of executing full-page reloads between visits.

> SPX's approach has been tried and tested for effectiveness. Modules like [Turbo](https://turbo.hotwired.dev/), [HTMX](https://htmx.org/), [Livewire](https://github.com/livewire/livewire), and [Barba](https://barba.js.org/) also employ an **over the wire** (OTW/Pjax) fetch/replace technique. It's a proven and widely adopted method in modern web development.

---

# Origin

SPX was originally developed to improve Time to First Byte (TTFB) performance in Shopify (Liquid) powered e-commerce sites and is highly regarded within that paradigm. Despite the abundance of JavaScript frameworks available, existing solutions were found to be either overly complex, insufficiently feature-rich, or in same cases the core code-base employed object-oriented programming (OOP) patterns which I personally (trigger warning), suboptimal (within reason) as a distribution standard choice.

Drawing influence from analogous JavaScript frameworks within the SSR nexus, SPX was conceived to chart a distinct path. The aim was to preserve the intuitive and accessible methodologies similar to those found in the component-based framework [Stimulus](https://stimulusjs.org/), while also seeking to innovate. The objective for SPX is to maintain familiar and user-friendly approaches on the consumer facing side, but expand upon current methodologies to enhance and exceed performance thresholds.

> The idea is predicated upon the concept of incremental processing, where its algorithm is structured to operate in accordance with a data model, so tasks that would typically be carried out in isolation, will instead execute in tandem (parallel).

#### Why Use SPX?

SPX presents a distinctive and tailored proposition that distinguishes it from similar alternatives. It introduces innovative techniques to the OTW (over the wire) paradigm, combining them with strategies standardized in similar projects. Central to the SPX model is the user's intent-to-visit. Over the wire page requests (fetches) are handled as background operations, typically completing before a navigation even begins. The primary objective with SPX is to offer a solution that is both inexpensive and powerful. Although there is a minimal overhead involved, the project aims to minimize technical debt.

#### Who Uses SPX?

SPX is successfully employed in production by reputable brands like [Brixtol Textiles](https://brixtoltextiles.com). At its core the solution was designed for web applications served in SaaS environments, specifically Shopify themes and thus it operates with reduced verbosity and accommodates to specificities. Given SPX is new, usage is fairly scarce at this point, real-world examples are limited, but for those curious take a look at [Relapse](https://panoply.github.com/relapse/) and [Æsthetic](https://aesthetic.js.org) documentation sites which are powered with SPX.
