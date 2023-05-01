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

spx.connect({ /* options */ })(function(session) {

  // The connect returns a callback function after
  // connection was established. Lets inspect the session:
  console.log(session);

  // You initialize third party js in this callback
  // It's the equivalent of DOMContentLoaded.

});
```
