---
title: 'Resource Evaluation'
permalink: '/usage/resource-evaluation/index.html'
layout: base.liquid
group: usage
---

# Resource Evaluation

External resources linked within `<script>`, `<link>`, or those which dictate the browser's treatment of external references are categorized as **Resources** in SPX. As SPX governs rendering operations, it's crucial to be intentional about how it manages such assets and files that require evaluation. While SPX is configured by default to handle a limited subset of resource elements without additional configuration, developers are strongly encouraged to fine-tune and expand support to align with their application's specific requirements.

> For optimal performance, it's recommended to minimize resource evaluation to the absolute minimum and ideally trigger project execution at runtime only.

---

# Configuration

Control over resources is facilitated through the `eval` configuration option upon connection. This option can accept either a `boolean` or an `object` type. When passing an `object`, each key represents a resource tag. You can provide [Attribute Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to instruct SPX to apply evaluation accordingly.

### Default Options

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx({
  eval: {
    script: ['script:not(script[src])'],    // Evaluates all inline <script> tags
    style: ['style'],                       // Evaluates all inline <style> tags
    link: ['link[rel=stylesheet]'],         // Evaluates stylesheet <link> tags
    meta: false,                            // No evaluation of <meta> tags
  }
});
```

### Attribute Directives

Connection settings serve as defaults, allowing developers to override `eval` options by annotating resource elements with the `spx-eval` attribute directive. The `spx-eval` attribute accepts a `boolean` value of `true` or `false`.

<!-- prettier-ignore -->
<!-- prettier-ignore -->
```html
<head>
  <script spx-eval="false"></script>   <!-- Prevent evaluation from occurring -->
  <script spx-eval="true"></script>    <!-- Ensures evaluation will apply always -->
</head>
```

---

# Script Evaluation

Script occurrences in the DOM are evaluated and initialized asynchronously. By default, re-evaluation applies to all inline scripts, whereas linked scripts (i.e., `<script src="">`) will only be evaluated once and never again thereafter. Modules that initialize using an IIFE execution pattern will require decoupling if re-evaluation is necessary. When navigating between pages that depend on linked resources being analyzed and re-executed, it is recommended to call inline scripts. Scripts within the `<body>` or within defined fragments should be avoided. There is little necessity for `<body>` script occurrences, and developers can easily replicate such logic using component design architecture.

> In cases where the default behavior is problematic, you can configure SPX to perform re-evaluation on a per-resource basis using the `spx-eval` attribute or `eval` configuration option.

### Placements

JavaScript evaluation between navigations is supported when `<script>` elements are contained within the document `<head>` or `<body>` elements. However, script tags in the `<body>` are **highly discouraged** and can lead to issues. You can avoid loading scripts in the body by taking advantage of ESM, which is widely supported in almost all modern browsers. Leverage dynamic imports (`import('.')`) within your bundle instead of rendering inline.

<!-- prettier-ignore -->
```html
<head>

  <script src="https://unpkg.com/spx" type="module">
    spx()
  </script>

  <script spx-eval="false">
    console.log('Run once');
  </script>

  <script>
    console.log('Run EveryTime');
  </script>

</head>
<body>

  <!-- Avoid this, you are very uncool if you do -->
  <script>
    console.log('Avoid scripts in the <body>');
  </script>
</body>
```

### Load Event

You may wish to leverage SPX lifecycle events to re-invoke JavaScript code between page visits. This is ideal for tasks such as Google Analytics and scripts that require per-page execution. The `spx.on('load')` event fires each time a page visit concludes and has rendered to the DOM. It serves as the final event to execute and is equivalent to using the `DOMContentLoaded` event.

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('load', function () {

  gtag('js', new Date()); // Trigger google analytics each time page loads

})
```

---

# Style Evaluation

Stylesheet and inline CSS evaluation is supported for `<style>` and `<link rel="stylesheet>` elements contained in the `<head>` or `<body>` elements. External stylesheets reference using `<link>` elements are will be evaluated once and never again thereafter. If you require re-evaluation then use `spx-eval="true"` attribute annotations.

```html
<head>
  <!-- Evaluated only once -->
  <link rel="stylesheet" href="stylesheet.css" />

  <!-- Evaluated only once -->
  <style>
    .class {
      color: pink;
    }
  </style>

  <!-- Evaluated every visit -->
  <style spx-eval="true">
    .class {
      color: white;
    }
  </style>
</head>
<body>
  ...

  <!-- Avoid this -->
  <style>
    .class {
      color: green;
    }
  </style>

  ...
</body>
```
