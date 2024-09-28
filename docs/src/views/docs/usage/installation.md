---
permalink: '/usage/installation/index.html'
title: 'Installation'
layout: base.liquid
anchors:
  - Installation
  - Bundling SPX
  - CDN
  - Debug Mode
---

# Installation

SPX is available for consumption via the [NPM](https://www.npmjs.com/package/spx) registry as an ESM module and is designed for usage in Browser environments. SPX is lightweight with a distribution size of **{{ meta.gzipSize }}** (gzipped) and ships with types included.

:::: grid row mt-5
::: grid col-12 col-md-6 pr-4 mb-5

#### PNPM

```bash
$ pnpm add spx --save
```

:::
::: grid col-12 col-md-6 pl-4 mb-5

#### NPM

```bash
$ npm install spx --save
```

:::
::: grid col-12 col-md-6 pr-4

#### YARN

```bash
$ yarn add spx
```

:::
::: grid col-12 col-md-6 pl-4

#### BUN

```bash
$ bun add spx
```

:::
::::

---

# Bundling SPX

SPX is distributed as an [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) module, with the generated bundle compiled into ECMAScript 6 ([ES6](https://kangax.github.io/compat-table/es6/)) from TypeScript. When bundling SPX and if you intend of leveraging to module as the core solution in your project, you'll often yield the best results and overall productivity by using a single entry point and exporting the `{js} spx` method as `default`.

<!-- prettier-ignore -->
```js
import spx from 'spx';

export default spx({
  //
  // Options
  //
})(async function(session) {

  // The connect returns a callback function after
  // connection was established. Lets inspect the session:
  console.log(session);

  // You initialize third party JavaScript in this callback
  // It's the equivalent of DOMContentLoaded.

});
```

> The recommended bundler to utilize with SPX is [tsup](https://tsup.egoist.dev), offering a lightweight and efficient addition to any JavaScript project. While Vite is favored by some developers, tsup stands out as a leaner and more versatile tool. Opting for tsup empowers independent OSS contributors, contributing to a more vibrant and diverse open-source ecosystem.

# CDN USAGE

If you're new to JavaScript or prefer a straightforward setup, you can easily integrate SPX into your website by fetching it from a CDN and dropping it into your project. Ensure that SPX is included before any other JavaScript files and add the `{html} <script type="module">` attribute to the script tag. By default, SPX will replace the entire `{html} <body>` fragment during navigation.

# Option 1

Importing SPX using the [esm.sh](https://esm.sh) CDN:

<!-- prettier-ignore -->
```html
<head>
  <meta charset="UTF-8" />
  <title>SPX | Single Page XHR</title>
  <!-- Import the module and connect with spx() -->
  <script
    type="module"
    spx-eval="false">

    import spx from 'https://esm.sh/spx';

    spx({ /* options */})

  </script>
</head>

<body>
  <h1>Hello World</h1>
</body>
```

# Option 2

Importing SPX using the [unpkg.com](https://unpkg.com) CDN:

<!-- prettier-ignore -->
```html
<head>
  <meta charset="UTF-8" />
  <title>SPX | Single Page XHR</title>
  <!-- Include the module and connect with spx() -->
  <script
    src="https://unpkg.com/spx"
    type="module"
    async="true"
    spx-eval="false">

    spx({ /* options */})

  </script>
</head>

<body>
  <h1>Hello World</h1>
</body>
```
