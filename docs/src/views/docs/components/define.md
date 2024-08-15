---
permalink: '/components/define/index.html'
title: Components - Define
layout: base.liquid
---

# Definitions

SPX components have the ability to control connection configuration through a static reference named `define`. The static `define` reference is an object utilized to control component state, nodes, and various other options related to the component rendering and execution behavior.

<br>

# Interface

The static `define` reference is an `object` type which is used as the configuration preset of a component. It's here where you'll provide a state interface and specify how SPX handles the component.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static define = {
    id: '',       // Component identifier, use in value of spx-component="" (optional)
    merge: false, // Component snapshot control, when true DOM will merge with cache
    state: {},    // Component state interface, where we define types.
    nodes: []     // Component node elements, use in value of spx-node=""
  };

}
```

<br>

---

# Available Context

In each component, references defined in the `define` object are utilized and made available within the component scope. Below, we define some `state` and `nodes`, and the `oninit` lifecycle method demonstrates how we access these references. Additionally, besides the `define` references, SPX components expose a couple of additional scopes for your usage.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static define = {
    nodes: [ 'title', 'count'],
    state: {
      string: String,     // The default value will be empty string
      boolean: Boolean,   // The default value will be 0
      number: Number,     // The default value will be false
      object: Object,     // The default value will be empty object, {}
      array: Array        // The default value will be empty array, []
    }
  };

  connect() {

    // COMMON CONTEXT

    this.dom             // The element using spx-component=""
    this.html            // The <html> element in the DOM
    this.state.string    // => ''
    this.state.boolean   // => false
    this.state.number    // => 0
    this.state.object    // => {}
    this.state.array     // => []
    this.titleNode       // => HTMLElement
    this.countNode       // => HTMLElement
    this.titleNodes      // => HTMLElement[]
    this.countNodes      // => HTMLElement[]

    // SPECIAL CONTEXT

    this.component('id') // => Returns a component instance


  }
}
```

<br>

---

# Existence

All `state` and `nodes` provide `has` checks, returning a boolean value. These conditionals enable you to verify whether the component template contains or has defined the references:

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static define = {
    nodes: [ 'title', 'count'],
    state: {
      foo: String,   // The default value will be empty string
      bar: Boolean,  // The default value will be 0
      baz: Number    // The default value will be false
    }
  };

  connect() {

    // STATE EXISTENCE

    this.state.hasFoo    // boolean
    this.state.hasBar    // boolean
    this.state.hasBaz    // boolean

    // NODE EXISTENCE

    this.hasTitleNode    // boolean
    this.hasCountNode    // boolean

  }
}
```

<br>

---

# Hooks

All components provide lifecycle hooks which allow you to listen and track the status of a component in the DOM. Hooks are **reserved** and **exclusive** namespace methods which will trigger when a component connects, mounts or unmounts from the DOM.

> Consult to the [hooks](/components/hooks/) section for an in-depth overview of the available lifecycle triggers.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  connect(page) {}    // Fires only once when the component initializes
  onmount(page) {}    // Fires each time a page loads and component exists
  unmount(page) {}    // Fires each time a page exists and component is removed

}
```
