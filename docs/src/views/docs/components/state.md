---
permalink: "/components/state/index.html"
layout: base.liquid
title: Component States
anchors:
  - State
  - Type Constructors
  - Default State
  - Persisted State
  - Shared State
---

# State

SPX States are data references defined on both the DOM element and component level. State can be used to establish 2-way inferfacing, allowing data communication to and from view elements. SPX persists state in component, which means defintions are preserved between page navigations, skipping state resets whenever a component unmounts from the DOM.

# Type Constructors

In the following code snippet, we've defined some state for a tab component. Developers familiar with Stimulus will notice that SPX components closely resemble how you might define `values` in controllers.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component({
  state: {
    startTab: Number,
    activeColor: String,
    activeTab: Number,
    disabledTabs: Array
  }
}) {

  /* Component Methods */

}
```

# Default State

Let's now elaborate on the previous definitions and provide some default values to state interfaces. This approach mirrors Stimulus, with differences in naming convention. In this example, we'll specify a pre-defined set of `disableTabs` in the interface.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component({
  state: {
    startTab: 0,
    activeColor: 'green',
    activeTab: 2,
    disabledTabs: [4,5] // Tab indexes 4 and 5 will be disabled
  }
}) {

  /* Component Methods */

}
```
