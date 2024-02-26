---
title: 'SPX - Using TypeScript'
layout: base.liquid
permalink: '/usage/using-typescript/index.html'
prev:
  label: 'Options'
  uri: '/usage/options'
next:
  label: 'Methods'
  uri: '/methods/'
---

# Using TypeScript

SPX is written in TypeScript and provides thorough type coverage. Every definition is accompanied by detailed JSDoc annotations, providing in-depth descriptions, documentation reference links and code examples. Leveraging of SPX into TypeScript projects is straightforward.

---

#### SPX Namespace

All accessible types are exposed within the SPX namespace, granting easy access to all available definitions.

<!-- prettier-ignore -->
```ts
import type { SPX } from 'spx';


SPX.Class     // Abstract class of spx.Component
SPX.Connect   // The static component connect object
SPX.Types     // Component Type constructors applied to connect > state
SPX.State     // Component static connect > state
```

---

#### Component State

Components are designed to consistently extend the `spx.Component` subclass. In TypeScript projects, type parameters can be inferred by passing the static `connect` object of the class. This provision, will allow SPX to apply auto-types on the `this.state` reference.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.connect> {

  static connect {
    state: {
      foo: String,
      bar: Boolean,
      baz: Number,
      qux: {
        typeof: Object,
        default: {
          name: 'sissel'
        }
      }
    }
  }

  onInit () {
    this.state.foo  // => string
    this.state.bar  // => boolean
    this.state.baz  // => number
    this.state.qux  // => { name: string }
  }

}

```

---

#### Component Nodes

SPX cannot auto-type node occurrences, but does support index signatures using string literal formations, which results in type validation but not type completion. This is a limitation of TypeScript, and for developers who desire completions for nodes will need to manually type them on classes.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.connect> {

  static connect {
    nodes: [
      'button'
    ]
  }

  onInit () {
    this.buttonNode      // => HTMLButtonElement
    this.buttonNodes     // => HTMLButtonElement[]
    this.hasButtonNode   // => true or false
  }

  public buttonNode: HTMLButtonElement;
  public buttonNodes: HTMLButtonElement[];
  public hasButtonNode: boolean;

}

```
