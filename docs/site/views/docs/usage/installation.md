---
title: 'Getting Started'
layout: base.liquid
permalink: '/usage/getting-started/index.html'
prev:
  label: 'Tutorial'
  uri: '/introduction/tutorial'
next:
  label: 'Connection'
  uri: '/usage/connection/'
---

# Bundle

SPX is developed for the browser environment and is distributed as an [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module. The generated bundle is compiled into ECMAScript 6 ([ES6](https://kangax.github.io/compat-table/es6/)) from TypeScript. Bundling SPX into your project is the recommended approach because this way you can better leverage the module into your stack. You can import SPX as a `default` or `named` export. Using `named` exports allows for tree-shaking.

<!-- prettier-ignore -->
```js
import spx from 'spx';

spx.connect({ /* options */ })(function(session) {

  // The connect returns a callback function after
  // connection was established. Lets inspect the session:
  console.log(session);

  // You initialize third party JavaScript in this callback
  // It's the equivalent of DOMContentLoaded.

});
```

# CDN

If you're new to JavaScript or just want a very simple setup, you can get SPX from a CDN and drop it into the `<head></head>` element of your website, ideally before any other scripts. By default, SPX will replace the entire `<body>` fragment. Wherever your index or root page layout exists you can drop SPX into the `<head>` element and then establish a connection. Be sure to include SPX before any other JavaScript files and to also include the `type="module"` attribute.

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>SPX | Single Page XHR</title>

    <!-- Include the module and establish a connection -->
    <script src="https://unpkg.com/spx" type="module">
      spx.connect()
    </script>

    <!-- Other JavaScript modules -->

  </head>

  <body>

    <h1>Hello World</h1>

  </body>
</html>
```
