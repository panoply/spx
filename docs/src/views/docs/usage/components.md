---
permalink: '/usage/components/index.html'
title: Components - Overview
layout: base.liquid
anchors:
  - Components
  - Markup
---

# SPX Components

SPX components serve as a bridge between JavaScript logic and the Document Object Model (DOM), enhancing interactivity in web applications. They are defined by a unique name, associated DOM elements, state, and event bindings. The `name` identifies the component within the application, while `nodes` specify which DOM elements the component interacts with. The `state` holds data that the component manages, which can include various data types like numbers, strings, booleans, objects, or arrays.

<!-- prettier-ignore -->
```ts
import spx from 'spx';


export class Demo extends spx.Component({
  name: 'demo',           // Define an identifier (optional)
  sugar: false,           // Whether or not to use node sugars
  nodes: ['foo'],         // Define elements associated with components
  state: {}               // Define component state interface
}) {

  connect({ page }) {}      // Component lifecycle event when component connects
  onmount({ page }) {}      // Component lifecycle event when component rendered
  unmount({ page }) {}      // Component lifecycle event when component removed

  method() {
    this.state            // State object as per define.state
    this.root             // DocumentElement reference: <html>
    this.dom              // HTMLElement reference for: <div spx-component="demo">
    this.fooNode          // The HTMLElement of <div spx-node="demo.foo"> in dom or undefined
    this.fooNodes         // An HTMLElement[] list of all nodes using <div spx-node="demo.foo">
    this.hasFoo           // Whether or not <div spx-node="demo.foo"> exists in dom
  }

  callback (event) {
    event.preventDefault()   // Event argument from callback trigger
    event.attrs              // Event callback parameters that where passed
  }
}
```

# Hooks

Components support lifecycle hooks like `onmount` for initialization when rendered, and `unmount` for cleanup before removal from the DOM. These hooks are essential for managing resources efficiently, ensuring components clean up after themselves when no longer needed.

# Events

Events are crucial for interactivity. For instance, a click event can be bound directly in HTML using `{html} <button spx@click="demo.open">` (or whatever element your event should be attached), where `open` is a method defined within the component. This method receives an event object with methods like `{js} preventDefault()` to stop default browser behavior and properties like `attrs` for accessing attributes passed with the event.

# Markup

SPX components connect with DOM elements via attribute annotations. Initializing a component involves assigning its name to the `spx-component` attribute on an HTML element. Component state is defined using state directives on the same element where the component is declared. Nodes and events can be defined anywhere in the DOM using SPX directives, allowing for dynamic attachments across different pages. This flexibility is due to SPX's component persistence throughout a session, which means components can be referenced and interacted with even as the user navigates through different parts of the application.

<!--prettier-ignore-->
```html
<!--
  A component element which is available to: "this.dom"
  The state directives defined available on: "this.state"
-->
<section
  spx-component="demo"
  spx-demo:string="example"
  spx-demo:boolean="true"
  spx-demo:number="100"
  spx-demo:array="[ 'foo', { key: true } ]"
  spx-demo:object="{ key: 200 }">
  <!--
    Component event which will trigger the method: callback(event)
    The state directives are assigned to the args: event.attrs
  -->
  <button
    type="button"
    spx@click="demo.callback"
    spx-demo:string="string"
    spx-demo:number="35"
    spx-demo:object="{ a: true, b: [1,2,3] }">
    Click Me
  </button>
  <!--
    Component dom element reference which be available to: "this.dom.foo"
    This will be index 0 as we have 2 node references
  -->
  <div spx-dom="demo.foo">
    Lorem Ipsum
  </div>
</section>
<!--
  Additional Component doom element reference placed outside of the
  components tree which will be index 1 in the array list: "this.dom.foo()"
-->
<div spx-dom="demo.foo">
  Hello World!
</div>
```

To ensure SPX is aware of their existence, all components must be registered. This can be achieved either through the [spx.register](/api/register) methods or by passing them to the [components](/usage/options#components) option upon connection, offering flexibility in your approach. Registered components are stored in the session and become available to SPX at runtime. However, components remain dormant until an `spx-component` directive is encountered. At that point, SPX establishes an instance using the registered component. Once created, this instance persists throughout the SPX session, enduring until a hard-refresh occurs. This incremental approach ensures a structured execution flow.

---

:::: grid row jc-center mx-2
::: grid col-10 py-4 mt-3

<img src="/assets/flow.svg" class="w-100">

:::
::::

---
