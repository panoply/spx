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

SPX is lightning fast and lightweight (9kb gzip) push~state enhancement that (pre)-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module executes navigation in an idle state and maintains an in-memory cache of fetched pages, which prevents subsequent requests from occurring.

The name "SPX" is an acronym for **Single Page XHR** and derived from terminologies used to describe JavaScript paradigms such as **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The concept SPX utilizes is often referred to as **Pjax** (Push state Ajax), a rendering technique initially introduced by the co-founder of GitHub, [Chris Wanstrath](http://github.com/defunkt). In 2011, Chris created [jquery-pjax](https://pjax.herokuapp.com/) which intercepted clicks made on link elements and fetched pages over the wire instead of executing full-page reloads between visits.

The effectiveness of SPX's approach has been tried and tested. Modules like [Turbo](https://turbo.hotwired.dev/) (formally [Turbolinks](https://github.com/turbolinks/turbolinks)), [HTMX](https://htmx.org/), [Livewire](https://github.com/livewire/livewire) and [Barba.js](https://barba.js.org/) also employ an **over the wire** (OTW) fetch/replace technique, making it a proven and widely adopted method in modern web development.

By incorporating SPX into your web applications, you can deliver a seamless browsing experience with reduced latency and improved performance.

# Why use SPX?

SPX offers a unique and tailored proposition that sets it apart from similar alternatives, recognizing that it is not a "one size fits all" solution. It introduces innovative techniques to the OTW (over the wire) paradigm, combining them with strategies standardized by similar projects in the web development landscape. The primary goals of SPX are to provide instantaneous navigation, progressive enhancement, and seamless integration.

At the core of the SPX model is the user's intent-to-visit. Over the wire page requests (fetches) are treated as background operations that typically execute and conclude before a navigation even begins. Originally developed to improve Time to First Byte (TTFB) performance in Shopify Liquid powered themes, SPX is now successfully employed in production by reputable brands like [Brixtol Textiles](https://brixtoltextiles.com).

SPX is specifically designed for web applications served in SaaS environments. This enables it to operate with reduced verbosity while offering superior progressive enhancements, all while respecting current architectural setups. The module is thoughtfully written to accommodate specificities and provide fetch, traversal, and cache handling capabilities without disrupting existing in-place logic. By embracing SPX, web developers can achieve optimized performance and a smoother user experience without compromising their current workflows.

# Live Example

This website is using SPX. It aims to demonstrate how SPX operates and showcase some of the capabilities it provides and it's best viewed on desktop for an optimal experience. As you explore the documentation, pay attention to the right side, where you can witness the caching engine in real-time. When you mouse over certain links or when the cursor is in close proximity to a link element, you'll notice that the `pages` section populates in the fragment.

The `pages`, `snapshots`, and `history` sections will always reflect the current cache status. To further understand the inner workings, navigate to the **store** tab, where you'll find additional information about lifecycle events, morph operations, and active page handling.
