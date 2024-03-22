---
permalink: '/components/definitions/index.html'
title: Components - Definitions
layout: base.liquid
---

# Definitions

SPX components have the ability to control connection configuration through a static reference named `define`. This static `define` reference is an object utilized to define component state, nodes, and various other options related to the component's rendering and execution behavior.

<br>

# Interface

The static `define` reference is an `object` type and accepts 3 different options.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static define = {
    named: '',   // Component identifier, use in value of spx-component="" (optional)
    state: {},  // Component state interface, where we define types.
    nodes: []   // Component node elements, use in value of spx-node=""
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
      foo: String,   // The default value will be empty string
      bar: Boolean,  // The default value will be 0
      baz: Number    // The default value will be false
    }
  };

  connect() {

    this.dom           // The element using spx-component=""
    this.html          // The <html> element in the DOM
    this.state.foo     // => ''
    this.state.bar     // => false
    this.state.baz     // => 0
    this.titleNode     // => HTMLElement
    this.countNode     // => HTMLElement
    this.titleNodes    // => HTMLElement[]
    this.countNodes    // => HTMLElement[]

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

    this.state.hasFoo    // boolean
    this.state.hasBar    // boolean
    this.state.hasBaz    // boolean
    this.hasTitleNode    // boolean
    this.hasCountNode    // boolean

  }
}
```

<br>

---

# Lifecycle Events

All components have access to the SPX lifecycle, allowing you to listen for operations and respond accordingly. Lifecycle methods can be defined in lowercase format and receive the session reference as parameters.

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

  connect(page) {}    // Fires once when the component initializes
  onmount(page) {}    // Fires each time a page loads and component exists
  unmount(page) {}    // Fires each time a page exists and component is removed


}
```
