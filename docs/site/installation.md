---
layout: docs.liquid
title: 'Installation'
permalink: '/installation/index.html'
position: 2
sidebar:
  - 'CDN'
  - 'Bundling'
---

# Installation

SPX is developed for the browser environment as an [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module. The distributed bundle is compiled into ECMAScript 6 ([ES6](https://kangax.github.io/compat-table/es6/)) from TypeScript.

###### PNPM

```bash
pnpm add spx
```

###### YARN

```bash
yarn add spx
```

###### NPM

```bash
npm install spx --save
```

###### UNPKG

```bash
https://unpkg.com/spx
```

### CDN

If you're new to JavaScript or just want a very simple setup, you can get SPX from a CDN and drop it into the `<head></head>` element of your website, ideally before any other scripts. By default, SPX will replace the entire `<body>` fragment.

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>SPX | Single Page XHR</title>

    <!-- Include the module and establish a connection  -->
    <script src="https://unpkg.com/spx" type="module">
      spx.connect()
    </script>

  </head>

  <body>

    <h1>Hello World</h1>

  </body>
</html>
```

## Bundling

Bundling the recommended approach because this way you can better leverage the module into your stack. You can import SPX as `default` or `named` export. Using `named` exports allows for tree-shaking.

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
