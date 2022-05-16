---
title: 'Getting Started'
layout: docs.liquid
permalink: '/introduction/index.html'
order: 1
sidebar:
  - 'Introduction'
  - 'What is SPX'
  - 'Installation'
  - 'Recommendations'
---

# Introduction

Single Page XHR enhancement for SSR powered web applications. SPX is a lightening fast, lightweight (8kb gzip) push~state solution that (pre)-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module maintains an in-memory cache of fetched pages which prevents subsequent requests and instantaneous navigation in a controlled a persisted manner.

##### KEY FEATURES

- Pre-fetching capabilities using hover, intersection or proximity observers.
- Snapshot caching engine and per-page state control.
- Powerful pub/sub event driven lifecycle triggers.
- Provides a client side DOM hydration approach.
- Supports multiple replace, append and prepend fragment targets.
- Gracefully handles script and style asset evaluation.
- Attribute driven programmatic control.

# What is SPX?

SPX is an acronym for **Single Page XHR** and derived from terminologies used to describe modern JavaScript paradigms like **SPA** (Single Page Application) and **MPA** (Multiple Page Application). The approach **SPX** employs is otherwise known as **Pjax** (Push state Ajax). Pjax is a rendering technique first introduced by the Github Co-Founder [Chris Wanstrath](http://github.com/defunkt). In 2011, Chris created [jquery-pjax](https://pjax.herokuapp.com/) which intercepted clicks made on link elements and fetched pages over the wire instead of executing a full-page reloads between visits.

SPX introduces new techniques to the paradigm and combines them with strategies standardized by similar projects in the nexus like Turbo. The aim is instantaneous navigation, progressive enhancement and simple integration.

# Getting Started

SPX aims to make it relatively simple to implement into new or existing projects. Before you start using SPX it is important that you consider if the solution is right for you. The JavaScript world is vast and there are many awesome open source projects that might be better suited to your project.

### Installation

SPX is developed for the browser environment as an [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module. The distributed bundle is compiled into ECMAScript 6 ([ES6](https://kangax.github.io/compat-table/es6/)) from TypeScript.

##### PNPM

```bash
pnpm add spx
```

##### YARN

```bash
yarn add spx
```

##### NPM

```bash
npm install spx --save
```

### Connection

Bundling the recommended approach because this way you can better leverage the module into your stack. You can import SPX as `default` or `named` export. Using `named` exports allows for tree-shaking.

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect({ /* options */ })(function(session) {

  // The connect returns a callback function after
  // connection was established. Lets inspect the session:
  console.log(session);

  // You initialize third party JavaScript in this callback
  // It's the equivalent of DOMContentLoaded.

});
```

# CDN

If you're new to JavaScript or just want a very simple setup, you can get SPX from a CDN and drop it into the `<head></head>` element of your website, ideally before any other scripts. By default, SPX will replace the entire `<body>` fragment.

##### UNPKG

```bash
https://unpkg.com/spx
```

### Connection

Wherever your index or root page layout exists you can drop SPX into the `<head>` element and then establish a connection. Be sure to include SPX before any other JavaScript files and to also include the `type="module"` attribute.

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>SPX | Single Page XHR</title>

    <!-- Include the module and establish a connection  -->
    <script src="https://unpkg.com/spx" type="module">
      spx.connect()
    </script>

    <!-- Other JavaScript modules -->

  </head>

  <body>

    <h1>Hello World</h1>

  </body>
</html>
```

# Recommendations

In order to get the most out of this module below are a few recommendations developers should consider when leveraging it within in their projects. The project was developed for our use cases and while it can be appropriated into other projects there are still a couple of minor features and/or capabilities that need work, so please bare that in mind.

### Script Evaluation

JavaScript evaluation between navigations is supported when contained `<script>` elements are contained within the document `<head>` but this highly discouraged. Avoid inline/external JavaScript and instead leverage dynamic imports (`import('.')`) within your bundle, similar to SPA architecture.

### Style Evaluation

Stylesheet and inline CSS evaluation between navigations is not yet supported. This means you need to load CSS files at runtime and any `<style>` and `<link rel="stylesheet>` elements which exist thereafter will be ignored, unless contained within targets elements. This is something we will support post-beta.

### Leverage Pre-fetching

The pre-fetching capabilities this SPX variation provides can drastically improve the speed of rendering. When used correctly pages will load instantaneously between navigations. By default, the pre-fetching features are opt-in and require attribute annotation but you can customize how, where and when SPX should execute a pre-fetch.

### Usage with Stimulus

This module was developed as a replacement for [turbo](https://github.com/hotwired/turbo) so leveraging it together with [stimulus.js](https://stimulusjs.org/) is the preferred usage. Stimulus is a very simple framework and when working with SSR projects it helps alleviate the complications developers tend to face. The reason one would choose this project over Turbo comes down to performance as this module is much faster and smaller than turbo, it's also not riddled with class OOP design patterns.

```bash
pnpm add @hotwired/stimulus
```

### Minification

By default, all fetched pages are stored in memory so for every request the HTML dom string response is saved to cache. The smaller your HTML pages the more performant the rendering engine will be. In addition to minification it is generally good practice to consider using semantic HTML5 as much as possible this will help negate the amount of markup pages require.

### JavaScript Execution

The best possible approach is to initialize JavaScript like Google Analytics and scripts which require per-page execution is to use the `SPX.on('load', function(){})` method event. This way you can be sure it will load between navigations.
