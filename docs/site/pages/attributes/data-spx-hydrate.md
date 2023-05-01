---
title: 'data-spx-hydrate'
layout: base.liquid
permalink: '/attributes/data-spx-hydrate/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# data-spx-hydrate

Executes a controlled replacement of the defined elements. You should perform hydration when server side logic is required to adjust or apply changes to a visitors session as it will allow your application to seamlessly adapt and progressively align the UI without having to trigger a full-page reload. Hydration incurs side effects and the SPX session will be augmented, see below:

1. Only current and previous page cache is aligned (updated), all other existing records are purged.
2. You cannot restore purged cache. Any `data-spx-cache="restore"` methods will be ignored.
3. Hydration is skipped when target location pathname does not match trigger location pathname.
4. History stack will not be touched, the visit is executed in the background.

# Tags

The `data-spx-hydrate` attribute can be used on the following tags:

- `<a>`
- `<button>`
- `<form>`
- `<input>`

> Triggering via an annotated `<button>` element will execute hydration on current url.

# Values

This attribute is a `string[]` type and expects a list of valid element selectors to be provided.

- `(['.foo'])`
- `(['.foo' , '#bar', '[data-baz]', '[data-qux=foo]'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

# Example

Lets assume we informed SPX to trigger replacements on the `#menu`, `#main` and `#note` between navigations upon connection, for example:

```js
spx.connect({ targets: ['#menu', '#main', '#note'] });
```

When performing a navigation visit the target elements `#menu`, `#main` and `#note` would be replaced (as expected) but when a trigger tag element is using a `data-spx-hydrate` attribute then SPX will only preform replacements on the elements defined within the `data-spx-hydrate` annotation, for example:

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
   data-spx-hydrate="(['.price'])">Perform server side action</a>

</nav>

<!-- This node will not be replaced during hydration visit only on navigation visit -->
<section id="note">
  The next navigation will replace all elements using class "price"
  and "cart-count" - If you have defined the element "#main" as a "target"
  in your connection, a replacement will not be made on that element,
  instead only the elements defined in "data-spx-hydrate" are replaced.
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
<button data-spx-hydrate="(['.cart-count'])">
  Add to cart
</button>

```
