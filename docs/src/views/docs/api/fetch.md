---
title: 'Fetch'
layout: base.liquid
group: api
permalink: '/api/fetch/index.html'
---

# spx.fetch

The `spx.fetch` method executes a programmatic fetch. The method expects a `url` as an argument.

# Events

The fetch method will fire the following events:

- TODO

# Example

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.fetch('/some-path').then(function(page) {

  console.log(page)

})


```
