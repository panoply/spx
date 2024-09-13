---
title: 'Resource Evaluation'
permalink: '/usage/resource-evaluation/index.html'
layout: base.liquid
group: usage
anchors:
  - Resource Evaluation
  - Configuration
  - Attribute Directives
  - Script Evaluation
  - Load Event
  - Style Evaluation
---

# Resource Evaluation

In SPX, external resources such as those referenced by `<script>`, `<link>`, or any other elements that influence how the browser handles external content, are classified as **Resources**. Given SPX's control over rendering, it's vital to approach the management of these resources with intentionality, especially concerning how they are evaluated or loaded.

By default, SPX is set up to manage a basic set of resource elements without needing extra configuration. However, for tailored performance and functionality, developers are encouraged to customize and broaden this support to match their application's unique needs.

> To maximize efficiency, it's advisable to limit resource evaluation to only what is strictly necessary and, where possible, delay the execution of project-specific scripts until runtime. This approach not only optimizes load times but also ensures that resources are loaded in a manner that best serves the application's dynamic requirements.

# Configuration

Control over resource evaluation in SPX is managed through the `eval` configuration option during connection setup. This option can be set to either a `boolean` value or an `object`. If you choose to use an `object`, each key should correspond to a resource tag name. By specifying [Attribute Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) for these tags, you can direct SPX to evaluate resources based on specific attributes, thereby customizing how and when these resources are processed.

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

# Attribute Directives

Connection settings in SPX provide default configurations, but developers can override the `eval` options directly on resource elements by using the `spx-eval` attribute directive. This attribute accepts a `boolean` value, where `true` or `false` dictates whether SPX should evaluate that specific resource element, allowing for fine-grained control over resource handling at the element level.

<!-- prettier-ignore -->
```html
<head>
  <script spx-eval="false"></script>   <!-- Prevent evaluation from occurring -->
  <script spx-eval="true"></script>    <!-- Ensures evaluation will apply always -->
</head>
```

# Script Evaluation

In SPX, scripts within the DOM undergo asynchronous evaluation and initialization. By default, all inline scripts are subject to re-evaluation, while scripts linked via `{html} <script src="">` are evaluated once upon their first encounter and not re-evaluated subsequently. For modules employing an Immediately Invoked Function Expression (IIFE) pattern, re-evaluation might require a redesign to support repeated execution. When navigating between pages that necessitate the re-execution of linked scripts, employing inline scripts is recommended. Placing scripts within the `{html} <body>` or within defined fragments is generally not advised.

> There's seldom a need for `{html} <body>` script placements; component-based designs can achieve similar outcomes more effectively. Should the default handling not meet your needs, SPX allows for custom script evaluation settings per resource using the `spx-eval` directive.

# Script Placement

JavaScript evaluation is supported for `{html} <script>` elements located in the document's `{html} <head>` or `{html} <body>` during navigation. However, placing scripts within the `{html} <body>` is **strongly discouraged** due to potential issues. To avoid this, utilize ES Modules (ESM), which are widely supported across modern browsers. Instead of using inline scripts, consider employing `{js} import('.')` dynamic imports within your bundle for better control and performance.

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

# Load Event

You might want to use SPX [events](/usage/events/) to re-execute JavaScript code with each page visit, which is particularly useful for tasks like Google Analytics or scripts needing execution on a per-page basis. The `{js} spx.on('load')` event triggers after each page visit has completed rendering to the DOM, acting as the last event in the sequence, akin to the DOMContentLoaded event.

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.on('load', function () {

  gtag('js', new Date()); // Trigger google analytics each time page loads

});
```

# Style Evaluation

Stylesheet and inline CSS evaluation is supported for ` <style>` and `<link rel="stylesheet>` elements contained in the `{html} <head>` or `{html} <body>` elements. External stylesheets reference using `{html} <link>` elements are will be evaluated once and never again thereafter. If you require re-evaluation then use `spx-eval="true"` attribute annotations.

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
