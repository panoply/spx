---
title: 'spx-proximity'
layout: base.liquid
permalink: '/attributes/spx-proximity/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-proximity

Triggers a proximity fetch when the cursor is within range of an `<a>` element. Optionally accepts a `number` value which overrides the `distance` preset configuration.

# Tags

The `spx-proximity` attribute can be annotated on any HTML contained within `<body>`.

# Values

This attribute is a `number` type or a boolean `false`

# Example

<!-- prettier-ignore -->
```html
<!-- This activates proximity based pre-fetch and uses the connection present defaults -->
<a
 href="*"
 spx-proximity></a>

<!-- This url will begin fetching when the mouse is within 100px of the element -->
<a
 href="*"
 spx-proximity="100"></a>

<!-- All <a href="*"> elements will be triggered via proximity -->
<div spx-proximity>

 <!-- These urls will pre-fetch and uses the connection present defaults -->
 <a href="*" ></a>
 <a href="*" ></a>

</div>

```
