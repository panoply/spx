---
title: 'Events'
permalink: '/events/index.html'
layout: docs.liquid
position: 2
sidebar:
  - 'spx:prefetch'
  - 'spx:visit'
  - 'spx:fetch'
  - 'spx:store'
  - 'spx:render'
  - 'spx:load'
---

# Events

SPX dispatches lifecycle events to the document. You can access contextual information in the parameters and carry out additional operations at different points of the SPX render cycle. Events can be cancelled with `preventDefault()` or by returning boolean `false`.

<!-- prettier-ignore -->
```typescript
import spx from 'spx'

document.addEventListener('spx:prefetch', (element?: Element, location?: ILocation) => void | false)

document.addEventListener('spx:visit', (event?: Event) => void | false)

document.addEventListener('spx:fetch', (state?: IState) => void | false)

document.addEventListener('spx:store', (state?: IState, dom?: Document) => void | false | Document)

document.addEventListener('spx:render', (target?: Element, newTarget?: Element) => void | false)

document.addEventListener('spx:load', (state?: IPage) => void)

```

# Connected

SPX is initialized using the `spx.connect()` method. This method returns a curried functional callback which is triggered 1 time. This is the equivalent of the `DOMContentLoaded` event. Upon connection, SPX will save the current documents outer HTML to the snapshot cache using `document.documentElement.outerHTML` whereas all additional snapshots are saved after an XHR request completes.

Because the initial snapshot is saved using `document.documentElement.outerHTML` the captured HTML may cause third party scripts which have augmented the document to serve an invalid dom into the snapshot cache. When a return navigation to this location occurs it may cause the third party script to fail. You can prevent issues of this nature from happening by initializing your modules within the `connected` event.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

<!-- prettier-ignore -->
```javascript
import spx from 'spx'

spx.connect({ /* options */ })(session => {

  // The connect returns a callback function after
  // connection was established. Lets inspect the session:
  console.log(session);

  // You initialize third party JavaScript in this callback
  // It's the equivalent of DOMContentLoaded.

});

// You can alternatively establish an instance callback
// using a curried variable assignment
const connect = spx.connect({ /* options */ })

// Later on...
connect(session => {})
```

# Lifecycle

The SPX lifecycle events will be triggered in the following order of execution:

1. **spx:prefetch**
2. **spx:visit**
3. **spx:fetch**
4. **spx:store**
5. **spx:route**
6. **spx:render**
7. **spx:load**

## spx:prefetch

The prefetch event will be triggered for every prefetch request. Prefetch requests are fired when `hover`, `intersect` and `proximity` requests occur. This event will be frequently triggered if you are leveraging any of those capabilities. You can determine the type of prefetch which has occurred via the `type` parameter.

**Cancellable:** `false` <br>
**Asynchronous:** `true`

## spx:visit

The visit event will be triggered when a `mousedown` event has occurred on a SPX enabled `<a href="*"></a>` element. This is the equivalent of a `click` event and when such an action occurs then navigation intent is assumed.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## spx:fetch

The fetch event will be triggered before an XHR request begins and a page is fetched. This event will be fired for `prefetch`, `hydrate` and `trigger` actions. You can determine the trigger action for the request using the `type` property passed in the `event.detail` parameter.

**Cancellable:** `false` <br>
**Asynchronous:** `true`

## spx:store

The store event will be triggered immediately after a request has finished and before the snapshot and page record is saved to memory. You can determine the trigger action for the request via the `type` parameter. This Lifecycle also allows you to augment the snapshot `Document` before it is saved to cache.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## spx:render

The render event will be triggered before a page or fragment is rendered (replaced) in the dom. For every `target` you've defined this event will fire. You can determine which elements are being replaced via the `target` and `newTarget` parameters passed. The `target` property represents the current element that will be replaced and the `newTarget` element represents the new target which it will be replaced with.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## spx:load

The load event is the final lifecycle event to be triggered. Use this event to re-initialize any third party scripts. The load event will only execute after navigation has concluded.

**Cancellable:** `false` <br>
**Asynchronous:** `false`
