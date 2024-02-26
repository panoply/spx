---
title: 'Components - State'
layout: base.liquid
permalink: '/components/state/index.html'
prev:
  label: 'Session'
  uri: '/introduction/session/'
next:
  label: 'Usage'
  uri: '/usage/installation'
---

# State

Component state is stored in the DOM and bindings are established so state changes reflect in mounted components. If you've used [stimulus.js](https://stimulusjs.org/), component state is similar to stimulus **values**. State references require you define an interface model via the static `connect.state` object in components, the static `connect.state` model accepts a couple of different definition structures and depending on your requirements.

---

#### Type Constructors

In the below code snippet we have defined some state for a tab component. For developers coming from Stimulus, you'll notice how SPX components are almost identical to how you might define `values` in controllers.

<!-- prettier-ignore -->
```js
import spx from 'spx';

export class Example extends spx.Component {

  static connect = {
    state: {
      startTab: Number,
      activeColor: String,
      activeTab: Number
      disabledTabs: Array,
    }
  };

}
```

---

#### Default States

Let's now expand on the above definitions and provide some default values to state interfaces, again this approach is similar to Stimulus, with differences being naming convention. In this example, we will instead provide a pre-defined set of `disableTabs` in the interface.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component {

  static connect = {
    state: {
      startTab: Number,
      activeColor: String,
      activeTab: Number
      disabledTabs: {
        typeof: Array,
        default: [4,5] // Tab indexes 4 and 5 will be disabled
      },
    }
  };

}
```

---

#### Persisted States

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
