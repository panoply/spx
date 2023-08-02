---
title: 'spx-hover'
layout: base.liquid
permalink: '/attributes/spx-hover/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-hover

Performs a prefetch of the `href` url upon mouse enter (hover). By default, hover pre-fetching is enabled and does expect attribute annotation on links to be provided. You can have SPX execute prefetch only specific `<a>` links by setting the `trigger` option to `attribute` in `spx.connect()`.

If you have set `trigger` to `href` (which is the default) then you do not need to define any attribute on links unless you wish to skip execution from occurring, in such a case you'd annotate the href element with a `false` hover attribute, eg: `<a spx-hover="false">`.

If you set hover pre-fetching to `false` in your `spx.connect()` settings then annotations will be ignored and hover pre-fetching will be disabled.

> On mobile devices the the prefetch will execute on the `touchstart` event

# Tags

The `spx-hover` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `boolean` type. Passing the `true` value is optional as `spx-hover` infers truthy.

- `true`
- `false`

# Example

```html
<!-- This link will be prefetch when it is hovered -->
<a href="*" spx-hover></a>

<!-- This link will be excluded from prefetch when hovered -->
<a href="*" spx-hover="false"></a>
```
