# @brixtol/pjax

A blazing fast, lightweight (8kb gzipped) and feature full new generation pjax solution. This pjax variation supports advanced pre-fetching capabilities, multiple fragment replacements and employs a snapshot caching engine that prevents subsequent requests from occurring.

### Features

- Simple and painless integration.
- Pre-fetching capabilities using hover, intersect and proximity triggers.
- Snapshot caching engine and per-page state control.
- Powerful pub/sub event driven lifecycle triggers.
- Provides a client side DOM hydration approach.
- Supports targeted append and prepend fragment replacements.
- Handles inlined and external script evaluation (asynchronously).
- Couples perfectly with [stimulus.js](https://stimulusjs.org/).
- Attribute driven programmatic control.

### Demo

We are using this module live on our [webshop](https://brixtoltextiles.com).

### Why?

The landscape of pjax based solution has become rather scarce. The current bread winners tend to offer the same thing or for our use case were either over or under engineered. This pjax variation couples together various techniques found to be the most effective in enhancing the performance of SSR rendered web application that fetch pages over the wire.

# Table of Contents

1. [Install](#install)
2. [Recommendations](#recommendations)
3. [Usage](#usage)
4. [Options](#options)
5. [Real World](#real-world)
6. [Lifecycle Events](#lifecycle-events)
7. [Methods](#methods)
8. [Attributes](#attributes)
9. [State](#state)
10. [How it works](#how-it-works)
11. [Contributing](#contributing)
12. [Acknowledgements](#acknowledgements)

# Install

This module is distributed as ESM and designed to work in the browser environment.

### pnpm

```cli
pnpm add @brixtol/pjax
```

_Because [pnpm](https://pnpm.js.org/en/cli/install) is dope and does dope shit._

### Yarn

```cli
yarn add @brixtol/pjax
```

_Stop using Yarn, it sucks. Choose [pnpm](https://pnpm.js.org/en/cli/install) and emancipate yourself._

### npm

```cli
npm i @brixtol/pjax
```

_Okay, Boomer..._

### cdn

```
https://unpkg.com/@brixtol/pjax
```

_Be as you are.._

# Recommendations

In order to get the most out of this module below are a few recommendations developers should consider when leveraging it within in their projects. The project was developed for our use cases and while it can be appropriated into other projects there are still a couple of minor features and/or capabilities that need work, so please bare that in mind.

### Scripts

JavaScript evaluation between navigations is supported when contained `<script>` elements are contained within the document `<head>` but this highly discouraged. Avoid inline/external JavaScript and instead leverage dynamic imports (`import('.')`) within your bundle, similar to SPA architecture.

### Styles

Stylesheet and inline CSS evaluation between navigations is not yet supported. This means you need to load CSS files at runtime and any `<style>` and `<link rel="stylesheet>` elements which exist thereafter will be ignored, unless contained within targets elements. This is something we will support post-beta.

### Pre-fetching

The pre-fetching capabilities this Pjax variation provides can drastically improve the speed of rendering. When used correctly pages will load instantaneously between navigations. By default, the pre-fetching features are opt-in and require attribute annotation but you can customize how, where and when pjax should execute a pre-fetch.

### Stimulus

This module was developed as a replacement for [turbo](https://github.com/hotwired/turbo) so leveraging it together with [stimulus.js](https://stimulusjs.org/) is the preferred usage. Stimulus is a very simple framework and when working with SSR projects it helps alleviate the complications developers tend to face. The reason one would choose this project over Turbo comes down to performance as this module is much faster and smaller than turbo, it's also not riddled with class OOP design patterns, just functions bae,fFunctions, functions functions.

### Minification

By default, all fetched pages are stored in memory so for every request the HTML dom string response is saved to cache. The smaller your HTML pages the more performant the rendering engine will be. In addition to minification it is generally good practice to consider using semantic HTML5 as much as possible this will help negate the amount of markup pages require.

### JavaScript

The best possible approach is to initialize JavaScript like Google Analytics and scripts which require per-page execution is to use the `pjax.on('load', function(){})` method event. This way you can be sure it will load between navigations.

# Usage

To initialize, call `pjax.connect()` in your bundle preferably before anything else is loaded. By default, the entire `<body>` fragment is replaced upon each navigation. You should define a set of `targets[]` whose inner contents change on a per-page basis for optimal performance and consider leveraging the pre-fetching capabilities.

> The typings provided in this package will describe each option in good detail, below are the defaults and all options are optional.

```js
import * as pjax from '@brixtol/pjax';

pjax.connect({
  targets: ['body'],
  schema: 'pjax',
  timeout: 30000,
  poll: 15,
  async: true,
  cache: true,
  reverse: true,
  persist: false,
  limit: 50,
  preload: null,
  hover: {
    trigger: 'attribute',
    threshold: 250
  },
  intersect: {
    rootMargin: '',
    threshold: 0
  },
  proximity: {
    distance: 85,
    throttle: 500,
    threshold: 250
  },
  progress: {
    minimum: 0.08,
    easing: 'linear',
    speed: 200,
    trickle: true,
    threshold: 500,
    trickleSpeed: 200
  }
});
```

# Options

#### `targets`

Define page fragment targets which are expected to change on a per-page basis. By default, this pjax module will replace the entire `<body>` fragment. It's best to define specific fragments.

**Type:** `string[]` <br>
**Default:** `['body']` <br>

#### `schema`

By default, attribute identifiers use a `-pjax-` identifier. You can use a custom attribute identifier.

**Type:** `string` <br>
**Default:** `pjax` <br>

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

Enable or Disable caching. Each page visit request is cached and used in subsequent visits to the same location. Setting this to `false` is discourage as all visits will be fetched over the network and `data-pjax-cache` attribute configs will be ignored.

> If `cache` is disabled then prefetches will be dispatched using HTML5 `<link>` prefetches, else when cache is enabled it uses XHR.

**Type:** `boolean` <br>
**Default:** `true` <br>

#### `persist`

**NOT YET AVAILABLE**

The `persist` option can be used to restore cache into memory after a browser refresh has been triggered. When persisting cache a reference is maintained in session storage.

**Type:** `boolean` <br>
**Default:** `false` <br>

#### `reverse`

Reverse caching. This will execute a pre-emptive fetch of the previous pages in the history stack when no snapshot exists in cache. Snapshots cache is purged when browser refresh occurs (unless `persist` is enabled) so when navigating backwards or pages will need to be re-fetched and this results in minor delays due to the refresh which was triggered.

**Type:** `boolean` <br>
**Default:** `true` <br>

#### `limit`

Cache size limit. This pjax variation limits cache size to `50mb`and once it exceeds that limit, records will be removed starting from the earliest point of known cache entries.

**Type:** `number` <br>
**Default:** `50` <br>

#### `hover`

Hover pre-fetching. You can disable hover pre-fetching by setting this to `false` which will prevent observers from executing and any `data-pjax-hover` attributes will be ignored. To use the default configurations you can set this to `true` or simply omit it.

**Type:** `boolean` or `object` <br>
**Default:** `{ trigger: 'attribute', threshold: 250 }` <br>

#### `hover.trigger`

How hover prefetches should be triggered. By default this option is set to trigger only when `<a>` href link elements are attributed with a `data-pjax-hover` attribute. You can instruct pjax to execute pre-fetching on all `<a>` elements by setting this option to `href`. If you set the trigger to `href` you can annotate links you wish to exclude from prefetch with `data-pjax-hover="false"`.

**Type:** `string` <br>
**Accepts:** `attribute` or `href` <br>
**Default:** `attribute` <br>

#### `hover.threshold`

Controls the fetch delay threshold. Requests will fire only when the mouse is both within range and the threshold time limit defined here has exceeded.

**Type:** `number` <br>
**Default:** `250` <br>

#### `proximity`

Proximity pre-fetching allow for requests to be dispatched when the cursor is within a proximity range of a href link element. Coupling proximity with mouseover prefetches enable predicative fetching to occur, so a request will trigger before any interaction with a link element happens. To use default behavior, set this to `true` and all `<a>` annotated with a `data-pjax-proximity` attribute will be pre-fetched.

> Annotate any `<a>` links you wish to exclude from pre-fetching using the `data-pjax-proximity="false"`

**Type:** `boolean` or `object` <br>
**Default:** `{ distance: 75, throttle: 500, threshold: 250 }` <br>

#### `proximity.distance`

The distance range the mouse should be within before the prefetch is triggered. You can optionally override this by assigning a number value to the proximity attribute. An href element using `data-pjax-proximity="50"` would inform Pjax to begin fetching when the mouse is within `50px` of the element.

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

Intersection pre-fetching. Intersect pre-fetching leverages the [Intersection Observer](https://shorturl.at/drLW9) API to fire requests when elements become visible in viewport. You can disable intersect pre-fetching by setting this to `false`, otherwise you can customize the intersect fetching behavior. To use default behavior, set this to `true` and all elements annotated with with a `data-pjax-intersect` or `data-pjax-intersect="true"` attribute will be pre-fetched. You can annotate elements that contain href links or `<a>` elements directly.

> Annotate any `<a>` links you wish to exclude from intersection pre-fetching using the `data-pjax-intersect="false"`

**Type:** `boolean` or `object` <br>
**Default:** `{ rootMargin: '0px 0px 0px 0px', throttle: 0 }` <br>

#### `intersect.rootMargin`

An offset rectangle applied to the root's href bounding box. The option is passed to the Intersection Observer.

**Type:** `string` <br>
**Default:** `0px 0px 0px 0px` <br>

#### `intersect.throttle`

Throttle limit passed to the intersection observer instance.

**Type:** `number` <br>
**Default:** `500` <br>

# Real World

Below is a real world example you can use to better understand how this module works and how it can be applied to your web application. We are working on providing a live demonstration for more advanced use cases but the below example should give you a good understanding of how to leverage this module.

<details>
<summary>
<strong>Example</strong>
</summary>

The first thing we want to do is make a connection with Pjax. In your JavaScript bundle we need to initialize it (connect). Our example web application has 3 pages, the **home** page, **about** page and **contact** page. We are going to instruct pjax to replace the `<nav>` and `<main>` fragments on every visit and then we are going to leverage `data-pjax` attributes to replace an additional fragment when we navigate to the contact page.

### JavaScript Bundle

<!-- prettier-ignore -->
```javascript
import * as pjax from "@brixtol/pjax";


pjax.connect({
  targets: [
    "nav",
    "main"
  ]
});


```

### Home Page

Below we have a very basic Home Page with pjax wired up. All `<a>` elements will be intercepted and cached as per the default configuration. SSR web applications (in most cases) will only ever have a couple of fragments that change between navigation.

<!-- prettier-ignore -->
```html

<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Home Page</title>
    <script src="/bundle.js"></script>
  </head>
  <body>

    <header>

      <h1>@brixtol/pjax</h1>

      <!-- THIS FRAGMENT WILL BE REPLACED -->
      <nav>

        <!-- This link will be intercepted -->
        <a
         href="/home"
         class="active">Home</a>

        <!-- These links will be pe-fetched on hover -->
        <a
         href="/about"
         data-pjax-hover>About</a>

        <!-- This link will replace the #foo fragment -->
        <a
         href="/contact"
         data-pjax-replace="(['#foo'])">Contact</a>
      </nav>

    </header>

    <!-- THIS FRAGMENT WILL BE REPLACED -->
    <main>

      <h1>Welcome to the home page</h1>

      <div class="container">
        Brixtol Textiles is a Swedish apparel brand!
      </div>

    </main>

    <div id="foo">
      This fragment will not be touched until /contact is clicked
    </div>

    <footer>
      This fragment will not be touched during navigations as it's not
      defined within targets.
    </footer>

  </body>
</html>

```

### About Page

<br>

The about page in our web application would look practically identical to the home page. We instructed pjax to pre-fetch this page upon hover by annotating the `<a>` href link with `data-pjax-hover` attribute. This attribute informs pjax to being fetching the page the moment the user hovers over the `<a>` link which results in the visit being instantaneous. The **about** page only has some minor differences, but for the sake of clarity, lets have look:

<!-- prettier-ignore -->
```html

<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>About Page</title>
    <script src="/bundle.js"></script>
  </head>
  <body>

    <header>

      <h1>@brixtol/pjax</h1>

      <!-- THIS FRAGMENT WILL BE REPLACED -->
      <nav>

        <!-- This link will be intercepted -->
        <a
         href="/home">Home</a>

        <!-- These links will be pe-fetched on hover -->
        <a
         href="/about"
         class="active"
         data-pjax-hover>About</a>

        <!-- This link will replace the #foo fragment -->
        <a
         href="/contact"
         data-pjax-replace="(['#foo'])">Contact</a>
      </nav>

    </header>

    <!-- THIS FRAGMENT WILL BE REPLACED -->
    <main>

      <h1>Welcome to the About Page</h1>

      <div class="container">
        Brixtol Textiles makes jackets out of recycled PET bottles.
        <p>Producing clothing in a sustainable way is the future!</p>
      </div>

    </main>

    <div id="foo">
      This fragment will not be touched until /contact is clicked
    </div>

    <footer>
      This fragment will not be touched during navigations as it's not
      defined within targets.
    </footer>

  </body>
</html>
```

### Contact Page

The contact page will replace an additional fragment with the id value of `foo` which we informed upon via attribute annotation. Upon visiting this page the `<nav>`, `<main>` and `<div id="foo">` fragments will be replaced.

<!-- prettier-ignore -->
```html

<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Contact Page</title>
    <script src="/bundle.js"></script>
  </head>
  <body>

    <header>

      <h1>@brixtol/pjax</h1>

      <!-- THIS FRAGMENT WILL BE REPLACED -->
      <nav>

        <!-- This link will be intercepted -->
        <a
         href="/home">Home</a>

        <!-- These links will be pe-fetched on hover -->
        <a
         href="/about"
         class="active"
         data-pjax-hover>About</a>

        <!-- This link will replace the #foo fragment -->
        <a
         href="/contact"
         data-pjax-replace="(['#foo'])">Contact</a>
      </nav>

    </header>

    <!-- THIS FRAGMENT WILL BE REPLACED -->
    <main>

      <h1>Welcome to the Contact Page</h1>

      <div class="container">
        This is contact page of our example! The below fragment was replaced too!
      </div>

    </main>

    <!-- THIS FRAGMENT WAS REPLACE VIA ATTRIBUTE INSTRUCTION -->
    <div id="foo">
      This fragment was replaced!
    </div>

    <footer>
      This fragment will not be touched during navigations as it's not
      defined within targets.
    </footer>

  </body>
</html>
```

</details>

# Session

A pjax navigation sessions will begin immediately after a connection was initialized via `pjax.connect()` and ends when a browser refresh is executed or url origin changes occurs. You can access, view or modify the session store using the `pjax.session()` method.

> The `pjax.session()` method references a subset of null prototypical objects.

<details>
<summary>
<strong>Model</strong>
</summary>

```typescript
interface ISession {
  options: IOptions;
  schema: object;
  tracked: Set<string>;
  pages: {
    [key: string]: IPage;
  };
  timers: {
    [key: string]: number;
  };
  requests: {
    [key: string]: XMLHttpRequest;
  };
  snapshots: {
    [uuid: string]: string;;
  };
  observers: {
    history: boolean;
    hover: boolean;
    hrefs: boolean;
    intersect: boolean;
    proximity: boolean;
    scroll: boolean;
  };
}
```

#### `options`

The merged default and custom configuration [options](#options) provided on connection via `pjax.connect()`.

#### `observers`

The connected observers being used in the session.

#### `schema`

A **readonly** reference object list of selectors used by the module for internal operations.

#### `pages`

A **readonly** key > value store of pages visited. The object properties (keys) in this store use a pathname + parameter combinator sequence which map to page states. See [state](#state) for more information.

#### `snapshots`

A **readonly** key > value store of snapshots. Snapshots hold the DOM string responses of visited pages. The object properties (keys) in this store use the `UUID` values in page [state](#states). S

#### `tracked`

A **readonly** `Set` of tracked nodes that have been rendered to the document.

</details>

# State

State represents per-page configuration. This store is immutable and created for every unique url `/path` or `/pathname?query=param` location that has been encountered throughout the session. The state of each page is stored in memory and also written to the browsers history stack so it can be retrieved in subsequent visits.

State modifications can be carried out using attributes, methods or from within lifecycle events that support it. When using the `Pjax.visit()` method you can apply state modification in the `options` parameter and changes will be merged before a visit begins. You should avoid modifying state outside of the available methods, treat state as **read only** and architect your application to prevent direct augmentation.

> State saved to history stack is stored with the `config` object omitted.

<details>
<summary>
<strong>Model</strong>
</summary>

```typescript
interface IPage {
  uuid: string;
  key: string;
  rev: string;
  title: string;
  type: number;
  position: {
    y: number;
    x: number;
  };
  location: {
    origin: string;
    hostname: string;
    pathname: string;
    search?: string;
    hash?: string;
  };
  config: {
    cache: boolean | number;
    history: boolean | string;
    threshold?: number;
    proximity?: number;
    hydrate?: string[];
    replace?: string[];
    append?: [from: string, to: string][];
    prepend?: [from: string, to: string][];
  };
}
```

#### `uuid`

A UUID reference to the page snapshot HTML Document element.

#### `key`

A URL pathname + parameter combination key reference (this value excludes `#hashes`).

#### `rev`

A previous pathname + parameter combination key reference, ie: the previous page

#### `title`

The document title, ie: the text content contained in `<title></title>` tags.

#### `type`

An enumerable number reference that informs upon how this store was created.

#### `position{}`

Scroll position of the next navigation. The `y` - Equivalent to `scrollTop` and the `x` is equivalent to `scrollLeft`.

#### `location{}`

Parsed location reference of the page. The `origin` is the domain value of `window.location.origin`, the `hostname` value will is the domain name with protocol and _www_ omitted (`https://www.brixtol.com` > `brixtol.com`). If the page does not contain search parameters or hashes then these options are omitted from the object.

#### `config{}`

Configuration model. This values defined here are applied on a per-page basis and will reflect the visits render options. These settings merge the connection defaults and attribute annotations (if defined) to instruct pjax on how to perform its rendering and cache operation.

</details>

# Lifecycle Events

Lifecycle events are dispatched to the document upon each navigation. You can access contextual information in the parameters. You can also cancel events with `preventDefault()` or by returning boolean `false` if you wish to prevent execution from occurring in a certain lifecycle.

The Pjax lifecycle events are dispatched in the following order of execution:

1. **connected** _executed once_
2. **prefetch**
3. **visit**
4. **fetch** - _skipped if cache exists_
5. **store**
6. **route** - _route events will trigger at this point_
7. **render**
8. **load**

### Events

<!-- prettier-ignore -->
```typescript
import * as pjax from '@brixtol/pjax'

// Triggered once after pjax initialization
pjax.on('connected', (state?: IPage, session?: ISession) => void)

// Triggered when a prefetch is triggered
pjax.on('prefetch', (trigger?: Element, location?: ILocation) => void | false): PrefetchEvent

// Triggered when a mousedown event occurs on a link
pjax.on('visit', (event?: Event) => void | false): VisitEvent

// Before a request begins and after a href element was parsed
pjax.on('fetch', (state?: IState) => void | false): FetchEvent

// Triggered before a page and snapshot is saved to memory
pjax.on('store', (state?: IState, dom?: Document) => void | false | Document): StoreEvent

// Triggered on before a hydration replacement occurs
pjax.on('hydrate', (target?: Element, newTarget?: Element) => void | false): HydrateEvent

// Triggered before a page or fragment is rendered
pjax.on('render', (target?: Element, newTarget?: Element) => void | false): RenderEvent

// Triggered after a page has rendered
pjax.on('load', (state?: IPage) => void): LoadEvent

```

## connected

The connected event will be triggered after Pjax has connected and fired only once. This is the equivalent of the `DOMContentLoaded` event. Upon connection, Pjax will save the current documents outer HTML to the snapshot cache using `document.documentElement.outerHTML` whereas all additional snapshots are saved after an XHR request completes.

Because the initial snapshot is saved using `document.documentElement.outerHTML` the captured HTML may cause third party scripts which have augmented the document to serve an invalid dom into the snapshot cache. When a return navigation to this location occurs it may cause the third party script to fail. You can prevent issues of this nature from happening by initializing your modules within the `connected` event.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## prefetch

The prefetch event will be triggered for every prefetch request. Prefetch requests are fired when `hover`, `intersect` and `proximity` are triggered. This event will be frequently triggered if you are leveraging any of those capabilities. You can determine the type of prefetch which has occurred via the `type` parameter.

**Cancellable:** `false` <br>
**Asynchronous:** `true`

## visit

The visit event will be triggered when a `mousedown` event has occurred on a Pjax enabled `href` element. This is the equivalent of a `click` and when such an action occurs then navigation intent is assumed and visit begins.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## request

The request event will be triggered before an XHR request begins and a page is fetched. This event will be fired for `prefetch`, `hydrate` and `trigger` actions. You can determine the trigger action for the request using the `type` property passed in the `event.detail` parameter.

**Cancellable:** `false` <br>
**Asynchronous:** `true`

## cache

The cache event will be triggered immediately after a request has finished and before the snapshot and page record is saved to memory. You can determine the trigger action for the request via the `type` parameter. This Lifecycle also allows you to augment the snapshot `Document` and before it is saved.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## render

The render event will be triggered before a page or fragment is rendered (replaced) in the dom. For every `target` you've defined this event will fire. You can determine which elements are being replaced via the `target` and `newTarget` parameters passed. The `target` property represents the current element that will be replaced and the `newTarget` element represents the new target which it will be replaced with.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## hydrate

The hydrate event is identical to the `render` event. The parameters represent the current `target` and `newTarget` elements which will be replaced.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

## load

The load event is the final lifecycle event to be triggered. Use this event to re-initialize any third party scripts. The load event will only execute after navigation has concluded.

**Cancellable:** `false` <br>
**Asynchronous:** `false`

# Routing

The module exposes a low-level routing approach using simple wildcard path matching. Routes executed right before fragments are replaced in the rendering lifecycle. Routes allow you to augment the target documents and state before replacement occur.

<!-- prettier-ignore -->
```typescript
import * as pjax from '@brixtol/pjax'

pjax.route({

  '/:value': (state?: IState, target?: IRoute) => void | Document,

  '/path/*': (state?: IState, target?: IRoute) => void | Document,

  '/?param': (state?: IState, target?: IRoute) => void | Document

});
```

# Methods

In addition to Lifecycle events, you also have a list of methods available. Methods will allow you some basic programmatic control of the Pjax session occurring, provides access to the cache store and various other operational utilities.

```typescript
import * as pjax from '@brixtol/pjax'

pjax.supported: boolean

pjax.connect(options?: IOptions): void

pjax.session(store?: string, merge{}): ISession

pjax.hydrate(url?: string, targets: string[]): Promise<IPage>

pjax.fetch(url): Promise<Document>

pjax.prefetch(string | Element): Promise<IPage>

pjax.visit(url: string, options?{}): Promise<IPage>

pjax.state(url: string, merge?{}): Page{}

pjax.capture(string[]): Promise<Element[]>

pjax.clear(url?: string): void

pjax.reload(): IPage

pjax.disconnect(): void

```

#### `pjax.connect(options?)`

The `connect` method is a **required** call and will initialize a pjax session. You can optionally provide options which inform pjax on how it should behave. See [options](#options) for list of settings.

**Returns:** `void`
**Dispatched Events:** `connected` <br>

#### `pjax.session()`

The `session` method will return the current store instance. This includes all state, snapshots, options and settings of the current session which exists in memory. If you intend of augmenting the session, please note that the store records are created without prototype.

**Returns:** `Promise<IPage>`

#### `pjax.hydrate(url: string, targets: string[])`

The `hydrate` method executed a programmatic hydration. The method expects a `url` and string list of element selectors.

**Returns:** `Promise<IPage>`<br>
**Events:** `cache > hydrate > load`

#### `pjax.fetch(url: string)`

Triggers a programmatic fetch. The XHR request response is not cached and no state reference are touched.

**Returns:** `Document`<br>

#### `pjax.prefetch(link: string | Element)`

The `prefetch` method executed a programmatic Prefetch. The method expects a `url` or `<a href="*"></a>` node as an argument. This method behaves the same way as hover, intersect of proximity prefetches.

**Returns:** `Promise<IPage>`<br>
**Events:** `request > cache`

#### `pjax.visit(url: string, options?: IOptions)`

The `visit` method executed a programmatic trigger visit. The method expects a `url` as an argument and optionally accepts an page state options model. This method behaves the same way as trigger.

**Returns:** `Promise<IPage>`<br>
**Events:** `replace > request > cache > render > load`

#### `pjax.state(url?: string, state?: IState)`

The `state` method returns the records pertaining to the provided `url` or if not defined returns the current location. Optionally pass a `state` object reference to merge and augment the current references.

**Returns:** `Promise<IPage>`

#### `pjax.capture(targets: string[])`

The `capture` method performs a snapshot modification to the current document. Use this to align a snapshot cache record between navigations. This is helpful in situations where the dom is augmented and you want to preserve

**Returns:** `Promise<IPage>`

# Attributes

Elements can be annotated with `data-pjax-*` attributes which you can leverage to customize how visits are rendered between navigations. By default, attributes are using a `-pjax-` schema but you can optionally provide a custom schema upon `connect` via the `schema` option.

- [data-pjax-eval](#data-pjax-eval)
- [data-pjax-disable](#data-pjax-disable)
- [data-pjax-hydrate](#data-pjax-hydrate)
- [data-pjax-replace](#data-pjax-replace)
- [data-pjax-prepend](#data-pjax-prepend)
- [data-pjax-append](#data-pjax-append)
- [data-pjax-hover](#data-pjax-hover)
- [data-pjax-threshold](#data-pjax-threshold)
- [data-pjax-proximity](#data-pjax-proximity)
- [data-pjax-position](#data-pjax-position)
- [data-pjax-cache](#data-pjax-cache)
- [data-pjax-history](#data-pjax-history)

## data-pjax-eval

Used on resources contained within the `<head>` fragment like styles, scripts or meta tags. Use this attribute if you want pjax to evaluate scripts and/or stylesheets. This option accepts a `false` value so you can define which scripts to execute per navigation. By default, pjax will run and evaluate all `<script>` tags it detects for every page visit but will not re-evaluate `<script src="*"></script>` tags.

> When a `<script>` tag is detected on a pjax navigation and annotated with `data-pjax-eval="false"` then execution will be triggered only once but never again after that.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-eval` attribute can be annotated on any of the below HTML tags:

- `<meta>`
- `<link>`
- `<style>`
- `<script>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `boolean` type. Passing the `true` value is optional as `data-pjax-eval` infers truthy.

- `true`
- `false`

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

```html
<script>
  console.log('I will run on every navigation');
</script>

<!-- script will only run once when between pjax visits -->
<script data-pjax-eval="false">
  console.log('I will run on initialization only!');
</script>
```

</details>

## data-pjax-disable

Use on `<a>` elements to disable pjax navigation. When a link element is annotated with `data-pjax-disable` a normal page navigation will be executed and cache will be cleared. You can optionally restore the cache using the `data-pjax-cache="restore"` attribute when navigating back to a pjax enabled url.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-disable` attribute can be used on the following tags:

- `<a>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `truthy` type. Passing the `true` value is optional as `data-pjax-disable` infers truthy.

- `true`

</details>

<details>
<summary>
<strong>Examples</strong>
</summary>

Clicking this link will clear cache and a normal page navigation will be executed.

```html
<a href="*" data-pjax-disable></a>
```

Clicking this link will execute a normal page navigation but will inform pjax to save the current cache and restore it upon the next pjax enabled visit. See [data-pjax-cache](#data-pjax-cache) for more information.

```html
<a href="*" data-pjax-cache="restore" data-pjax-disable></a>
```

</details>

## data-pjax-track

Place on elements to track on a per-page basis that might otherwise not be contained within target elements. This methods will append nodes to the document `<body>` and placement is not certain. This is helpful when you need to reference an `svg` sprite of template or some sort.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-track` attribute can be annotated on any HTML contained within `<body>` but cannot be applied to `<a>` href links.

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `truthy` type. Passing the `true` value is optional as `data-pjax-track` infers truthy.

- `true`

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

Lets assume you are navigating from `Page 1` to `Page 2` and `#main` is your defined target. When you navigate from `Page 1` only the `#main` target will be replaced and any other dom elements will be skipped that are not contained within the `#main` HTML tag. When annotating `data-pjax-track` to elements located outside of target/s which will be added and persisted on all future navigations.

**Page 1**

```html
<nav>
  <a href="/page-1" class="active">Page 1</a>
  <a href="/page-2">Page 2</a>
</nav>

<div id="#main">
  <div class="block">I will be replaced, I am active on every page.</div>
</div>
```

**Page 2**

```html
<nav>
  <a href="/page-1">Page 1</a>
  <a href="/page-2" class="active">Page 2</a>
</nav>

<div id="#main">
  <div class="block">I will be replaced, I am active on every page.</div>
</div>

<!-- This element will be appended to the dom -->
<div data-pjax-track>
  I am outside of target and will be tracked if pjax was initialized on Page 1
</div>

<!-- This element will not be appended to the dom -->
<div>I will not be tracked unless Pjax was initialized on Page 2</div>
```

> If navigation started on `Page 2` then Pjax will have knowledge of the tracked elements existence before navigating away. In such a situation the tracked element is marked internally and the handling will be identical.

</details>

## data-pjax-hydrate

Executes a controlled replacement of the defined elements. You should perform hydration when server side logic is required to adjust or apply changes to a visitors session as it will allow your application to seamlessly adapt and progressively align the UI without having to trigger a full-page reload. Hydration incurs side effects and the pjax session will be augmented, see below:

1. Only current and previous page cache is aligned (updated), all other existing records are purged.
2. You cannot restore purged cache. Any `data-pjax-cache="restore"` methods will be ignored.
3. Hydration is skipped when target location pathname does not match trigger location pathname.
4. History stack will not be touched, the visit is executed in the background.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-hydrate` attribute can be used on the following tags:

- `<a>`
- `<button>`
- `<form>`
- `<input>`

> Triggering via an annotated `<button>` element will execute hydration on current url.

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `string[]` type and expects a list of valid element selectors to be provided.

- `(['.foo'])`
- `(['.foo' , '#bar', '[data-baz]', '[data-qux=foo]'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

Lets assume we informed pjax to trigger replacements on the `#menu`, `#main` and `#note` between navigations upon connection, for example:

```js
pjax.connect({ targets: ['#menu', '#main', '#note'] });
```

When performing a navigation visit the target elements `#menu`, `#main` and `#note` would be replaced (as expected) but when a trigger tag element is using a `data-pjax-hydrate` attribute then pjax will only preform replacements on the elements defined within the `data-pjax-hydrate` annotation, for example:

<!-- prettier-ignore -->
```html

<!-- This node will not be replaced during hydration visit only on navigation visit -->
<nav id="menu">

  <!-- Pressing this link will trigger a navigation visit  -->
  <a
   href="/home">Replaces the #menu, #main and #note elements</a>

  <!-- Pressing this link triggers hydration and replaces all .price nodes -->
  <a
   href="/products?currency=SEK"
   data-pjax-hydrate="(['.price'])">Perform server side action</a>

</nav>

<!-- This node will not be replaced during hydration visit only on navigation visit -->
<section id="note">
  The next navigation will replace all elements using class "price"
  and "cart-count" - If you have defined the element "#main" as a "target"
  in your connection, a replacement will not be made on that element,
  instead only the elements defined in "data-pjax-hydrate" are replaced.
</section>


<!-- This node will be replaced on hydration -->
<span class="cart-count">1</span>

<!-- This node will be replaced on hydration -->
<span class="price">€ 450</span>

<div id="main">
  <img src="*">
  <ul>
    <li>Great Product</li>
    <!-- This node will be replaced on hydration -->
    <li class="price">€ 100</li>
    <li>Awesome Product</li>
    <!-- This node will be replaced on hydration -->
    <li class="price">€ 200</li>
    <li>Cool Product</li>
    <!-- This node will be replaced on hydration -->
    <li class="price">€ 300</li>
  </ul>
</div>

<!-- Pressing this triggers hydration and replaces the .cart-count node -->
<button data-pjax-hydrate="(['.cart-count'])">
  Add to cart
</button>

```

</details>

## data-pjax-replace

Executes a replacement of defined targets, where each target defined in the array is replaced in the navigation visit. Targets defined in `pjax.connect()` will be merged with those defined on this attribute.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-replace` attribute can be used on the following tags:

- `<a>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `string[]` type and expects a list of valid element selectors to be provided.

- `(['.foo'])`
- `(['.foo' , '.bar', '#baz'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

<!-- prettier-ignore -->
```html

<a
 href="*"
 data-pjax-replace="(['#target1', '#target2'])">
 Link
</a>

<div id="target1">
  I will be replaced on next navigation
</div>

<div id="target2">
  I will be replaced on next navigation
</div>

```

</details>

## data-pjax-prepend

Executes a prepend replacement on visit, where the array list values are used as targets. Index `[0]` will prepend itself to the index `[1]` value. Multiple prepend actions can be defined. Each prepend action is recorded are marked after execution.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-prepend` attribute can be used on the following tags:

- `<a>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `string[][]` type and expects a list of valid element selectors to be provided.

- `(['.foo', '.bar'])`
- `(['.foo' , '.bar'], ['#baz', '#qux'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

</details>

## data-pjax-append

Executes a append replacement on visit, where the array list values are used as targets. Index `[0]` will append itself to the index `[1]` value. Multiple append actions can be defined. Each append action is recorded are marked after execution.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-append` attribute can be used on the following tags:

- `<a>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `string[][]` type and expects a list of valid element selectors to be provided.

- `(['.foo', '.bar'])`
- `(['.foo' , '.bar'], ['#baz', '#qux'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

**PAGE 1**

<!-- prettier-ignore -->
```html

<a
 href="*"
 data-pjax-prepend="(['#target-1', '#target-2'])">
 Page 2
</a>

<div id="target-1">
  I will prepend to target-2 on next navigation
</div>

<div id="target-2">
  <p>target-1 will prepended to me on next navigation</p>
</div>

```

**PAGE 2**

<!-- prettier-ignore -->
```html

<a
 href="*"
 data-pjax-prepend="(['#target-1', '#target-2'])">
 Page 2
</a>

<div id="target-2">

  <!-- An action reference record is applied -->
  <div data-pjax-action="xxxxxxx">
    I am target-1 and have been prepended to target-2
  </div>

  <p>target-1 is now prepended to me</p>

</div>

```

</details>

## data-pjax-hover

Performs a prefetch of the `href` url upon mouse enter (hover). By default, hover pre-fetching is enabled but expects attribute annotation on links. You can have pjax execute pre-fetching on all `<a>` links by setting the `trigger` option to `href` in `pjax.connect()`. If you have set `trigger` to `href`then you do not need to define the attribute on links, unless you wish to skip executing the pre-fetch for occurring, in such a case your annotate the href element with a `false` hover attribute, eg: `<a data-pjax-hover="false">`.

If you set hover pre-fetching to `false` in your `pjax.connect()` settings then annotations will be ignored and hover pre-fetching will be disabled.

> On mobile devices the the prefetch will execute on the `touchstart` event

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-hover` attribute can be used on the following tags:

- `<a>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `boolean` type. Passing the `true` value is optional as `data-pjax-hover` infers truthy.

- `true`
- `false`

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

```html
<!-- This link will be prefetch when it is hovered -->
<a href="*" data-pjax-hover></a>

<!-- This link will be excluded from prefetch when hovered -->

<a href="*" data-pjax-hover="false"></a>
```

</details>

## data-pjax-threshold

By default, this will be set to whatever preset configuration was defined in `pjax.connect()` but you can override those settings by annotating the link with this attribute. The `data-pjax-threshold` attribute can only be used on attributes that accept threshold control. The per-page state session will write this to the `threshold` property.

<details>
<summary>
<strong>Attributes</strong>
</summary>

The `data-pjax-threshold` attribute can be used together with one the following attributes:

- `data-pjax-hover`
- `data-pjax-proximity`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute either a `number` type. You can optionally pass a key reference to target specific attributes when an element is using multiple attribute annotations. Threshold accepts number with decimals, negative numbers will be ignored.

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

<!-- prettier-ignore -->
```html
<!-- hover prefetch will begin after 500ms on hover -->
<a
 href="*"
 data-pjax-threshold="500"
 data-pjax-hover>Link</a>

<!-- prefetch will begin after 1s on proximity -->
<a
 href="*"
 data-pjax-threshold="1000"
 data-pjax-proximity>Link</a>

```

</details>

## data-pjax-proximity

Triggers a proximity fetch when the cursor is within range of an `<a>` element. Optionally accepts a `number` value which overrides the `distance` preset configuration.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-proximity` attribute can be annotated on any HTML contained within `<body>`.

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `number` type or a boolean `false`

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

<!-- prettier-ignore -->
```html
<!-- This activates proximity based pre-fetch and uses the connection present defaults -->
<a
 href="*"
 data-pjax-proximity></a>

<!-- This url will begin fetching when the mouse is within 100px of the element -->
<a
 href="*"
 data-pjax-proximity="100"></a>

<!-- All <a href="*"> elements will be triggered via proximity -->
<div data-pjax-proximity>

 <!-- These urls will pre-fetch and uses the connection present defaults -->
 <a href="*" ></a>
 <a href="*" ></a>

</div>

```

</details>

## data-pjax-position

Sets the scroll position of the next navigation. This is a space separated expression with colon separated prop and value.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-threshold` attribute can be used on the following tags:

- `<a>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `number` type. The value requires a key definition to be defined to inform upon position.

- `y:0`
- `x:0`
- `y:0 x:0`

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

<!-- prettier-ignore -->
```html
<!-- This next navigation will load at 1000px from top of page  -->
<a
 href="*"
 data-pjax-position="y:1000 x:0"></a>

<!-- This next navigation will load at 250px from top of page  -->
<a
 href="*"
 data-pjax-position="y:250"></a>

```

</details>

## data-pjax-cache

Controls the caching engine of each pjax navigation. When using `data-pjax-cache` together with prefetch attributes like `data-pjax-hover` the action is respected.

### false

Passing a `false` value will execute a pjax visit that will not be saved to cache and if the link exists in cache it will be removed.

### reset

Passing a `reset` value will remove the cache reference existing at the location of the trigger. A new pjax visit will be executed and the response will saved to cache, replacing the previous record.

### clear

Passing a `clear` value will purge the entire cache store and all records will be removed.

### restore

Passing a `restore` value will save the current cache to session storage which allows the store to be maintained during page a refresh. The cache will exist in session storage and be restored to memory when another pjax visit is triggered. The restore method can be used together with `data-pjax-disable` or when navigating to an external webpage. If the tab or browser is closed then session storage is purged.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-cache` attribute can be used on the following tags:

- `<a>`
- `<button>`

> When annotating `<button>` elements the action is triggered on current location.

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `string` type and expects on the following values.

- `false`
- `reset`
- `clear`
- `restore` _option is not yet available_

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

<!-- prettier-ignore -->
```html

<!-- Disables cache and remove any records that might exists at '/a' -->
<a
 href="/a"
 data-pjax-cache="false"></a>

<!-- Resets the cache of '/b' -->
<a
 href="/b"
 data-pjax-cache="reset"></a>

<!-- Purges all cache references -->
<a
 href="/c"
 data-pjax-cache="clear"></a>

<!-- Saves cache to session storage and restores it on the next pjax visit -->
<a
 href="/d"
 data-pjax-cache="restore"
 data-pjax-disable></a>
```

</details>

## data-pjax-history

Controls the history pushstate for the navigation. Accepts `false`, `replace` or `push` value. Passing in `false` will prevent the navigation from being added to history. Passing in `replace` or `push` will execute its respective value to pushstate to history.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-history` attribute can be used on the following tags:

- `<a>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute is a `string` type and expects on the following values.

- `false`
- `replace`
- `push`

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

```html
<!-- the navigation not be pushed to history -->
<a href="*" data-pjax-history="false"></a>
```

</details>

## data-pjax-progress

Controls the progress bar delay. By default, progress will use the threshold defined in configuration presets defined upon connection, else it will use the value defined on link attributes. Passing in a value of `false` will disable the progress from showing.

<details>
<summary>
<strong>Tags</strong>
</summary>

The `data-pjax-progress` attribute can be used on the following tags:

- `<a>`
- `<button>`
- `<form>`
- `<input>`

</details>

<details>
<summary>
<strong>Values</strong>
</summary>

This attribute can be `number` or boolean `false` type. You must provide a number greater than or equal to 100, negative numbers will be ignored.

</details>

<details>
<summary>
<strong>Example</strong>
</summary>

```html
<!-- Progress bar will be displayed if the request exceeds 500ms -->
<a href="*" data-pjax-progress="500"></a>

<!-- Progress bar will not be displayed -->
<a href="*" data-pjax-progress="false"></a>
```

</details>

# How it works?

This pjax variation is leveraging modern browser capabilities. What makes this pjax variant faster than others is how the pages are fetched and the caching approach it employs.

### Fetching

Pages are fetches using XHR opposed to the Fetch API as we are dealing with HTML requests there is no benefit of using Fetch over XHR.

### Pre-fetching

TODO

### Rendering

1. An XHR request can begin on mousedown, mouseover, element intersection or via cursor proximity.
2. The response DOM string of fetched pages is stored in memory, so page requests are only ever executed once.
3. Stored pages (snapshots) are re-used when returning visits to cached (stored) locations occur.
4. The DOM Parser API is used in the rendering cycle, only specific elements (targets) are replaced.
5. The state model of the History API is used maintain page specific configuration references.

# Contributing

This module is written in TypeScript. Production bundles exports to ES2015. This project has been open sourced from within a predominantly closed source mono/multi repo. We will update it according to what we need. Feel free to suggest features or report bugs and PR's are welcome!

### Development

The project is functional in its architecture, there are no classes, just functions. The [observers](https://github.com/BRIXTOL/pjax/blob/master/src/observers) directory contains the various fetch and pre-fetch logics. Objects avoid the prototype and `Object.create(null)` is the preferred approach.

The project is fairly easy to understand, there are no complexities and over-engineering. The Pjax method is simple, you fetch pages over the wire and replace elements in the rendering cycle. This module follows this pattern but includes additional extras to help improve the rendering times.

# Acknowledgements

This module combines concepts originally introduced by other awesome Open Source projects:

- [Defunkt Pjax](https://github.com/defunkt/jquery-pjax)
- [Pjax.js](https://github.com/brcontainer/pjax.js)
- [MoOx Pjax](https://github.com/MoOx/pjax)
- [InstantClick](https://github.com/dieulot/instantclick)
- [Turbo](https://github.com/hotwired/turbo)
- [Turbolinks](https://github.com/turbolinks/turbolinks)

# License

Licensed under [MIT](#LICENSE)

---

We [♡](https://www.brixtoltextiles.com/discount/4D3V3L0P3RS]) open source!
