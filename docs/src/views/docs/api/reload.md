---
title: 'Reload'
layout: base.liquid
group: api
permalink: '/api/reload/index.html'
---

# spx.reload

Triggers a reload of the current page. The page will be re-fetched over HTTP and re-cached. If fetch fails then an SSR location assignment will be invoked and redirection will be applied.

# Example

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.reload().then(function(page) {

  console.log(page)

})


```
