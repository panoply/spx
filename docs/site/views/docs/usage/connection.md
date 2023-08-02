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

SPX requires invoking and can be initialized using the `spx.connect()` method. This method returns a curried (function) callback which is triggered once which fires upon `DOMContentLoaded`. SPX will save the outer HTML of the current document in snapshot cache using `document.documentElement.outerHTML` upon connection whereas all additional snapshots are saved after an XHR request completes.

::: note
Below is the default configuration used by SPX. The type declarations provided will describe each option in good detail. All settings are completely optional.
:::

<!-- prettier-ignore -->
```js
import spx from 'spx'

spx.connect({
  targets: ['body'],
  timeout: 30000,
  schema: 'spx',
  manual: false,
  globalThis: true,
  cache: true,
  limit: 100,
  async: true,
  render: 'replace',
  annotate: false,
  preload: {},
  eval: {
    style: true,
    script: false,
    link: false,
    meta: false
  },
  hover: {
    trigger: 'href',
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
