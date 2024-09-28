---
permalink: '/components/algorithm/index.html'
title: Components - Define
layout: base.liquid
anchors:
  - Definitions
  - Static Define
  - Lifecycle Hooks
  - Context Reference
  - Existence Checks
---

# Algorithm

The SPX Component algorithm (or pattern) works in a progressive and incremental manner. This explanation will delve into the internal execution logic that drives component handling within the SPX framework, offering a better understanding into how things operate beneath the surface. This is not-essential reading or anything general users of the framework are required to know, but more so for those curious of looking to contribute to the project.

# Execution Process

The SPX Component algorithm execution approach is not rigid and will adapt according to the method of invocation which is determined based on various factors. Despite variability, the algorithm's core operations will remain consistent with several fundamental processes being carried out. These processes might be executed with different emphases depending on the state of the application or their invocation point, but typically adhere to the following execution order:

1. Register Components
2. Construct Context
3. Establish Instance
4. Execute Hooks
5. Snapshot Alignment

The most performance-critical operations and incurred at runtime, wherein SPX will perform a full traversal of the DOM. Though this might sound extraneous, in most cases this task will conclude in milliseconds (depending on DOM Size). There step is essential for thoroughly understanding the document structure and operations during this phase are not exclusively component specific, but also involve session and cache related configurations.

> SPX optimizes performance by executing some operations outside the main event loop in a non-blocking manner, thus preventing excessive strain on the browser's rendering engine. During this phase, SPX undertakes several actions:

# Registering Components

Before the initialization of SPX, components are registered into a dedicated session data structure within `{js} spx.$.registry`, establishing a unique reference for each component. These registered components form the foundation upon which instances are subsequently created. However, prior to the actual establishment of an instance, the module engages in the critical process of acquiring context, marking the initiation of the core algorithm governing component creation.

Component registration is somewhat isolated in the overall algorithm and is mostly a pre-process operation. The [Register](/components/register/) documentation describes registration in greater detail, so refer to that page for more information.

# Construct Context

Context construction is an ongoing process that takes place during DOM traversal, executed at runtime. This process is active during morphs, which are state or structural changes in the DOM, as well as when mutations, such as modifications in content or attributes, are detected. The `ctx` model will hold reference to `Context` (store) which has the following structure:

> The `$` prefix is intentional and it signals to ESBuild that properties should be mangled, see [mangleProps](https://esbuild.github.io/api/#mangle-props) documentation.

<!--prettier-ignore-->
```ts
export interface Context {
  $aliases: {};
  $scopes: {};
  $morph: HTMLElement;
  $snapshot: HTMLElement;
  $element: string;
  $snaps: string;
}
```

<br>

The `Context` model serves as our primary interface, containing references to a variety of data types that are relevant based on the current execution state. Central to `Context` is the `$scopes` reference, which is pivotal. Crafting a `Scope` during context generation involves creating a detailed encapsulation of elements specific to each SPX component, ensuring that all necessary information for component interaction and state management is readily accessible. The entries of `$scopes` will be assigned to every single component instance we establish, and have the following structure:

<!--prettier-ignore-->
```ts
export interface Scope {
  dom: HTMLElement,
  alias: string;
  instanceOf: string;
  define: SPX.Define;
  snapshot: string;
  snap: number;
  key: string;
  ref: string;
  inFragment: boolean;
  status: Hooks;
  state: Record<string, string | number | object | any[] | boolean>;
  binds: { [stateKey: string]: Record<string, ComponentBinds> };
  events: Record<string, ComponentEvent>;
  nodes: Record<string, ComponentNodes>;
  hooks: {
    connect: HookStatus
    onmount: HookStatus
    unmount: HookStatus
    onmedia: HookStatus
  };
}
```

### Runtime

Runtime context happens upon SPX connection. This is a heavy operation and likely the most expensive in terms of performance bottlenecks (depending on the size of the DOM), however in most cases will conclude in less than 50ms. Runtime context works in a similar way as subsequent context, the difference being is that subsequent context is composed during morph operations, whereas runtime context is component using DOM traversal.

### Morph

Runtime context happens upon SPX connection. This is a heavy operation and likely the most expensive in terms of performance bottlenecks (depending on the size of the DOM), however in most cases will conclude in less than 50ms. Runtime context works in a similar way as subsequent context, the difference being is that subsequent context is composed during morph operations, whereas runtime context is component using DOM traversal.

### Mutation

### Immutability

Component instances are immutable and for every component occurrence, a new instance will be established, however once instances have been established, they will not re-establish. This is the intended design philosophy behind SPX component architecture and similar to the caching algorithm, component will behave in accordance with snapshot references.

### Subsequent

### data-spx
