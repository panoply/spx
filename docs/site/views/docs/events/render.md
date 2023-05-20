---
title: 'Render Event'
layout: base.liquid
permalink: '/events/render/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# Render

The render event will be triggered before a page or fragment is rendered (replaced) in the dom. For every `target` you've defined this event will fire before it is swapped. You can determine which elements are being replaced via the `target` and `newTarget` parameters. The `target` property represents the current element that will be replaced and the `newTarget` element represents the new target which it will be replaced with.

> The `Hydrate` event will be invoked instead of `Render` when using the client side hydration approach.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('render', function(target?: Document, newTarget?: Document){

  //

})
```
