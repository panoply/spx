---
title: 'spx-track'
layout: base.liquid
permalink: '/attributes/spx-track/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-track

The `spx-track` attribute can be placed on elements you wish to track on a per-page basis that might otherwise not be contained within target elements. This method will append nodes to the document `<body>` and placement is not certain. This is helpful when you need to reference an `svg` sprite of template or some sort.

# Tags

The `spx-track` attribute can be annotated on any HTML contained within `<body>` but cannot be applied to `<a>` href links.

# Values

This attribute is a `truthy` type. Passing the `true` value is optional as `spx-track` infers truthy.

- `true`

# Example

Lets assume you are navigating from `Page 1` to `Page 2` and `#main` is your defined target. When you navigate from `Page 1` only the `#main` target will be replaced and any other dom elements will be skipped that are not contained within the `#main` HTML tag. When annotating `spx-track` to elements located outside of target/s which will be added and persisted on all future navigations.

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
<div spx-track>I am outside of target and will be tracked if SPX was initialized on Page 1</div>

<!-- This element will not be appended to the dom -->
<div>I will not be tracked unless SPX was initialized on Page 2</div>
```

> If navigation started on `Page 2` then SPX will have knowledge of the tracked elements existence before navigating away. In such a situation the tracked element is marked internally and the handling will be identical.
