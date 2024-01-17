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

SPX requires invoking and can be initialized using the `spx.connect()` method. This method returns a curried (function) callback which is triggered once which fires upon **DOMContentLoaded**. SPX will save the outer HTML of the current document in snapshot cache using `document.documentElement.outerHTML` upon connection whereas all additional snapshots are saved after an XHR request completes.

<br>

#### Option 1

SPX Connection using default options

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect(); // (session) => {}
```

<br>

#### Option 2

SPX Connection using default options with callback:

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect()(function(session) {

  // You initialize third party js in this callback

});
```

<br>

#### Option 3

SPX Connection with `fragment[]` options and callback:

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect({
  fragment: ['nav', 'main'] // <nav> and <main> elements will be swapped
})(function(session) {

  // You initialize third party js in this callback
  console.log(session);

});
```
