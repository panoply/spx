---
title: 'Fetch'
layout: base.liquid
permalink: '/methods/fetch/index.html'
prev:
  label: 'spx.prefetch'
  uri: '/methods/prefetch/'
next:
  label: 'spx.capture'
  uri: '/methods/capture/'
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
