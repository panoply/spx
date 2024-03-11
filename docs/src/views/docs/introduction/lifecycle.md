---
title: 'Lifecycle'
layout: base.liquid
permalink: '/introduction/lifecycle/index.html'
prev:
  label: 'Session'
  uri: '/introduction/session/'
next:
  label: 'Usage'
  uri: '/usage/installation'
---

# Visit Lifecycle

SPX takes over the rendering cycle in your web application and exposes an visit lifecycle that you can hook into to perform operations at different points. If you've worked with virtual DOM frameworks, you'll likely be familiar with lifecycle methods. SPX takes inspiration from the brilliant SPA framework known as [mithril.js](https://mithril.js.org) for lifecycle execution and offers a couple of different ways for developers to work with renders.

---

#### Listeners

You can access the lifecycle using SPX events listeners. There is no limit to the amount of events you and SPX will dispatch in sequential order, starting from the first defined listener to the last.

<!--prettier-ignore-->
```js
import spx from 'spx';


spx.on('init', function(page) {

});

spx.on('fetch', function({ page }) {

});

spx.on('cache', function({ page, dom }) {

});

spx.on('visit', function({ event, page }) {

});

spx.on('popstate', function({ event, page }) {

});

spx.on('resource', function({ page, type, url }) {

});

spx.on('render', function({ page, oldDom, newDom }) {

});

spx.on('load', function({ page }) {

});

spx.on('exit', function({ page }) {

});


```

---

#### Component Hooks

Components can hook into the lifecycle directly within class using the below methods. Component hooks will pass the same parameters as the listeners, but will not bind anything to the `this` in callbacks.

#### oninit

---

#### onload

---

#### onstate

---

#### onexit

---

#### oncache

---

#### onfetch

---

#### onvisit
