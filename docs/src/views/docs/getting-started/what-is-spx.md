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

SPX is a lightweight JavaScript library ({{ meta.gzipSize }} gzip) designed for static, SaaS, and server-side powered web applications. It performs HTML pre-fetching over the wire and utilizes the response to carry-out morphed replacements. The module performs navigation in an idle state, maintains an in-memory cache, applies morphed rendering between visits and supports component integration.

{% include 'include/comparison' %}

The name "SPX" stands for **Single Page XHR**, derived from terminologies used to describe JavaScript paradigms such as **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The concept utilized by SPX is also known as **PJAX** (Push state Ajax), which intercepts clicks made on link elements and fetches pages over the wire instead of executing full-page reloads between visits.

> SPX's approach has been tried and tested for effectiveness. Modules like [Turbo](https://turbo.hotwired.dev/), [HTMX](https://htmx.org/), [Livewire](https://github.com/livewire/livewire), and [Barba](https://barba.js.org/) also employ an **over the wire** (OTW/Pjax) fetch/replace technique. It's a proven and widely adopted method in modern web development.

# Why Use SPX?

SPX presents a distinctive and tailored proposition that distinguishes it from similar alternatives. It introduces innovative techniques to the OTW (over the wire) paradigm, combining them with strategies standardized in similar projects. Central to the SPX model is the user's intent-to-visit. Over the wire page requests (fetches) are handled as background operations, typically completing before a navigation even begins. The primary objective with SPX is to offer a solution that is both inexpensive and powerful. Although there is a minimal overhead involved, the project aims to minimize technical debt.

# Who Uses SPX?

SPX was originally developed to improve Time to First Byte (TTFB) performance in Shopify (Liquid) powered webshop's and is successfully employed in production by reputable brands like [Brixtol Textiles](https://brixtoltextiles.com). At its core the solution was specifically designed for web applications served in SaaS environments and thus it operates with reduced verbosity and accommodates to specificities.
