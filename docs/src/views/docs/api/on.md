---
title: 'On'
layout: base.liquid
group: api
permalink: '/api/on/index.html'
---

# spx.on

The `spx.on` method in SPX serves as an event listener of the navigation Lifecycle. Use this method to monitor and manipulate how SPX behaves at key junctures such as connection, fetching, caching, rendering and loaded stages.

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('connect', function(){})    // Fires on DOMContentLoaded
spx.on('visit', function(){})      // Fires on <a> clicks
spx.on('prefetch', function(){})   // Fires on <a> prefetches, i.e, hover
spx.on('fetch', function(){})      // Fires before an XHR fetch begins
spx.on('cache', function(){})      // Fires before page is cached
spx.on('render', function(){})     // Fires after morph but before swap
spx.on('load', function(){})       // Fires for each page render
```

# Order of Execution

1. `{js} "connect"`
2. `{js} "visit"`
3. `{js} "prefetch"`
4. `{js} "fetch"`
5. `{js} "cache"`
6. `{js} "render"`
7. `{js} "load"`

---

# Context
