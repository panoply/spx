---
title: 'data-spx-hover'
layout: base.liquid
permalink: '/attributes/data-spx-hover/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# data-spx-hover

Performs a prefetch of the `href` url upon mouse enter (hover). By default, hover pre-fetching is enabled but expects attribute annotation on links. You can have SPX execute pre-fetching on all `<a>` links by setting the `trigger` option to `href` in `spx.connect()`. If you have set `trigger` to `href`then you do not need to define the attribute on links, unless you wish to skip executing the pre-fetch for occurring, in such a case your annotate the href element with a `false` hover attribute, eg: `<a data-spx-hover="false">`.

If you set hover pre-fetching to `false` in your `spx.connect()` settings then annotations will be ignored and hover pre-fetching will be disabled.

> On mobile devices the the prefetch will execute on the `touchstart` event

# Tags

The `data-spx-hover` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `boolean` type. Passing the `true` value is optional as `data-spx-hover` infers truthy.

- `true`
- `false`

# Example

```html
<!-- This link will be prefetch when it is hovered -->
<a href="*" data-spx-hover></a>

<!-- This link will be excluded from prefetch when hovered -->

<a href="*" data-spx-hover="false"></a>
```
