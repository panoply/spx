---
title: 'Components - Context'
layout: base.liquid
permalink: '/components/context/index.html'
grid: 'col-md-7'
---

# Connect

SPX Components can control connection configuration via the static reference named `connect`. The static `connect` reference is an object which is used to define component state, nodes and a couple of other options which pertain to the components rendering and execution behavior.

<br>

### Interface

The static `connect` reference is an `object` type and accepts 3 different options.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static connect = {
    name: '',   // Component identifier, use in value of spx-component=""
    state: {},  // Component state interface, where we define types.
    nodes: []   // Component node elements, use in value of spx-node=""
  };

}
```

<br>

### Scopes

Each component will use references defined in the `connect` object and make them available to the Component scope. Below we define some `state` and `nodes`, the `oninit` lifecycle method shows how we access the references. In addition to our `connect` references, SPX components also expose a couple of additional scopes which you can use.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static connect = {
    nodes: [ 'title', 'count'],
    state: {
      foo: String,   // The default value will be empty string
      bar: Boolean,  // The default value will be 0
      baz: Number    // The default value will be false
    }
  };

  oninit() {

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

### Has

All `state` and `nodes` provide `has` checks which will return a `boolean` value. You can use these conditionals to check whether or not the component template contains or has defined the references:

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static connect = {
    nodes: [ 'title', 'count'],
    state: {
      foo: String,   // The default value will be empty string
      bar: Boolean,  // The default value will be 0
      baz: Number    // The default value will be false
    }
  };

  oninit() {

    this.state.hasFoo    // boolean
    this.state.hasBar    // boolean
    this.state.hasBaz    // boolean
    this.hasTitleNode    // boolean
    this.hasCountNode    // boolean

  }
}
```

<br>

#### Lifecycle Methods

All components have access to the SPX lifecycle. You can use these methods to listen for operations and act in accordance. Lifecycle methods can be defined in lowercase format and will pass session reference in parameters. The main 3 lifecycle methods that you'll use are `oninit`, `onload` and `onexit` which can be used to control component contexts.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static connect = {
    nodes: [ 'title', 'count'],
    state: {
      foo: String,   // The default value will be empty string
      bar: Boolean,  // The default value will be 0
      baz: Number    // The default value will be false
    }
  };

  oninit(page) {}    // Fires once when the component initializes
  onload(page) {}    // Fires each time a page loads and component exists
  onexit(page) {}    // Fires each time a page exists and component is removed
  onvisit(page) {}   // Fires each time a visit has incurred
  oncache(page) {}   // Fires each time cache has be updated

}
```
