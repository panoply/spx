---
title: 'Introduction'
layout: base.liquid
permalink: '/introduction/what-is-spx/index.html'
prev:
  label: 'Introduction'
  uri: '/introduction/what-is-spx/'
next:
  label: 'Key Concepts'
  uri: '/introduction/key-concepts/'
---

# What is SPX?

SPX is lightning fast and lightweight (10kb gzip) push~state enhancement that (pre)-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module executes navigation in an idle state and maintains an in-memory cache of fetched pages that prevents subsequent requests from occurring.

The name "SPX" is an acronym for **Single Page XHR** and derived from terminologies used to describe JavaScript paradigms such as **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The concept SPX utilizes is otherwise known as **Pjax** (Push state Ajax) which is a rendering technique initially introduced by the co-founder of GitHub, [Chris Wanstrath](http://github.com/defunkt). In 2011, Chris created [jquery-pjax](https://pjax.herokuapp.com/) which intercepted clicks made on link elements and fetched pages over the wire instead of executing full-page reloads between visits.

> The effectiveness of SPX's approach has been tried and tested. Modules like [Turbo](https://turbo.hotwired.dev/), [HTMX](https://htmx.org/), [Livewire](https://github.com/livewire/livewire) and [Barba.js](https://barba.js.org/) also employ an **over the wire** (OTW/Pjax) fetch/replace technique, making it a proven and widely adopted method in modern web development.

# Why use SPX?

SPX offers a unique and tailored proposition that sets it apart from similar alternatives. It is not a "one size fits all" solution. SPX introduces innovative techniques to the OTW (over the wire) paradigm and combines them with strategies standardized by similar projects in the web development nexus. At the core of the SPX model is the user's intent-to-visit. Over the wire page requests (fetches) are treated as background operations that typically execute and conclude before a navigation even begins.

# SaaS Enhancement

SPX was originally developed to improve Time to First Byte (TTFB) performance in Shopify (Liquid) powered webshop's and is successfully employed in production by reputable brands like [Brixtol Textiles](https://brixtoltextiles.com). At its core the solution was specifically designed for web applications served in SaaS environments and thus it operates with reduced verbosity and accommodating specificities without disrupting existing in-place logic. By embracing SPX, web developers can achieve optimized performance and a smoother user experience without compromising current workflows or service requirements.

# Live Example

This website is using SPX. It aims to demonstrate how SPX operates and showcase some of the capabilities it provides and it's best viewed on desktop for an optimal experience. As you explore the documentation, pay attention to the right side, where you can witness the caching engine in real-time. When you mouse over certain links or when the cursor is in close proximity to a link element, you'll notice that the `pages` section populates in the fragment.

The `pages`, `snapshots`, and `history` sections will always reflect the current cache status. To further understand the inner workings, navigate to the **store** tab, where you'll find additional information about lifecycle events, morph operations, and active page handling.
