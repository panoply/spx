---
title: 'spx-progress'
layout: base.liquid
permalink: '/attributes/spx-progress/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-progress

Controls the progress bar delay. By default, progress will use the threshold defined in configuration presets defined upon connection, else it will use the value defined on link attributes. Passing in a value of `false` will disable the progress from showing.

# Tags

The `spx-progress` attribute can be used on the following tags:

- `<a>`
- `<button>`
- `<form>`
- `<input>`

# Values

This attribute can be `number` or boolean `false` type. You must provide a number greater than or equal to 100, negative numbers will be ignored.

# Example

```html
<!-- Progress bar will be displayed if the request exceeds 500ms -->
<a href="*" spx-progress="500"></a>

<!-- Progress bar will not be displayed -->
<a href="*" spx-progress="false"></a>
```
