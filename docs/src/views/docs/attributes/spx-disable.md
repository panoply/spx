---
title: 'spx-disable'
layout: base.liquid
permalink: '/attributes/spx-disable/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-disable

Use on `<a>` elements to disable SPX navigation. When a link element is annotated with `spx-disable` a normal page navigation will be executed and cache will be cleared. You can optionally restore the cache using the `spx-cache="restore"` attribute when navigating back to a SPX enabled url.

# Tags

The `spx-disable` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `truthy` type. Passing the `true` value is optional as `spx-disable` infers truthy.

- `true`

# Examples

Clicking this link will clear cache and a normal page navigation will be executed.

```html
<a href="*" spx-disable></a>
```

Clicking this link will execute a normal page navigation but will inform SPX to save the current cache and restore it upon the next SPX enabled visit. See [spx-cache](#spx-cache) for more information.

```html
<a href="*" spx-cache="restore" spx-disable></a>
```
