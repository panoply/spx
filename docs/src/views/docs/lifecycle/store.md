---
title: 'SPX Events - Store'
layout: base.liquid
group: 'directive'
permalink: '/lifecyclestore/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# Store

The store event will be triggered immediately after a request has finished but before a snapshot and page record is saved to memory. This Lifecycle also allows you to augment the snapshot `Document` before it is saved to cache.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('store', function(state?: Page, dom?: Document){

  // Optionally return dom
  return dom

})
```
