---
title: 'Components - Overview'
layout: base.liquid
permalink: '/components/overview/index.html'
prev:
  label: 'Session'
  uri: '/introduction/session/'
next:
  label: 'Usage'
  uri: '/usage/installation'
---

# Components

SPX provides a component extendability feature which is loosely based on the [stimulus.js](https://stimulus.hotwired.dev/) approach. Components serve as DOM enhancements and have been designed to integrate with the SPX rendering, morph and caching methodology.

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

<!--prettier-ignore-->
```js
import spx from 'spx';

export class Tabs extends spx.Component {

  static attrs = {
    persist: Boolean,
    easing: String,
    opened: Number
  };

  toggle({ attrs }) {

    this.state.open = attrs.index;

    this.buttonsNode.children.forEach((button, index) => {
      if(index !== this.state.open) {
        button.classList.remove('active')
      } else {
        button.classList.add('active')
      }
    })

    this.panelNodes.forEach((panel, index) => {
      if(index !== this.state.open) {
        panel.classList.setAttribute('hidden', 'true')
      } else {
        panel.classList.removeAttribute('hidden')
      }
    })
  }
}

```
