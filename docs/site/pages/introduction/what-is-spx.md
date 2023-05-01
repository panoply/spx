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

SPX is a lightening fast, lightweight (8kb gzip) push~state enhancement that (pre)-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module maintains an in-memory cache of fetched pages which prevents subsequent requests from occurring that resulting in instantaneous navigations.

The name "SPX" is an acronym for **Single Page XHR** and derived from terminologies used to describe modern JavaScript paradigms like **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The approach **SPX** employs is otherwise known as **Pjax** (Push state Ajax). Pjax is a rendering technique first introduced by the Github Co-Founder [Chris Wanstrath](http://github.com/defunkt). In 2011, Chris created [jquery-pjax](https://pjax.herokuapp.com/) which intercepted clicks made on link elements and fetched pages over the wire instead of executing full-page reloads between visits.

# Why SPX?

SPX introduces new techniques to the OTW (over the wire) paradigm and combines them with strategies standardized by similar projects in the nexus. The aim is instantaneous navigation, progressive enhancement and simple integration. The usage proposition for SPX is a matter of appropriation and is not a one size, fits all solution. The module was originally developed to improve TTFB performance in Shopify Liquid powered themes and currently used in production by brands like [Brixtol Textiles](https://brixtoltextiles.com).

# Key Features

SPX Provides a number of features that developers can progressively adapt to the web applications.

- Pre-fetching capabilities using hover, intersection or proximity observers.
- Snapshot caching engine and per-page state control.
- Powerful pub/sub event driven lifecycle triggers.
- Provides a client side DOM hydration approach.
- Supports multiple replace, append and prepend fragment targets.
- Gracefully handles script and style asset evaluation.
- Attribute driven programmatic control.
