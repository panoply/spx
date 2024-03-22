---
permalink: '/components/directives/index.html'
title: Components - Directives
layout: base.liquid
---

# Markup

TODO

---

# Components

To connect templates to class components in SPX, elements annotated with the `spx-component` attribute require a value matching the class name of the SPX component you intend to connect. By default, SPX transforms class component names to `kebab-case` format.

:::: grid row gx-3
::: grid col-6

<!--prettier-ignore-->
```ts
class SomeDemo extends spx.Component {

  // spx-component="some-demo"

}
```

:::
::: grid col-6

<!--prettier-ignore-->
```html
<div spx-component="some-demo">

<!-- class SomeDemo -->

</div>
```

:::
::::

---

# State

Component templates annotated with `spx-component` also accept state attributes. These state attributes enable you to provide data via the DOM to components in an isolated manner. Components require an interface definition provided via the `connect → state` static property (refer to [state](/components/state)). This interface utilizes a namespace XML-like syntactic structure.

:::: grid row gx-3
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
::::

---

# Bind

The `spx-bind` directive can be used on elements which you want bound to a `state` value. Elements marked as a component binding will reflect the value of a state change in real-time and persisted across page visits. You can define bindings by passing a component identifier name and state key name.

:::: grid row gx-3
::: grid col-6

<!--prettier-ignore-->
```ts
class Demo extends spx.Component {

  static define = {
    state: {
      count: Number
    }
  }

}
```

:::
::: grid col-6

<!--prettier-ignore-->
```html
<div
  spx-component="demo"
  spx-demo:count="0">
  <!--
    This innerText will reflect
    the this.state.count value
  -->
  <span spx-bind="demo.count"></span>
</div>
```

:::
::::

---

# Events

DOM Events can be annotated to elements using the `spx@` prefix followed by the event name. The attribute values follow a simple object dot `.` notation structure of `<component>.<method>`.

:::: grid row gx-3
::: grid col-6

<!--prettier-ignore-->
```ts
class Demo extends spx.Component {

  onClick() {}

  onFocus() {}

}
```

:::
::: grid col-6

<!--prettier-ignore-->
```html
<button
  spx@click="demo.onPress"
  spx@focus="demo.onFocus">

  Example

</button>
```

:::
::::

<br>

In certain scenarios, you might need to pass data to method callbacks in components from a DOM element. You can use the standard (state) directive structure, and all annotations will be provided to the event parameter argument in the class method. Event attributes are parsed, and the provided type will be normalized accordingly.

:::: grid row gx-3
::: grid col-6

<!--prettier-ignore-->
```ts
class Demo extends spx.Component {

  onPress(event) {
    event.attrs.name  // => "xxx"
    event.attrs.price // => 100
  }

}
```

:::
::: grid col-6

<!--prettier-ignore-->
```html
<button
  spx@click="demo.onPress"
  spx-demo:name="xxx"
  spx-demo:price="100">

  Click Me!

</button>
```

:::
::::

---

# Nodes

:::: grid row gx-3
::: grid col-6

<!--prettier-ignore-->
```ts
class Demo extends spx.Component {

  static define = {
    nodes: ['foo', 'bar', 'baz']
  }
}
```

:::
::: grid col-6

<!--prettier-ignore-->
```html
<!--
  Nodes within the demo component
-->
<div spx-node="demo.foo"></div>
<div spx-node="demo.bar"></div>
<div spx-node="demo.baz"></div>
```

:::
::::
