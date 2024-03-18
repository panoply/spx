---
title: 'Session'
layout: base.liquid
group: introduction
permalink: '/introduction/session/index.html'
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

<!-- prettier-ignore -->
```ts
import spx from 'spx';

const { page } = spx.session();

page.data;          // Data reference passed via spx-data attribute
page.snap;          // UUID Snapshot identifier property key
page.visits;        // The number of times this page was visited
page.ts;            // Timestamp of the last known visit to this page
page.key;           // The pathname reference, also used as the page id
page.rev;           // The previous page pathname name, used by History
page.visitType;     // An enum value describing the visit type
page.title;         // The page <title> value to apply
page.scrollX;       // Horizontal scroll offset position, typically 0
page.scrollY;       // Vertical scroll offset position of last visit
page.cache;         // The cache tactic to apply on the page, defaults to true
page.target;        // List of selectors provided via spx-target on links
page.progress;      // Progress loading bar options to apply provided via spx-progress
page.threshold;     // Threshold limit to apply on a prefetch such as spx-hover or spx-intersect
page.hydrate;       // List of selectors to apply spx hydration tactic upon
page.preserve;      // List of element selectors to preserve and exclude from morphs
page.proximity;     // Proximity prefetching bounding offset threshold
page.components;    // List of component instances this page contains
page.location;      // An object describing the the page URL route
```

# Snaps

# Components

<!-- prettier-ignore -->
```ts
import spx from 'spx';

const { components } = spx.session();


components.registry;       // Map storage type of components that were registered
components.instances;      // Map storage type of component instances established
components.connected;      // Set storage type of active instances UUID references
components.elements;       // Map storage type of all elements of interest in the DOM
components.references;     // Proxy which returns instance by element reference mark

```
