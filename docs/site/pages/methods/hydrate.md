---
title: 'Hydrate'
layout: base.liquid
permalink: '/methods/hydrate/index.html'
prev:
  label: 'spx.clear'
  uri: '/methods/clear/'
next:
  label: 'spx.store'
  uri: '/methods/store/'
---

# spx.hydrate

Programmatic hydrate execution. The method expects a `url` as first parameter and accepts an options string list of element selectors to replace along with an optional `pushState` method to apply. When no replacement selectors are provided then the `targets` are used.

export function hydrate(url: string, nodes?: string[], pushState?: 'replace' | 'push'): Promise<IPage>

# Example

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.hydrate('/some-path', ['#target', 'h1'], 'replace').then(function(page) {

  console.log(page)

})
```
