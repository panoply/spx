---
title: 'Prefetch'
layout: base.liquid
permalink: '/methods/prefetch/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx.prefetch `spx.prefetch(link: string | Element)`

The `prefetch` method executed a programmatic Prefetch. The method expects a `url` or `<a href="*"></a>` node as an argument. This method behaves the same way as hover, intersect of proximity prefetches.

**Returns:** `Promise<IPage>`<br>
**Events:** `request > cache`

**Returns:** `Document`<br>
