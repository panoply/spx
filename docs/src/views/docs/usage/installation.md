---
title: 'Installation'
layout: base.liquid
permalink: '/usage/installation/index.html'
grid: 'col-md-7'
anchors:
  - Installation
  - Bundling SPX
  - CDN
  - Debug Mode
---

# Installation

SPX is available for consumption via the [NPM](https://www.npmjs.com/package/spx) registry as an ESM module for usage in Browser environments. SPX is lightweight with a distribution size of **10kb** (gzipped).

##### PNPM

```bash
$ pnpm add spx --save
```

##### NPM

```bash
$ npm install spx --save
```

##### YARN

```bash
$ pnpm add spx
```

##### BUN

```bash
$ bun add spx
```

---

# Bundling SPX

SPX is distributed as an [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module. The generated bundle is compiled into ECMAScript 6 ([ES6](https://kangax.github.io/compat-table/es6/)) from TypeScript. It is highly recommended to bundle SPX into your project and integrate it into your stack.

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

---

# CDN

If you're new to JavaScript or just want a very simple setup, you can get SPX from CDN and drop it into your website. Be sure to include SPX before any other JavaScript files and to also include the `type="module"` attribute. By default, SPX will replace the entire `<body>` fragment.

<!-- prettier-ignore -->
```html
<head>
  <meta charset="UTF-8" />
  <title>SPX | Single Page XHR</title>
  <!-- Include the module and establish a connection -->
  <script src="https://unpkg.com/spx" type="module">
    spx.connect()
  </script>
</head>

<body>
  <h1>Hello World</h1>
</body>
```
