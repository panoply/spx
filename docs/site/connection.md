---
title: 'Usage'
permalink: '/connection/index.html'
layout: base.liquid
order: 2
sidebar:
  - 'Pre-Requisites'
  - 'Connection'
  - 'Options'
  - 'Instance'
  - 'DOM Targets'
  - 'Resource Evaluation'
---

# Usage

An SPX connection is how the module is initialized. SPX takes control of your SSR navigation and by default it will swap out the entire `<body></body>`{:.language-html} fragment upon each navigation but you should define a set of `targets[]` whose inner contents change on a per-page basis. In addition to targeted replacements, one should consider leveraging the pre-fetching capabilities to ensure the most optimal performance.

> The typings provided in this package will describe each option in good detail, below are the defaults. Settings are optional.

```js
import spx from 'spx';

spx.connect({
  targets: ['body'],
  timeout: 30000,
  schema: 'spx',
  cache: true,
  limit: 100,
  preload: null,
  async: true,
  annotate: false,
  hover: {
    trigger: 'attribute',
    threshold: 250
  },
  intersect: {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  },
  proximity: {
    distance: 75,
    threshold: 250,
    throttle: 500
  },
  progress: {
    background: '#111',
    height: '3px',
    minimum: 0.09,
    easing: 'linear',
    speed: 300,
    trickle: true,
    threshold: 500,
    trickleSpeed: 300
  }
});
```

# Connected

SPX is initialized using the `spx.connect();` method. This method returns a curried (functional) callback which is triggered once. This is the equivalent of the `DOMContentLoaded` event. Upon connection, SPX will save the outer HTML of current document to the snapshot cache using `document.documentElement.outerHTML`. All additional snapshots are saved after an XHR request completes.

<!-- prettier-ignore -->
```js
import spx from 'spx'

spx.connect({ /* options */ })(function(session) {

  // The connect returns a callback function after
  // connection was established. Lets inspect the session:
  console.log(session);

  // You initialize third party js in this callback
  // It's the equivalent of DOMContentLoaded.

});

// You can alternatively establish an instance callback
// using a curried variable assignment
const connect = spx.connect({ /* options */ })

// Later on...
connect(function(session) {})
```

# Options

#### `targets`

Define page fragment targets which are expected to change on a per-page basis. By default, SPX will replace the entire `<body>` fragment but it is best to define specific fragments.

**Type:** `string[]` <br>
**Default:** `['body']` <br>

#### `schema`

By default, attribute identifiers use a `-spx-` identifier. You can use a custom attribute identifier or if you wish to opt-out of an identifier you can pass `null` so annotations can be expressed using `data-` only.

**Type:** `string` <br>
**Default:** `spx` <br>

#### `timeout`

Request polling limit is used when a request is already in transit. Request completion is checked every 10ms, by default this is set to `30000` which means requests will wait `30s` before being a new request is triggered.

#### `poll`

Request polling limit is used when a request is already in transit. Request completion is checked every 10ms, by default this is set to `1000` which means requests will wait `1s` before being a new request is triggered.

**Type:** `number` <br>
**Default:** `1000` <br>

#### `async`

Determine if page requests should be fetched asynchronously or synchronously. Setting this to `false` is not recommended.

**Type:** `boolean` <br>
**Default:** `true` <br>

#### `cache`

Enable or Disable caching. Each page visit request is cached and used in subsequent visits to the same location. Setting this to `false` is discourage as all visits will be fetched over the network and `data-spx-cache` attribute configs will be ignored.

> If `cache` is disabled then prefetches will be dispatched using HTML5 `<link>` prefetches, else when cache is enabled it uses XHR.

**Type:** `boolean` <br>
**Default:** `true` <br>

#### `persist` _Coming Soon_

The `persist` option can be used to restore cache into memory after a browser refresh has been triggered. When persisting cache a reference is maintained in session storage.

**Type:** `boolean` <br>
**Default:** `false` <br>

#### `limit`

Cache size limit. This pjax variation limits cache size to `50mb`and once it exceeds that limit, records will be removed starting from the earliest point of known cache entries.

**Type:** `number` <br>
**Default:** `50` <br>

#### `hover`

Hover pre-fetching. You can disable hover pre-fetching by setting this to `false` which will prevent observers from executing and any `data-spx-hover` attributes will be ignored. To use the default configurations you can set this to `true` or simply omit it.

**Type:** `boolean` or `object` <br>
**Default:** `{ trigger: 'attribute', threshold: 250 }` <br>

#### `hover.trigger`

How hover prefetches should be triggered. By default this option is set to trigger only when `<a>` href link elements are attributed with a `data-spx-hover` attribute. You can instruct pjax to execute pre-fetching on all `<a>` elements by setting this option to `href`. If you set the trigger to `href` you can annotate links you wish to exclude from prefetch with `data-spx-hover="false"`.

**Type:** `string` <br>
**Accepts:** `attribute` or `href` <br>
**Default:** `attribute` <br>

#### `hover.threshold`

Controls the fetch delay threshold. Requests will fire only when the mouse is both within range and the threshold time limit defined here has exceeded.

**Type:** `number` <br>
**Default:** `250` <br>

#### `proximity`

Proximity pre-fetching allow for requests to be dispatched when the cursor is within a proximity range of a href link element. Coupling proximity with mouseover prefetches enable predicative fetching to occur, so a request will trigger before any interaction with a link element happens. To use default behavior, set this to `true` and all `<a>` annotated with a `data-spx-proximity` attribute will be pre-fetched.

> Annotate any `<a>` links you wish to exclude from pre-fetching using the `data-spx-proximity="false"`

**Type:** `boolean` or `object` <br>
**Default:** `{ distance: 75, throttle: 500, threshold: 250 }` <br>

#### `proximity.distance`

The distance range the mouse should be within before the prefetch is triggered. You can optionally override this by assigning a number value to the proximity attribute. An href element using `data-spx-proximity="50"` would inform Pjax to begin fetching when the mouse is within `50px` of the element.

**Type:** `number` <br>
**Default:** `75` <br>

#### `proximity.throttle`

Controls the fetch delay threshold. Requests will fire only when the mouse is both within range and the threshold time limit defined here has exceeded.

**Type:** `number` <br>
**Default:** `250` <br>

#### `proximity.threshold`

Controls the fetch delay threshold. Requests will fire only when the mouse has exceeded the range and the threshold time limit defined here has been exceeded.

**Type:** `number` <br>
**Default:** `250` <br>

#### `intersect`

Intersection pre-fetching. Intersect pre-fetching leverages the [Intersection Observer](https://shorturl.at/drLW9) API to fire requests when elements become visible in viewport. You can disable intersect pre-fetching by setting this to `false`, otherwise you can customize the intersect fetching behavior. To use default behavior, set this to `true` and all elements annotated with with a `data-spx-intersect` or `data-spx-intersect="true"` attribute will be pre-fetched. You can annotate elements that contain href links or `<a>` elements directly.

> Annotate any `<a>` links you wish to exclude from intersection pre-fetching using the `data-spx-intersect="false"`

**Type:** `boolean` or `object` <br>
**Default:** `{ rootMargin: '0px 0px 0px 0px', throttle: 0 }` <br>

#### `intersect.rootMargin`

An offset rectangle applied to the root's href bounding box. The option is passed to the Intersection Observer.

**Type:** `string` <br>
**Default:** `0px 0px 0px 0px` <br>

#### `intersect.threshold`

Throttle limit passed to the intersection observer instance.

**Type:** `number` <br>
**Default:** `500` <br>
