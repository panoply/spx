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

<!--prettier-ignore-->
```html
<div spx-component="foo">

</div>
```

### Components State

<!--prettier-ignore-->
```html
<div
  spx-component="foo"
  spx-foo:some-string="foo"
  spx-foo:cool-number="1000"
  spx-foo:nice-boolean="true"
  spx-foo:list-array="[ 'string' ]"
  spx-foo:test-object="{ prop: 'value', digit: 200, list: [] }">

</div>
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

#### Event Attrs

In some cases you may want to pass data to event methods defined on components. Using the standard attrs (state) directive structure allows to to expose passed references in the event parameter.

<!--prettier-ignore-->
```html
<button
  spx@click="foo.onPress"
  spx-foo:name="xxx"
  spx-foo:price="100">

</button>
```
