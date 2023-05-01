---
title: 'data-spx-history'
layout: base.liquid
permalink: '/attributes/data-spx-history/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# data-spx-history

Controls the history pushstate for the navigation. Accepts `false`, `replace` or `push` value. Passing in `false` will prevent the navigation from being added to history. Passing in `replace` or `push` will execute its respective value to pushstate to history.

# Tags

The `data-spx-history` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `string` type and expects on the following values.

- `false`
- `replace`
- `push`

# Example

```html
<!-- the navigation not be pushed to history -->
<a href="*" data-spx-history="false"></a>
```
