## @brixtol/pjax

A modern next generation drop-in pjax solution for SSR web applications.

### Key Features

✓ Drop-in solution<br>
✓ Supports multiple fragments<br>
✓ Per-page configuration<br>
✓ Lifecycle event hooks<br>
✓ Intersection caching engine<br>
✓ Pre-fetching capabilities<br>
✓ 6kb gzipped dependency free <br>
✓ Integrates seamlessly with Stimulus<br>

### Why?

The landscape of pjax orientated solutions has become rather scarce and all current bread winners are over engineered or offer the same basic shit. We wanted a size appropriate, fast and effective alternative that we could integrate seamlessly into our SSR SaaS based web apps.

### Differences

This pjax solution will cache each request using an immutable state management pattern and provides opt-in prefetch capabilities using mouseover events and the Intersection Observer API. Each response is stored and rendered with the DOM Parser.

## Presets

| Option   | Type       | Default     |
| -------- | ---------- | ----------- |
| target   | `string[]` | `['#main']` |
| action   | `string`   | `replace`   |
| throttle | `number`   | `0`         |
| cache    | `boolean`  | `true`      |

## Methods

#### `Pjax.connect(options?)`

This is the initializer method. Call this to activate pjax. Pass in preset configuration options.

#### `Pjax.visit(url, options?)`

Programmatic navigation visit to a URL. You can optionally pass in options for the visit.

#### `Pjax.cache(url?)`

Returns cache `Map` session. All methods available to `Map` can be accessed via this method.

## Configuration

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

#### `data-pjax-target="*"`

Target selectors for navigation. Use space separation when defining multiple targets to reload.

<details>
<summary>
Example
</summary>

```html
<a data-pjax-target="#header #main #footer" href="*"></a>
```

</details>

#### `data-pjax-chunks="*"`

Target multiple fragments from a link navigation. Space separated expression with colon separated `target` and `action` options. This is helpful when you which to reload additional target elements using different actions, like providing infinite scrolling.

<details>
<summary>
Example
</summary>

```html
<!-- This will replace the #header element and append to #products element -->

<a
  data-pjax-chunks="#header:replace #products:append"
  href="/products?page=2"
></a>
```

#### `data-pjax-action="*"`

The navigation action to execute on navigation. Accepts `replace`, `append` or `prepend`. When multiple target selectors are defined, space separate actions in accordance with target order.

<details>
<summary>
Example
</summary>

```html
<a data-pjax-action="replace" href="*"></a>
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

Fires after a request has been made. You can access the parsed response document via `target`and made adjustments where necessary.

#### `pjax:cache`

Fires on pre-fetches after caching a response. If you are leveraging `intersect` it will fire for each request encountered.

#### `pjax:render`

Fires before rendering document targets in the dom. When you are replacing multiple targets, it will fire for each replacement. If you are using a SPA framework like [Mithril](#)

#### `pjax:load`

Fires on initialization and on each page navigation. Treat this event as you would the `DOMContentLoaded` event.

### Acknowledgements

This project owes its creation and some of the source code to the maintainers and developers who provide related pjax solutions within the nexus.

- [brcontainer/pjax.js](#)
- [hotwired/turbo](#)
- [defunkt/jquery-pjax](#)
- [youtube/spfjs](#)

### Licence

[MIT](#)
