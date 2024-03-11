---
title: 'Introduction'
layout: base.liquid
permalink: '/introduction/what-is-spx/index.html'
grid: 'col-md-8'
anchors:
  - What is SPX?
  - Why use SPX?
  - Who uses SPX?
  - How SPX Works?
---

# What is SPX?

SPX is a lightweight (12kb gzip) JavaScript library for static, SaaS and server-side powered web applications that pre-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module executes navigation in an idle state, maintains an in-memory cache of fetched pages that prevents subsequent requests from occurring and carries out morphed renders between visits and supports component integration.

{% include 'comparison'%}

The name "SPX" is an acronym for **Single Page XHR** and derived from terminologies used to describe JavaScript paradigms such as **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The concept SPX utilizes is also known as **PJAX** (Push state Ajax) which intercepts clicks made on link elements and fetched pages over the wire instead of executing full-page reloads between visits.

> The effectiveness of SPX's approach has been tried and tested. Modules like [Turbo](https://turbo.hotwired.dev/), [HTMX](https://htmx.org/), [Livewire](https://github.com/livewire/livewire) and [Barba](https://barba.js.org/) also employ an **over the wire** (OTW/Pjax) fetch/replace technique. It's is a proven and widely adopted method in modern web development.

# Why use SPX?

SPX offers a unique and tailored proposition that sets it apart from similar alternatives. It introduces innovative techniques to the OTW (over the wire) paradigm and combines them with strategies standardized in similar projects. At the core of the SPX model is the user's intent-to-visit. Over the wire page requests (fetches) are treated as background operations that typically execute and conclude before a navigation even begins. The main objective with SPX is to provide a solution that is inexpensive but powerful, though there is a tax incurred, the project attempts to eliminate technical debt.

# Who uses SPX?

SPX was originally developed to improve Time to First Byte (TTFB) performance in Shopify (Liquid) powered webshop's and is successfully employed in production by reputable brands like [Brixtol Textiles](https://brixtoltextiles.com). At its core the solution was specifically designed for web applications served in SaaS environments and thus it operates with reduced verbosity and accommodates to specificities.

# How SPX Works?

This website is using SPX. It aims to demonstrate how SPX operates and showcase some of the capabilities it provides and it's best viewed on desktop for an optimal experience. As you explore the documentation, pay attention to the right side, where you can witness the caching engine in real-time. When you mouse over certain links or when the cursor is in close proximity to a link element, you'll notice that the `pages` section populates in the fragment.

The `pages`, `snapshots`, and `history` sections will always reflect the current cache status. To further understand the inner workings, navigate to the **store** tab, where you'll find additional information about lifecycle events, morph operations, and active page handling.
