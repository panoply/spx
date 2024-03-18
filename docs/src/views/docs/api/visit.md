---
title: 'Visit'
layout: base.liquid
group: api
permalink: '/api/visit/index.html'
---

# spx.visit

The `visit` method executed a programmatic trigger visit. The method expects a `url` as an argument and optionally accepts an page state options model. This method behaves the same way as trigger.

**Returns:** `Promise<Page>`<br>
**Events:** `replace > request > cache > render > load`

# Example

```js
import spx from 'spx';

spx.visit('/some-path', {});
```
