---
permalink: '/components/define/index.html'
title: Components - Define
layout: base.liquid
anchors:
  - Definitions
  - Static Define
  - Lifecycle Hooks
  - Context Reference
  - Existence Checks
---

# Definitions

SPX components leverage a static `define` reference to provide comprehensive control over their configuration, encompassing state management, DOM node interactions, rendering strategies, and execution behavior. The `define` object acts as a pivotal point for developers to tailor component behavior, allowing for precise adjustments in how components handle state changes, interact with the DOM, manage their lifecycle, and optimize rendering for various environments.

# Static Define

The static `define` reference in SPX components is an object that serves as the configuration blueprint for the component. Within this object, developers define the state interface and dictate how SPX should manage and interact with the component, effectively setting the rules for its behavior and lifecycle.

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

# Lifecycle Hooks

SPX components are equipped with lifecycle hooks, which are reserved methods that allow developers to monitor and react to changes in a component's status within the DOM. These hooks are exclusive, meaning they are specifically designed to trigger at distinct moments during the component's lifecycle.

> For a comprehensive understanding of component lifecycle hooks, their application and how to leverage them effectively, consult the [hooks documentation](/components/hooks/) for a detailed overview.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  connect(page) {}    // Fires only once when the component initializes
  onmount(page) {}    // Fires each time a page loads and component exists
  unmount(page) {}    // Fires each time a page exists and component is removed

}
```

# Context Reference

In each component, the references specified within the static define object are not only utilized within DOM structures but also become accessible inside the components scope. For instance, defining `state` and `nodes` allows these to be referenced directly within the `this` context of the component. The `{js} connect()` lifecycle method exemplifies how these defined references can be accessed.

> For a more in-depth understanding and comprehensive overview of how component state and nodes function within SPX, refer to the respective sections on [component state](/components/state/) and [component nodes](/components/nodes/).

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static define = {
    nodes: [ 'element', 'button'],
    state: {
      someString: String,     // The default value will be empty string
      someBoolean: Boolean,   // The default value will be 0
      someNumber: Number,     // The default value will be false
      someObject: Object,     // The default value will be empty object, {}
      someArray: Array        // The default value will be empty array, []
    }
  };

  connect() {

    this.html                 // => The <html> element in the DOM
    this.root                 // => The element using spx-component=""
    this.state.someString     // => ''
    this.state.someBoolean    // => false
    this.state.someNumber     // => 0
    this.state.someObject     // => {}
    this.state.someArray      // => []
    this.dom.elementNode     // => HTMLElement OR undefined
    this.dom.elementNodes    // => HTMLElement[] OR []
    this.dom.buttonNode      // => HTMLButtonElement OR undefined
    this.dom.buttonNode      // => HTMLButtonElement[] OR []

  }
}
```

# Existence Checks

In SPX, both `state` and `nodes` come equipped with `has` methods, which return boolean values to indicate whether the specified state properties or DOM nodes exist within the component. This structure allows for conditional logic based on the presence of defined state properties provided on component root elements and component nodes element/s contained within the DOM.

<!--prettier-ignore-->
```ts
import spx from 'spx';

export class Component extends spx.Component {

  static define = {
    nodes: [ 'element', 'button'],
    state: {
      someString: String,     // The default value will be empty string
      someBoolean: Boolean,   // The default value will be 0
      someNumber: Number,     // The default value will be false
      someObject: Object,     // The default value will be empty object, {}
      someArray: Array        // The default value will be empty array, []
    }
  };

  connect() {

    this.state.hasSomeString    // => boolean
    this.state.hasSomeBoolean   // => boolean
    this.state.hasSomeNumber    // => boolean
    this.state.hasSomeObject    // => boolean
    this.state.hasSomeArray     // => boolean
    this.dom.hasElement         // => boolean
    this.dom.hasButton          // => boolean

  }
}
```
