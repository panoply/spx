---
title: 'spx-threshold'
layout: base.liquid
group: 'directive'
permalink: '/directives/spx-threshold/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-threshold

By default, this will be set to whatever preset configuration was defined in `spx.connect()` but you can override those settings by annotating the link with this attribute. The `spx-threshold` attribute can only be used on attributes that accept threshold control. The per-page state session will write this to the `threshold` property.

# Attributes

The `spx-threshold` attribute can be used together with one the following attributes:

- `spx-hover`
- `spx-proximity`

# Values

This attribute either a `number` type. You can optionally pass a key reference to target specific attributes when an element is using multiple attribute annotations. Threshold accepts number with decimals, negative numbers will be ignored.

# Example

<!-- prettier-ignore -->
```html
<!-- hover prefetch will begin after 500ms on hover -->
<a
 href="*"
 spx-threshold="500"
 spx-hover>Link</a>

<!-- prefetch will begin after 1s on proximity -->
<a
 href="*"
 spx-threshold="1000"
 spx-proximity>Link</a>

```
