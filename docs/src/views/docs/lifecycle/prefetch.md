---
title: 'Prefetch Event'
layout: base.liquid
group: 'directive'
permalink: '/lifecycleprefetch/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# Prefetch

The prefetch event will be triggered for every prefetch request. Prefetch events are fired when `hover`, `intersect` and `proximity` requests occur. This event will be frequently triggered if you are leveraging any of those capabilities. You can determine the type of prefetch which has occurred via the `type` parameter.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-green">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('prefetch', function(element?: Element, location?: Location){

  // The <a> element the prefetch was invoked
  console.log(element);

  // The SPX location model
  console.log(location);

})
```
