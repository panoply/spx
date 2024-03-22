---
title: 'Components - Hooks'
permalink: '/components/hooks/index.html'
layout: base.liquid
---

# Hooks

Hooks are lifecycle callback methods provided within components which will execute at different stages of the SPX rendering cycle. There are 3 distinct callback hooks offered (connect, onmount and unmount). Each hook triggers in accordance with the presence of a element within the DOM annotated with an `spx-component` directive and value matching the component identifier.

{% include 'hooks' %}

> The **order of execution** for components hooks is determined by initial or subsequent visits. Whenever a component instance is established the `connect` hook is triggered before `onmount`, whereas subsequent visits the `connect` hook will not be fired, resulting in `onmount` followed by `unmount` upon removal.

Hooks are fired outside the event-loop so as negate any potential blocking or expensive operations of callbacks and are resolved concurrently. Hooks can be either synchronous or asynchronous and used to facilitate controlled and timely execution of logic within SPX components.

---

# Connect

The `connect` lifecycle callback hook is an initializer that executes first and will fire be invoked when a new instance was established. New instances are determined by the presence of an element in DOM annotated with a `spx-component` attribute who's value matches the component identifier (see [definitions](/components/defintions/)). Because component instances persist throughout a session in SPX, this hook will only ever fire **one** time for each component occurrence and never again after that.

<!-- prettier-ignore-->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  connect({ page }) {

    // Fires once when an instance was establish on initial visits
    console.log(page)

  }

}
```

<br>

# Onmount

The `onmount` lifecycle callback hook will trigger after the component has been mounted in the DOM. The hook is the equivalent of `DOMContentLoaded` and will fire each time an component with an established (existing) instance is rendered to the DOM. The difference between `connect` and `onmount` is that `connect` will trigger once upon initial visit whereas `onmount` triggers both upon initial visit (following `connect`) and in all subsequent visits to a location where the component exists.

<!-- prettier-ignore-->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  onmount({ page }) {

    // Fires on initial visit after connect() and for all subsequent visits
    console.log(page)

  }

}
```

<br>

# Unmount

The `unmount` lifecycle callback hook will trigger whenever the component is removed from the DOM. The hook will signal before a DOM morph occurs and can be used to teardown or clean-up logic between page visits.

<!-- prettier-ignore-->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  unmount({ page }) {

    // Fires on initial visit after connect() and for all subsequent visits
    console.log(page)

  }

}
```

---

# Demonstration

{% include 'iframe', url: '/iframe/using-hooks/page-a', class: 'hook-iframe' %}
