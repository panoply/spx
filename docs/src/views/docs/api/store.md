---
title: 'Store'
layout: base.liquid
group: api
permalink: '/api/store/index.html'
---

# spx.store `spx.store(url?: string, state?: IState)`

The `store` method returns the records pertaining to the provided `url` or if not defined returns the current location. Optionally pass a `state` object reference to merge and augment the current references.

**Returns:** `Promise<Page>`
