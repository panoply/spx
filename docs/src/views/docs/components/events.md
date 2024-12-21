---
permalink: '/components/events/index.html'
title: Components - Events
layout: base.liquid
anchors:
  - Component Events
  - Using Attrs
  - Event Options
  - Multiple References
  - Targeting Window
---

# Component Events

Component events can be defined within the DOM on elements using a `spx@<eventName>` directive annotation, where `<eventName>` denotes the type of event (such as click, hover, etc.) that will bind DOM events directly to methods within component classes. The attribute values of these event directives follow a `<ref>.<method>` dot notation structure. In this notation, `<ref>` represents the component identifier, and `<method>` specifies the particular method within a component to be invoked when the event occurs.

:::: grid row gx-3 mt-4 mb-5
::: grid col-6

<!--prettier-ignore-->
```html
<button spx@click="demo.onPress">

  <!-- Event Directive -->

</button>
```

:::
::: grid col-6

<!--prettier-ignore-->
```ts
class Demo extends spx.Component() {

  onPress(event) {} // Callback

}
```

:::
::::

---

# Using Attrs

Event parameter arguments passed to callback methods defined within components include an `attrs` object, which can contain additional data references specified in the DOM. When an element with an `spx@` event directive includes state-structured directives, SPX automatically performs type conversion and makes the data available in the `event.attrs` object within the callback method.

> Type conversion of state-structured directives is applied without definition, as it is automatically carried out according to the data type passed. Notice in the example below how the data converts based on the input supplied.

:::: grid row gx-3 mt-4 mb-5
::: grid col-6

<!--prettier-ignore-->
```html
<button
  spx@click="demo.onPress"
  spx-demo:str="xxx"
  spx-demo:num="100"
  spx-demo:bol="true"
  spx-demo:obj="{ foo: 0 }"
  spx-demo:arr="[ 'bar' ]">

  <!-- Example Attrs -->

</button>
```

:::
::: grid col-6

<!--prettier-ignore-->
```ts
class Demo extends spx.Component() {

  onPress(event) {
    event.attrs.str // "xxx"
    event.attrs.num // 100
    event.attrs.bol // true
    event.attrs.obj // { "foo": 0 }
    event.attrs.arr // [ "bar" ]
  }

}
```

:::
::::

---

# Multiple References

Event directive values can contain multiple references and are not limited to a single component. In some situations you may require multiple listeners to on a single element be applied, space separated `<ref>.<method>` occurrences within event directive values will be treated in isolation.

<!--prettier-ignore-->
```html
<button
  spx@click="foo.onPress bar.onPress"
  spx@hover="foo.onHover bar.onHover">
  <!-- Multiple References -->
</button>
```

---

# Targeting Window

Events can also be attached to the `window` object on the directive level. In cases where you require a listener in **globalThis** scope, provide a `window:` prefix on the event name.

<!--prettier-ignore-->
```html
<button spx@window:click="demo.onPress">
  <!-- Window Events -->
</button>
```

---

# Passing Options

In some situations you may need to specify event options. Options can be provided on the directive value level by suffixing an options event struct at the end of method references. An options event struct in SPX will apply **truthy** values to event options base on inclusion. The below directive value will apply `true` to passive, capture and once.

:::: grid row gx-3 my-4 py-1
::: grid col-12

{% include 'include/event-options' %}

:::
::::

<!--prettier-ignore-->
```html
<button spx@click="demo.onPress { passive, capture, once }">
  <!-- Event Options -->
</button>
```

---
