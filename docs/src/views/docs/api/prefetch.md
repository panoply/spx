---
title: 'Prefetch'
layout: base.liquid
permalink: '/api/prefetch/index.html'
prev:
  label: 'spx.visit'
  uri: '/methods/visit/'
next:
  label: 'spx.fetch'
  uri: '/methods/fetch/'
---

# spx.prefetch

The `prefetch` method executed a programmatic Prefetch. The method expects a `url` or `<a href="*"></a>` node as an argument. This method behaves the same way as hover, intersect of proximity prefetches.

# Events

The prefetch method will fire the following events:

- TODO

# Example

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.prefetch('/some-path').then(function(page) {

  console.log(page)

})

spx.prefetch(document.querySelector('a.some-link')).then(function(page) {

  console.log(page)

})

```
