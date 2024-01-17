<br>
<a href="https://spx.js.org">
<img align="left" src="https://raw.githubusercontent.com/panoply/spx/13d4440296f86ca276c7de7b710dcd714f69b94f/docs/site/assets/svg/logo.svg" width="180px">
</a>
<h1 align="right">
  <i>SINGLE PAGE XHR</i>
</h1>

Single Page XHR - An enhancement for static SSR powered web applications. SPX is a lightening fast, lightweight (8kb gzip) push~state solution for fetching HTML over the wire and maintains an in-memory snapshot cache.

### Documentation

Documentation lives on **[spx.js.org](https://spx.js.org)**

### Features

- Simple and painless drop-in integration.
- Supports components extendability.
- Pre-fetching capabilities using hover, intersection or proximity observers.
- Snapshot caching engine and per-page state control.
- Powerful pub/sub event driven lifecycle triggers.
- Provides a client side DOM hydration approach.
- Gracefully handles script and style asset evaluation.
- Attribute driven programmatic control.

# Installation

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

###### CDN

```bash
https://unpkg.com/spx
```

# Usage

SPX is distributed as an ESM module and designed for usage in browser. You need to establish a connection to invoke the module.

<!--prettier-ignore-->
```ts
import spx from 'spx';

spx.connect({
  fragments: [
    'header',
    'main'
  ]
})(function (session) {

  // Callback is invoked on DOMContentLoaded.
  console.log(session)

});
```

An SPX connection will initialize an SPX session. In the above example we are targeting the `<header>` and `<main>` nodes. In your web application, ensure both elements exist for each page, for example:

```html
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <h1>Hello World!</h1>
</main>
```

Take a look at the documentation to learn how to refine and configure SPX.

# License

Licensed under **[MIT](#LICENSE)**
