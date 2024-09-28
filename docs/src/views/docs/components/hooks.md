---
title: 'Components - Hooks'
permalink: '/components/hooks/index.html'
layout: base.liquid
anchors:
  - Hooks
  - Connect
  - Onmount
  - Unmount
  - Demonstration
---

# Hooks

Component hooks in SPX are lifecycle callback methods that execute at various points during the rendering cycle, offering three primary hooks: `connect`, `onmount`, and `unmount`. These hooks are triggered based on the presence of an element in the DOM marked with an [spx-component](/directives/spx-component/) attribute directive that matches the component's identifier.

> Hooks in SPX are executed outside the event loop to prevent any potential blocking or performance degradation from expensive operations. This design allows hooks to be resolved concurrently, ensuring that they do not hinder performance.

# Order of Execution

The order in which component hooks execute depends on whether it's the first time a component is encountered or if it's a subsequent visit. Initially, when a component instance is created and added to the DOM, the `{js} connect()` hook is executed before `{js} onmount()`, ensuring setup logic runs once. However, on subsequent visits to a component with an existing instance, the connect hook will not trigger; instead, `{js} onmount()` executes each time the component becomes active, followed by `{js} unmount()` whenever the component root element it's removed or replaced in the DOM.

{% include 'include/hooks-table' %}

---

# connect

The `connect` lifecycle callback hook serves as an initializer, executing first and only once for each new instance of a component. This hook is triggered when a new instance is created, identified by an element in the DOM that carries the `spx-component` attribute matching the component's identifier. Since SPX maintains component instances throughout a session, the connect hook is invoked just **once** for each component instance and will not be called again for subsequent interactions.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component() {

  connect({ page }) {

    // This method runs once when the component instance is first established
    console.log(page);

  }

}
```

# onmount

The `onmount` lifecycle callback hook will trigger after the component has been mounted in the DOM. The hook is the equivalent of **DOMContentLoaded** and will fire each time an component with an established (existing) instance is rendered to the DOM. The difference between connect and onmount is that `connect` will trigger once upon initial visit whereas `onmount` triggers both upon initial visit and in all subsequent visits to a location where the component exists.

<!-- prettier-ignore-->
```ts
import spx from 'spx';

export class Example extends spx.Component() {

  onmount({ page }) {

     // This method runs after the component is mounted in the DOM,
     // including on initial and subsequent visits
    console.log(page)

  }

}
```

# unmount

The `unmount` lifecycle callback hook is invoked when a component is about to be removed from the DOM. This hook serves as a signal before any DOM restructuring or removal takes place, providing an opportunity for cleanup or teardown operations between page transitions. In SPX, `unmount` only triggers when the component's element is entirely removed from the DOM; if the component merely morphs or changes without complete removal, `unmount` does not fire.

<!-- prettier-ignore-->
```ts
import spx from 'spx';

export class Example extends spx.Component() {

  unmount({ page }) {

    // This method runs right before the component is removed from the DOM
    console.log(page);

  }

}
```

---

# Demonstration

See the below example where we are demonstrating hooks execution.

{% include 'include/iframe', url: '/iframe/using-hooks/page-a/', class: 'hook-iframe' %}
