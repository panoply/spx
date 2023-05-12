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

SPX is a lightening fast, lightweight (8kb gzip) push~state enhancement that (pre)-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module maintains an in-memory cache of fetched pages which prevents subsequent requests from occurring resulting in instantaneous navigations.

The name "SPX" is an acronym for **Single Page XHR** and derived from terminologies used to describe modern JavaScript paradigms like **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The approach **SPX** employs is otherwise known as **Pjax** (Push state Ajax). This is a rendering technique first introduced by the Github Co-Founder [Chris Wanstrath](http://github.com/defunkt). In 2011, Chris created [jquery-pjax](https://pjax.herokuapp.com/) which intercepted clicks made on link elements and fetched pages over the wire instead of executing full-page reloads between visits.

The approach is tried and tested. Modules like [Turbo](https://turbo.hotwired.dev/), [HTMX](https://htmx.org/) and [Barba.js](https://barba.js.org/) all employ an OTW (over the wire) fetch ~ replace technique and each have their own unique handling algorithm.

# Why SPX?

SPX introduces new techniques to the OTW (over the wire) paradigm and combines them with strategies standardized by these similar projects. The goal is instantaneous navigation, progressive enhancement and simple integration. The usage proposition for SPX over alternatives is a matter of appropriation and it's not a one size, fits all solution.

SPX was originally developed to improve TTFB performance in Shopify Liquid powered themes and is currently used in production by brands like [Brixtol Textiles](https://brixtoltextiles.com). Because it was designed for usage within a SaaS environment the manner in which SPX functions results in far less verbosity and better progressive enhancements within the nexus.
