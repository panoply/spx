---
title: 'Capture'
layout: base.liquid
permalink: '/api/capture/index.html'
prev:
  label: 'spx.fetch'
  uri: '/methods/fetch'
next:
  label: 'spx.reload'
  uri: '/methods/reload/'
---

# spx.capture `spx.capture(targets: string[])`

The `capture` method performs a snapshot modification to the current document. Use this to align a snapshot cache record between navigations. This is helpful in situations where the dom is augmented and you want to preserve

**Returns:** `Promise<IPage>`

# Example

```js
import spx from 'spx';

spx.capture(['span.price', 'select.sizes']);
```

```html
<div>
  <span class="price">1000 SEK</span>
  <span class="price">2000 SEK</span>
</div>

<select>
  <option>XS</option>
  <option>S</option>
  <option>M</option>
  <option>L</option>
  <option>XL</option>
</select>
```
