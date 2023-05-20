---
title: 'Store'
layout: base.liquid
permalink: '/methods/store/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx.store `spx.store(url?: string, state?: IState)`

The `store` method returns the records pertaining to the provided `url` or if not defined returns the current location. Optionally pass a `state` object reference to merge and augment the current references.

**Returns:** `Promise<IPage>`
