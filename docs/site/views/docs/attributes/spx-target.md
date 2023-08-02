---
title: 'spx-target'
layout: base.liquid
permalink: '/attributes/spx-target/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-target

Executes a replacement of defined targets, where each target defined in the array is replaced in the navigation visit. Targets defined in `spx.connect()` will be merged with those defined on this attribute.

# Tags

The `spx-replace` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `string[]` type and expects a list of valid element selectors to be provided.

- `(['.foo'])`
- `(['.foo' , '.bar', '#baz'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

# Example

<!-- prettier-ignore -->
```html

<a
 href="*"
 spx-replace="(['#target1', '#target2'])">
 Link
</a>

<div id="target1">
  I will be replaced on next navigation
</div>

<div id="target2">
  I will be replaced on next navigation
</div>

```
