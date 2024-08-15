---
title: 'Components - Aliasing'
permalink: '/components/aliases/index.html'
layout: base.liquid
---

# Aliases

Aliases for SPX Components serve as alternative identifier references. Aliases are made available when component elements include an `id=""` attribute value. An `id` value can be used as an alternative reference to facilitate the association of [events](/components/events), [nodes](/components/nodes), or [binds](/components/binds) with components mounted within the DOM.

<!-- prettier-ignore -->
```html
<div id="foo" spx-component="counter">
  <!--
    Passing an id attribute value of "foo" allows the component to be
    referenced using "foo" as the identifier by events, nodes and binds.
  -->
</div>

<!-- Reference using the id="foo" value -->
<button spx@click="foo.click"></button>

<!-- Reference using the id="foo" value -->
<div spx-node="foo.feedback"></div>

<!-- Reference using the id="foo" value -->
<span spx-bind="foo.count"></span>
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
<div
  id="foo"
  spx-component="counter">
  <button
    type="button"
    spx@click="bar.click">Bar increment</button>
</div>
<!--
  This component uses an alias of "bar" which we control within
  the "foo" alias component above. The "foo" <span> bind is targeted.
-->
<div
  id="bar"
  spx-component="counter">
  <button
    type="button"
    spx@click="foo.click">Foo Increment</button>
</div>
```

In the above example, we provided id values on each `spx-component` counter occurrence. One counter component was given an id value of `foo` and the other component was given an id value of `bar`. Whenever an spx component has an `id` value, it can be used as an alternate reference, so instead of using `counter.<name>`, we can associate events, nodes and bindings using `foo.<name>` or `bar.<name>`.

# Demonstration

{% include 'iframe', url: '/iframe/using-aliases/example', class: 'alias-iframe' %}
