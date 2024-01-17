---
title: 'spx-scroll'
layout: base.liquid
permalink: '/attributes/spx-scroll/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-scroll

Sets scrollTop position, can be used as a simpler alias to `spx-position`.

# Tags

The `spx-threshold` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `number` type. The value requires a key definition to be defined to inform upon position.

- `0`
- `100`

# Example

<!-- prettier-ignore -->
```html
<!-- This next navigation will load at 1000px from top of page  -->
<a
 href="*"
 spx-scroll="1000"></a>

<!-- This next navigation will load at 0 from top of page  -->
<a
 href="*"
 spx-scroll="0"></a>

```
