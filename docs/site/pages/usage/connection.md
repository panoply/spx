---
title: 'Connection'
layout: base.liquid
permalink: '/usage/connection/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# Connection

SPX is initialized using the `spx.connect()` method. This method returns a curried (function) callback which is triggered once. The `connect` call fires on `DOMContentLoaded`. SPX will save the outer HTML of current document to the snapshot cache using `document.documentElement.outerHTML` upon connection whereas all additional snapshots are saved after an XHR request completes.

::: note
The typings provided in this package will describe each option in good detail, below are the defaults. Settings are optional.
:::

<!-- prettier-ignore -->
```js
import spx from 'spx'

spx.connect({
  targets: ['body'],
  timeout: 30000,
  schema: 'spx',
  manual: false,
  cache: true,
  limit: 100,
  preload: {},
  async: true,
  annotate: false,
  eval: {
    script: false,
    style: true,
    link: false,
    meta: false
  },
  hover: {
    trigger: 'attribute',
    threshold: 250
  },
  intersect: {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  },
  proximity: {
    distance: 75,
    threshold: 250,
    throttle: 500
  },
  progress: {
    background: '#111',
    height: '3px',
    minimum: 0.09,
    easing: 'linear',
    speed: 300,
    trickle: true,
    threshold: 500,
    trickleSpeed: 300
  }
})(function(session) {

  // Inspect the established session
  console.log(session);

  // You initialize third party js in this callback,
  // it's the equivalent of DOMContentLoaded.

});
```
