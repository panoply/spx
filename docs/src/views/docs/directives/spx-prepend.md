---
title: 'spx-prepend'
layout: base.liquid
group: 'directive'
permalink: '/directives/spx-prepend/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-prepend

Executes a prepend replacement on visit, where the array list values are used as targets. Index `[0]` will prepend itself to the index `[1]` value. Multiple prepend actions can be defined. Each prepend action is recorded are marked after execution.

# Tags

The `spx-prepend` attribute can be used on the following tags:

- `<a>`

# Values

This attribute is a `string[][]` type and expects a list of valid element selectors to be provided.

- `(['.foo', '.bar'])`
- `(['.foo' , '.bar'], ['#baz', '#qux'])`

> The surrounding parenthesis `()` characters are optional and can be omitted.
