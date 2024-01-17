---
title: 'spx-data'
layout: base.liquid
permalink: '/attributes/spx-data/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-data

The `spx-data` attribute is a **special** attribute that can be used to pass data references to page states. The attribute uses an XML type syntactical structure and will parse the provided values into an object which will be made available in SPX events and session state.

### Example

The `spx-data` attribute can be annotated on `<a>` link elements and uses a colon notation structure:

```xml
<a
  href="*"
  spx-data:some-string="foo"
  spx-data:cool-number="1000"
  spx-data:nice-boolean="true"
  spx-data:list-array="[ 'string' ]"
  spx-data:test-object="{ prop: 'value', digit: 200, list: [] }"
>
```

The above code sample would result be converted from `kebab-case` to `camelCase`

<!--prettier-ignore-->
```json
{
  "someString": "foo",
  "coolNumber": 1000,
  "niceBoolean": true,
  "listArray": ["string"],
  "testObject": {
    "prop": "value",
    "digit": 200,
    "list": []
  },

}
```

### Usage

Each event will pass the data values in page state.

```js
spx.on('load', function (state) {
  state.data.someString; // => 'foo'
  state.data.coolNumber; // => 1000
  state.data.niceBoolean; // => true
  state.data.listArray; // => ['string']
  state.data.testObject.prop; // => 'value'
  state.data.testObject.digit; // => 200
  state.data.testObject.list; // => []
});
```
