---
title: 'data-spx-render'
layout: base.liquid
permalink: '/attributes/data-spx-render/index.html'
prev:
  label: 'data-spx-target'
  uri: '/attributes/data-spx-target'
next:
  label: 'data-spx-replace'
  uri: '/attributes/data-spx-replace/'
---

# data-spx-render

Determine the renderer to leverage when swapping targets. By default, `Element.replaceWith()` method is used, however you prefer to execute node morphs. SPX has [morphdom](https://github.com/patrick-steele-idem/morphdom) cooked into the distribution bundle which perform tree traversal and swaps on _dirty_ (changed) nodes.

Leveraging morph swaps might be preferred in some cases, especially if the target element is only expected to have minor changed per-navigation, something like your `<nav>` element of similar.

In addition, to `morph` renders, you may also desire hard swaps using `Element.innerHTML = Element.innerHTML` during the render cycles. Though this is typically discouraged as `Element.replaceWith` suffices are preferred.

# Tags

The `data-spx-render` attribute can be annotated on `target` elements contained within `<body>`.

# Values

This attribute is a `string` type which accepts one of the following values:

- `morph`
- `replace`
- `inner`

# Example

<!-- prettier-ignore -->
```html
<!-- Inner content will diff before swapping -->
<nav id="navigation" data-spx-render="morph"></nav>

<!-- Inner content will replace -->
<main id="content" data-spx-render="replace"></main>

<!-- Inner content will re-assign -->
<footer id="footer" data-spx-render="inner"></footer>

```
