---
title: 'Lifecycle'
layout: base.liquid
permalink: '/introduction/lifecycle/index.html'
prev:
  label: 'Session'
  uri: '/introduction/session/'
next:
  label: 'Usage'
  uri: '/usage/installation'
---

# Visit Lifecycle

SPX visits unfold through a series of distinct steps, with each step being an integral part of the navigation lifecycle. SPX will dispatch events and/or callbacks at various points in the visit lifecycle which developers can hook into. Lifecycle methods can be accessed via `spx.on` or from within component [methods](/components/methods).

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.on('fetch', function ({ page }) {
  // Return false to cancel
});
spx.on('cache', function ({ page, dom }) {
  // Return Document to augments cache
});
spx.on('visit', function (page) {
  // Returning false to cancel
});
spx.on('morph', function (oldNode, newNode) {
  // Inspect Changes
});
spx.on('load', function (page) {
  // Consider this DOMContentLoaded
});
```

---

## fetch

Triggers before a visit is fetched over XHR.

---

## cache

Triggers before and after a fetched page and its related snapshot is saved to cache.

---

## visit

Triggered when a link is clicked, before a page morph is to be carried out.

---

## morph

Triggered for every fragment replacement during page morphs

---

## load

Triggered after a page has rendered. Consider this the equivalent of `DOMContentLoaded` and use it to reinitialize any third party scripts such as analytics.
