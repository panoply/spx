---
title: 'Components - Directives'
layout: base.liquid
permalink: '/components/directives/index.html'
prev:
  label: 'Session'
  uri: '/introduction/session/'
next:
  label: 'Usage'
  uri: '/usage/installation'
---

# Directives

SPX Components

### Single Component

Connect templates to class components. Elements which are annotated with the `spx-component` attribute require a value matching the class name of an SPX component you wish to connect. By default, SPX will transform class component names to `kebab-case` format.

:::: grid row
::: grid col-6

<!--prettier-ignore-->
```html
<div spx-component="some-demo">

<!-- class SomeDemo -->

</div>
```

:::
::: grid col-6

<!--prettier-ignore-->
```ts
class SomeDemo extends spx.Component {

  // spx-component="some-demo"

}
```

:::
::::

---

### Component State

Component templates annotated with `spx-component` also accept state attributes. State attributes allow you to provide data via the DOM to components in an isolated manner. Components require an interface definition to be provided via the `connect → state` static property (see [state](/components/state)) and use a namespace XML like syntactic structure.

:::: grid row
::: grid col-6

<!--prettier-ignore-->
```html
<div
  spx-component="foo"
  spx-foo:some-string="foo"
  spx-foo:cool-number="1000"
  spx-foo:nice-boolean="true"
  spx-foo:list-array="[ 'string' ]"
  spx-foo:test-object="{ prop: 'x' }"
  spx-foo:screen="window.innerWidth">
  <!--
   Component state references require
   a static connect → state interface
   to be defined in your components!
   -->
</div>
```

:::
::: grid col-6

<!--prettier-ignore-->
```ts
class Foo extends spx.Component {

  static connect = {
    state: {
      someString: String,
      coolNumber: Number,
      niceBoolean: Boolean,
      listArray: Array,
      testObject: Object,
      screen: Number
    }
  }

}
```

:::
::::

---

### State Bindings

<!--prettier-ignore-->
```html
<span spx-bind="name.xxx">

</span>
```

### Multiple Components

<!--prettier-ignore-->
```html
<div
  spx-component="foo|bar|baz"
  spx-foo:some-string="foo-example"
  spx-foo:some-number="1000"
  spx-bar:some-string="bar-example"
  spx-bar:cool-number="2000"
  spx-baz:some-string="baz-example"
  spx-baz:cool-number="3000">

</div>
```

### Component Events

DOM Events can be annotated to elements. The directive uses a simple `spx@` prefix followed by event name. The attribute values use an object dot `.` notation structure of `<component.<method>`

<!--prettier-ignore-->
```html
<button
  spx@click="foo.onPress"
  spx@focus="foo.onFocus">

</button>
```

### Event Attrs

In some cases you may want to pass data to method callbacks in components from a DOM element. The standard (state) directive structure can be used and all annotation will be provided to the event parameter argument in the class method. Event attrs are parsed and the provided **type** will be normalized.

:::: grid row
::: grid col-6

<!--prettier-ignore-->
```html
<button
  spx@click="foo.onPress"
  spx-foo:name="xxx"
  spx-foo:price="100">

  Click Me!

</button>
```

:::
::: grid col-6

<!--prettier-ignore-->
```ts
class Foo extends spx.Component {

  onPress(event) {
    event.attrs.name  // => "xxx"
    event.attrs.price // => 100
  }

}
```

:::
::::

### Component Nodes

<!--prettier-ignore-->
```html
<div spx-node="foo.name">

</div>
```
