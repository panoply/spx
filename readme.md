<br>
<img align="left" src="https://raw.githubusercontent.com/panoply/spx/13d4440296f86ca276c7de7b710dcd714f69b94f/docs/site/assets/svg/logo.svg" width="180px">
<h1 align="right">
  <i>SINGLE PAGE XHR</i>
</h1>

Single Page XHR enhancement for SSR powered web applications. SPX is a lightening fast, lightweight (8kb gzip) push~state solution that (pre)-fetches HTML over the wire and uses the response to perform targeted fragment replacements. The module maintains an in-memory cache of fetched pages which prevents subsequent requests and instantaneous navigation in a controlled a persisted manner.

### Documentation

Documentation lives on **[spx.js.org](https://spx.js.org)**

### Features

- Simple and painless drop-in integration.
- Pre-fetching capabilities using hover, intersection or proximity observers.
- Snapshot caching engine and per-page state control.
- Powerful pub/sub event driven lifecycle triggers.
- Provides a client side DOM hydration approach.
- Supports multiple replace, append and prepend fragment targets.
- Gracefully handles script and style asset evaluation.
- Attribute driven programmatic control.

# Installation

This module is distributed as ESM and designed to work in the browser environment.

### pnpm

```bash
pnpm add spx
```

### Yarn

```bash
yarn add spx
```

### npm

```bash
npm install spx --save
```

### cdn

```bash
https://unpkg.com/spx
```

# Acknowledgements

This module combines concepts originally introduced by other awesome Open Source projects:

- [Defunkt Pjax](https://github.com/defunkt/jquery-pjax)
- [pjax.js](https://github.com/brcontainer/pjax.js)
- [MoOx Pjax](https://github.com/MoOx/pjax)
- [InstantClick](https://github.com/dieulot/instantclick)
- [Turbo](https://github.com/hotwired/turbo)
- [Turbolinks](https://github.com/turbolinks/turbolinks)

### Special Thanks

Special Thanks/Спасибі to [Alexey](https://github.com/gigi) for the **SPX** registry name.

# License

Licensed under [MIT](#LICENSE)
