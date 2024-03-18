---
title: 'spx-bind'
layout: base.liquid
group: 'directive'
permalink: '/directives/spx-bind/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-bind

The `spx-bind` attribute is a component specific attribute that binds a state value to a specific element or number of elements. The directive is used when you require state to reflect in the DOM.

<!--prettier-ignore-->
```html
<section
  spx-component="counter"
  spx-counter:count="0">
  <button spx@click="example.increase">Count:</button>
  <span spx-bind="example.count">0</span>
</section>
```
