---
title: 'Connection'
layout: base.liquid
group: usage
permalink: '/usage/connection/index.html'
anchors:
  - Connection
  - Example 1
  - Example 2
  - Example 3
  - Example 4
---

# Connect

The SPX initialization process involves invoking a default function, `{js} spx()`, which returns a curried callback function designed to activate once the `DOMContentLoaded` event fires. At this juncture, SPX captures a snapshot of the document's state by saving `{js} document.documentElement.outerHTML` into its snapshot cache.

> This initial snapshot serves as a baseline, reflecting the document's state at the moment of initialization. This differs in subsequent visits, as snapshots are obtained using XHR over the wire.

#### Example 1

SPX Connection using default options:

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx(); // (session) => {}
```

#### Example 2

SPX Connection using default options with callback:

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx()(function(session) {

  // You initialize third party js in this callback

});
```

#### Example 3

SPX Connection with `{ts} fragment[]` options and callback:

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx({
  fragment: [
    'menu',  // #menu is dynamic and will morph
    'main'   // #main is dynamic and will morph
  ]
})(function(session) {

  // You initialize third party js in this callback
  console.log(session);

});
```

#### Example 4

SPX Connection with curried callback reference:

<!-- prettier-ignore -->
```js
import spx from 'spx';

const domReady = spx({
  fragment: [
    'menu',  // #menu is dynamic and will morph
    'main'   // #main is dynamic and will morph
  ]
});

export default domReady(function(session) {

  // You initialize third party js in this callback
  console.log(session);

})
```
