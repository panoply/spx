> _This is still in beta stages, use it with care and expect some changes to be shipped before official release. Tests are still being worked on and will be pushed at official v1, sit tight._

## @brixtol/pjax

Functional, blazing fast, lightweight (9kb gzipped) and feature full new generation pjax solution for instantaneous page navigation of SSR web applications. This pjax variation supports multiple fragment replacements, advanced pre-fetching capabilities executing via mouse, pointer, touch or intersection events and employs a snapshot caching engine to prevent subsequent requests from occurring.

### Features

- Simple and painless integration
- Pre-fetching capabilities using click, hover and intersect
- Snapshot caching engine and per-page state control.
- Powerful target and document triggered lifecycle event dispatching
- Client side DOM hydration approach approach
- Supports both append and prepend fragment replacements
- Dependency management system
- Couples perfectly with [stimulus.js](https://stimulusjs.org/).

##### Demo

We are using this module live on our [webshop](https://brixtoltextiles.com).

### Why?

The landscape of pjax based solution has become rather scarce. The current bread winners either offer the same thing or for our use case were vastly over engineered. This pjax variation couples together various techniques found to be the most effective in enhancing the performance of SSR rendered web application which are fetching pages over the wire.

## Install

```cli
pnpm add @brixtol/pjax
```

> _Because [pnpm](https://pnpm.js.org/en/cli/install) is dope and does dope shit._

## Usage

To initialize, call `pjax.connect()` in your bundle, preferably before anything else renders. Optionally pass preset configuration. By default the entire `<body>` fragment is replaced upon each navigation. You should define a set of `targets[]` whose inner contents change on a per-page basis for optimal performance.

> The typings provided in this package will describe each option in good detail, below are the defaults and all options are optional.

<!-- prettier-ignore -->
```js
import * as pjax from "@brixtol/pjax";

pjax.connect({
  targets: [ 'body' ],
  schema: 'pjax',
  timeout: 30000,
  poll: 15,
  async: true,
  cache: true,
  reverse: true,
  limit: 25,
  mouseover: {
    trigger: 'href',
    threshold: 100
  },
  intersect: {
    rootMargin: '',
    threshold: 0
  },
  proximity: {
    bounding: 0,
    threshold: 100
  },
  progress: {
    threshold: 850,
    minimum: 0.1,
    speed: 225,
    trickle: true,
    colour: '#111',
    height: '2px',
    easing: 'ease'
  }
});

```

#### Real World

Below is a real world example you can use to better understand how this module works and how it can be applied to your web application. We are working on providing a live demonstration for more advanced use cases but the below example should give you a good understanding of how to leverage this module.

<details>
<summary>
Example
</summary>

The first thing we want to do is make a connection with Pjax. In your JavaScript bundle we need to initialize it (connect). Our example web application has 3 pages, the **home** page, **about** page and **contact** page. We are going to instruct pjax to replace the `<nav>` and `<main>` fragments on every visit and then we are going to leverage `data-pjax` attributes to replace an additional fragment when we navigate to the contact page.

<br>
<strong>JavaScript Bundle</strong>
<br>

<!-- prettier-ignore -->
```javascript
import * as Pjax from "@brixtol/pjax";


Pjax.connect({ targets: ["nav", "main"] });


```

**Home Page**

<br>
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
         data-pjax-mouseover>About</a>

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

**About Page**
<br>

The about page in our web application would look practically identical to the home page. We instructed pjax to pre-fetch this page upon hover by annotating the `<a>` href link with `data-pjax-mouseover` attribute. This attribute informs pjax to being fetching the page the moment the user hovers over the `<a>` link which results in the visit being instantaneous. The **about** page only has some minor differences, but for the sake of clarity, lets have look:

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
         data-pjax-mouseover>About</a>

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

**Contact Page**
<br>

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
         data-pjax-mouseover>About</a>

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

# Lifecycle Events

Lifecycle events are dispatched to the document upon each navigation. You can access contextual information from within the `event.detail` property. You can also cancel events with `preventDefault()` or by returning boolean `false` if you wish to prevent execution from occurring in a certain lifecycle.

The Pjax lifecycle events are dispatched in the following order of execution:

1. **pjax:prefetch**
2. **pjax:trigger**
3. **pjax:request**
4. **pjax:cache**
5. **pjax:render**
6. **pjax:load**
7. **pjax:module**

## Events

<!-- prettier-ignore -->
```javascript

// Triggered when a prefetch is triggered
document.addEventListener("pjax:prefetch");

// Triggered when a mousedown event occurs on a link
document.addEventListener("pjax:trigger");

// Triggered before a page is fetched over XHR
document.addEventListener("pjax:request");

// Triggered before a page is cached
document.addEventListener("pjax:cache");

// Triggered before a page or fragment is rendered
document.addEventListener("pjax:render");

// Triggered before a fragment is hydrated
document.addEventListener("pjax:hydrate"); // { detail: { target: HTMLElement } }

// Triggered after a page has rendered
document.addEventListener("pjax:load");

// Triggered when a JavaScript module is loaded
document.addEventListener("pjax:module");
```

# Methods

In addition to Lifecycle events, you also have a list of methods available. Methods will allow you some basic programmatic control of the Pjax session occurring, provides access to the cache store and various other operational utilities.

```typescript

// Check to see if Pjax is supported by the browser
pjax.supported: boolean

// Connects Pjax, called upon initialization
pjax.connect(options?): void

// Returns the current page state reference
pjax.current(): IPage

// Execute a programmatic pjax visit
pjax.visit(url?, options?): Promise<Page{}>

// Access the cache, pass in href for specific record
pjax.cache(url?): Page{}

// Returns a snapshot
pjax.snapshot(url?, options?): Document | { [id: string]: string }

// Clears the cache, pass in url to clear specific record
pjax.clear(url?): void

// Returns a UUID string via nanoid
pjax.uuid(size = 16): string

// Reloads the current page
pjax.reload(): Page{}

// Disconnects Pjax
pjax.disconnect(): void

```

# Attributes

Elements can be annotated with `data-pjax-*` attributes which you can leverage to customize how visits are rendered between navigations. By default, attributes are using a `-pjax-` schema but you can optionally provide a custom schema upon `connect` via the `schema` option.

- [data-pjax-eval](#data-pjax-eval)
- [data-pjax-disable](#data-pjax-disable)
- [data-pjax-hydrate](#data-pjax-hydrate)
- [data-pjax-replace](#data-pjax-replace)
- [data-pjax-prepend](#data-pjax-prepend)
- [data-pjax-append](#data-pjax-append)
- [data-pjax-mouseover](#data-pjax-mouseover)
- [data-pjax-threshold](#data-pjax-threshold)
- [data-pjax-position](#data-pjax-position)
- [data-pjax-cache](#data-pjax-cache)
- [data-pjax-history](#data-pjax-history)

## data-pjax-eval

Used on resources contained within the `<head>` fragment like styles, scripts or meta tags. Use this attribute if you want pjax to evaluate scripts and/or stylesheets. This option accepts a `false` value so you can define which scripts to execute on each navigation. By default, pjax will run and evaluate all `<script>` tags it detects for every page visit but will not re-evaluate `<script src="*"></script>` tags.

> When a `<script>` tag is detected on a pjax navigation and annotated with `data-pjax-eval="false"` then execution will be triggered only once upon but never again after that.

#### Tags

The `data-pjax-eval` attribute can be annotated on any of the below HTML tags:

- `<meta>`
- `<link>`
- `<style>`
- `<script>`

#### Values

This attribute is a `boolean` type. Passing the `true` value is optional as `data-pjax-eval` infers truthy.

- `true`
- `false`

<details>
<summary>
Example
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

#### Tags

The `data-pjax-disable` attribute can be used on the following tags:

- `<a>`

#### Values

This attribute is a `truthy` type. Passing the `true` value is optional as `data-pjax-disable` infers truthy.

- `true`

<details>
<summary>
Examples
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

Place on elements to track on a per-page basis that might otherwise not be contained within target elements.

#### Tags

The `data-pjax-track` attribute can be annotated on any HTML contained within `<body>` but cannot be applied to `<a>` href links.

#### Values

This attribute is a `truthy` type. Passing the `true` value is optional as `data-pjax-track` infers truthy.

- `true`

<details>
<summary>
Example
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

#### Tags

The `data-pjax-hydrate` attribute can be used on the following tags:

- `<a>`
- `<button>`
- `<form>`
- `<input>`

> Triggering via an annotated `<button>` element will execute hydration on current url.

#### Values

This attribute is a `string[]` type and expects a list of valid element selectors to be provided.

- `(['.foo'])`
- `(['.foo' , '#bar', '[data-baz]', '[data-qux=foo]'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

<details>
<summary>
Example
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

Executes a replacement of defined targets, where each target defined in the array is replaced in the navigation visit.

#### Tags

The `data-pjax-replace` attribute can be used on the following tags:

- `<a>`

#### Values

This attribute is a `string[]` type and expects a list of valid element selectors to be provided.

- `(['.foo'])`
- `(['.foo' , '.bar', '#baz'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

<details>
<summary>
Example
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

Executes a prepend visit, where the array list values are used as targets. Index `[0]` will prepend itself to the index `[1]` value. Multiple prepend actions can be defined. Each prepend action is recorded are marked after execution.

#### Tags

The `data-pjax-prepend` attribute can be used on the following tags:

- `<a>`

#### Values

This attribute is a `string[][]` type and expects a list of valid element selectors to be provided.

- `(['.foo', '.bar'])`
- `(['.foo' , '.bar'], ['#baz', '#qux'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

<details>
<summary>
Example
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

## data-pjax-mouseover

Performs a prefetch of the `href` url upon mouseover (hover). By default, mouseover pre-fetching is enabled but expects attribute annotation on links. You can have pjax execute pre-fetching on all `<a>` links by setting `trigger` to `href` in `pjax.connect()`. If you have set `trigger` to `href`then you you do not need to define the attribute on links, unless you wish to skip executing the pre-fetch, eg: `<a data-pjax-mouseover="false">`. If you set mouseover pre-fetching to `false` in your `pjax.connect()` settings then annotations will be ignored and mouseover pre-fetching will be disabled.

> On mobile devices the `mouseover` value will execute on the `touchstart` event

#### Tags

The `data-pjax-mouseover` attribute can be used on the following tags:

- `<a>`

#### Values

This attribute is a `boolean` type. Passing the `true` value is optional as `data-pjax-mouseover` infers truthy.

- `true`
- `false`

<details>
<summary>
Example
</summary>

```html
<!-- This link will be prefetch when it is hovered -->
<a href="*" data-pjax-mouseover></a>

<!-- This link will be excluded from prefetch when hovered -->
<a href="*" data-pjax-mouseover="false"></a>
```

</details>

## data-pjax-threshold

By default, this will be set to `100` or whatever preset configuration was defined in `pjax.connect()` but you can override those settings by annotating the link with this attribute. The `data-pjax-threshold` attribute should be used together attributes that accept threshold control.

#### Attributes

The `data-pjax-threshold` attribute can be used together with the following attributes:

- `data-pjax-mouseover`
- `data-pjax-intersect`
- `data-pjax-proximity`

#### Values

This attribute either a `number` type. You can optionally pass a key reference to target specific attributes when an element is using multiple attribute annotations. Threshold accepts number with decimals, negative numbers will be ignored.

<details>
<summary>
Example
</summary>

<!-- prettier-ignore -->
```html
<!-- hover prefetch will begin after 500ms on mouseover -->
<a
 href="*"
 data-pjax-threshold="500"
 data-pjax-mouseover>Link</a>

<!-- prefetch will begin after 500ms on mouseover -->
<!-- prefetch will begin after 1s on proximity -->
<a
 href="*"
 data-pjax-threshold="mouseover:500 proximity:1000"
 data-pjax-mouseover
 data-pjax-proximity>Link</a>

<!-- prefetch will begin after 500ms on mouseover and proximity -->
<a
 href="*"
 data-pjax-threshold="500"
 data-pjax-mouseover
 data-pjax-proximity>Link</a>

<!-- Prefetch will begin 1s after this link becomes visible in viewport -->
<div data-pjax-threshold="1000" data-pjax-intersect>

  <!-- Prefetch will begin after 1s as per the threshold defined on the parent -->
  <a
   href="*">link</a>

  <!-- This threshold will be used and fetch will begin after 100ms instead of 1s -->
  <a
   href="*"
   data-pjax-threshold="100">link</a>

  <!-- Prefetch will be disabled -->
  <a
   href="*"
   data-pjax-intersect="false">link</a>

  <!-- Prefetch will be disabled on intersection by trigger on mouseover after 300ms -->
  <a
   href="*"
   data-pjax-intersect="false"
   data-pjax-threshold="300"
   data-pjax-mouseover>link</a>

</div>
```

</details>

## data-pjax-position

Sets the scroll position of the next navigation. This is a space separated expression with colon separated prop and value.

#### Tags

The `data-pjax-threshold` attribute can be used on the following tags:

- `<a>`

#### Values

This attribute is a `number` type. The value requires a key definition to be defined to inform upon position.

- `y:0`
- `x:0`
- `y:0 x:0`

<details>
<summary>
Example
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

Controls the caching engine of each pjax navigation. When using `data-pjax-cache` together with prefetch attributes like `data-pjax-mouseover` the action is respected.

#### `false`

Passing a `false` value will execute a pjax visit that will not be saved to cache and if the link exists in cache it will be removed.

#### `reset`

Passing a `reset` value will remove the cache reference existing at the location of the trigger. A new pjax visit will be executed and the response will saved to cache, replacing the previous record.

#### `clear`

Passing a `clear` value will purge the entire cache store and all records will be removed.

#### `restore`

Passing a `restore` value will save the current cache to session storage which allows the store to be maintained during page a refresh. The cache will exist in session storage and be restored to memory when another pjax visit is triggered. The restore method can be used together with `data-pjax-disable` or when navigating to an external webpage. If the tab or browser is closed then session storage is purged.

#### Tags

The `data-pjax-cache` attribute can be used on the following tags:

- `<a>`
- `<button>`

> When annotating `<button>` elements the action is triggered on current location.

#### Values

This attribute is a `string` type and expects on the following values.

- `false`
- `reset`
- `clear`
- `restore`

<details>
<summary>
Example
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

#### Tags

The `data-pjax-history` attribute can be used on the following tags:

- `<a>`

#### Values

This attribute is a `string` type and expects on the following values.

- `false`
- `replace`
- `push`

<details>
<summary>
Example
</summary>

```html
<!-- the navigation not be pushed to history -->
<a href="*" data-pjax-history="false"></a>
```

</details>

## data-pjax-progress

Controls the progress bar delay. By default, progress will use the threshold defined in configuration presets defined upon connection, else it will use the value defined on link attributes. Passing in a value of `false` will disable the progress from showing.

#### Tags

The `data-pjax-progress` attribute can be used on the following tags:

- `<a>`
- `<button>`
- `<form>`
- `<input>`

#### Values

This attribute can be `number` or boolean `false` type. You must provide a number greater than or equal to 100, negative numbers will be ignored.

<details>
<summary>
Example
</summary>

```html
<!-- Progress bar will be displayed if the request exceeds 500ms -->
<a href="*" data-pjax-progress="500"></a>

<!-- Progress bar will not be displayed -->
<a href="*" data-pjax-progress="false"></a>
```

</details>

## State

Each page visited has a state value. Page state is immutable and created for every unique url `/path` or `/pathname?query=param` location that has been encountered throughout the pjax session. The state value of each page is added to its pertaining History stack record and it will be referenced on subsequent visits. This approach drastically improves TTFB and provides a specific store for every page.

> Navigation sessions begin once a Pjax connection has been established and ends when a browser refresh is executed or url origin changes. You can maintain and restore sessions using cache methods.

#### Read

You can access page state via the `event.details.state` property provided in certain dispatched lifecycle events or via the `pjax.cache()` method. The caching engine used by this Pjax variation acts as mediator when a session begins, when you access page state via the `pjax.cache()` method you are given a bridge to the object that holds all active sessions of the cache store kept in browser memory.

#### Write

State modifications can be carried out using attributes, method or from within dispatched events. When using the `Pjax.visit()` method you can apply state modification to the `options` parameter and changes will be merged before a visit begins. You should avoid modifying state outside of the available methods, treat state as **read only** and architect your application to prevent direct augmentation.

```typescript
interface IPage {
  /**
   * The list of fragment target element selectors defined upon connection.
   * Targets are inherited from `Pjax.connect()` presets.
   *
   * > You cannot override the targets but you can skip replacements using
   * `hydrate` to replace specific fragments.
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
   * The Document title
   */
  title?: string;

  /**
   * Should this fetch be pushed to history
   */
  history?: boolean;

  /**
   * List of fragments to replace. When `hydrate` is used,
   * it will run precedence over `targets` and execute replacements
   * on the triggered page fragments.
   *
   * @example
   * ['#main', '.header', '[data-attr]', 'header']
   */
  hyrdate?: null | string[];

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
   *
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  append?: null | Array<[from: string, to: string]>;

  /**
   * List of fragments to be prepend from and to. Accepts multiple.
   *
   * @example
   *
   * [['#main', '.header'], ['[data-attr]', 'header']]
   */
  prepend?: null | Array<[from: string, to: string]>;

  /**
   * Controls the caching engine for the link navigation.
   * Option is enabled when `cache` preset config is `true`.
   * Each pjax link can set a different cache option.
   */
  cache?: boolean | 'reset' | 'clear' | 'restore';

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
   * Location URL
   */
  location: {
    /**
     * The URL origin name
     *
     * @example
     * 'https://website.com'
     */
    origin?: string;
    /**
     * The URL Hostname
     *
     * @example
     * 'website.com'
     */
    hostname?: string;

    /**
     * The URL Pathname
     *
     * @example
     * '/pathname' OR '/pathname/foo/bar'
     */
    pathname?: string;

    /**
     * The URL search params
     *
     * @example
     * '?param=foo&bar=baz'
     */
    search?: string;

    /**
     * The URL Hash
     *
     * @example
     * '#foo'
     */
    hash?: string;

    /**
     * The previous page path URL, this is also the cache identifier.
     * If `cache.reverse` is `true` then preemptive fetches will be
     * executed to this location.
     *
     * @example
     * '/pathname' OR '/pathname?foo=bar'
     */
    lastpath?: string;
  };

  /**
   * HTML string of the page
   */
  get snapshot(): string;
}
```

## Contributing

This module is written in TypeScript. Production bundles exports to ES2015. This project has been open sourced from within a predominantly closed source mono/multi repo. We will update it according to what we need. Feel free to suggest features or report bugs and PR's are welcome!

## Acknowledgements

This module combines concepts originally introduced by other awesome Open Source projects:

- [Defunkt Pjax](https://github.com/defunkt/jquery-pjax)
- [Pjax.js](https://github.com/brcontainer/pjax.js)
- [MoOx Pjax](https://github.com/MoOx/pjax)
- [InstantClick](https://github.com/dieulot/instantclick)
- [Turbo](https://github.com/hotwired/turbo)
- [Turbolinks](https://github.com/turbolinks/turbolinks)

## License

Licensed under [MIT](#LICENCE)

---

We [♡](https://www.brixtoltextiles.com/discount/4D3V3L0P3RS]) open source!
