---
permalink: '/components/overview/index.html'
title: Components - Overview
layout: base.liquid
---

# Components

SPX components serve as a fundamental DOM enhancement and enabling the creation of interactive logic within web applications. Below illustrates the basic context provided in an SPX component.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Demo extends spx.Component {

  static define = {
    named: '',              // Define an identifier (optional)
    nodes: [],              // Define elements associated with components
    state: {}               // Define component state interface
  }

  connect({ page }) {}      // Component lifecycle event when component connects
  onmount({ page }) {}      // Component lifecycle event when component rendered
  unmount({ page }) {}      // Component lifecycle event when component removed

  method() {

    this.html               // DocumentElement reference: <html>
    this.dom                // HTMLElement reference for: <div spx-component="demo">
    this.state              // State object as per define.state

  }

  callback (event) {

    event.preventDefault()   // Event argument from callback trigger
    event.attrs              // Event callback parameters that where passed

  }
}

```

---

# Markup

SPX Components establish connections with DOM elements through attribute (directive) annotations. Assigning a component identifier name to the `spx-component` directive initializes a component instance which will persists throughout an SPX session. Defining component `state` using the DOM is achieved through [state directives](/components/state) and should be applied on the same element where `spx-component` is declared.

Component [nodes](/components/nodes) and [events](/components/events) can be defined anywhere in the DOM using the corresponding directive patterns provided by SPX as long as the component exists. The persisted nature of SPX Components allow for incremental node or event based attachments to occur across different pages when leveraging dynamically targeted [fragment](/key-concepts) rendering.

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
    Component node reference which be available to: "this.fooNode"
    This will be index 0 as we have 2 node references
  -->
  <div spx-node="demo.foo">
    Lorem Ipsum
  </div>
</section>
<!--
  Additional Component node reference placed outside of the
  components tree which will be index 1 in the array list: "this.fooNodes"
-->
<div spx-node="demo.foo">
  Hello World!
</div>
```

<br>

To ensure SPX is aware of their existence, all components must be registered. This can be achieved either through the [spx.register](/api/register) methods or by passing them to the [components](/usage/options#components) option upon connection, offering flexibility in your approach. Registered components are stored in the session and become available to SPX at runtime. However, components remain dormant until an `spx-component` directive is encountered. At that point, SPX establishes an instance using the registered component. Once created, this instance persists throughout the SPX session, enduring until a hard-refresh occurs. This incremental approach ensures a structured execution flow.

---

:::: grid row jc-center mx-2
::: grid col-10 py-4 mt-3

<img src="/assets/flow.svg" class="w-100">

:::
::::

---
