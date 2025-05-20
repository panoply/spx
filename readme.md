<br>
<p align="center">
<a href="https://spx.js.org">
<img src="https://raw.githubusercontent.com/panoply/spx/13d4440296f86ca276c7de7b710dcd714f69b94f/docs/site/assets/svg/logo.svg"
width="160px">
</a>
</p>
<h1></h1>

Single Page XHR - The essential dom enhancement for static SSR powered web applications. SPX is a lightening fast, lightweight (18kb gzip) over the wire (push~state) solution that employs an incremental (snapshot) morphing tactic with DOM driven component capabilities integrated at the core.

### Documentation

[![DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/panoply/spx)

<h4>
  Documentation lives on&nbsp;&nbsp;➠&nbsp;&nbsp;https://spx.js.org
</h4>

> [!NOTE]
> Documentation is still a **WIP** so please just read the codebase or refer to the type definitions for a better understanding. You can also check the [test](/test/) and [docs](/) directories for real-world implementations.

### Features

- Simple and painless drop-in integration.
- Supports components extendability.
- Pre-fetching capabilities using hover, intersection or proximity observers.
- Snapshot caching engine and per-page state control.
- Powerful pub/sub event driven lifecycle triggers.
- Gracefully handles script and style asset evaluation.
- Attribute driven programmatic control.
- Zero dependencies and lightweight

# Installation

SPX is available for download on the [NPM](https://www.npmjs.com/package/spx) registry.

### Latest (Release Candidate)

SPX is currently in the RC version release stage. Majority of its API has been ironed out and used in production.

```bash
<pnpm|npm> add spx
```

# Usage

SPX is distributed as an ESM module and designed for usage in browser. You need to establish a connection to invoke the module, this can be done by calling the `spx()` method.

<!--prettier-ignore-->
```ts
import spx from 'spx';

spx({
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

For more advanced cases, SPX provides component extendability. Connect components to DOM elements and use attribute driven control for state, events, and element queries:

<!--prettier-ignore-->
```ts
import spx from 'spx';

class Counter extends spx.Component({
  nodes: <const>['count'],
  state: {
    clicks: 0
  }
}) {

  increment () {
    this.countNode.innerText = ++this.state.clicks
  }
}

spx.register(Counter);

```

Associate the component to a DOM elements, add the following within a defined `fragment` and allow SPX to do the rest:

<!--prettier-ignore-->
```html
<section spx-component="counter">

  Clicked: <span spx-node="counter.count">0</span>

  <button
    type="button"
    spx@click="counter.increment"> Increment </button>

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

The project uses [tsup](https://tsup.egoist.sh) for producing the distributed bundle.

```bash
pnpm dev         # Development in watch mode
pnpm build       # Bundle distribution builds for production
pnpm docs        # Documentation development environment
pnpm test        # Spins up the testing web application
```

# Testing

The [tests](/tests/) directory contains a runtime for testing SPX. Given that SPX often involves actions that typical testing tools don't handle well, a custom test suite that performs e2e (end-to-end) testing is appropriated.

### How It Works

We generate a static site using [11ty](https://www.11ty.dev/) and serve it locally. Each test case is written and then executed in the browser. We rely on good old-fashioned debugging techniques, such as using developer tools and monitoring the console, to ensure that features work as intended without errors.

### Writing Tests

In the [cases](/test/cases/) directory, you'll find sub-directories named after individual test cases. Each sub-directory follows a common file-pattern structure:

```bash
├── readme.md            # Information about the test to be injected into index.liquid
├── index.liquid         # Markup for the test or a starting page
├── index.test.ts        # Entry point script for the test (optional)
├── include
│   └──  file.liquid     # Optional include files used by the test case
├── pages
│   ├── page-a.liquid    # Optional page A for testing navigation
│   ├── page-b.liquid    # Optional page B for testing navigation
│   └── page-c.liquid    # Optional page C for testing navigation
├── tests
│   ├── foo.liquid       # Specific test-case or related content (optional)
│   └── foo.test.ts      # Specific script for the test (optional)
```

While this structure is recommended for consistency, all items labeled as **optional** can be omitted. The structure is flexible, allowing you to adapt it to your preferences and requirements.

# License

The project is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
