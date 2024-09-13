---
permalink: '/usage/typescript/index.html'
layout: base.liquid
title: 'Using TypeScript'
anchors:
  - TypeScript
  - SPX Namespace
  - Component State
  - Type Constructors
  - Component Nodes
  - Component Events
  - Event Utilities
---

# TypeScript

SPX is developed in TypeScript, ensuring comprehensive type safety and coverage. Every component and utility in SPX comes with extensive JSDoc annotations that include detailed descriptions, references to relevant documentation, and practical code examples. This makes integrating SPX into TypeScript projects seamless and enhances developer productivity with clear, type-safe interfaces.

> SPX thrives within a TypeScript environment, fully leveraging TypeScript's IntelliSense capabilities for enhanced developer experience. The framework is designed to integrate smoothly into TypeScript projects, encouraging developers to utilize SPX for its robust type system.

---

# SPX Namespace

The `SPX` namespace export provides a range of accessible types, encompassing both utility types and interface structures. This module, being extensively typed, ensures that its exports are comprehensive enough to handle most use cases within your TypeScript projects.

<!-- prettier-ignore -->
```ts
import type { SPX } from 'spx';

SPX.Page          // Interface of an SPX Page model
SPX.Options       // Interface of the SPX Connection options
SPX.Class         // Abstract class of spx.Component
SPX.Define        // The static component define object
SPX.Event<T>      // Type inferred Event parameter utility
```

# Component State

Components in SPX **always** extend the `spx.Component` subclass, which supports auto-typing. In TypeScript environments, you can leverage type inference passing the static define object reference, by asserting a `typeof` prefix. This technique enables SPX to provide type completions and validations for `{js} this.state`.

> For developers employing the ESLint rule [no-use-before-define](https://eslint.org/docs/latest/rules/no-use-before-define), you might need to disable or adjust this rule within components that use the `spx.Component<T>` subclass, as the `typeof` reference can trigger this linting error.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define {
    state: {
      foo: String,
      bar: Boolean,
      baz: Number,
      qux: Object,
      arr: Array
    }
  }

  connect () {
    this.state.foo  // => string
    this.state.bar  // => boolean
    this.state.baz  // => number
    this.state.qux  // => object
    this.state.arr  // => any[]
  }
}
```

# Type Constructors

Type constructors can also accept inferred types, and the provision will behave in accordance with the definition passed. Applying _typed_ (Type) constructors is highly desirable when using `Object` or `Array` constructors in component state. Additionally, SPX extends support to literal unions for `String` type constructors which will resolve to `Record<T>` ensuring that known types of the string are shown as completions while unknown strings being error tolerant.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define {
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

  connect () {
    this.state.foo  // => 'a' | 'b' | 'c' | string
    this.state.bar  // => { name: string, age: number }
    this.state.baz  // => [ { city: string, country: string; } ]
  }
}
```

# Component Nodes

SPX provides robust support for HTMLElement typing for all `nodes[]` defined within the static `define` configuration object. These nodes become available through the `{js} this.dom` object, offering a direct interface to manipulate DOM elements within your component. SPX intelligently interprets the node identifiers to determine the appropriate element tag types. This means that by simply naming your nodes with a tag prefix (e.g., `button`, `div`, `input`), SPX can automatically infer and apply the correct typing for these elements. This feature significantly enhances developer productivity by reducing manual type annotations and ensuring type safety throughout your component interactions.

> The `<const>` prefix type annotation is **mandatory** when defining `nodes`. Omitting this annotation will prevent SPX from applying the specific DOM Node element typing, potentially leading to type errors or loss of IntelliSense support in your IDE.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define {
    nodes: <const>[
      'buttonFoo',
      'inputDemo',
      'example'
    ]
  }

  connect () {

    this.dom.buttonFooNode      // => HTMLButtonElement
    this.dom.buttonFooNodes     // => HTMLButtonElement[]
    this.dom.hasButtonFoo       // => true or false
    this.dom.inputDemoNode      // => HTMLInputElement
    this.dom.inputDemoNodes     // => HTMLInputElement[]
    this.dom.hasInputDemo       // => true or false
    this.dom.exampleNode        // => HTMLElement
    this.dom.exampleNodes       // => HTMLElement[]
    this.dom.hasExample         // => true or false

  }
}
```

# Component Events

Event methods for components are inferred at the parameter level. SPX provides a subset of event type utilities to address most cases and event types. Events which pass [State Directives](/components/events) will include an `attrs` parameter and SPX will automatically generates definitions from the utilities, eliminating the need for conditional checks to determine availability. Using these inferred event types ensures that the expected interfaces are returned consistently.

<!-- prettier-ignore -->
```ts
import spx, { SPX } from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define {
    nodes: <const>['button']
  }

  // We can pass attrs as first parameter and Element type second
  //
  onPress (event: SPX.Event<{ foo: string bar: boolean }, HTMLButtonElement> ) {
    event.attrs.foo  // string
    event.attrs.bar  // boolean
    event.target     // HTMLButtonElement
  }

  // We can optionally pass Element type are first parameter is no attrs
  //
  onClick(event: SPX.Event<HTMLAnchorElement>) {
    event.target     // HTMLAnchorElement
  }

  // We can take advantage of the Event type utilities which automate handling
  //
  onInput(event: SPX.InputEvent<{ baz: number }>) {
    event.attrs.baz  // number
    event.target     // HTMLInputElement
  }

}
```

# Event Utilities

The `SPX.Event` type utilities merge with TypeScripts official DOMEvent declarations and will act in accordance with arguments provided. You can omit arguments in cases where an event callback does not include `attrs` and the inferred values will behave correctly. SPX provides the below list of event utilities:

```ts
import type { SPX } from 'spx';

SPX.Event<T>;
SPX.InputEvent<T>;
SPX.KeyboardEvent<T>;
SPX.TouchEvent<T>;
SPX.PointerEvent<T>;
SPX.DragEvent<T>;
SPX.FocusEvent<T>;
SPX.MouseEvent<T>;
SPX.AnimationEvent<T>;
SPX.WheelEvent<T>;
SPX.SubmitEvent<T>;
SPX.ToggleEvent<T>;
SPX.FormDataEvent<T>;
```
