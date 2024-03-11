---
title: 'Components - State'
layout: base.liquid
permalink: '/components/state/index.html'
grid: 'col-md-7'
---

# State

Component state is stored in the DOM and bindings are established in mounted components. State references require you define an interface model via the static `connect.state` object within components and accept several different definition structures.

<br>

### Type Constructors

In the below code snippet we have defined some state for a tab component. For developers coming from Stimulus, you'll notice how SPX components are almost identical to how you might define `values` in controllers.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static connect = {
    state: {
      startTab: Number,
      activeColor: String,
      activeTab: Number,
      disabledTabs: Array
    }
  };

}
```

<br>

### Default State

Let's now expand on the above definitions and provide some default values to state interfaces, again this approach is similar to Stimulus, with differences being naming convention. In this example, we will instead provide a pre-defined set of `disableTabs` in the interface.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static connect = {
    state: {
      startTab: Number,
      activeColor: String,
      activeTab: Number,
      disabledTabs: {
        typeof: Array,
        default: [4,5] // Tab indexes 4 and 5 will be disabled
      },
    }
  };

}
```

<br>

### Persisted State

In addition to the above approaches, you may require persisted state values. Persist states will instruct SPX to preserve the state values between page navigations, skipping state resets whenever a component disconnects.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static connect = {
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
      },
    }
  };

}
```

<br>

### Shared State

Shared state instructs SPX to maintain state across all instances of a component. Changes applied to shared state is incremental and it can be controlled for multiple points in your web application.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static connect = {
    state: {
      counter: {
        typeof: Number,
        shared: true // This state value is maintained across all instances
      }
    }
  };

}
```
