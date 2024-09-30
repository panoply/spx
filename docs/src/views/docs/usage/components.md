---
permalink: '/usage/components/index.html'
title: Components - Overview
layout: base.liquid
logger: false
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
  sugar: false,           // Whether or not to use node sugars (optional)
  merge: false,           // Whether or not snapshot merging applies (optional)
  nodes: ['foo'],         // Define elements associated with components (optional)
  state: {}               // Define component state interface (optional)
}) {

  connect({ page }) {}      // Component lifecycle event when component connects
  onmount({ page }) {}      // Component lifecycle event when component rendered
  unmount({ page }) {}      // Component lifecycle event when component removed

  method() {
    this.state            // State object as per define.state
    this.root             // DocumentElement reference: <html>
    this.view             // HTMLElement reference for: <div spx-component="demo">
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

SPX components incorporate three essential lifecycle callback hooks for precise control over component behavior. The `connect` hook triggers at the outset and is ideal for initial setup, executing just once. The `onmount` hook will trigger every time a component view is attached to the DOM, useful for logic that needs to run upon rendering. The `unmount` hook is invoked each time a component's view is detached from the DOM, this allows you to perform any necessary cleanups before component removal applies. Hooks provide you with a simple and effective management point, allowing components to responsibly handle their lifecycle, from initialization to termination and recurrence.

:::: grid row gx-0
::: grid col-12 col-sm-7 iframe-code mt-4 my-sm-4

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Demo extends spx.Component() {

  connect() {
    console.log('Demo Connect')
  }
  onmount() {
    console.log('Demo Mounted')
  }
  unmount() {
    console.log('Demo Unmounted')
  }
}
```

:::
::: grid col-12 col-sm-5 iframe-code mb-4 my-sm-4

{% include 'include/iframe'
  , url: '/usage/iframe/components-hooks/onmount/'
  , class: 'iframe-code'
%}

:::
::::

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
    Component dom element reference which be available to: "this.fooNode"
    This will be index 0 as we have 2 node references
  -->
  <div spx-dom="demo.foo">
    Lorem Ipsum
  </div>
</section>
<!--
  Additional Component dom element references placed outside of the
  component view are supported. This would be on index 1: "this.fooNodes[1]"
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
