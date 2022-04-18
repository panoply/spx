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
