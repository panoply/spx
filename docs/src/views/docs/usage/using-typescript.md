---
permalink: '/usage/using-typescript/index.html'
layout: base.liquid
title: 'Using TypeScript'
---

# Using TypeScript

SPX is written in TypeScript and provides thorough type coverage. Each definition is accompanied by detailed JSDoc annotations, providing in-depth descriptions, documentation reference links and code examples. Incorporating SPX into TypeScript projects is straightforward.

> It is important that developers keep in mind that there are some very minor limitations with TypeScript itself which limit the auto-typing features that SPX is able to provide, namely [Component Nodes](#component-nodes) completions.

---

# SPX Namespace

Accessible types are provided within the `SPX` namespace export. The exposed types are a combination of utilities and interface structures. The module itself is extensively typed, the available exports should cover most cases.

<!-- prettier-ignore -->
```ts
import type { SPX } from 'spx';

SPX.Page          // Interface of an SPX Page model
SPX.Options       // Interface of the SPX Connection options
SPX.Class         // Abstract class of spx.Component
SPX.Define        // The static component define object
SPX.Event<T>      // Type inferred Event parameter utility
```

---

# Component State

Components will always extend the `spx.Component` subclass, which can be utilized for auto-typing. In TypeScript projects, type parameters can be inferred by passing `typeof` on the static `connect` object reference. This provision allows SPX to apply type completions and validations to the `this.state` reference.

> **TIP** Developers using the ESLint rule [no-use-before-define](https://eslint.org/docs/latest/rules/no-use-before-define) will need to either disable or turn it off in components when using the `spx.Component<T>` subclass due the `typeof` reference.

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

Type constructors can also accept inferred types, and the provision will behave in accordance with the definition passed. Applying _typed_ (Type) constructors is highly desirable when using `Object` or `Array` constructors in component state. Additionally, SPX extends support to literal unions for `String` type constructors which will resolve to `Record<T>` ensuring that known types of the
string are shown as completions while unknown strings being error tolerant.

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

---

# Component Nodes

SPX cannot automatically type node occurrences within components, but it does support index signatures using string literal formations. While type validations will apply, type completions will not. This limitation stems from TypeScript itself. Therefore, developers who desire completions for nodes will need to manually type them on classes.

> The `<const>` prefix type annotation provided to `nodes` are used for the index signatures and can be omitted if you are manually typing nodes for type completions.

<!-- prettier-ignore -->
```ts
import spx from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define {
    nodes: <const>['button']
  }

  connect () {
    this.buttonNode      // => HTMLButtonElement
    this.buttonNodes     // => HTMLButtonElement[]
    this.hasButtonNode   // => true or false
  }

  // Explicitly pass the following for completion support

  public buttonNode: HTMLButtonElement;
  public buttonNodes: HTMLButtonElement[];
  public hasButtonNode: boolean;

}
```

_There are plans to bring completions support for nodes in [vscode-spx](https://github.com/panoply/vscode) in due time. Consider the explicit typing to be a temporary workaround until support is made available._

---

# Component Events

Event methods for components are inferred at the parameter level. SPX provides a subset of event type utilities to address most cases and event types. Events which pass [State Directives](/components/events) will include an `attrs` parameter and SPX will automatically generates definitions from the utilities, eliminating the need for conditional checks to determine availability. Using these inferred event types ensures that the expected interfaces are returned consistently.

<!-- prettier-ignore -->
```ts
import spx, { SPX } from 'spx';

export class Example extends spx.Component<typeof Example.define> {

  static define {
    nodes: <const>['button']
  }

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
