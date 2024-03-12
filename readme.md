<br>
<p align="center">
<a href="https://spx.js.org">
<img src="https://raw.githubusercontent.com/panoply/spx/13d4440296f86ca276c7de7b710dcd714f69b94f/docs/site/assets/svg/logo.svg"
width="160px">
</a>
</p>
<h1></h1>

Single Page XHR - The essential enhancement for static SSR powered web applications. SPX is a lightening fast, lightweight (15kb gzip) over the wire (push~state) solution that employs an incremental (snapshot) morphing tactic with DOM driven component capabilities integrated at the core.

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
    'menu',
    'main'
  ]
})(function (session) {

  // Callback is invoked on DOMContentLoaded.
  console.log(session)

});
```

An SPX connection will initialize an SPX session. In the above example we are targeting the `<nav>` and `<main>` element fragments. In your web application, ensure both elements exist for each page, for example:

```html
<header>
  <nav id="menu">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main id="main">
  <h1>Hello World!</h1>
</main>
```

### Components

For more advanced cases, SPX provides component extendability. Register and connect components to DOM elements, and use attribute driven control for state, events, and element queries:

<!--prettier-ignore-->
```ts
import spx from 'spx';

class Counter extends spx.Component {

  static connect = {
    nodes: ['count'],
    state: {
      clicks: Number
    }
  }

  increment () {
    this.countNode.innerText = +this.state.clicks
  }
}

spx.register(Counter);

```

Connect the component to DOM elements, add the following to a defined `fragment` and allow SPX to do the rest:

<!--prettier-ignore-->
```html
<section spx-component="counter">

  Clicked: <span spx-node="counter.node">0</span>

  <button type="button" spx@click="counter.increment">
    Increment
  </button>
</section>
```

# Contributing

Contributions are welcome! This project uses [pnpm](https://pnpm.js.org/en/cli/install) for package management and is written in TypeScript.

1. Ensure pnpm is installed globally `npm i pnpm -g`
2. Leverage `pnpm env` if you need to align node versions.
3. Clone this repository `git clone https://github.com/panoply/spx.git`
4. Run `pnpm i` in the root directory
5. Run `pnpm dev` for development mode

### Developing

The project uses [tsup](https://tsup.egoist.sh) for producing the distributed bundle. The [test](/test/) directory contains real-world web application that is spun up within via 11ty.

```bash
pnpm dev         # Development in watch mode
pnpm build       # Bundle distribution builds for production
pnpm docs        # Documentation development environment
pnpm test        # Spins up the testing web application
```

# License

Licensed under **[CC BY-NC-ND 4.0](./LICENSE)**
