---
title: 'Options'
layout: base.liquid
permalink: '/usage/options/index.html'
prev:
  label: 'Connection'
  uri: '/usage/connection'
next:
  label: 'Resource Evaluation'
  uri: '/usage/resource-evaluation/'
---

# Options

The `spx.connect` method accepts an object of configuration options, all of which are optional (see [connection](/usage/connection)). It is **recommended** that you configure SPX for optimal performance, this would involve setting `targets`, define how evaluations should be handled and refine observers.

<!-- prettier-ignore -->
```js
import spx from 'spx'

spx.connect({
  fragments: ['body'],       // Element selectors that will change
  timeout: 30000,            // Request Timeout limit
  schema: 'spx',             // The data-attribute schema
  manual: false,             // Manually invoke observers
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

A list of element selectors to swap on a per-page basis. By default, SPX will replace the entire `<body>` fragment. It is best to define specific fragments.

```js
import spx from 'spx';

spx.connect({
  fragments: ['body'] // The default fragment is <body>
});
```

---

## globalThis

Whether or not the SPX connection instance should be made available to globalThis (e.g: `window.spx`). This enabled by default, and as such SPX is made accessible in global scope, the instance is assigned as a getter method on documents `window`.

```js
import spx from 'spx';

spx.connect({
  globalThis: true // Access SPX using window.spx
});
```

---

## manual

Whether or not you want to manually invoke observers. This defaults to `false` resulting in all prefetch and related interception observers running upon connection. When disabled (i.e: `false`) the invocation is left up to you. Use the `spx.observe()` method to enable observers.

#### Example

```js
import spx from 'spx';

spx.connect({
  manual: false // Prevents SPX from initializing the internal observers
});
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

## cache

Enable or Disable caching. Each page visit request is cached and used in subsequent visits to the same location. Setting this to `false` is discouraged as all visits will be fetched over the network and `spx-cache` attribute configs will be ignored.

#### Example

```js
spx.connect({
  cache: true // Cache is enabled by default, you should avoid disabling
});
```

---

## maxCache

Cache size limit. SPX limits cache size to `100mb`and once it exceeds that limit, records will be removed starting from the earliest point of known cache entries.

```js
import spx from 'spx';

spx.connect({
  maxCache: 100 // Use smaller limit if your HTML pages are large
});
```

---

## components

Components registry. Expects an `object` type of class components. Components must be passed in raw, SPX will initialize components and establish instances in accordance with template views.

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

## hover

Hover prefetching. You can disable hover pre-fetching by setting this to `false` which will prevent observers from executing and any `spx-hover` attributes will be ignored. To use the default configurations you can set this to `true` or simply omit it.

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

#### Options

<section class="options-accordion" data-relapse>
<details>
<summary>
trigger
</summary>
<div>

How hover prefetches should be triggered. By default this option is set to trigger only when `<a>` href link elements are attributed with a `spx-hover` attribute. You can instruct pjax to execute pre-fetching on all `<a>` elements by setting this option to `href`. If you set the trigger to `href` you can annotate links you wish to exclude from prefetch with `spx-hover="false"`.

</div>
</details>
<details>
<summary>
threshold
</summary>
<div>

Controls the fetch delay threshold, defaults to `250` (250ms). Requests will fire only when the mouse is both within range and the threshold time limit defined here has exceeded.

</div>
</details>
</section>

---

## proximity

Proximity pre-fetching allow for requests to be dispatched when the cursor is within a proximity range of a href link element. Coupling proximity with mouseover prefetches enable predicative fetching to occur, so a request will trigger before any interaction with a link element happens. To use default behavior, set this to `true` and all `<a>` annotated with a `spx-proximity` attribute will be pre-fetched. Annotate any `<a>` links you wish to exclude from pre-fetching using the `spx-proximity="false"`

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

#### Options

<section class="options-accordion" data-relapse>
<details>
<summary>
distance
</summary>
<div>

The proximity distance range defaults to `75`. Distance controls cursor range before the prefetch is triggered. You can optionally override this by assigning a number value on the proximity attribute. An href element using `spx-proximity="50"` would inform SPX to begin fetching when the mouse is within `50px` of the element.

</div>
</details>
<details>
<summary>
throttle
</summary>
<div>

The proximity throttle defaults to `250` (250ms) and controls the mouseover trigger throttle. This helps limit the amount of times an internal callback fires once cursor is in range. It is highly discouraged to set this to a limit less than 250ms.

</div>
</details>
<details>
<summary>
threshold
</summary>
<div>

Controls the fetch delay threshold. Requests will fire only when the mouse has exceeded the range and the threshold time limit defined here has been exceeded.

</div>
</details>
</section>

---

## intersect

Intersection pre-fetching. Intersect pre-fetching leverages the [Intersection Observer](https://shorturl.at/drLW9) API to fire requests when elements become visible in viewport. You can disable intersect pre-fetching by setting this to `false`, otherwise you can customize the intersect fetching behavior.

To use default behavior, set this to `true` and all elements annotated with with a `spx-intersect` or `spx-intersect="true"` attribute will be pre-fetched. You can annotate elements that contain href links or `<a>` elements directly. Annotate any `<a>` links you wish to exclude from intersection pre-fetching using the `spx-intersect="false"`

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

#### Options

<section class="options-accordion" data-relapse>
<details>
<summary>
rootMargin
</summary>
<div>

The proximity distance range defaults to `75`. Distance controls cursor range before the prefetch is triggered. You can optionally override this by assigning a number value on the proximity attribute. An href element using `spx-proximity="50"` would inform SPX to begin fetching when the mouse is within `50px` of the element.

</div>
</details>
<details>
<summary>
threshold
</summary>
<div>

Throttle limit passed to the intersection observer instance.

</div>
</details>
</section>

---

## eval

Control evaluation of specific tags which either refer to resources or control DOM behavior. These are typically tags located in the `<head>` region of documents. This option behaves similar to `spx-eval` with the difference being that it can be used instead of attributes annotations.

<!--prettier-ignore-->
```js
import spx from 'spx';

spx.connect({
  eval: {
    script: ['script:not(script[src])'], // SPX defaults to this evaluation
    style: ['style'], // SPX defaults to evaluate all inline <style> elements
    link: ['link[rel=stylesheet]', 'link[rel~=preload]'], // SPX defaults to this
    meta: false // SPX will not evaluate <meta> tag occurrences
  }
});
```

#### Options

<section class="options-accordion" data-relapse>
<details>
<summary>
script
</summary>
<div>

Whether or not `<script>` and/or `<script src="*">` tags should evaluate between page visits. This option accepts either a `boolean` or list of selectors. By default, SPX will evaluate all inline `<script>` tags but will not evaluate `<script src="">` tags. Setting this to true is discouraged and you should instead leverage attribute annotations for external scripts.

</div>
</details>
<details>
<summary>
style
</summary>
<div>

Whether or not `<style>` and/or `<link rel="stylesheet">` tags should evaluate between page visits. This option accepts either a boolean or list of selectors. By default, SPX will always evaluate inline styles. SPX will maintain a cache reference of inline styles and only even re-render changes between visits. Use the link reference for evaluation of stylesheets.

</div>
</details>
<details>
<summary>
link
</summary>
<div>

Whether or not `<link>` tags should evaluate between page visits. This option accepts either a boolean or list of selectors. By default, SPX evaluates `<link rel="preload">` and `<link rel="stylesheet">` elements only.

</div>
</details>
<details>
<summary>
meta
</summary>
<div>

Whether or not `<meta>` tags should evaluate between page visits. This option accepts either a boolean or list of selectors. By default, SPX ignores `<meta>` tag evaluation. Setting this to true is discouraged.

</div>
</details>
</section>
