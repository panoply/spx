---
title: 'data-spx-eval'
layout: base.liquid
permalink: '/attributes/data-spx-eval/index.html'
prev:
  label: 'Installation'
  uri: '/usage/installation'
next:
  label: 'Options'
  uri: '/usage/options/'
---

# data-spx-eval

Used on resources contained within the `<head>` fragment like styles, scripts or meta tags. Use this attribute if you want SPX to evaluate scripts and/or stylesheets. This option accepts a `false` value so you can define which scripts to execute per navigation. By default, SPX will run and evaluate all `<script>` tags it detects for every page visit but will not re-evaluate `<script src="*"></script>` tags.

> When a `<script>` tag is detected on a SPX navigation and annotated with `data-spx-eval="false"` then execution will be triggered only once but never again after that.

# Tags

The `data-spx-eval` attribute can be annotated on any of the below HTML tags:

- `<meta>`
- `<link>`
- `<style>`
- `<script>`

# Values

This attribute is a `boolean` type. Passing the `true` value is optional as `data-spx-eval` infers truthy.

- `true`
- `false`

# Example

```html
<script>
  console.log('I will run on every navigation');
</script>

<!-- script will only run once when between SPX visits -->
<script data-spx-eval="false">
  console.log('I will run on initialization only!');
</script>
```
