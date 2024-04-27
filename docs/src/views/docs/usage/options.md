---
title: 'Options'
layout: base.liquid
group: usage
permalink: '/usage/options/index.html'
anchors:
  - Options
  - fragments
  - globalThis
  - manual
  - schema
  - timeout
  - reverse
  - annotate
  - logLevel
  - cache
  - maxCache
  - components
  - preload
  - hover
  - proximity
  - intersect
  - progress
---

# Options

The `spx.connect` (see [connection](/usage/connection)) method is the gateway to configuring SPX behavior. It accepts an object containing various options, all of which are optional but highly recommended for optimal performance. By specifying `targets`, defining evaluation behavior, and refining observers, you can tailor SPX to suit your application's needs effectively.

<!-- prettier-ignore -->
```js
import spx from 'spx'

spx.connect({
  fragments: [],             // Element (id="") values that are dynamic
  timeout: 30000,            // Request Timeout limit
  logLevel: 2,               // Console Log level
  schema: 'spx',             // The data-attribute schema
  manual: false,             // Manually invoke observers
  reverse: true,             // Perform a reverse fetch base on history on connection
  globalThis: true,          // Allow global scope, i.e: window.spx
  cache: true,               // Use caching engine
  maxCache: 100,             // Cache limitation in bytes
  components: {},            // Component classes which are added to register
  annotate: false,           // When true, <a> elements require spx- attributes
  preload: {},               // Key > Value list of paths to preload
  eval: {},                  // Resource evaluation control
  hover: {},                 // Hover prefetching control
  intersect: {},             // Intersection observer prefetching control
  proximity: {},             // Proximity prefetching control
  progress: {}               // Customize the progress bar configuration
});
```

---

## fragments

The `fragments[]` option in SPX allows you to specify a list of element `id` attribute values that persist across various pages of your website. These fragments act as the dynamic regions of your web application, wherein their descendant elements undergo changes between page visits. It's important to note that the `fragments[]` option does not support class, element, or attribute-like selectors; only the value of an `id` attribute or a hash `#` prefixed identifier will be accepted.

The `spx-fragment` directive can be used to extend the connection presets in the dom.

```js
import spx from 'spx';

spx.connect({
  fragments: [] // By default, this empty as SPX applies morphed replacement of the <body>
});
```

---

## globalThis

By default, SPX makes the instance available globally via `window.spx`. This means that the SPX instance is assigned as a getter method on the `window` object, allowing easy access to SPX in the global scope. If you prefer to disable this behavior, you can set the `global` option to `false`.

```js
import spx from 'spx';

spx.connect({
  globalThis: true // Access SPX using window.spx
});
```

---

## manual

By default, SPX automatically invokes observers upon connection, handling prefetch and related interception operations. This behavior is controlled by the `observe` option, which defaults to `false`. When set to `false`, observers are triggered automatically upon connection. However, if you prefer manual control over observer invocation, you can set `observe` to `true`, and then use the `spx.observe()` method to manually trigger observers.

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.connect({
  manual: false // Prevents SPX from initializing the internal observers
});

// .....

// Because manual is false, observers require manual invocation.
// Below we call the observe() method after 5 seconds has passed.

setTimeout(() => {

  // In real world applications, it's unlikely you'd do this
  spx.observe();

}, 5000);
```

---

## schema

By default, attribute identifiers use an `spx-` identifier. You can use a custom attribute identifier or if you wish to opt-out of an identifier you can pass `null` value. When `null` is provided prefix annotation is removed. W3C HTML [validators](https://validator.w3.org/) will declare the default `spx-` attribute as invalid, but browsers can easily reason with the annotation and it's common practice in projects. Consider validations as a warning, or change to `data-spx` if you wish to respect the W3 markup preference.

```js
import spx from 'spx';

spx.connect({
  schema: 'spx' // The default attribute, eg: <a spx-hover></a>
});
```

---

## timeout

Request polling limit is used when a request is already in transit. By default this is set to `30000` which means requests will wait `30s` before the limit of the XHR request will timeout. If timeout limit is exceeded a normal page visit will be executed.

```js
import spx from 'spx';

spx.connect({
  timeout: 30000 // The default time is set to 30s
});
```

---

## reverse

The `reverse` option determines whether SPX should perform reverse fetch + cache operation. When enabled, if the history **pushState** record is determined to contain an SPX reference but no snapshot or cache reference exists in the SPX session, then SPX will carry out a reverse fetch on the last known backward location. The reverse fetch will execute outside the event-loop upon an idle state so as to prevent any form of blocking or extraneous runs.

```js
import spx from 'spx';

spx.connect({
  reverse: true // The default is true, backward (reverse) fetches will apply
});
```

---

## annotate

The `annotate` option determines whether or not directive annotation is required to perform SPX visits. When set to `true`, SPX visits will only be triggered on `<a>` href elements that are explicitly annotated with an `spx-link` attribute. Conversely, when set to `false`, SPX will trigger on all `<a>` link elements, except for those annotated with `spx-disable`. By default, this option is set to `false`, so all href links are SPX visits.

```js
import spx from 'spx';

spx.connect({
  annotate: false // When set to true, <a> elements are identified using spx-link
});
```

---

## logLevel

SPX offers **4** logging levels, and defaults to using level [`2`](#2-info) to accommodate different debugging needs in your implementation. While excessive console logging should generally be avoided due to its performance overhead, logging can be invaluable during development for debugging potential issues and gaining insights into SPX's internal operations.

Logging to the console imposes a measurable performance penalty in browsers. SPX applies numerous uses of `console.log` and this can add substantial time to a page load. When you're confident that your application is running smoothly, you should opt to using either the **WARN** or **ERROR** level.

```js
import spx from 'spx';

spx.connect({
  logLevel: 2 // The default level is 2, printing info, warnings and errors
});
```

<br>

#### `1` VERBOSE

Setting the log level to `1` performs **VERBOSE** logging in SPX, which is useful during development for detailed insight into the framework's operations. However, verbose logging should be avoided in production due to its aggressive logging behavior. Though verbose mode provides extensive information about executed operations, it does not offer more informative error or warning messages.

<br>

#### `2` INFO

When the log level is set to `2`, SPX performs **INFO** logging in SPX which is the level that SPX defaults to using. In this mode, SPX provides contextual information about key operations occurring. Unlike **VERBOSE** logging, **INFO** logging is far less aggressive but still definitely heavy overall and is probably unsuitable for production despite it being the default level.

<br>

#### `3` WARN

When the log level is set to `3`, SPX switches to a mode where it only prints warnings and errors. This configuration is ideal for production environments and is commonly used as the standard approach. It helps maintain a clean console output while still alerting developers to potential issues that need attention.

<br>

#### `4` ERROR

When the log level is set to `4`, SPX enters **SILENT** mode. In this mode, SPX will only print errors or notify about issues that caused operations to fail. It's suitable for situations where you're confident that your application is running smoothly and you don't need any console output except for critical errors.

---

## cache

You can toggle caching behavior with the `cache` option. By default, caching is enabled, meaning that each page visit request is cached for subsequent visits to the same location. However, setting this option to `false` disables caching. Keep in mind that when caching is disabled, all visits will be fetched over the network, and any configurations specified with the `spx-cache` attribute will be ignored.

```js
spx.connect({
  cache: true // Cache is enabled by default, you should avoid disabling
});
```

---

## maxCache

SPX imposes a cache size limit of 100MB. When the cache size surpasses this limit, SPX initiates a removal process, starting from the oldest cached entries, in order to maintain the cache within the specified size constraint.

```js
import spx from 'spx';

spx.connect({
  maxCache: 100 // Use smaller limit if your HTML pages are large
});
```

---

## components

The component registry expects an object containing class components. These components should be provided in their raw form. SPX will then initialize these components and establish instances based on the template views defined within them. You may prefer to register components using the `spx.register()` method instead.

<!-- prettier-ignore -->
```js
import spx from 'spx';
import { Foo } from './components/foo';
import { Example } from './components/example';
import { BazQux } from './components/baz-qux';

spx.connect({
  components: {
    Foo,        // => Reference as spx-component="foo"
    Example,    // => Reference as spx-component="example"
    BazQux,     // => Reference as spx-component="bazQux"
  }
});
```

---

## preload

The `preload` options can be used to perform anticipatory pre-loading, or static-prefetching and allows developers to define specific entries that will be fetched preemptively and stored in the cache. These preloads will occur either upon SPX connection (i.e., when DOMContentLoaded event fires) or when a particular path is visited that matches a key reference.

> The `preload` option is made available as a last-resort solution and is experimental. This feature is unlikely to be considered in future versions of the module, unless users find the capability an essential.

Entries can be specified as either a `string[]` list of paths or an `object` key > value map, depending on the desired behavior. When providing a `string[]` list of paths, SPX will asynchronously fetch each page in the order they are defined. If you require path-specific static-prefetching, you can specify preloading behavior by providing an object where each key represents a path to match and the corresponding value is an array of paths to preload when that key is matched.

```js
// OPTION 1 - Preloading a list of routes
spx.connect({
  preload: ['/path/foo', '/path/bar', '/path/baz']
});

// OPTION 2 - Preloading routes when page has been visited
spx.connect({
  preload: {
    '/path/foo': ['/path/to/bar', '/path/to/baz'],
    '/path/qux': ['/path/to/xxx']
  }
});
```

---

## hover

The `hover` setting can be either a `boolean` or an `object` type. If set to `false`, it disables hover prefetching, preventing related observers from triggering, and thus any `spx-hover` directive attribute occurrences will also be ignored. When set to `true` or left undefined, SPX uses its default configuration. To customize the hover prefetching behavior, pass an `object` type with specific configuration options.

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect({
  hover: {
    trigger: 'href', // When attribute, SPX assumes <a spx-hover> annotation
    threshold: 250   // The amount of time before executing pre-fetch
  }
});
```

<br>

## \{ trigger \}

How hover prefetches should be triggered. By default this option is set to trigger only when `<a>` href link elements are attributed with a `spx-hover` attribute. You can instruct pjax to execute pre-fetching on all `<a>` elements by setting this option to `href`. If you set the trigger to `href` you can annotate links you wish to exclude from prefetch with `spx-hover="false"`.

<br>

## \{ threshold \}

Controls the fetch delay threshold, defaults to `250` (250ms). Requests will fire only when the mouse is both within range and the threshold time limit defined here has exceeded.

---

## proximity

Proximity prefetching allows requests to be dispatched when the cursor (i.e, touch or mouse pointer) is within a proximity range of an `<a>` href element annotated with a `spx-proximity` directive (attribute). Coupling proximity with hover prefetches enables predictive fetching to occur, triggering a request before any interaction with a link element happens.

To use the default behavior, set this option to `true`, and all `<a>` elements annotated with a `spx-proximity` directive will be pre-fetched. You can exclude specific `<a>` links from pre-fetching by passing a value of `false` to the `spx-proximity` directive attribute.

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.connect({
  proximity: {
    distance: 75,   // The distance the cursor must be within before executing pre-fetch
    threshold: 250, // The amount of time before executing pre-fetch
    throttle: 500   // Limit the amount of times an internal callback
  }
});
```

<br>

## \{ distance \}

By default, the proximity distance range is set to `75`. This range determines how close the cursor needs to be to trigger prefetching. You can customize this by assigning a specific number value to the `spx-proximity` attribute. For example, setting `spx-proximity="50"` on an `<a>` element would instruct SPX to begin prefetching when the cursor (i.e, touch or mouse pointer) is within `50px` of the element.

<br>

## \{ throttle \}

By default, the proximity throttle is set to `250` milliseconds, controlling the pointer (i.e, touch or mouse pointer) trigger throttle. This setting limits the frequency of internal callback firing once the cursor is within range. It's advisable not to set this value to less than 250 milliseconds to avoid excessive firing of callbacks.

<br>

## \{ threshold \}

Controls the fetch delay threshold. It determines when requests will be triggered based on cursor movement. Specifically, requests will only fire when the cursor (i.e, touch or mouse pointer) has moved beyond the defined range and the threshold time limit has been exceeded.

---

## intersect

The `intersect` option accepts either a `boolean` or `object` type. Intersection pre-fetching utilizes the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API to trigger requests when specific elements become visible in the viewport. If set to `false`, it disables intersection prefetching, preventing the related observers from triggering, and thus any `spx-intersect` directive attribute occurrences will also be ignored. When set to `true` or left undefined, SPX will carry out prefetching via intersection on all descendant `<a>` href occurrences of the annotated element when it becomes visible in the viewport. You can also annotate `<a>` href elements directly.

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.connect({
  intersect: {
    rootMargin: '0px 0px 0px 0px', // Passed to intersection observer
    threshold: 0 // Passed to intersection observer
  }
});
```

<br>

## \{ rootMargin \}

The default proximity distance range is `75`. This range determines the distance from the element where the prefetch is triggered by the cursor. You can customize this range by assigning a specific number value to the proximity attribute. For example, setting `spx-proximity="50"` on an href element would instruct SPX to start fetching when the mouse is within `50px` of the element.

<br>

## \{ threshold \}

The throttle limit passed to the Intersection Observer instance controls the rate at which the observer callback is invoked. It helps to limit the frequency of callbacks when elements intersect with the viewport. By default, this throttle limit is set to `250ms`. It's generally discouraged to set this limit to less than `250ms`.

---

## eval

The `eval` option allows you to control the evaluation of specific tags, typically found in the `<head>` region of documents, which either refer to resources or control DOM behavior. It functions similarly to `spx-eval`, but can be used as an alternative to attribute annotations.

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.connect({
  eval: {
    script: [
      'script:not(script[src])'  // SPX defaults to this evaluation
    ],
    style: [
      'style'                   // SPX defaults to evaluate all inline <style> elements
    ],
    link: [
      'link[rel=stylesheet]',  // SPX defaults to evaluating linked stylesheets
      'link[rel~=preload]'     // SPX defaults to evaluating preloads
    ],
    meta: false                // SPX will not evaluate <meta> tag occurrences
  }
});
```

<br>

## \{ script \}

Controls whether `<script>` tags, both inline and with a `src` attribute should be evaluated between page visits. It accepts either a boolean value or a list of selectors. By default, SPX evaluates all inline `<script>` tags but not those with a `src` attribute. It is discouraged to set this option to `true`, and instead, use `spx-eval` directives to control external scripts.

<br>

## \{ style \}

Whether or not `<style>` and/or `<link rel="stylesheet">` tags should evaluate between page visits. This option accepts either a boolean or list of selectors. By default, SPX will always evaluate inline styles. SPX will maintain a cache reference of inline styles and only even re-render changes between visits. Use the link reference for evaluation of stylesheets.

<br>

## \{ link \}

Whether or not `<link>` tags should evaluate between page visits. This option accepts either a boolean or list of selectors. By default, SPX evaluates `<link rel="preload">` and `<link rel="stylesheet">` elements only.

<br>

## \{ meta \}

Whether or not `<meta>` tags should evaluate between page visits. This option accepts either a boolean or list of selectors. By default, SPX ignores `<meta>` tag evaluation. Setting this to true is discouraged.

---

## progress

The `progress` configuration option in SPX offers extensive customization for the progress bar appearance and behavior. By default, SPX will display a simple and unobtrusive progress bar that indicates the loading status of page in transit. The progress bar is typically going to render only when connection or rendering is slow as SPX However, developers can tailor this feature to better suit the design and performance requirements of their web applications.

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.connect({
  progress: {
    bgColor: '#000',
    barHeight: '3px',
    minimum: 0.08,
    easing: 'linear',
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
    threshold: 500
  }
});
```

<br>

## \{ bgColor \}

This option specifies the color of the progress bar. Developers can customize it to match the overall color scheme of their website. Defaults to using an Hex value of `#111` which is a black color.

<br>

## \{ barHeight \}

Determines the height of the progress bar in pixels. Adjusting this value allows developers to control the visual prominence of the progress bar. Defaults to using a height of `3px` which is typically the recommended.

<br>

## \{ minimum \}

Sets the minimum percentage of progress required for the progress bar to be displayed. This can help prevent the progress bar from being displayed too early in the page loading process. Defaults to starting at the `8%` percent mark.

<br>

## \{ easing \}

Applies a CSS easing or cubic-bezier string to the loading transition of the progress bar. This can create smoother and more visually appealing animations. Defaults to using a `linear` easing effect.

<br>

## \{ speed \}

Controls the animation speed of the progress bar. Developers can adjust this value to achieve the desired pacing of the progress indication. Defaults to `200` milliseconds per conclusion animation.

<br>

## \{ trickle \}

Specifies whether to apply trickle/incrementing behavior to the progress bar. When enabled, the progress bar will incrementally fill during prolonged loading periods. Defaults to `true`, enabling trickle.

<br>

## \{ trickleSpeed \}

Adjusts the frequency at which the progress bar trickles or increments. Developers can fine-tune this value to achieve the desired rate of progress indication. Defaults to `200` milliseconds per trickle animation.

<br>

## \{ threshold \}

Defines the time delay before the progress bar is shown. This can help prevent the progress bar from appearing too quickly and disrupting the user experience. Adjusting this value allows developers to control when the progress bar becomes visible during the loading process. Default to showing after `500` milliseconds.

---
