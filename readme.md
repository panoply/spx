## @brixtol/pjax

A new generation pjax solution for SSR web applications.

### Key Features

✓ Drop-in solution<br>
✓ Multiple fragments<br>
✓ Lifecycle events<br>
✓ Pre-fetching capabilities<br>
✓ Snapshot caching<br>
✓ Lightweight, 9kb gzipped<br>

## Install

```cli
pnpm i @brixtol/pjax
```

> Because [pnpm](https://pnpm.js.org/en/cli/install) is dope and does dope shit.

## Usage

To initialize, call `Pjax.connect()` in your bundle and optionally pass preset configuration. By default Pjax will replace the entire `<body>` fragments upon each navigation, so it is recommended that you define a set of `targets[]` whose inner contents will change on per-page basis.

<!-- prettier-ignore -->
```js
import * as Pjax from "@brixtol/pjax";

/* CONNECT
/* -------------------------------------------- */

Pjax.connect({
  targets: ["body"],
  cache: {
    enable: true,
    limit: 25,
  },
  requests: {
    timeout: 1500,
    poll: 150,
    async: true,
  },
  prefetch: {
    mouseover: {
      enable: true,
      threshold: 100,
      proximity: 0,
    },
    intersect: {
      enable: true,
      options: {
        rootMargin: "0px",
        threshold: 1.0,
      },
    },
  },
  progress: {
    enable: true,
    threshold: 500,
    options: {
      minimum: 0.25,
      easing: "ease",
      speed: 200,
      trickle: true,
      trickleSpeed: 200,
      showSpinner: false,
    },
  },
});

```

## Lifecycle Events

Lifecycle events are dispatched to the document upon each navigation. You access context information from within `event.detail` and also cancel events with `preventDefault()` if you wish to prevent execution.

<!-- prettier-ignore -->
```javascript

// called when a prefetch is triggered
document.addEventListener("pjax:prefetch");

// called when a mousedown event occurs on a link
document.addEventListener("pjax:trigger");

// called before a page is fetched over XHR
document.addEventListener("pjax:request");

// called before a page is cached
document.addEventListener("pjax:cache");

// called before a page is rendered
document.addEventListener("pjax:render");

// called after a page has rendered
document.addEventListener("pjax:load");
```

## Methods

In addition to Lifecycle events, a list of methods are available. Methods will allow you some basic programmatic control.

```javascript

// Check to see if Pjax is supported by the browser
Pjax.supported: boolean

// Connects Pjax, called upon initialization
Pjax.connect(options?): void

// Execute a programmatic visit
Pjax.visit(url?, options?): Promise<Page{}>

// Access the cache, pass in href for specific record
Pjax.cache(url?): Page{}

// Clears the cache, pass in href to clear specific record
Pjax.clear(url?): void

// Returns a UUID string via nanoid
Pjax.uuid(size = 16): string

// Reloads the current page
Pjax.reload(): Page{}

// Disconnects Pjax
Pjax.disconnect(): void

```

## Navigation

<hr>

#### `data-pjax-eval="false"`

Used on resources contained within `<head>` fragment like styles and scripts. Use this attribute if you want pjax the evaluate scripts and/or stylesheets. This option accepts a `false` value so you can define which scripts to execute on each navigation. By default, pjax will run and evaluate all `<script>` tags it detects for every page visit but will not re-evaluate `<script src="*"></script>` tags.

> If a script tag is detected on pjax navigation and is using `data-pjax-eval="false"` it will execute only once upon the first visit but never again after that.

<details>
<summary>
Example
</summary>

```html
<script>
  console.log("I will run on every navigation");
</script>

<!-- script will also run once if detected on pjax navigation -->
<script data-pjax-eval="false">
  console.log("I will run on initialization only!");
</script>
```

</details>

#### `data-pjax-disable`

Place on `href` elements you don't want pjax navigation to be executed. When a link element is annotated with `data-pjax-disable` a normal page navigation will be executed and cache will be cleared.

<details>
<summary>
Example
</summary>

Clicking this link will clear cache and a normal page navigation will be executed.

```html
<a href="*" data-pjax-disable></a>
```

</details>

#### `data-pjax-track`

Place on elements to track on a per-page basis that might otherwise not be contained within target elements.

<details>
<summary>
Example
</summary>

Lets assume you are navigating from `Page 1` to `Page 2` and `#main` is your defined target. When you navigate from `Page 1` only the `#main` target will be replaced and any other dom elements will be skipped which are not contained within `#main`. Element located outside of target/s that do no exist on previous or future pages will be added.

###### Page 1

```html
<nav>
  <a href="/page-1" class="active">Page 1</a>
  <a href="/page-2">Page 2</a>
</nav>

<div id="#main">
  <div class="block">I will be replaced, I am active on every page.</div>
</div>
```

###### Page 2

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
  I am outside of target and will be tracked if Pjax was initialized on Page 1
</div>

<!-- This element will not be appended to the dom -->
<div>I will not be tracked unless Pjax was initialized on Page 2</div>
```

> If pjax was initialized on `Page 2` then Pjax would have knowledge of its existence before navigation. In such a situation, pjax will mark the tracked element internally.

</details>

<hr>

#### `data-pjax-replace="([])"`

Executes a replacement of defined targets, where each target defined in the array is replaced.

###### VALUE ATTRIBUTE

- `(['target'])`
- `(['target' , 'target'])`

<details>
<summary>
Example
</summary>

<!-- prettier-ignore -->
```html

<a
 href="*"
 data-pjax-replace="(['target1', 'target2'])">
 Link
</a>

<div data-pjax-target="target1">
  I will be replaced on next navigation
</div>

<div data-pjax-target="target2">
  I will be replaced on next navigation
</div>

```

</details>

<hr>

#### `data-pjax-prepend="([])"`

Executes a prepend visit, where `[0]` will prepend itself to `[1]` defined in that value. Multiple prepend actions can be defined. Each prepend action is recorded are marked.

###### VALUE EXPRESSION

- `(['target' , 'target'])`
- `(['target' , 'target'], ['target' , 'target'])`

<details>
<summary>
Example
</summary>

###### PAGE 1

<!-- prettier-ignore -->
```html

<a
 href="*"
 data-pjax-prepend="(['target-1', 'target-2'])">
 Page 2
</a>

<div data-pjax-target="target-1">
  I will prepend to target-2 on next navigation
</div>

<div data-pjax-target="target-2">
  <p>target-1 will prepended to me on next navigation</p>
</div>

```

###### PAGE 2

<!-- prettier-ignore -->
```html

<a
 href="*"
 data-pjax-prepend="(['target-1', 'target-2'])">
 Page 2
</a>

<div data-pjax-target="target-2">

  <!-- An action reference record is applied -->
  <div data-pjax-action="xxxxxxx">
    I am target-1 and have been prepended to target-2
  </div>

  <p>target-1 is now prepended to me</p>

</div>

```

</details>

#### `data-pjax-prefetch="*"`

Prefetch option to execute. Accepts either `intersect` or `hover` value. When `intersect` is provided a request will be dispatched and cached upon visibility via Intersection Observer, whereas `hover` will dispatch a request upon a pointerover (mouseover) event.

> On mobile devices the `hover` value will execute on a `touchstart` event

<details>
<summary>
Example
</summary>

```html
<!-- This link will be prefetch when it is hovered -->
<a data-pjax-prefetch="hover" href="*"></a>

<!-- This link will be prefetch when it is in viewport -->
<a data-pjax-prefetch="intersect" href="*"></a>
```

</details>

#### `data-pjax-threshold="*"`

Set the threshold delay timeout for hover prefetches. By default, this will be set to `100` or whatever preset configuration was defined in `Pjax.connect()` but you can override those settings by annotating the link with this attribute.

<details>
<summary>
Example
</summary>

```html
<!-- hover prefetch will begin according to the connect preset -->
<!-- prefetch will not be initialized if a click was detected before threshold -->
<a data-pjax-prefetch="hover" href="*"></a>

<!-- prefetch will begin 500ms after hover but will cancel if mouse existed before threshold -->
<a data-pjax-prefetch="intersect" data-pjax-threshold="500" href="*"></a>
```

</details>

#### `data-pjax-position="*"`

Scroll position of the next navigation. Space separated expression with colon separated prop and value.

###### VALUE EXPRESSION

- `x:0 y:100`
- `y:200`

<details>
<summary>
Example
</summary>

```html
<!-- This next navigation will load at 1000px from top of page  -->

<a data-pjax-position="y:1000 x:0" href="*"></a>
```

</details>

#### `data-pjax-cache="*"`

Controls the caching engine for the link navigation. Accepts `false`, `reset` or `clear` value. Passing in `false` will execute a pjax visit that will not be saved to cache and if the link exists in cache it will be removed. When passing `reset` the cache record will be removed, a new pjax visit will be executed and its result saved to cache. The `clear` option will clear the entire cache.

<details>
<summary>
Example
</summary>

```html
<a data-pjax-cache="false" href="*"></a>
```

</details>

#### `data-pjax-history="*"`

Controls the history pushstate for the navigation. Accepts `false`, `replace` or `push` value. Passing in `false`will prevent this navigation from being added to history. Passing in `replace` or `push` will execute its respective value to pushstate to history.

<details>
<summary>
Example
</summary>

```html
<!-- the navigation not be pushed to history -->
<a data-pjax-history="false" href="*"></a>
```

</details>

#### `data-pjax-progress="*"`

Controls the progress bar delay. By default, progress will use the threshold defined in configuration presets defined upon connection, else it will use the value defined on link attributes. Passing in a value of `false` will disable the progress from showing.

<details>
<summary>
Example
</summary>

```html
<!-- Progress bar will be displayed if the request exceeds 500ms -->
<a data-pjax-progress="500" href="*"></a>
```

</details>

## State

Each page has an object state value that is added to its pertaining History stack. Page state is immutable and created for every unique url `/path` or `/pathname?query=param` value encountered in the navigation session.

> Navigation sessions begin once a Pjax connection (`Pjax.connect()`) has been established and ends when a browser refresh is executed or url origin changes.

### Read

You can access a readonly copy of page state via the `event.details.state` property within dispatched lifecycle events or via the `Pjax.cache()` method. The caching engine used by this Pjax variation acts as mediator when a session begins, when you access page state via the `Pjax.cache()` method you are given a bridge to the Map object where all the active current session page state exists.

### Write

State modifications are carried out via link attributes or when executing a programmatic visit using the `Pjax.visit()` method which provides an `options` parameter where you can send adjustments to be merged. This method will only allow you to modify the next navigation. You should avoid modifying state and instead treat it as readonly.

```typescript
interface IPage {
  /**
   * The list of fragment target element selectors defined upon connection.
   * Targets are inherited from `Pjax.connect()` presets.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  readonly targets?: string[];

  /**
   * The URL cache key and current url path
   */
  url?: string;

  /**
   * UUID reference to the page snapshot HTML Document element
   */
  snapshot?: string;

  /**
   * UUID to a captured snapshot HTML string. Captures are temporary
   * snapshots used to preserve the document when navigating between history
   * popstate. Captured snapshots are removed upon subsequent visits to location.
   */
  captured?: string;

  /**
   * Location URL
   */
  location?: ILocation;

  /**
   * The Document title
   */
  title?: string;

  /**
   * Should this fetch be pushed to history
   */
  history?: boolean;

  /**
   * Whether page should execute capture. When set to `true`
   * the snapshot reference is created and its UUID value assigned
   * to the `captured` property value.
   *
   * @default false
   */
  capture?: boolean;

  /**
   * List of fragment element selectors. Accepts any valid
   * `querySelector()` string.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  replace?: null | string[];

  /**
   * List of fragments to append from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  append?: null | Array<[from: string, to: string]>;

  /**
   * List of fragments to be prepend from and to. Accepts multiple.
   *
   * @example
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  prepend?: null | Array<[from: string, to: string]>;

  /**
   * Controls the caching engine for the link navigation.
   * Option is enabled when `cache` preset config is `true`.
   * Each pjax link can set a different cache option.
   */
  cache?: boolean | "reset" | "clear";

  /**
   * Scroll position of the next navigation.
   *
   * ---
   * `x` - Equivalent to `scrollLeft` in pixels
   *
   * `y` - Equivalent to `scrollTop` in pixels
   */
  position?: {
    y: number;
    x: number;
  };

  /**
   * Define mouseover timeout from which fetching will begin
   * after time spent on mouseover
   *
   * @default 100
   */
  threshold?: number;

  /**
   * Define proximity prefetch distance from which fetching will
   * begin relative to the cursor offset of href elements.
   *
   * @default 0
   */
  proximity?: number;

  /**
   * Progress bar threshold delay
   *
   * @default 350
   */
  progress?: boolean | number;
}
```

## Development

This module is written in ES2020 format JavaScript. Production bundles export in ES6 format. Legacy support is provided as an ES5 UMD bundle. This project leverages JSDocs and Type Definition files for its typechecking. If you have an editor that supports IntelliSense features, all TS features are available using this method.

### Contributing

Generally speaking, this module is consumed by us for a couple of our projects, we will update it according to what we need it for. If you wish to contribute, have a feature suggestion or bug, PR's are welcome!

### Licence

[MIT](LICENCE)
