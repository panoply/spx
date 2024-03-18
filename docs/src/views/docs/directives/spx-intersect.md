---
title: 'spx-intersect'
layout: base.liquid
group: 'directive'
permalink: '/directives/spx-intersect/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-intersect

The `spx-intersect` attribute provides DOM driven control of the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API. The attribute value will determine operation context to SPX which allows you execute different functionalities in accordance with intersection matches.

# Prefetch

Annotating link elements with `spx-intersect` or `spx-intersect="true"` signals to SPX that a prefetch should take place when the node containing the attribute become visible in viewport. If you've defined [Intersect](/usage/options#intersect) options like `rootMargin` and `threshold` then they will be used when carrying out the prefetch. The `spx-intersect` or `spx-intersect="true"` can also be used on elements which contain `<a>` descendants when you want SPX to automatically execute prefetches on all `<a>` within.

::: note
When using element annotation to target contained `<a>` descendant, you can exclude certain links from intersection prefetching using the `spx-intersect="false"` attribute.
:::

# Triggers

Intersection triggers can perform append, prepend or replace operations when viewport matches occur. Passing a value of `append`, `prepend` or `replace` to the `spx-intersect` attribute will result in an execution operation. Triggers require the value operation attribute be provided and can only be used on link `<a>` elements.

Using intersection triggers are helpful in cases where you require scroll position to invoke fetching. The [Infinite Scrolling](/examples/infinite-scrolling/) example shows how this method can be used to perform infinite pagination.

::: note
You need to provide the value defined attribute to perform intersection triggers. For example, if you provide an append trigger via `spx-intersect="append"` then you will need to also pass the `spx-append=""` attribute.
:::

# Example

<!-- prettier-ignore -->
```html

<!-- Intersecting <a> elements -->
<ul>
  <li>
    <a href="*" spx-intersect>Home</a>
  </li>
  <li>
    <a href="*" spx-intersect>About</a>
  </li>
</ul>

<!-- Intersecting <a> elements contained in this div -->
<div data-intersect="true">


  <a href="*">I will be prefetched</a>
  <a href="*">I will be prefetched</a>

  <a href="*" spx-intersect="false">
    I will not be prefetched
  </a>

  <a href="*">I will be prefetched</a>
  <a href="*">I will be prefetched</a>

  <a href="*" spx-intersect="false">
    I will not be prefetched
  </a>

</div>

```
