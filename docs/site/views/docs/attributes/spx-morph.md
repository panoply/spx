---
title: 'spx-morph'
layout: base.liquid
permalink: '/attributes/spx-morph/index.html'
prev:
  label: 'spx-target'
  uri: '/attributes/spx-target'
next:
  label: 'spx-replace'
  uri: '/attributes/spx-replace/'
---

# spx-morph

Controls DOM morphing operation. This attribute will be referenced during dom diffing and behave in accordance. The `spx-morph` attribute is only available when using the `morph` renderer. SPX implements a hard-forked variation of [morphdom](https://github.com/patrick-steele-idem/morphdom) algorithm into the distribution bundle. For each page render taking place, SPX will execute tree traversal and swap _dirty_ (changed) nodes.

DOM Morphs are a powerful capability and allow SPX to achieve measurable performance gains between navigations. The `spx-morph` attribute allows for seamless swaps to take place and ensures that each render operation concludes according to expectation.

# Tags

The `spx-morph` attribute can be annotated on `target` elements contained within `<body>` but cannot be applied to link targets.

# Values

This attribute is a `string` type which accepts one of the following values:

- `attrs`
- `text`
- `children`
- `preserve`

---

# attrs

Passing a value of `attrs` instructs SPX to apply morphs to the containing element only.

# children

Passing a value of `children` instructs SPX to apply morphs to descendent nodes of the annotated element, while preserving the element containing the attribute. This is helpful when you require morphs to apply exclusively to child nodes. If you are using a framework like Stimulus this may be required to apply on controllers.

##### Example

In the below example, we will assume the that `data-attr` value will change on page 2, but because we have annotated the element with `spx-morph="children"` the attributes will not be touched, only the descendent nodes will morph.

<!-- prettier-ignore -->
```html

<nav
  id="navigation"
  data-attr="Hello World"
  spx-morph="children">
  <ul>
    <li>
      <a href="/page-1" class="active">Page 1</a>
    </li>
    <li>
      <a href="/page-2">Page 2</a>
    </li>
  </ul>
</nav>
```

# preserve

Passing a value of `preserve` instructs SPX to skips morphs on the containing elements and all of its descendent nodes. Using `preserve` annotations will persist contents between navigations, regardless if inner contents has changed.

###### Example

<!-- prettier-ignore -->
```html
<!-- Morph will only apply to children -->
<nav id="navigation" spx-morph="children"></nav>

<!-- Inner content will not be replaced -->
<aside id="content" spx-morph="false"></aside>

```
