---
title: 'Session'
layout: base.liquid
permalink: '/introduction/session/index.html'
prev:
  label: 'Key Concepts'
  uri: '/introduction/key-concepts/'
next:
  label: 'Recommendations'
  uri: '/introduction/recommendations'
---

# Session

An SPX session begins when the module has been connected (see [connection](/usage/connection)) and will persist until a full-page reload occurs on the module has been disconnected. An SPX "session" consists of varying data models, all of which are used to control rendering operations and tasks during navigation and page visits.

> The right sidebar represents the current SPX session taking place as you navigate the documentation. It provides a (partial) visual representation of the caching engine in real-time, and the varying models of a session.

#### Inspect Session

You can inspect the SPX session using the `spx.session()` method.

<!--prettier-ignore-->
```js
import spx from 'spx';

const session = spx.session();

session.pages;       // Per-page references and data
session.snaps;       // Snapshot raw HTML storage
session.components   // Component registry, instances and scopes
session.config;      // The connection configuration
session.observers;   // Observer connections
session.memory;      // The current memory usage
```

---

# Pages

The `pages` session store is an object type. The properties are path references and values are per-page rendering configuration options. The configuration model of each page record is used to determine how SPX should behave when a visit to that location is intercepted and carried out. The model is updated on a per-link basis and adheres to common structure that can controlled on `<a>` elements.

```ts
interface Page {
  data: unknown;
  uuid: string;
  session: string;
  visits: number;
  ts: number;
  key: string;
  rev: string;
  type: number;
  title: string;
  scrollX: number;
  scrollY: number;
  cache: boolean | string;
  target: string[];
  progress?: boolean | number;
  threshold?: number;
  hydrate?: string[];
  preserve?: string[];
  append: [string, string][];
  prepend: [string, string][];
  proximity: number;
  components: string[];
  events: string[];
  location: {
    origin: string;
    hostname: string;
    pathname: string;
    search: string;
    hash: string;
  };
}
```

# Snaps

# Components

```ts
interface Components {
  register: Map<string, Component>;
  connected: Set<HTMLElement>;
  scopes: Map<
    string,
    {
      instance: Component;
      key: string;
      instanceOf: string;
      fragment: string;
      domNode: HTMLElement;
      domState: any;
      events: {
        dom: HTMLElement[];
        ref: {
          [uuid: string]: Array<{
            uuid: string;
            eventName: string;
            node: number;
            method: string;
            binding: unknown;
            attached: boolean;
            isWindow: boolean;
          }>;
        };
      };
      nodes: {
        ref: { [nodeName: string]: string[] };
        map: { [uuid: string]: number };
        dom: HTMLElement[];
      };
    }
  >;
  refs: {
    [uuid: string]: string;
  };
}
```
