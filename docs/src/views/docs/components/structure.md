---
title: 'SPX Components - Structure'
layout: base.liquid
permalink: '/components/structure/index.html'
prev:
  label: 'Session'
  uri: '/introduction/session/'
next:
  label: 'Usage'
  uri: '/usage/installation'
---

# Components

SPX components provide a robust solution for connection and interaction with the DOM. Positioned at the core of the module, SPX components integrate into the SPX rendering, morphing, and caching algorithm. They furnish you with a straight-forward DOM enhancement API, and provide a well-structured for creating interactive logic within web applications.

> SPX Components are loosely based on [stimulus.js](https://stimulus.hotwired.dev/) approach. Using Components allows you to harness the full potential of SPX without sacrificing performance overheads.

<!--prettier-ignore-->
```html
<section
  spx-component="tabs"
  spx-tabs:opened="0"
  spx-tabs:persist="false"
  spx-tabs:easing="linear">

  <!-- Tab Buttons-->
  <div spx-node="buttons">
    <button
      type="button"
      spx@click="tabs.toggle"
      spx-tabs:index="0"> Foo </button>
    <button
      type="button"
      spx@click="tabs.toggle"
      spx-tabs:index="1"> Bar </button>
  </div>

  <!-- Tab Panels --->
  <div spx-node="tabs.panel">
    <p>Tab index 0</p>
  </div>
  <div spx-node="tabs.panel">
    <p>Tab index 1</p>
  </div>

</section>
```
