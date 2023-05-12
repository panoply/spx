---
title: 'Introduction'
layout: base.liquid
permalink: '/introduction/recommendations/index.html'
prev:
  label: 'Tutorial'
  uri: '/introduction/tutorial/'
next:
  label: 'Usage'
  uri: '/usage/getting-started'
---

# Recommendations

In order to get the most out of this module below are a few recommendations developers should consider when leveraging it in their projects. The project was developed for our use cases and while it can be appropriated into other projects there are still a couple of minor features and/or capabilities that need improvements, so please bare that in mind.

# Script Evaluation

JavaScript evaluation between navigations is supported when `<script>` elements are contained within the document `<head>` or `<body>` elements, though the latter is discouraged. A better approach is to use external scripts or leverage dynamic imports (`import('.')`) within your bundle.

```html
<head>
  <script src="https://unpkg.com/spx"></script>

  <script data-spx-eval="false">
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

Stylesheet and inline CSS evaluation is supported for `<style>` and `<link rel="stylesheet>` elements contained in the `<head>` or `<body>` elements. External stylesheets reference using `<link>` elements are will be evaluated once and never again thereafter. If you require re-evaluation then use `data-spx-eval="true"` attribute annotations.

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
  <style data-spx-eval="true">
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
import { Application } from 'application/controller';
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
