---
title: 'Fetch Event'
layout: base.liquid
permalink: '/events/fetch/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# Fetch

The fetch event will be triggered before an XHR request begins and a page is fetched over the wire. This event will be fired for `prefetch`, `hydrate` and `trigger` actions. You can determine the trigger action of the request using the `type` property to the `state` parameter.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-green">true</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('fetch', function(state?: IPage){


})
```
