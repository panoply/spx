---
title: 'Clear'
layout: base.liquid
group: api
permalink: '/api/clear/index.html'
---

# spx.clear

Removes pages and snapshots from the in-memory session store. Optionally accepts a single `key` value or a `string[]` list of `key` values and when provided will remove those records passed.

# Example

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.clear(): void

spx.clear('/path-1'): void

spx.clear(['/path-1', '/path-2', '/path-3']): void

```
