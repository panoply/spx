---
title: 'Cache Event'
layout: base.liquid
permalink: '/events/cache/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# Cache

The cache event is fired after the record was saved to memory. This event will fire for `prefetch` and `fetch` triggers. The parameters passed is the record that was added into the session store.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('cache', function(state?: IPage){

  // void

})
```
