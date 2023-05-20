---
title: 'data-spx-threshold'
layout: base.liquid
permalink: '/attributes/data-spx-threshold/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# data-spx-threshold

By default, this will be set to whatever preset configuration was defined in `spx.connect()` but you can override those settings by annotating the link with this attribute. The `data-spx-threshold` attribute can only be used on attributes that accept threshold control. The per-page state session will write this to the `threshold` property.

# Attributes

The `data-spx-threshold` attribute can be used together with one the following attributes:

- `data-spx-hover`
- `data-spx-proximity`

# Values

This attribute either a `number` type. You can optionally pass a key reference to target specific attributes when an element is using multiple attribute annotations. Threshold accepts number with decimals, negative numbers will be ignored.

# Example

<!-- prettier-ignore -->
```html
<!-- hover prefetch will begin after 500ms on hover -->
<a
 href="*"
 data-spx-threshold="500"
 data-spx-hover>Link</a>

<!-- prefetch will begin after 1s on proximity -->
<a
 href="*"
 data-spx-threshold="1000"
 data-spx-proximity>Link</a>

```
