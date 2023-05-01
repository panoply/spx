---
title: 'data-spx-append'
layout: base.liquid
permalink: '/attributes/data-spx-append/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# data-spx-append

Executes a append replacement on visit, where the array list values are used as targets. Index `[0]` will append itself to the index `[1]` value. Multiple append actions can be defined. Each append action is recorded are marked after execution.

# Tags

The `data-spx-append` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `string[][]` type and expects a list of valid element selectors to be provided.

- `(['.foo', '.bar'])`
- `(['.foo' , '.bar'], ['#baz', '#qux'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.

# Example

**PAGE 1**

<!-- prettier-ignore -->
```html
<a
 href="*"
 data-spx-prepend="(['#target-1', '#target-2'])">
 Page 2
</a>

<div id="target-1">
  I will prepend to target-2 on next navigation
</div>

<div id="target-2">
  <p>target-1 will prepended to me on next navigation</p>
</div>

```

**PAGE 2**

<!-- prettier-ignore -->
```html
<a
 href="*"
 data-spx-prepend="(['#target-1', '#target-2'])">
 Page 2
</a>

<div id="target-2">

  <!-- An action reference record is applied -->
  <div data-spx-action="xxxxxxx">
    I am target-1 and have been prepended to target-2
  </div>

  <p>target-1 is now prepended to me</p>

</div>

```
