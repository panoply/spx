---
title: 'Resource Evaluation'
permalink: '/usage/resource-evaluation/index.html'
layout: base.liquid
group: usage
---

# Resource Evaluation

External resources linked within `<script>`, `<link>` or those which that dictate the browser's treatment of external references fall under the category of **Resources** in SPX. SPX governs rendering operations, so it is imperative to deliberate on how it should manage such assets and files which demand evaluation. While SPX is configured by default to handle a limited subset of resource elements without additional configuration, developers are strongly encouraged to fine-tune and expand support to align with their application's specific requirements.

> For optimal performance it is recommended that you limit resource evaluation to the absolute minimum and if possible trigger your projects execution at runtime.

---

# Configuration

Resources control is made available upon connection via the `eval` configuration option. The `eval` option accepts either a `boolean` or an `object` type. When passing an `object`, each key represents a resource tag. You can provide [Attribute Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) and have SPX apply evaluation in accordance.

<br>

#### Default Options

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect({
  eval: {
    script: ['script:not(script[src])'],    // Evaluates all inline <script> tags
    style: ['style'],                       // Evaluates all inline <style> tags
    link: ['link[rel=stylesheet]'],         // Evaluates stylesheet <link> tags
    meta: false,                            // No evaluation of <meta> tags
  }
});
```

<br>

#### Attribute Directives

Connection settings are treated as defaults, and developers can override `eval` options by annotating resource elements with the `spx-eval` attribute directive. The `spx-eval` attribute accepts a `boolean` value of `true` or `false`.

<!-- prettier-ignore -->
<!-- prettier-ignore -->
```html
<head>
  <script spx-eval="false"></script>          <!-- Prevent evaluation from occurring -->
  <script spx-eval="true"></script>           <!-- Ensures evaluation will apply always -->
</head>
```

---

#### Script Evaluation

Script occurrences in the DOM are evaluated and initialized asynchronously. By default, re-evaluation applies to all inline scripts whereas linked scripts (i.e `<script src="">`) will only be evaluated once and never again after that. Modules that initialize using an IIFE execution pattern will require decoupling if re-evaluation is required. When navigating between pages that depend upon linked resources being analyzed and re-executed, it is recommended to call inline.

> In cases where the default behavior is problematic, you can configure SPX to perform re-evaluation on a per-resource basis control using the spx-eval attribute or eval configuration option.

Scripts that exist in the `<body>`` or within defined fragments should be avoided. There is little necessity for `<body>` script occurrences and developers can easily replicate such logic using component design architecture.

# Recommendations

In order to get the most out of this module below are a few recommendations developers should consider when leveraging it in their projects. SPX was developed for certain use cases but using it on its own can be a tad vanilla, as such developers are encouraged to couple it with other modules.

### Script Evaluation

JavaScript evaluation between navigations is supported when `<script>` elements are contained within the document `<head>` or `<body>` elements, though the latter is discouraged. A better approach is to use external scripts or leverage dynamic imports (`import('.')`) within your bundle.

```html
<head>
  <script src="https://unpkg.com/spx"></script>

  <script spx-eval="false">
    console.log('Run once');
  </script>

  <script>
    console.log('Run EveryTime');
  </script>
</head>
<body>
  ...

  <!-- Avoid This -->
  <script>
    console.log('Avoid scripts in the <body>');
  </script>

  ...
</body>
```

### Style Evaluation

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

### Leverage Pre-fetching

The pre-fetching capabilities this SPX variation provides can drastically improve the speed of rendering. When used correctly pages will load instantaneously between navigations. By default, the pre-fetching features are opt-in and require attribute annotation but you can customize how, where and when SPX should execute a pre-fetch.

```js
spx.connect({
  hover: {
    trigger: 'href', // prefetch all <a href=""> nodes
    threshold: 250 // begin prefetch after 250ms of cursor entering
  }
});
```

# Usage with Stimulus

SPX works great with [stimulus.js](https://stimulusjs.org/). SPX can used as an alternative to Turbo and though it does not offer as many features, you will get faster navigations. Stimulus is a very simple framework and when working with SSR projects it helps alleviate the complications developers tend to face. The reason one would choose this project over Turbo comes down to performance and given that Stimulus handles most of the business logic, SPX is great alternative.

<!-- prettier-ignore -->
```js
import spx from 'spx';
import { Application } from '@hotwired/stimulus';
import { Carousel } from './controllers/carousel'

spx.connect({
  targets: ['#main']
  hover: {
    trigger: 'href',
    threshold: 250
  }
})(function () {

  const stimulus = Application.start();

  stimulus.register('carousel', Carousel);

  // etc etc

});
```

### JavaScript Execution

The best possible approach when you need to invoke JavaScript like Google Analytics and scripts which require per-page execution is to use the `spx.on('load')` event. This event will fire each time a page visit concludes and has rendered to the dom.

<!-- prettier-ignore -->
```js
import spx from 'spx';


spx.on('load', function () {

  gtag('js', new Date());

})
```

# Minification

By default, all fetched pages are stored in memory so for every request the HTML dom string response will be in cache. The smaller your HTML pages the more performant the rendering engine will operate. In addition to minification it is generally good practice to consider using semantic HTML5 as much as possible this will help negate the amount of markup pages require.

# Script

TODO

# Style

TODO

# Link

TODO

# Meta

TODO
