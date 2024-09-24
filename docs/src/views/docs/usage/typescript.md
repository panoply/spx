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

SPX is written in TypeScript, which means it's designed with a strong emphasis on type safety from the ground up. This choice ensures that developers working with SPX benefit from TypeScript's static typing, with full support for IntelliSense in IDEs, auto-completions and real-time error checking. Every piece of SPX, from its core components to utility functions, is annotated with JSDoc comments that include detailed descriptions, references to relevant documentation, and practical code examples.

> SPX thrives within a TypeScript environment, its recommended that developers choose to leverage SPX within a TS Runtime.

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

# Component Auto-typing

In SPX, every component is derived from the `spx.Component` subclass, which facilitates auto-typing. Within TypeScript environments, this feature allows developers to utilize type inference. By applying the `typeof` prefix to the static `define` object, SPX can infer and enforce types upon the `{js} this.state` context, providing type completions and validations automatically.

> For developers employing the ESLint rule [no-use-before-define](https://eslint.org/docs/latest/rules/no-use-before-define), you might need to disable or adjust this rule within components that use the `spx.Component<T>` subclass, as the `typeof` reference can trigger this linting error.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define = {
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

# Customized Typing

There are scenarios where you might want to customize the auto-typing mechanism provided by SPX components. The `{js} spx.Component` class offers flexibility by allowing you to define custom interfaces for component state and specify different types of `HTMLElement` for DOM elements within your component.

<!-- prettier-ignore -->
```ts
interface IExample {
  /** Lorem Ipsum */
  text: string;
}

interface IElements {
  /** Open Button */
  toggle: HTMLButtonElement;
}

spx.Component<typeof Example.define, IExample, IElements> {

  static define = {
    state: {
      text: String
    }
  }

  connect () {
    this.state.text  // => string
    this.dom.toggle  // => HTMLButtonElement
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

# Component DOM

Component `dom[]` elements which are defined on the static `define` configuration object will default to using `HTMLElement`. These DOM identifier entires will be made available on the `{js} this.dom` object, offering a direct interface to manipulate elements within your component. SPX intelligently interprets the node identifiers to determine the appropriate element tag types. This means that DOM identifier names suffixed with an valid element name (e.g., `button`, `div`, `input`) will automatically infer and apply the element type.

> The `<const>` prefix type annotation is **mandatory** when defining `nodes`. Omitting this annotation will prevent SPX from applying the specific DOM Node element typing, potentially leading to type errors or loss of IntelliSense support in your IDE.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define {
    nodes: <const>[
      'fooButton',
      'demoInput',
      'example'
    ]
  }

  connect () {

    this.dom.fooButton         // => HTMLButtonElement
    this.dom.fooButton()       // => HTMLButtonElement[]
    this.dom.fooButtonExists   // => true or false
    this.dom.demoInput         // => HTMLInputElement
    this.dom.demoInput()       // => HTMLInputElement[]
    this.dom.demoInputExists   // => true or false
    this.dom.example           // => HTMLElement
    this.dom.example()         // => HTMLElement[]
    this.dom.exampleExists     // => true or false

  }
}
```

# Component Events

Event methods for components are inferred at the parameter level. SPX provides a subset of event type utilities to address most cases and event types. Events which pass [State Directives](/components/events/) will include an `attrs` parameter and SPX will automatically generates definitions from the utilities, eliminating the need for conditional checks to determine availability. Using these inferred event types ensures that the expected interfaces are returned consistently.

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
