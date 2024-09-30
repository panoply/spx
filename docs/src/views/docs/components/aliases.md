---
title: 'Components - Aliasing'
permalink: '/components/aliases/index.html'
layout: base.liquid
---

# Aliases

Aliases for SPX Components serve as alternative identifier references. Aliases are made available to component elements by expressing an `as` keyword in `spx-component` attribute values. Whenever an spx component value applies an alias, it can be used as an alternate reference to facilitate the association of [events](/components/events), [nodes](/components/nodes), or [binds](/components/binds) with components mounted within the DOM.

<!-- prettier-ignore -->
```html
<div spx-component="counter as foo">
  <!--
    Passing an as keyword and new assignment of "foo" allows the component to be
    referenced using "foo" as its identifier by events, nodes and binds.
  -->
</div>

<!-- Reference using the foo alias -->
<button spx@click="foo.click"></button>

<!-- Reference using the foo alias -->
<div spx-node="foo.feedback"></div>

<!-- Reference using the foo alias -->
<span spx-bind="foo.count"></span>
```

### Multiple Component Aliases

In some situations you wish to apply multiple aliases to a single elements used by multiple components. You can optionally use a separator of ` `, `|` or `,` characters. Below we are some components called `dog`, `bird` and `shark` - we give each of these components an alias

<!-- prettier-ignore -->
```html
<!-- Using whitespace separator -->
<div spx-component="dog as cat shark as whale">
  <!--
    The aliases of cat and whale are being used to reference dog and shark components
   -->
  <span spx-node="cat.identifier"></span>
  <span spx-node="whale.identifier"></span>
</div>

<!-- Using pipe separator -->
<div spx-component="bird as duck | dog as wolf | shark as fish">
  <!--
    The aliases of duck, wolf and fish and being used to reference bird, dog and shark
   -->
  <input spx@input="duck.method" type="text">
  <input spx@input="wolf.method" type="number">
  <input spx@input="fish.method" type="checkbox">
  <!--
    Below we are referencing the aliases from out first component
    to define some DOM node references
   -->
  <output spx-node="cat.identifier fish.identifier">
</div>
```

---

# Usage

Its not uncommon you'll have multiple occurrences of the same component within the DOM. Using alias identifiers allow you to isolate the associated references and target different component instances. Below a practical example of alias usage, wherein we have 2 separate instances of a component called <strong>counter</strong>.

<!-- prettier-ignore -->
```html
<!--
  These element bindings are associated using component alias
  identifiers as per the 2 counter components defined below.
-->
<span spx-bind="foo.count"></span>
<span spx-bind="bar.count"></span>

<!--
  This component uses an alias of "foo" which we control within
  the "bar" alias component. The "bar" <span> bind is targeted.
-->
<div spx-component="counter as foo">
  <button
    type="button"
    spx@click="bar.click">Bar increment</button>
</div>
<!--
  This component uses an alias of "bar" which we control within
  the "foo" alias component above. The "foo" <span> bind is targeted.
-->
<div spx-component="counter as bar">
  <button
    type="button"
    spx@click="foo.click">Foo Increment</button>
</div>
```

In the above example, we provided aliases on each `spx-component` counter occurrence. One counter component was given an identifier alias value of `foo` and the other component was given an identifier value of `bar`.
