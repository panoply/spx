---
title: 'spx-target'
layout: base.liquid
permalink: '/attributes/spx-target/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# spx-target

Enables targeted replacements on specified elements. The `spx-target` attribute can be applied to any element in the DOM and accepts either a `string[]` list of selectors or a `boolean` value. When a boolean value of `true` or `false` is provided, it informs SPX whether the respective node (element) should be included (`true`) or excluded (`false`) from replacement operations during navigations. The attribute also serves as a means to override the `targets[]` defined upon SPX connection. When the `spx-target` attribute is applied to link elements (e.g., `<a href="*">`) and the value is recognized as a selector (`string`) or list of selectors (`string[]`), SPX will apply replacements to the specified elements.

### Tags

The attributes value determines the tag annotation. Boolean values of either `true` or `false` can be applied to all elements in the DOM. Selector values of either `string` or `string[]` can be applied to link elements only.

### Values

This attribute value accepts the following types:

- `boolean`
- `string`
- `string[]`

# Examples

The following examples attempt to showcase `spx-target` usage.

<!-- prettier-ignore -->
```html

<a
 href="/url"
 spx-target="['#target1', '#target2']">
 Link
</a>

<div id="target1">
  I will be replaced on next navigation
</div>

<div id="target2">
  I will be replaced on next navigation
</div>

```
