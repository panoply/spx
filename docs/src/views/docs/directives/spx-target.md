---
title: 'spx-target'
layout: base.liquid
permalink: '/directives/spx-target/index.html'
---

# spx-target

The `spx-target` attribute facilitates targeted replacements on specified elements within the DOM. This attribute can be applied to any element and accepts either a selector or a boolean value. When the `spx-target` attribute is applied to link elements and the value is recognized as a selector `{ts} string` or array list of `{ts} string[]` selectors, SPX will apply replacements to the specified elements, and override fragments defined on connection. When a boolean value of `{js} true` or `{js} false` is provided as the directive value, it informs SPX whether the respective node (element) should be included or excluded from replacement operations during navigations.

# Accepts

<!-- prettier-ignore -->
```html
<a spx-target="#foo">                <!-- Hash singleton prefix id selector -->
<a spx-target="bar">                 <!-- Hash singleton omitted id selector -->
<a spx-target="#foo, #bar">          <!-- Comma separated hash prefix id selectors -->
<a spx-target="#foo #bar">           <!-- Space separated hash prefix id selectors -->
<a spx-target="foo, bar">            <!-- Comma separated hash omitted id selectors -->
<a spx-target="foo bar">             <!-- Space separated hash omitted id selectors -->
<a spx-target="[ foo, bar ]">        <!-- Array like comma id selector structure -->
<a spx-target="[ 'foo', 'bar' ]">    <!-- Array like comma id selector structure with quotes -->
```

# Examples

The following examples attempt to showcase `spx-target` usage.

<!-- prettier-ignore -->
```html

<a href="/url" spx-target="[ #target1, #target2 ]">
 Link
</a>

<div id="target1">
  I will be replaced on next navigation
</div>

<div id="target2">
  I will be replaced on next navigation
</div>

```
