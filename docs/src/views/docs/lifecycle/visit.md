---
title: 'Visit Event'
layout: base.liquid
permalink: '/lifecyclevisit/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# Visit

The visit event will be triggered when a `mousedown` event has occurred on a SPX enabled `<a href="*"></a>` element. This is the equivalent of a `click` event and when such an action happens, navigation intent is assumed.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('visit', function(event?: MousedownEvent){

  // The mousedown event
  console.log(event)

})
```
