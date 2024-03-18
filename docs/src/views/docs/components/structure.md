---
title: 'SPX Components - Structure'
layout: base.liquid
group: 'directive'
permalink: '/components/structure/index.html'
---

# Components

Positioned at the core of the module, SPX components are a straight-forward DOM enhancement for creating interactive logic within web applications. SPX Components use an scalable pattern, one which you seamlessly apply to your existing projects. The internal tactic SPX employs for components is tightly coupled together with the rendering, morphing, and caching algorithm.

### Structure

<br>

### Example Component

::: tabs template

<!--prettier-ignore-->
```html
<section spx-component="tabs" spx-tabs:open="0">
  <!--
    Tab Buttons
  -->
  <div spx-node="tab.buttons">
    <button type="button" spx@click="tabs.toggle" spx-tabs:index="0">
      Foo Tab
    </button>
    <button type="button" spx@click="tabs.toggle" spx-tabs:index="1">
      Bar Tab
    </button>
     <button type="button" spx@click="tabs.toggle" spx-tabs:index="2">
      Baz Tab
    </button>
  </div>
  <!--
    Tab Panels
  -->
  <div spx-node="tabs.item">
    <p>Tab index 0</p>
  </div>
  <div spx-node="tabs.item">
    <p>Tab index 1</p>
  </div>
  <div spx-node="tabs.item">
    <p>Tab index 2</p>
  </div>
</section>
```

:::
::: tabs component

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Tabs extends spx.Component {

  static connect = {
    state: {
      open: Number
    }
  }

  toggle ({ attrs }) {

    if (this.state.open !== attrs.index) {

      this.state.open = attrs.index;

      for (let i = 0, s = this.panelNodes.length; i < s; i++) {
        if (i === attrs.index) {
          this.buttonNodes[i].classList.add('active');
          this.panelNodes[i].classList.remove('d-none');
        } else {
          this.buttonNodes[i].classList.remove('active');
          this.panelNodes[i].classList.toggle('d-none', true);
        }
      }
    }
  }
}
```

:::

::: tabs example

{% include 'examples/tabs' %}

:::

---

# Aliases

When components have an `id` attribute, they can be used as the target reference by events, nodes and bindings. This is helpful when you have multiple components and need to target certain instances in the DOM.

::: tabs template

<!--prettier-ignore-->
```html
<!--
  Modal Component 1 - Using newsletter is alias
-->
<section id="newsletter" spx-component="modal" >
  <h1>Newsletter</h1>
  <button type="button" spx@click="model.close">
    Close
  </button>
</section>
<!--
  Modal Component 2 - Using size-chart id alias
-->
<section id="size-chart" spx-component="modal">
  <h1>Size Chart</h1>
  <button type="button" spx@click="model.close">
    Close
  </button>
</section>
<!--
  Opens newsletter modal
-->
<button type="button" spx@click="modal.open">
  Newsletter
</button>
<!--
  Opens size-chart modal
-->
<button type="button" spx@click="modal.open">
  Size Chart
</button>
```

:::
::: tabs component

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Modal extends spx.Component {

  static connect = {
    state: {
      isOpen: Boolean
    }
  }

  open () {
    this.dom.classList.add('open');
    this.state.isOpen = true
  }

  close () {
    this.dom.classList.remove('open');
    this.state.isOpen = false
  }
}
```

:::

::: tabs example

{% include 'examples/modal' %}

:::

---

# Incremental

Incremental components can be progressively extended upon when mounted within static fragment or targeting specific elements via [spx-target](/directives/spx-target). Incremental components will adapt automatically, without the need to tear down or perform manual re-connection across different routes in your web application.

:::: grid row
::: grid col-6

<!--prettier-ignore-->
```html
<aside
  spx-component="demo"
  spx-demo:title="Foo">
  <span spx-bind="demo.title">
    Hello
  </span>
</aside>
<main id="content">
   <h1>PAGE A</h1>
  <button
   type="button"
   spx@click="demo.newTitle"
   spx-demo:title="Hello"> Update </button>
</main>
```

:::
::: grid col-6

<!--prettier-ignore-->
```html
<aside
  spx-component="demo"
  spx-demo:title="Foo">
  <span spx-bind="demo.title">
    World
  </span>
</aside>
<main id="content">
  <h1>PAGE B</h1>
  <button
   type="button"
   spx@click="demo.newTitle"
   spx-demo:title="World!"> Update </button>
</main>
```

:::
::::
