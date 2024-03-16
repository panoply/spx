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

# SPX Namespace

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

# Component State

Components will always extend the `spx.Component` subclass which can be used for auto-typing. In TypeScript projects, type parameters can be inferred by passing `typeof` on static `connect` object reference. This provision, will allow SPX to apply type completions and validations to the `this.state` reference.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.connect> {

  static connect {
    state: {
      foo: String,
      bar: Boolean,
      baz: Number,
      qux: Object,
      arr: Array
    }
  }

  onInit () {
    this.state.foo  // => string
    this.state.bar  // => boolean
    this.state.baz  // => number
    this.state.qux  // => object
    this.state.arr  // => any[]
  }
}
```

Type constructors can also accept inferred types and the provision will behave in accordance with the definition. This is helpful when using `Object` or `Array` typeof constructors in component state but SPX also extends support to literal unions for `String` typeof constructors.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.connect> {

  static connect {
    state: {
      foo: String<'a' | 'b' | 'c'>,
      bar: Object<{
        name: string
        age: number
      }>,
      baz: Array<{
        city: string
        country: string
      }>
    }
  }

  oninit () {
    this.state.foo  // => 'a' | 'b' | 'c' | string
    this.state.bar  // => { name: string, age: number }
    this.state.baz  // => { city: string, country: string; }[]
  }
}
```

---

# Component Nodes

SPX cannot auto-type node occurrences within components, but does support index signatures using string literal formations. Type validations will apply but not type completions. This is a limitation of TypeScript, so for developers who desire completions for nodes, you'll need to manually type them on classes.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.connect> {

  static connect {
    nodes: <nodes>[
      'button'
    ]
  }

  oninit () {
    this.buttonNode      // => HTMLButtonElement
    this.buttonNodes     // => HTMLButtonElement[]
    this.hasButtonNode   // => true or false
  }

  public buttonNode: HTMLButtonElement;
  public buttonNodes: HTMLButtonElement[];
  public hasButtonNode: boolean;

}
```

---

# Component Events

Event methods for components are inferred at the parameter level. SPX introduces a variety of event type utilities to address diverse cases and event types. In instances where events include `attrs` parameters, SPX automatically generates definitions, from the utilities which eliminates the need for conditional checks to determine availability, thereby seamlessly returning the expected interfaces.

<!-- prettier-ignore -->
```ts
import spx, { SPX } from 'spx';

export class Example extends spx.Component<typeof Example.connect> {


  onPress (event: SPX.Event<{ foo: string bar: boolean }, HTMLButtonElement> ) {

    event.attrs.foo  // string
    event.attrs.bar  // boolean

    event.target     // HTMLButtonElement

  }

  public buttonNode: HTMLButtonElement;
  public buttonNodes: HTMLButtonElement[];
  public hasButtonNode: boolean;

}
```
