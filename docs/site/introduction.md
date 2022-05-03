---
title: 'Introduction'
layout: docs.liquid
permalink: '/introduction/index.html'
position: 0
sidebar:
  - 'What is SPX'
  - 'Getting Started'
  - 'Prefetch'
  - 'Caching'
  - 'Recommendations'
---

# Introduction

Single Page XHR enhancement for SSR powered web applications. SPX is a lightening fast, lightweight (8kb gzip) push~state solution that (pre)-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module maintains an in-memory cache of fetched pages which prevents subsequent requests and instantaneous navigation in a controlled a persisted manner.

### Key Features

- Pre-fetching capabilities using hover, intersection or proximity observers.
- Snapshot caching engine and per-page state control.
- Powerful pub/sub event driven lifecycle triggers.
- Provides a client side DOM hydration approach.
- Supports multiple replace, append and prepend fragment targets.
- Gracefully handles script and style asset evaluation.
- Attribute driven programmatic control.

## What is SPX

SPX is an acronym for **Single Page XHR** and derived from terminologies used to describe modern JavaScript paradigms like **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The approach **SPX** employs is otherwise known as **Pjax** (Push~State Ajax). Pjax is a rendering technique first introduced by the Github Co-Founder [Chris Wanstrath](http://github.com/defunkt). In 2011 Chris created [jquery-pjax](https://pjax.herokuapp.com/) which intercepted clicks made on link elements and fetched pages over the wire instead of executing a full-page reloads between visits.

The Pjax method employed in jquery-pjax remained the standard until around 2015 and the team at [basecamp](https://basecamp.com/) shipped [Turbolinks 5](https://github.com/turbolinks/turbolinks). Turbolinks introduced an ingenious snapshot caching approach that together with the pjax technique drastically improved perceived loading times and overall performance between SSR website navigations. In 2021 Turbolinks the was superseded by [Turbo](https://turbo.hotwired.dev/) which is a fantastic alternative to SPX.

SPX is a new generation pjax based solution. The modules introduces new techniques to this paradigm and combines them with strategies standardized by similar projects in the nexus. The aim is instantaneous navigation, progressive enhancement and simple integration.

## Getting Started

TODO

## Recommendations

In order to get the most out of this module below are a few recommendations developers should consider when leveraging it within in their projects. The project was developed for our use cases and while it can be appropriated into other projects there are still a couple of minor features and/or capabilities that need work, so please bare that in mind.

### Scripts

JavaScript evaluation between navigations is supported when contained `<script>` elements are contained within the document `<head>` but this highly discouraged. Avoid inline/external JavaScript and instead leverage dynamic imports (`import('.')`) within your bundle, similar to SPA architecture.

### Styles

Stylesheet and inline CSS evaluation between navigations is not yet supported. This means you need to load CSS files at runtime and any `<style>` and `<link rel="stylesheet>` elements which exist thereafter will be ignored, unless contained within targets elements. This is something we will support post-beta.

### Pre-fetching

The pre-fetching capabilities this SPX variation provides can drastically improve the speed of rendering. When used correctly pages will load instantaneously between navigations. By default, the pre-fetching features are opt-in and require attribute annotation but you can customize how, where and when SPX should execute a pre-fetch.

### Stimulus

This module was developed as a replacement for [turbo](https://github.com/hotwired/turbo) so leveraging it together with [stimulus.js](https://stimulusjs.org/) is the preferred usage. Stimulus is a very simple framework and when working with SSR projects it helps alleviate the complications developers tend to face. The reason one would choose this project over Turbo comes down to performance as this module is much faster and smaller than turbo, it's also not riddled with class OOP design patterns, just functions bae,fFunctions, functions functions.

### Minification

By default, all fetched pages are stored in memory so for every request the HTML dom string response is saved to cache. The smaller your HTML pages the more performant the rendering engine will be. In addition to minification it is generally good practice to consider using semantic HTML5 as much as possible this will help negate the amount of markup pages require.

### JavaScript

The best possible approach is to initialize JavaScript like Google Analytics and scripts which require per-page execution is to use the `SPX.on('load', function(){})` method event. This way you can be sure it will load between navigations.
