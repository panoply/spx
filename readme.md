## @brixtol/pjax

A modern next generation drop-in pjax solution for SSR web applications.

### Key Features

✓ Drop-in solution<br>
✓ Supports multiple fragments<br>
✓ Per-page configuration<br>
✓ Lifecycle event hooks<br>
✓ Intersection caching engine<br>
✓ Pre-fetching capabilities<br>
✓ Tiny! Only 4.2kb minified and gzipped<br>
✓ Integrates seamlessly with Stimulus<br>

### Why?

The landscape of pjax orientated solutions has become rather scarce and all current bread winners are over engineered or offer the same basic shit. We wanted a size appropriate, fast and effective alternative that we could integrate seamlessly into our SSR SaaS based web apps.

### Differences

This pjax solution will cache each request using an immutable state management pattern. It provides opt-in prefetch capabilities using mouseover events and/or the Intersection Observer API. Each response is stored and rendered with the native DOM Parser and you can set per-page options via data attributes.

## Install

```cli
pnpm i @brixtol/pjax
```

> Because [pnpm](https://pnpm.js.org/en/cli/install) is dope and does dope shit.

## Get Started

You do not create a class instance, the module has no classes or any of that oop shit but you do need to call `connect` to initialize.

```js
import * as Pjax from "@brixtol/pjax";

/* CONNECT
/* -------------------------------------------- */

Pjax.connect({
  fragments: ["main"],
  action: "replace",
  prefetch: true,
  cache: true,
  throttle: 0,
  progress: false,
  threshold: {
    intersect: 250,
    hover: 100,
  },
});

/* LIFECYCLE EVENTS
/* -------------------------------------------- */

document.addEventListener("pjax:load", ({ detail }) => {});

document.addEventListener("pjax:click", (event) => {});

document.addEventListener("pjax:request", (event) => {});

document.addEventListener("pjax:cache", (event) => {});

document.addEventListener("pjax:render", ({ detail }) => {});
```

You can also cherry-pick the export methods:

```js
import { connect } from "@brixtol/pjax";

connect({
  target: ["main", "#navbar"],
  action: "replace",
  prefetch: true,
  cache: true,
  throttle: 0,
  progress: false,
  threshold: {
    intersect: 250,
    hover: 100,
  },
});
```

## Define Presets

The below options will be used as the global default presets. Pass these options within `Pjax.connect()` and they will be inherited and applied to each page navigation. Once initialized you can control each page visit using attributes. You can omit the options and just use the defaults if you would rather that.

| Option    | Type       | Default                          |
| --------- | ---------- | -------------------------------- |
| target    | `string[]` | `['body']`                       |
| method    | `string`   | `replace`                        |
| throttle  | `number`   | `0`                              |
| cache     | `boolean`  | `true`                           |
| progress  | `boolean`  | `false`                          |
| threshold | `object{}` | `{ intersect: 250, hover: 100 }` |

## Methods

#### `Pjax.connect(options?)`

This is the initializer method. Call this to activate pjax. Pass in preset configuration options.

#### `Pjax.visit(url, options?)`

Programmatic navigation visit to a URL. You can optionally pass in options for the visit.

#### `Pjax.cache(url?)`

Returns cache `Map` session. All methods available to `Map` can be accessed via this method.

## Terminology

###### Targets

Targets are fragment elements which contain a `data-pjax-target="*"` attribute.

###### Actions

Actions are manipulations executed by pjax.

## Navigation

<hr>

#### `data-pjax-eval="false"`

Used on resources contained in the `<head></head>` like styles and scripts. Use this attribute if you want pjax the evaluate scripts and/or stylesheets. This option accepts a `false` value so you can define which scripts to execute on each navigation. By default, pjax will run and evaluate all `<script></script>` tags it detects each page visit but will not re-evaluate `<script src="*"></script>` tags.

> If a script tag is detected on pjax navigation and is using `data-pjax-eval="false"` it will execute only once, one the first visit and never again.

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

###### Options

- `true`
- `history`

Place on `href`elements you don't want pjax navigation to be executed. When present a normal page navigation will be executed and cache will be cleared unless combined with a `cache` option.

<details>
<summary>
Example
</summary>

Clicking this link will clear cache and normal page navigation will be executed.

```html
<a href="*" data-pjax-disable></a>
```

Clicking this link will clear cache and normal page navigation will be executed.

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

Lets assume you are navigating from `Page 1` to `Page 2` and `#main` is your defined target. When you navigate from `Page 1` only the `#main` target will be replaced and any other dom elements will be skipped that are not contained within that target. In order for Pjax to work as efficiently as possible any elements located outside of a target/s does not exist on the initialization page it will be added a new page navigation.

###### Page 1

```html
<nav>
  <a href="/page-1">Page 1</a>
  <!-- You are currently here -->
  <a href="/page-2">Page 2</a>
</nav>

<div id="#main">
  I will be replaced, I am active on every page.
  <div></div>
</div>
```

###### Page 2

```html
<nav>
  <a href="/page-1">Page 1</a>
  <a href="/page-2">Page 2</a>
  <!-- You are now here -->
</nav>

<div id="#main">
  I will be replaced, I am active on every page.
  <div>
    <!-- This element will be appended to the dom -->
    <div data-pjax-track>
      I am outside of target and will be tracked if Pjax was initialized on Page
      1
    </div>

    <!-- This element will not be appended to the dom -->
    <div>I will not be tracked unless Pjax was initialized on Page 2</div>
  </div>
</div>
```

> If pjax was initialized on `Page 2` the tracked element pjax would have knowledge of the tracked element before navigation as reference to the element exists on initialization. In such a situation, pjax will mark the tracked element internally.

</details>

<hr>

#### `data-pjax-replace`

Executes a replacement to single or multiple fragments.

###### ATTRIBUTE

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

#### `data-pjax-prepend`

Executes a prepend visit. Locates target, then prepends it another target. A Prepend navigation will have its action recorded.

###### ATTRIBUTE

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

#### `data-pjax-method="*"`

The navigation method to execute on navigation. Accepts `replace`, `append` or `prepend`. When multiple target selectors are defined, space separate actions in accordance with target order.

<details>
<summary>
Example
</summary>

```html
<a data-pjax-method="replace" href="*"></a>
```

</details>

#### `data-pjax-prefetch="*"`

Prefetch option to execute for each link. Accepts either `intersect` or `hover` value. When `intersect` is provided a request will be dispatched and cached on visibility.

> On mobile devices the `hover` value will execute on a `touch` event

<details>
<summary>
Example
</summary>

```html
<a data-pjax-prefetch="intersect" href="*"></a>
```

</details>

#### `data-pjax-threshold="*"`

Set the threshold timeouts for pre-fetches. By default these options are `250ms` for `intersect` and `100` for `hover` elements. You can optionally set to a preferred defaults on preset.

<details>
<summary>
Example
</summary>

```html
<!-- hover prefetch will begin 500ms after it was observed -->
<!-- A prefetch will not be initialized if a click was detected before threshold -->
<a data-pjax-prefetch="hover" data-pjax-threshold="500" href="*"></a>

<!-- Intersection prefetch will begin 500ms after it was observed -->
<a data-pjax-prefetch="intersect" data-pjax-threshold="500" href="*"></a>
```

</details>

#### `data-pjax-position="*"`

Scroll position of the next navigation. Space separated expression with colon separated prop and value.

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

Controls the caching engine for the link navigation. Accepts `false`, `reset` or `save` value. Passing in `false` will execute a pjax visit that will not be saved to cache and if the link exists in cache it will be removed. When passing `reset` the cache record will be removed, a new pjax visit will be executed and the result saved to cache. The `save` option will save temporarily save the current cached session to local or session storage (depending on your configuration presets) and will be removed on your next navigation visit.

> The `save` option should be avoided unless you are executing a full page reload and wish to store your cached pages in order to prevent new requests being executed. If your cache exceeds 3mb in size cache records will be removed start from earliest point on of entry. Use `save` in conjunction with the `data-pjax-disable` option, else do your upmost to avoid it.

<details>
<summary>
Example
</summary>

```html
<a data-pjax-cache="false" href="*"></a>
```

</details>

#### `data-pjax-throttle="*"`

Navigation can be very fast when there is a cached record available in the browsing session. Each link click with cache is instantaneous and thus there might be some cases where you might like to throttle each navigation.

<details>
<summary>
Example
</summary>

```html
<!-- the navigation will load over a 500ms time frame -->
<a data-pjax-throttle="500" href="*"></a>
```

</details>

## Events

Each events can accessed via `document`and allows you to hook into each lifecycle.

#### `pjax:click`

Fires when when a link has been clicked. You can cancel the pjax navigation with `preventDefault()`.

#### `pjax:request`

Fires after a request has completed. You can access the parsed response document via `target`and make adjustments where necessary.

#### `pjax:cache`

Fires on pre-fetches after caching a response. If you are leveraging `intersect` it will fire for each request encountered.

#### `pjax:render`

Fires before rendering document targets in the dom. When you are replacing multiple targets, it will fire for each replacement.

#### `pjax:load`

Fires on initialization and on each page navigation. Treat this event as you would the `DOMContentLoaded` event.

### Licence

[MIT](#)
