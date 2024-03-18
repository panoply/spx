---
title: 'spx-cache'
layout: base.liquid
group: 'directive'
permalink: '/directives/spx-cache/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-cache

Controls the caching engine of each SPX navigation. When using `spx-cache` together with prefetch attributes like `spx-hover` the action is respected.

### false

Passing a `false` value will execute a SPX visit that will not be saved to cache and if the link exists in cache it will be removed.

### reset

Passing a `reset` value will remove the cache reference existing at the location of the trigger. A new SPX visit will be executed and the response will saved to cache, replacing the previous record.

### clear

Passing a `clear` value will purge the entire cache store and all records will be removed.

### update

Passing a `update` value will update the page snapshot before moving to a new page.

### restore

Passing a `restore` value will save the current cache to session storage which allows the store to be maintained during page a refresh. The cache will exist in session storage and be restored to memory when another SPX visit is triggered. The restore method can be used together with `spx-disable` or when navigating to an external webpage. If the tab or browser is closed then session storage is purged.

# Tags

The `spx-cache` attribute can be used on the following tags:

- `<a>`
- `<button>`

> When annotating `<button>` elements the action is triggered on current location.

# Values

This attribute is a `string` type and expects on the following values.

- `false`
- `reset`
- `clear`
- `restore` _option is not yet available_

# Example

<!-- prettier-ignore -->
```html

<!-- Disables cache and remove any records that might exists at '/a' -->
<a
 href="/a"
 spx-cache="false"></a>

<!-- Resets the cache of '/b' -->
<a
 href="/b"
 spx-cache="reset"></a>

<!-- Purges all cache references -->
<a
 href="/c"
 spx-cache="clear"></a>

<!-- Saves cache to session storage and restores it on the next SPX visit -->
<a
 href="/d"
 spx-cache="restore"
 spx-disable></a>
```
