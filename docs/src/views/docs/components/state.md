---
permalink: '/components/state/index.html'
layout: base.liquid
title: Component States
---

# State

Component state is stored in the DOM, and bindings are established in mounted components. State references necessitate the definition of an interface model via the static `define.state` object within components, supporting various definition structures.

<br>

# Type Constructors

In the following code snippet, we've defined some state for a tab component. Developers familiar with Stimulus will notice that SPX components closely resemble how you might define `values` in controllers.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static define = {
    state: {
      startTab: Number,
      activeColor: String,
      activeTab: Number,
      disabledTabs: Array
    }
  };

}
```

---

# Default State

Let's now elaborate on the previous definitions and provide some default values to state interfaces. This approach mirrors Stimulus, with differences in naming convention. In this example, we'll specify a pre-defined set of `disableTabs` in the interface.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static define = {
    state: {
      startTab: Number,
      activeColor: String,
      activeTab: Number,
      disabledTabs: {
        typeof: Array,
        default: [4,5] // Tab indexes 4 and 5 will be disabled
      }
    }
  };

}
```

---

# Persisted State

In addition to the above approaches, you may require persisted state values. Persisted states instruct SPX to preserve the state values between page navigations, thereby skipping state resets whenever a component disconnects.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static define = {
    state: {
      startTab: Number,
      activeColor: String,
      activeTab: {
        typeof: Number,
        persist: true // We will persist the active tab value
      },
      disabledTabs: {
        typeof: Array,
        default: [4,5] // Tab indexes 4 and 5 will be disabled
      }
    }
  };

}
```

---

# Shared State

Shared state instructs SPX to maintain state across all instances of a component. Changes applied to shared state are incremental, and it can be controlled from multiple points within your web application.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static define = {
    state: {
      counter: {
        typeof: Number,
        shared: true // This state value is maintained across all instances
      }
    }
  };

}
```
