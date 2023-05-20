---
title: 'Key Concepts'
layout: base.liquid
permalink: '/introduction/key-concepts/index.html'
prev:
  label: 'Introduction'
  uri: '/introduction/what-is-spx/'
next:
  label: 'Session'
  uri: '/introduction/session/'
---

# Key Concepts

SPX is relatively simple to understand and implement into web applications but before leveraging it you should familiarize yourself with a couple of its key concepts. In SPX, full-page refresh will never occur because all `href` occurrences are executed over the wire with XHR and handled using push~state. The XHR response of an intercepted navigation is both cached and then used to perform targeted replacements by swapping out a predefined set or elements who's inner contents have changed.

- [- Targets](#targets)
- [- Navigation](#navigation)
- [- Prefetching](#prefetching)
- [- Interception](#interception)
- [- Caching](#caching)

# Targets

Targets are a set of fragments (elements) which are expected to change on a per-page basis. By default, SPX assumes that all nodes contained within the `<body>` are different but in most cases only a few elements will change. Take the following example:

<!-- prettier-ignore -->
```js
spx.connect({
  targets: [ 'nav', 'main' ]
});
```

<!-- prettier-ignore -->
```html
<body>
  <nav>
    <a href="/" class="active">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
  <main>
    <h1>Welcome to my site!</h1>
    <p>This website is using SPX</h1>
  </main>
  <footer>
    Copyright 2023
  </footer>
</body>
```

In the above code snippet let's assume that the `<nav>`, `<main>` and `<footer>` elements exist in the same structure for all 3 pages. Using this logic, when navigating between pages results in the inner contents of the `<nav>` and `<main>` nodes changing whereas the `<footer>` and external resources remain the same. In traditional SSR websites if you were to click the `about` link then all the elements will be re-rendered and the external resources such as the `style.css` file will be reloaded. Using SPX we can limit the number of operations required to perform the visits between pages and reload a specific set of elements which we defined upon `spx.connect()`.

Using targets is highly encouraged and will result in better rendering and overall performance with SPX. It also good practice overall when working with markup languages like HTML.

# Navigation

SPX listens for events happening on `<a>` element in the DOM. This is the default behavior of the module is centered around link interception and navigational intent wherein SPX will carries visits in accordance with actions observed on these node types. Link elements are at core of SPX as they represent you web application routes and inform upon the browsing intent of the end user.

<!-- prettier-ignore -->
```html
<!-- Disable SPX -->
<a data-spx-disable="true"></a>

<!-- Hover Prefetch -->
<a data-spx-hover="true"></a>

<!-- Prefetch Proximity -->
<a data-spx-proximity="100"></a>

<!-- Intersection Prefetch -->
<a data-spx-intersect="50"></a>

<!-- Position Control -->
<a data-spx-position="y:0"></a>

<!-- Target Control -->
<a data-spx-target="['#node']"></a>

<!-- Cache Control -->
<a data-spx-cache="false"></a>

<!-- History Control -->
<a data-spx-history="replace"></a>

<!-- Prepend Control -->
<a data-spx-prepend="['#foo', '#bar']">

<!-- Append Control -->
<a data-spx-append="['#foo', '#bar']">

<!-- Threshold Limits -->
<a data-spx-threshold="250">

<!-- Progress Control -->
<a data-spx-progress="false">

<!-- Hydration Fetch -->
<a data-spx-hydrate="['.xxx']">
```

You can control how SPX should behave and handle link occurrences several different ways, but in addition you can also configure options on a per-page basis directly from link elements. Take a look at the [Attributes](/attributes) section for additional information and examples.

# Prefetching

TODO

# Interception

TODO

# Caching

SPX maintains an in-memory cache of fetched pages. For every visit that concludes via SPX a snapshot representing the raw DOM as a string is stored in the local browser memory. You may think that this comes at a performance costs but it's relatively inexpensive. Each snapshot (DOM String) of fetched pages will exist in state and are accessible during an SPX session (i.e: until a full page refresh occurs or the hostname changes).

::: note

Subsequent visits to cached page with snapshot existing in memory prevents additional requests from occurring.

:::

The cache algorithm and approach that SPX takes is preemptive in nature and visits are considered a low-cost operation as they execute in an asynchronous no-blocking sequential manner that can be aborted, queued and prioritized. SPX will use the HistoryAPI `state` reference when performing cached visits and respects external resource execution.
