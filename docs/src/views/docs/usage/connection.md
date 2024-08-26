---
title: 'Connection'
layout: base.liquid
group: usage
permalink: '/usage/connection/index.html'
---

# Connection

SPX initialization requires invoking the default function `{js} spx()`. This default export returns a curried callback function, triggered once the **DOMContentLoaded** event fires. Upon connection, SPX saves the outer HTML of the current document in the snapshot cache using `{js} document.documentElement.outerHTML`. Subsequent snapshots are saved after an XHR request completes.

### Example 1

SPX Connection using default options:

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx(); // (session) => {}
```

### Example 2

SPX Connection using default options with callback:

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx()(function(session) {

  // You initialize third party js in this callback

});
```

### Example 3

SPX Connection with `fragment[]` options and callback:

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

### Example 4

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
