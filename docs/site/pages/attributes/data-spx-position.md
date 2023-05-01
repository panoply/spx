---
title: 'data-spx-position'
layout: base.liquid
permalink: '/attributes/data-spx-position/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# data-spx-position

Sets the scroll position of the next navigation. This is a space separated expression with colon separated prop and value.

# Tags

The `data-spx-threshold` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `number` type. The value requires a key definition to be defined to inform upon position.

- `y:0`
- `x:0`
- `y:0 x:0`

# Example

<!-- prettier-ignore -->
```html
<!-- This next navigation will load at 1000px from top of page  -->
<a
 href="*"
 data-spx-position="y:1000 x:0"></a>

<!-- This next navigation will load at 250px from top of page  -->
<a
 href="*"
 data-spx-position="y:250"></a>

```
