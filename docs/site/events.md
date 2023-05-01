---
title: 'Events'
permalink: '/events/index.html'
layout: base.liquid
order: 3
sidebar:
  - 'Prefetch'
  - 'Visit'
  - 'Fetch'
  - 'Store'
  - 'Cache'
  - 'Render'
  - 'Hydrate'
  - 'Load'
---

# Events

SPX dispatches lifecycle events to the document. You can access contextual information in the parameters and carry out additional operations at different points of the SPX render cycle. Events can be cancelled with `preventDefault()` or by returning boolean `false`.

### Lifecycle

The SPX lifecycle events will be triggered in the following order of execution:

1. **Prefetch**
2. **Visit**
3. **Fetch**
4. **Store**
5. **Cache**
6. **Render**
7. **Hydrate**
8. **Load**

<h1 id="prefetch">Prefetch</h1>

The prefetch event will be triggered for every prefetch request. Prefetch events are fired when `hover`, `intersect` and `proximity` requests occur. This event will be frequently triggered if you are leveraging any of those capabilities. You can determine the type of prefetch which has occurred via the `type` parameter.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-green">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('prefetch', function(element?: Element, location?: ILocation){

  // The <a> element the prefetch was invoked
  console.log(element);

  // The SPX location model
  console.log(location);

})
```

<h1 id="visit">Visit</h1>

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

<h1 id="fetch">Fetch</h1>

The fetch event will be triggered before an XHR request begins and a page is fetched over the wire. This event will be fired for `prefetch`, `hydrate` and `trigger` actions. You can determine the trigger action of the request using the `type` property to the `state` parameter.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-green">true</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('fetch', function(state?: IPage){


})
```

<h1 id="store">Store</h1>

The store event will be triggered immediately after a request has finished but before a snapshot and page record is saved to memory. This Lifecycle also allows you to augment the snapshot `Document` before it is saved to cache.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('store', function(state?: IPage, dom?: Document){

  // Optionally return dom
  return dom

})
```

<h1 id="cache">Cache</h1>

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

<h1 id="render">Render</h1>

The render event will be triggered before a page or fragment is rendered (replaced) in the dom. For every `target` you've defined this event will fire before it is swapped. You can determine which elements are being replaced via the `target` and `newTarget` parameters. The `target` property represents the current element that will be replaced and the `newTarget` element represents the new target which it will be replaced with.

> The `Hydrate` event will be invoked instead of `Render` when using the client side hydration approach.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('render', function(target?: Element, newTarget?: Element){

  //

})
```

<h1 id="render">Hydrate</h1>

The hydrate event will be triggered before a page or fragment is rendered (replaced) in the dom. For every `target` you've defined this event will fire before it is swapped. You can determine which elements are being replaced via the `target` and `newTarget` parameters. The `target` property represents the current element that will be replaced and the `newTarget` element represents the new target which it will be replaced with.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('hydrate', function(target?: Element, newTarget?: Element){

  //

})
```

<h1 id="load">Load</h1>

The load event is the final lifecycle event to be triggered. Use this event to re-initialize any third party scripts. The load event will only execute after navigation has concluded, targets have been replaced and the document is ready.

<span class="fc-gray">Cancellable</span>: <span class="ff-code fs-md fc-cyan">false</span><br>
<span class="fc-gray">Asynchronous</span>: <span class="ff-code fs-md fc-cyan">false</span>

<!-- prettier-ignore -->
```js
import spx from 'spx'

spx.on('load', function(state?: IPage){

  //

})
```
