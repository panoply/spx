---
permalink: "/components/nodes/index.html"
title: Components - Nodes
layout: base.liquid
group: components
anchors:
  - Component Nodes
  - Defining Nodes
  - Using Nodes
---

# Component Nodes

Component nodes represent DOM elements associated with a specific component instance and are made available using attribute annotations and act as query selectors. The `spx-node` directive can be used to establish association with components which expects a `{html} <div spx-node="component.identifier">` dot notation value be provided. Every element in the DOM marked with an `spx-node` directive is made accessible within component scope and support both multiple occurrences and referencing.

> Component nodes are not query selected in the traditional sense, but instead are incrementally defined during morphs and traversal operations. Nodes can exist anywhere in the DOM and are registered ahead of time, making them accessible outside of dynamic fragments.

---

# Defining Nodes

Component nodes can be defined in the `nodes[]` setting within the static `define` object of a component class. This option accepts an array of strings, where each string serves as an identifier. These identifiers are used in the DOM to associate specific nodes with their corresponding components.

<br>

:: row mb-4
:: col-6

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Demo extends spx.Component({
  nodes: [
    'button',
    'counter',
    'feedback'
  ]
}) {

  // component methods

}
```

::
:: col-6

<!-- prettier-ignore -->
```html
<div spx-component="demo">
  <button
    type="button"
    spx-node="demo.button">
    <!-- This is buttonNode -->
  </button>
  <span spx-node="demo.counter">
    <!-- This is counterNode -->
  </span>
  <div spx-node="demo.feedback">
    <!-- This is feedbackNode -->
  </div>
</div>
```

::
::

> In this setup, the `spx-node` attribute connects each DOM element to its corresponding node within the `Demo` component. The `buttonNode`, `counterNode`, and `feedbackNode` are now directly linked to their respective DOM elements, allowing for seamless interaction and dynamic updates within the component's logic.

# Accessing Nodes

In our component, nodes can be easily accessed through the `this` context, which is available in all components. The `dom` object not only provides direct access to the defined nodes but also includes additional references that facilitate interaction with associated elements. This makes it straightforward to manipulate DOM elements directly from within a component. Here's an example of how we can access our defined nodes:

<!-- prettier-ignore -->
```js
import spx from 'spx';

export class Example extends spx.Component({
  nodes: [
    'button',
    'counter',
    'feedback'
  ]
}) {

  connect() {
    this.buttonNode       // Returns the <button> element
    this.counterNode      // Returns the <span> element
    this.feedbackNode;    // Returns the <div> element
  }

}
```

The `Node` suffix is used to clearly distinguish between accessing a single element and other functionalities like arrays of elements or existence checks. This naming convention ensures that your code remains intuitive and easy to understand, especially when managing complex components with multiple nodes.

# Full Example

<!-- prettier-ignore -->
```js
import spx from 'spx';

export class Example extends spx.Component({
  nodes: [
    'button',
    'counter',
    'feedback'
  ]
}) {

  connect() {

    // Single Elements
    this.buttonNode             // Returns the <button> element or null
    this.counterNode            // Returns the <span> element or null
    this.feedbackNode           // Returns the <div> element or null

    // Multiple Elements
    this.buttonNodes           // Returns an array of <button> elements or []
    this.counterNodes          // Returns an array of <span> elements or []
    this.feedbackNodes         // Returns an array of <div> elements or []

    // Element Existence
    this.buttonExists          // Returns a boolean indicating if <button> exists
    this.counterExists         // Returns a boolean indicating if <span> exists
    this.feedbackExists        // Returns a boolean indicating if <div> exists

  }
}
```
