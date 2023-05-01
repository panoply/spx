---
title: 'Hydrate'
layout: base.liquid
permalink: '/methods/hydrate/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# `spx.hydrate(url: string, targets: string[])`

The `hydrate` method executed a programmatic hydration. The method expects a `url` and string list of element selectors.

**Returns:** `Promise<IPage>`<br>
**Events:** `cache > hydrate > load`

<span class="fc-gray">Returns</span>: `Promise<IPage>`
